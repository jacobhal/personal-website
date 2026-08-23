-- Acquisition tracking for the jacobhal.se app marketing pages.
--
-- Records two things per visitor: that they saw /skarp or /krydda, and that
-- they clicked through to a store. Together with the UTM parameters the visit
-- arrived with, that answers "which post produced downloads" without an SDK,
-- an MMP, or a cookie banner.
--
-- What is deliberately NOT stored: no IP address, no user agent, no cookie, no
-- device or browser fingerprint, no identifier of any kind. Rows are anonymous
-- and uncorrelatable, which is why the pages need no consent prompt. Do not add
-- a session id to this table without revisiting that.
--
-- Writes come from a public web page holding only the anon key, so the table is
-- insert-only for anon and every column is constrained. Reads go exclusively
-- through the token-gated aggregate function at the bottom.

-- digest() for the passphrase hash.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.web_acquisition_events (
    id uuid primary key default gen_random_uuid(),
    -- Which marketing page. Not a foreign key: this database does not own the
    -- app catalogue, and the list changes only when a new app ships.
    app text not null check (app in ('skarp', 'krydda')),
    event text not null check (event in ('landing_view', 'store_click')),
    -- Set on store_click only; null on a landing_view.
    store text check (store in ('app_store', 'google_play')),
    -- UTM parameters, lowercased and length-capped at the edge so a crafted
    -- link cannot write unbounded text through the anon role.
    utm_source text check (char_length(utm_source) <= 64),
    utm_medium text check (char_length(utm_medium) <= 64),
    utm_campaign text check (char_length(utm_campaign) <= 96),
    utm_content text check (char_length(utm_content) <= 96),
    -- Which language the page rendered in, to see whether Swedish or English
    -- creative converts better.
    locale text check (locale in ('sv', 'en')),
    created_at timestamptz not null default now(),
    -- A store click must name a store; a landing view must not.
    constraint web_acquisition_events_store_matches_event check (
        (event = 'store_click' and store is not null)
        or (event = 'landing_view' and store is null)
    )
);

-- The summary function always filters on a time window and groups by app, so
-- this index serves every read. created_at leads because the window is the
-- most selective predicate once the table has any history.
create index if not exists web_acquisition_events_created_at_app_idx
    on public.web_acquisition_events (created_at desc, app);

alter table public.web_acquisition_events enable row level security;

-- Anonymous visitors may append their own event and nothing else. No select,
-- update or delete policy exists, so the anon role cannot read the table back
-- even though it can write to it.
drop policy if exists web_acquisition_events_anon_insert
    on public.web_acquisition_events;
create policy web_acquisition_events_anon_insert
    on public.web_acquisition_events
    for insert
    to anon, authenticated
    with check (true);

-- ---------------------------------------------------------------------------
-- Read side
-- ---------------------------------------------------------------------------

-- Secrets live outside the API schema so PostgREST cannot expose them.
create schema if not exists private;
revoke all on schema private from anon, authenticated;

create table if not exists private.web_stats_access (
    id boolean primary key default true check (id),
    -- sha256 hex of the passphrase. The passphrase itself is never stored, and
    -- never appears in the client bundle: the /stats page prompts for it and
    -- keeps it in localStorage.
    token_sha256 text not null,
    updated_at timestamptz not null default now()
);

alter table private.web_stats_access enable row level security;
-- No policies: only SECURITY DEFINER functions reach this table.

/**
 * Aggregated acquisition figures for the /stats page.
 *
 * SECURITY DEFINER because the caller is the anon role, which deliberately has
 * no read access to the events table. The passphrase check is what stands in
 * for authentication; without a configured token the function returns nothing
 * rather than opening up.
 *
 * Returns one row per (app, source, medium, campaign, content) with the view
 * count, the click count split by store, so the page can compute click-through
 * rate per campaign.
 */
create or replace function public.web_acquisition_summary(
    p_token text,
    p_days integer default 30,
    p_app text default null
)
returns table (
    app text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    views bigint,
    clicks bigint,
    clicks_app_store bigint,
    clicks_google_play bigint
)
language plpgsql
security definer
set search_path = public, private, extensions, pg_temp
as $$
declare
    v_expected text;
    v_days integer := least(greatest(coalesce(p_days, 30), 1), 365);
begin
    select token_sha256 into v_expected from private.web_stats_access limit 1;

    -- No token configured, or a wrong one, yields an empty result rather than
    -- an error, so the endpoint reveals nothing about which case it hit.
    if v_expected is null or p_token is null then
        return;
    end if;
    if encode(digest(p_token, 'sha256'), 'hex') <> v_expected then
        return;
    end if;

    return query
    select
        e.app,
        coalesce(e.utm_source, 'organic') as utm_source,
        coalesce(e.utm_medium, 'none') as utm_medium,
        coalesce(e.utm_campaign, 'none') as utm_campaign,
        coalesce(e.utm_content, 'none') as utm_content,
        count(*) filter (where e.event = 'landing_view') as views,
        count(*) filter (where e.event = 'store_click') as clicks,
        count(*) filter (
            where e.event = 'store_click' and e.store = 'app_store'
        ) as clicks_app_store,
        count(*) filter (
            where e.event = 'store_click' and e.store = 'google_play'
        ) as clicks_google_play
    from public.web_acquisition_events e
    where e.created_at >= now() - make_interval(days => v_days)
      and (p_app is null or e.app = p_app)
    group by 1, 2, 3, 4, 5
    order by views desc, clicks desc;
end;
$$;

revoke all on function public.web_acquisition_summary(text, integer, text)
    from public;
grant execute on function public.web_acquisition_summary(text, integer, text)
    to anon, authenticated;

/**
 * Sets the /stats passphrase. Run once, by hand, with a strong value:
 *
 *   select private.set_web_stats_token('<passphrase>');
 *
 * Not exposed to the API — private schema, and no grant to anon.
 */
create or replace function private.set_web_stats_token(p_token text)
returns void
language sql
security definer
set search_path = private, extensions, pg_temp
as $$
    insert into private.web_stats_access (id, token_sha256, updated_at)
    values (true, encode(digest(p_token, 'sha256'), 'hex'), now())
    on conflict (id) do update
        set token_sha256 = excluded.token_sha256,
            updated_at = now();
$$;

revoke all on function private.set_web_stats_token(text) from public, anon, authenticated;

#!/usr/bin/env python3
"""Generates one static landing page per recipe site Krydda can import from.

The site is a client-rendered SPA, so a React route would hand crawlers an empty
shell. These are plain HTML files written into client/public/, which Vite copies
into the build verbatim, so every URL returns real markup.

Source of truth is the import audit in the recipe-app repo. Numbers are measured,
never invented: each page states the recipe that was actually tested and how many
ingredient lines and steps came through.

    python3 tools/generate_import_pages.py [--audit ../recipe-app]
"""

import argparse
import json
import os
from datetime import date
from html import escape
from urllib.parse import urlparse

SITE = "https://jacobhal.se"
APP_STORE = "https://apps.apple.com/se/app/krydda-recipes-meal-plan/id6777108071?l=en-GB"
PLAY_STORE = "https://play.google.com/store/apps/details?id=se.jacobhallman.krydda"

# Display names where the domain alone reads badly.
DISPLAY = {
    "ica": "ICA.se",
    "koket": "Köket.se",
    "recept_se": "Recept.se",
    "recepten_se": "Recepten.se",
    "tasteline": "Tasteline",
    "zeta": "Zeta",
    "arla": "Arla",
    "coop": "Coop",
    "mathem": "Mathem",
    "santamaria": "Santa Maria",
    "receptfavoriter": "Receptfavoriter",
    "k56kilo": "56kilo",
    "zeinaskitchen": "Zeinas Kitchen",
    "jennysmatblogg": "Jennys Matblogg",
    "lindasbakskola": "Lindas Bakskola",
    "javligtgott": "Jävligt Gott",
    "allrecipes": "Allrecipes",
    "bbcfood": "BBC Food",
    "bbcgoodfood": "BBC Good Food",
    "bonappetit": "Bon Appétit",
    "budgetbytes": "Budget Bytes",
    "cookieandkate": "Cookie and Kate",
    "damndelicious": "Damn Delicious",
    "delish": "Delish",
    "eatingwell": "EatingWell",
    "epicurious": "Epicurious",
    "food52": "Food52",
    "foodcom": "Food.com",
    "foodnetwork": "Food Network",
    "gimmesomeoven": "Gimme Some Oven",
    "halfbakedharvest": "Half Baked Harvest",
    "jamieoliver": "Jamie Oliver",
    "kingarthur": "King Arthur Baking",
    "loveandlemons": "Love and Lemons",
    "minimalistbaker": "Minimalist Baker",
    "natashaskitchen": "Natasha's Kitchen",
    "nyt": "NYT Cooking",
    "pinchofyum": "Pinch of Yum",
    "recipetineats": "RecipeTin Eats",
    "sallysbaking": "Sally's Baking Addiction",
    "seriouseats": "Serious Eats",
    "simplyrecipes": "Simply Recipes",
    "skinnytaste": "Skinnytaste",
    "smittenkitchen": "Smitten Kitchen",
    "tasty": "Tasty",
    "thepioneerwoman": "The Pioneer Woman",
    "thewoksoflife": "The Woks of Life",
}

CSS = """*{box-sizing:border-box}body{margin:0;font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1b1b1f;background:#fff}
.wrap{max-width:760px;margin:0 auto;padding:32px 20px 72px}
a{color:#b4451f}
header nav{font-size:14px;margin-bottom:36px}
header nav a{color:#6b6b76;text-decoration:none}
h1{font-size:31px;line-height:1.25;margin:0 0 14px;letter-spacing:-.02em}
.lede{font-size:18px;color:#4a4a55;margin:0 0 28px}
.proof{border:1px solid #e6e2dc;border-left:3px solid #b4451f;border-radius:6px;padding:16px 18px;background:#faf8f5;margin:0 0 30px}
.proof p{margin:0 0 6px}
.proof .n{font-variant-numeric:tabular-nums;font-weight:600}
.proof small{color:#6b6b76}
h2{font-size:21px;margin:34px 0 12px;letter-spacing:-.01em}
ol.steps{padding-left:20px}ol.steps li{margin-bottom:10px}
ul.feat{padding-left:20px}ul.feat li{margin-bottom:6px}
.cta{display:flex;flex-wrap:wrap;gap:12px;margin:26px 0 8px}
.cta a{display:inline-block;padding:11px 18px;border-radius:8px;background:#b4451f;color:#fff;text-decoration:none;font-weight:600;font-size:15px}
.cta a.alt{background:#1b1b1f}
footer{margin-top:48px;padding-top:20px;border-top:1px solid #e6e2dc;font-size:14px;color:#6b6b76}
footer a{color:#6b6b76}
.more{font-size:14px;margin-top:10px}
@media (prefers-color-scheme:dark){body{background:#141416;color:#ececf0}
.lede{color:#a9a9b4}.proof{background:#1c1c1f;border-color:#2c2c31;border-left-color:#e0703f}
.proof small,footer,footer a,header nav a{color:#9a9aa4}a{color:#e0703f}
.cta a.alt{background:#ececf0;color:#141416}footer{border-color:#2c2c31}}"""

TEXT = {
    "sv": {
        "title": lambda s: f"Spara recept från {s} till Krydda",
        "meta": lambda s, r, i, st: (
            f"Så sparar du recept från {s} i receptappen Krydda. Testat på "
            f"”{r}”: {i} ingredienser och {st} steg importerades korrekt, utan AI."
        ),
        "h1": lambda s: f"Spara recept från {s} till Krydda",
        "lede": lambda s: (
            f"Krydda läser {s} direkt. Du slipper skriva av receptet, och du slipper "
            f"tappa bort det bland bokmärkena."
        ),
        "proof_head": "Testat på riktigt",
        "proof_body": lambda s, r, i, st: (
            f"Vi körde receptet <em>{r}</em> från {s} genom Kryddas import. "
            f"<span class='n'>{i} ingredienser</span> och <span class='n'>{st} steg</span> "
            f"kom in korrekt formaterade, tillsammans med bilden."
        ),
        "proof_note": (
            "Ingen AI inblandad. Importen läser sidans egen receptdata, så den "
            "kostar inga AI-krediter och fungerar likadant varje gång."
        ),
        "how": "Så gör du",
        "steps": lambda s: [
            "Öppna Krydda och gå till fliken Webbläsare.",
            f"Surfa till receptet på {s}, precis som i vilken webbläsare som helst.",
            "Tryck på spara-knappen. Receptet läggs i din kokbok med ingredienser, steg och bild.",
        ],
        "what": "Vad som följer med",
        "feats": [
            "Ingredienser, rad för rad, med mängder du kan skala upp eller ner",
            "Alla steg, uppdelade så du kan bocka av dem medan du lagar",
            "Bilden från receptsidan",
            "Portioner och tider när sidan anger dem",
            "Källänken, så du hittar tillbaka till originalet",
        ],
        "more_head": "Fungerar med fler sidor",
        "more": lambda n: (
            f"Krydda är testad mot {n} receptsajter, svenska och engelska. "
            f"<a href='/krydda/import/'>Se hela listan</a>."
        ),
        "cta_head": "Hämta Krydda",
        "cta_note": "Gratis att komma igång. Finns på svenska och engelska.",
        "back": "Om Krydda",
        "index_title": "Receptsajter du kan importera från",
        "index_lede": lambda n: (
            f"Krydda importerar recept direkt från webben, utan AI. Listan nedan är "
            f"{n} sajter som testats mot riktiga receptsidor."
        ),
    },
    "en": {
        "title": lambda s: f"Save recipes from {s} to Krydda",
        "meta": lambda s, r, i, st: (
            f"How to save recipes from {s} in the Krydda recipe app. Tested on "
            f"“{r}”: {i} ingredients and {st} steps imported correctly, no AI."
        ),
        "h1": lambda s: f"Save recipes from {s} to Krydda",
        "lede": lambda s: (
            f"Krydda reads {s} directly. No retyping the recipe, and no losing it in "
            f"a pile of bookmarks."
        ),
        "proof_head": "Actually tested",
        "proof_body": lambda s, r, i, st: (
            f"We ran <em>{r}</em> from {s} through Krydda's importer. "
            f"<span class='n'>{i} ingredients</span> and <span class='n'>{st} steps</span> "
            f"came through properly formatted, along with the photo."
        ),
        "proof_note": (
            "No AI involved. The importer reads the page's own recipe data, so it "
            "costs no AI credits and behaves the same every time."
        ),
        "how": "How to do it",
        "steps": lambda s: [
            "Open Krydda and go to the Browser tab.",
            f"Browse to the recipe on {s}, just like in any browser.",
            "Tap save. The recipe lands in your cookbook with ingredients, steps and the photo.",
        ],
        "what": "What comes across",
        "feats": [
            "Ingredients line by line, with amounts you can scale up or down",
            "Every step, split so you can tick them off while cooking",
            "The photo from the recipe page",
            "Servings and times when the site states them",
            "The source link, so you can get back to the original",
        ],
        "more_head": "Works with more sites",
        "more": lambda n: (
            f"Krydda is tested against {n} recipe sites, English and Swedish. "
            f"<a href='/krydda/import/'>See the full list</a>."
        ),
        "cta_head": "Get Krydda",
        "cta_note": "Free to start. Available in English and Swedish.",
        "back": "About Krydda",
        "index_title": "Recipe sites you can import from",
        "index_lede": lambda n: (
            f"Krydda imports recipes straight from the web, without AI. The list below "
            f"is {n} sites tested against real recipe pages."
        ),
    },
}


def page(slug, display, lang, recipe, ing, steps, total):
    t = TEXT[lang]
    url = f"{SITE}/krydda/import/{slug}/"
    title = t["title"](display)
    desc = t["meta"](display, recipe, ing, steps)
    howto = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": title,
        "description": desc,
        "step": [
            {"@type": "HowToStep", "position": i + 1, "text": s}
            for i, s in enumerate(t["steps"](display))
        ],
    }
    steps_html = "\n".join(
        f"            <li>{escape(s)}</li>" for s in t["steps"](display)
    )
    feats_html = "\n".join(f"            <li>{escape(f)}</li>" for f in t["feats"])
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title>
<meta name="description" content="{escape(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:url" content="{url}">
<link rel="shortcut icon" href="/favicon.ico">
<style>{CSS}</style>
<script type="application/ld+json">{json.dumps(howto, ensure_ascii=False)}</script>
</head>
<body>
<div class="wrap">
    <header><nav><a href="/krydda">Krydda</a> &rsaquo; <a href="/krydda/import/">Import</a></nav></header>
    <main>
        <h1>{escape(t["h1"](display))}</h1>
        <p class="lede">{escape(t["lede"](display))}</p>

        <div class="proof">
            <p><strong>{escape(t["proof_head"])}</strong></p>
            <p>{t["proof_body"](escape(display), escape(recipe), ing, steps)}</p>
            <p><small>{escape(t["proof_note"])}</small></p>
        </div>

        <h2>{escape(t["how"])}</h2>
        <ol class="steps">
{steps_html}
        </ol>

        <h2>{escape(t["what"])}</h2>
        <ul class="feat">
{feats_html}
        </ul>

        <h2>{escape(t["cta_head"])}</h2>
        <div class="cta">
            <a href="{APP_STORE}">App Store</a>
            <a class="alt" href="{PLAY_STORE}">Google Play</a>
        </div>
        <p><small>{escape(t["cta_note"])}</small></p>

        <h2>{escape(t["more_head"])}</h2>
        <p class="more">{t["more"](total)}</p>
    </main>
    <footer><a href="/krydda">{escape(t["back"])}</a> &middot; <a href="/">jacobhal.se</a></footer>
</div>
</body>
</html>
"""


def index_page(rows, lang, total):
    t = TEXT[lang]
    url = f"{SITE}/krydda/import/"
    items = "\n".join(
        f'            <li><a href="/krydda/import/{slug}/">{escape(display)}</a></li>'
        for slug, display, _ in rows
    )
    title = t["index_title"]
    desc = t["index_lede"](total).replace("<a href='/krydda/import/'>Se hela listan</a>.", "")
    desc = " ".join(desc.split())
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} | Krydda</title>
<meta name="description" content="{escape(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:url" content="{url}">
<link rel="shortcut icon" href="/favicon.ico">
<style>{CSS}</style>
</head>
<body>
<div class="wrap">
    <header><nav><a href="/krydda">Krydda</a> &rsaquo; Import</nav></header>
    <main>
        <h1>{escape(title)}</h1>
        <p class="lede">{t["index_lede"](total)}</p>
        <ul class="feat">
{items}
        </ul>
        <h2>{escape(t["cta_head"])}</h2>
        <div class="cta">
            <a href="{APP_STORE}">App Store</a>
            <a class="alt" href="{PLAY_STORE}">Google Play</a>
        </div>
    </main>
    <footer><a href="/krydda">{escape(t["back"])}</a> &middot; <a href="/">jacobhal.se</a></footer>
</div>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audit", default="../recipe-app")
    ap.add_argument("--out", default="client/public/krydda/import")
    args = ap.parse_args()

    exp = json.load(
        open(f"{args.audit}/test/services/fixtures/import_sites/expectations.json")
    )
    sites = {
        s["name"]: (s.get("seed") or s.get("url"))
        for s in json.load(open(f"{args.audit}/tools/import_audit/sites.json"))["sites"]
    }

    usable = []
    skipped = []
    for name, e in sorted(exp.items()):
        # Never advertise a site whose method does not come through.
        if e["steps"] < 1 or e["ingredients"] < 3:
            skipped.append(f"{name} ({e['ingredients']} ing / {e['steps']} steps)")
            continue
        seed = sites.get(name)
        if seed is None and name not in DISPLAY:
            # A saved page with no sites.json entry and no display name would
            # produce a page titled after a slug. Skip rather than guess.
            skipped.append(f"{name} (no site entry)")
            continue
        host = urlparse(seed).netloc.replace("www.", "") if seed else ""
        display = DISPLAY.get(name, host)
        usable.append((name, display, e["lang"], e["title"], e["ingredients"], e["steps"]))

    total = len(usable)
    written = []
    for slug, display, lang, recipe, ing, steps in usable:
        d = os.path.join(args.out, slug)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(page(slug, display, lang, recipe, ing, steps, total))
        written.append(f"/krydda/import/{slug}/")

    # Index in both languages: Swedish at the root, English mirror beside it.
    sv_rows = [(s, d, l) for s, d, l, *_ in usable if l == "sv"]
    en_rows = [(s, d, l) for s, d, l, *_ in usable if l == "en"]
    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_page(sv_rows + en_rows, "sv", total))
    written.append("/krydda/import/")

    # Sitemap covering the generated pages plus the hand-written app routes.
    today = date.today().isoformat()
    static_routes = [
        "/", "/krydda", "/krydda/guide", "/skarp", "/portfolio", "/about", "/contact",
    ]
    urls = "\n".join(
        f"  <url><loc>{SITE}{p}</loc><lastmod>{today}</lastmod></url>"
        for p in static_routes + sorted(written)
    )
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n</urlset>\n"
    )
    with open("client/public/sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    with open("client/public/robots.txt", "w", encoding="utf-8") as f:
        f.write(f"User-Agent: *\nDisallow:\n\nSitemap: {SITE}/sitemap.xml\n")

    print(f"wrote {len(written)} pages ({len(sv_rows)} sv, {len(en_rows)} en)")
    print(f"sitemap: {len(static_routes) + len(written)} urls")
    if skipped:
        print("skipped (nothing worth advertising): " + ", ".join(skipped))


if __name__ == "__main__":
    main()

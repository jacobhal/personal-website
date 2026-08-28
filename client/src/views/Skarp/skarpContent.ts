import type { Locale } from '../../i18n/locale'

export interface Feature {
    title: string
    body: string
}

export interface SkarpShowcaseCopy {
    eyebrow: string
    title: string
    body: string
}

export interface SkarpCopy {
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    headlineLead: string
    headlineTail: string
    tagline: string
    appStore: string
    playStore: string
    trustLine: string
    showcases: SkarpShowcaseCopy[]
    featuresHeading: string
    features: Feature[]
    closingTitle: string
    closingBody: string
    footerPrivacy: string
    footerTerms: string
    footerDelete: string
    footerContact: string
}

/**
 * Swedish is written, not translated. The English page is longer and more
 * enthusiastic because English marketing copy is; the Swedish page is shorter
 * and flatter because that is what reads as confident in Swedish.
 *
 * Numbers are deliberately phrased as floors ("över 6 600") so the page stays
 * true as the bank grows instead of going stale the week after it ships.
 */
export const SKARP_COPY: Record<Locale, SkarpCopy> = {
    sv: {
        metaTitle: 'Skarp — quizet som gör dig vassare',
        metaDescription:
            'Över 6 600 handskrivna frågor i elva ämnen. Spela själv, utmana en vän eller samla hela rummet i ett livequiz på storbild. Svenska och engelska, inga banners.',
        ogTitle: 'Skarp — quizet som gör dig vassare',
        ogDescription:
            'Spela själv, utmana en vän eller kör ett livequiz för hela rummet. Över 6 600 handskrivna frågor.',
        headlineLead: 'Allt du borde kunna.',
        headlineTail: 'Fem minuter om dagen.',
        tagline:
            'Över 6 600 handskrivna frågor i elva ämnen. Spela själv, utmana en vän, eller samla hela rummet i ett livequiz på storbild. På svenska och engelska.',
        appStore: 'Ladda ner på App Store',
        playStore: 'Hämta på Google Play',
        trustLine:
            'Gratis att spela · Inga banners · Fungerar offline · Svenska och engelska',
        showcases: [
            {
                eyebrow: 'Livequiz',
                title: 'Alla i rummet.\nSamma frågor.',
                body: 'Skapa ett rum, öppna storbildssidan i webbläsaren på tv:n eller projektorn, och låt alla gå med på sina egna telefoner med en sexteckenskod. Frågorna visas på skärmen, poängen räknas automatiskt och ställningen uppdateras mellan frågorna. Upp till 12 enheter i samma rum.',
            },
            {
                eyebrow: 'Spela själv',
                title: 'Utvalda frågor.\nInga utfyllnader.',
                body: 'Elva ämnen, från historia och vetenskap till mat och dryck. Varje fråga är skriven för hand och kontrollerad mot källor — inga inköpta frågepaket, ingen slit-och-släng-trivia. Frågorna ligger i telefonen, så en runda fungerar utan nät.',
            },
            {
                eyebrow: 'Utmana en vän',
                title: 'Sju frågor.\nEn vinnare.',
                body: 'Skicka en utmaning, svara på samma frågor var för sig och se resultatet runda för runda. När du blivit varm i kläderna möter du främlingar i rankade matcher med Elo-ranking.',
            },
            {
                eyebrow: 'Se dig själv bli bättre',
                title: 'Från Nybörjare\ntill Mästare.',
                body: 'Din kunskapsnivå räknas per svårighetsgrad, så du ser om du faktiskt blir bättre eller bara spelar. Tjäna mynt på vägen och lås upp avatarer, ramar, titlar och reaktioner.',
            },
        ],
        featuresHeading: 'Och detaljerna, ordentligt gjorda',
        features: [
            {
                title: 'Sju sorters frågor',
                body: 'Inte bara fyra alternativ. Sätt en nål på kartan, tryck ut rätt land, dra ett reglage till rätt tal, lägg saker i ordning, peka i en bild.',
            },
            {
                title: 'Tvåspråkig på riktigt',
                body: 'Varje fråga är skriven två gånger, en gång på svenska och en gång på engelska. Ingenting är maskinöversatt, och du byter språk när du vill.',
            },
            {
                title: 'Inga banners',
                body: 'Ingen reklam mitt i en runda och inga helskärmsannonser. Den enda annonsen i appen är en du själv väljer att titta på för att få mynt.',
            },
            {
                title: 'Frågor som faktiskt stämmer',
                body: 'Varje fråga kontrolleras mot källor, och automatiska kontroller letar efter frågor där rätt svar råkar avslöja sig själv genom sin form i stället för genom fakta.',
            },
        ],
        closingTitle: 'Bli lite vassare i kväll.',
        closingBody:
            'Ladda ner Skarp och se hur mycket du egentligen kan. Gratis, på svenska och engelska.',
        footerPrivacy: 'Integritetspolicy',
        footerTerms: 'Användarvillkor',
        footerDelete: 'Radera konto',
        footerContact: 'Kontakt',
    },
    en: {
        metaTitle: 'Skarp — the quiz that makes you sharper',
        metaDescription:
            'Over 6,600 hand-written questions across eleven subjects. Play solo, challenge a friend, or run a live quiz for the whole room on the big screen. English and Swedish, no banner ads.',
        ogTitle: 'Skarp — the quiz that makes you sharper',
        ogDescription:
            'Play solo, challenge a friend, or run a live quiz for the whole room. Over 6,600 hand-written questions.',
        headlineLead: 'Everything worth knowing.',
        headlineTail: 'Five minutes a day.',
        tagline:
            'Over 6,600 hand-written questions across eleven subjects. Play solo, challenge a friend, or gather the whole room for a live quiz on the big screen — in English and Swedish.',
        appStore: 'Download on the App Store',
        playStore: 'Get it on Google Play',
        trustLine:
            'Free to play · No banner ads · Works offline · English and Swedish',
        showcases: [
            {
                eyebrow: 'Live quiz rooms',
                title: 'Everyone in the room.\nThe same questions.',
                body: 'Create a room, open the big-screen page in any browser on your TV or projector, and let everyone join from their own phone with a six-character code. Questions appear on the screen, scoring is automatic, and the standings update between rounds. Up to 12 devices per room.',
            },
            {
                eyebrow: 'Play solo',
                title: 'Curated questions.\nNo filler.',
                body: 'Eleven subjects, from history and science to food and drink. Every question is written by hand and checked against sources — no bought question packs, no throwaway trivia. Questions live on your phone, so a round works with no connection.',
            },
            {
                eyebrow: 'Challenge a friend',
                title: 'Seven questions.\nOne winner.',
                body: 'Send a challenge, answer the same questions independently, and see the result round by round. Once you have found your feet, face strangers in ranked matches with an Elo-style rating.',
            },
            {
                eyebrow: 'Watch yourself improve',
                title: 'From Beginner\nto Master.',
                body: 'Your skill level is tracked per difficulty, so you can see whether you are actually improving or just playing. Earn coins along the way and unlock avatars, frames, titles and reactions.',
            },
        ],
        featuresHeading: 'And the details, done properly',
        features: [
            {
                title: 'Seven kinds of question',
                body: 'Not just four options. Drop a pin on the map, tap the right country, drag a slider to a number, put things in order, point at a place inside a picture.',
            },
            {
                title: 'Genuinely bilingual',
                body: 'Every question is written twice, once in English and once in Swedish. Nothing is machine translated, and you can switch language whenever you like.',
            },
            {
                title: 'No banner ads',
                body: 'No ad in the middle of a round and no full-screen interstitials. The only ad in the app is one you choose to watch to earn coins.',
            },
            {
                title: 'Questions that hold up',
                body: 'Every question is checked against sources, and automated checks look for questions where the correct answer gives itself away by its shape rather than by the fact.',
            },
        ],
        closingTitle: 'Get a little sharper tonight.',
        closingBody:
            'Download Skarp and find out how much you really know. Free, in English and Swedish.',
        footerPrivacy: 'Privacy',
        footerTerms: 'Terms',
        footerDelete: 'Delete account',
        footerContact: 'Contact',
    },
}

import type { Locale } from '../../i18n/locale'

export interface KryddaShowcaseCopy {
    eyebrow: string
    title: string
    body: string
}

export interface KryddaFeature {
    title: string
    body: string
}

export interface KryddaCopy {
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    headlineLead: string
    headlineTail: string
    subheading: string
    appStore: string
    playStore: string
    trustLine: string
    showcases: KryddaShowcaseCopy[]
    featuresHeading: string
    features: KryddaFeature[]
    closingTitle: string
    closingBody: string
    footerPrivacy: string
    footerTerms: string
    footerDelete: string
    footerContact: string
}

/**
 * Swedish written from scratch rather than translated. `Krydda` sells on
 * concrete verbs — spara, planera, handla — so the Swedish copy leads with them
 * instead of mirroring the English cadence.
 */
export const KRYDDA_COPY: Record<Locale, KryddaCopy> = {
    sv: {
        metaTitle: 'Krydda — alla dina recept på ett ställe',
        metaDescription:
            'Spara recept från vilken sajt som helst eller direkt från ett Instagram-inlägg, planera veckan och handla från en enda lista. Krydda håller samlingen i telefonen — snabbt, offline och ditt. Svenska och engelska.',
        ogTitle: 'Krydda — alla dina recept på ett ställe',
        ogDescription:
            'Spara recept från vilken sajt som helst, planera veckan och handla från en enda lista.',
        headlineLead: 'Alla recept du gillar.',
        headlineTail: 'På ett ställe.',
        subheading:
            'Spara från vilken sajt som helst eller från ett Instagram-inlägg, planera veckan och handla från en enda lista. Recepten ligger i telefonen — snabbt, offline och ditt.',
        appStore: 'Ladda ner på App Store',
        playStore: 'Hämta på Google Play',
        trustLine:
            'Gratis att använda · Inget konto behövs för att börja · Svenska och engelska',
        showcases: [
            {
                eyebrow: 'Spara var du än är',
                title: 'Vilken receptsida\nsom helst. Ett tryck.',
                body: 'Öppna receptet i Kryddas egen webbläsare och tryck en gång. Ingredienser, steg, tider och bilden följer med — ingen AI, inget kopierande, ingen omskrivning. Testat mot de största receptsajterna i Sverige och utomlands.',
            },
            {
                eyebrow: 'Instagram och TikTok',
                title: 'Dela ett inlägg.\nFå ett riktigt recept.',
                body: 'Hittade du middagen i en reel? Dela inlägget till Krydda så blir bildtexten ett riktigt recept med en ingredienslista du kan ta med till affären — och en länk tillbaka till den som lagade det.',
            },
            {
                eyebrow: 'Veckoplanering',
                title: 'En vecka middagar,\nplanerad på sekunder.',
                body: 'Berätta vad du tycker om så bygger Krydda en hel vecka av dina egna recept — och gör sedan hela planen till en inköpslista, sorterad och utan dubbletter.',
            },
            {
                eyebrow: 'Matlagning, inte administration',
                title: 'En lista för\nhela veckan.',
                body: 'Varje ingrediens från varje planerad måltid, samlad i en enda lista. Bocka av medan du handlar, håll koll på skafferiet och dela listan med hushållet.',
            },
        ],
        featuresHeading: 'Och vardagsgrejerna, ordentligt gjorda',
        features: [
            {
                title: 'Byt över på en gång',
                body: 'Importera en hel export från Paprika, Recipe Keeper, Crouton eller Mela på en gång. Inget lämnas kvar och inget skrivs om.',
            },
            {
                title: 'Direkt, även offline',
                body: 'Recepten ligger i telefonen. Sök bland tusentals på ett tryck — på tåget, i affären, utan täckning.',
            },
            {
                title: 'Laga utan att peta på skärmen',
                body: 'Ett kokläge byggt för kladdiga händer: stora steg, timers som fortsätter ringa och en skärm som håller sig vaken.',
            },
            {
                title: 'En kokbok för hela hushållet',
                body: 'Dela ett bibliotek med familjen så att samma recept finns i allas telefoner — inga skärmdumpar, inget vidarebefordrande.',
            },
        ],
        closingTitle: 'Börja med ett recept.',
        closingBody:
            'Spara nästa sak du vill laga. Resten av samlingen kan följa efter när du vill.',
        footerPrivacy: 'Integritetspolicy',
        footerTerms: 'Användarvillkor',
        footerDelete: 'Radera konto',
        footerContact: 'Kontakt',
    },
    en: {
        metaTitle: 'Krydda — every recipe you love, in one place',
        metaDescription:
            'Save recipes from any website or an Instagram post, plan the week, and shop from one list. Krydda keeps your collection on your phone — fast, offline and yours. Swedish and English.',
        ogTitle: 'Krydda — every recipe you love, in one place',
        ogDescription:
            'Save recipes from any website or an Instagram post, plan the week, and shop from one list.',
        headlineLead: 'Every recipe you love.',
        headlineTail: 'In one place.',
        subheading:
            'Save from any website or an Instagram post, plan the week, and shop from one list. Your recipes stay on your phone — fast, offline, and yours.',
        appStore: 'Download on the App Store',
        playStore: 'Get it on Google Play',
        trustLine:
            'Free to use · No account needed to start · Swedish and English',
        showcases: [
            {
                eyebrow: 'Save from anywhere',
                title: 'Any recipe page.\nOne tap.',
                body: 'Open a recipe in Krydda’s own browser and tap once. Ingredients, steps, times and the photo come across — no AI, no copying, no retyping. Tested against the biggest recipe sites in Sweden and abroad.',
            },
            {
                eyebrow: 'Instagram and TikTok',
                title: 'Share a post.\nGet a real recipe.',
                body: 'Found dinner in a Reel? Share the post to Krydda and its caption becomes a proper recipe with an ingredient list you can take to the shop — and a link back to the creator.',
            },
            {
                eyebrow: 'Weekly planning',
                title: 'A week of dinners,\nplanned in seconds.',
                body: 'Tell Krydda what you like and it builds a full week from your own recipes — then turns the whole plan into one shopping list, sorted and de-duplicated.',
            },
            {
                eyebrow: 'Cooking, not admin',
                title: 'One list for\nthe whole week.',
                body: 'Every ingredient from every planned meal, combined into a single list. Check things off as you shop, keep a pantry, and share the list with the household.',
            },
        ],
        featuresHeading: 'And the everyday things, done properly',
        features: [
            {
                title: 'Switch in one go',
                body: 'Import a whole Paprika, Recipe Keeper, Crouton or Mela export at once. Nothing is left behind, and nothing is retyped.',
            },
            {
                title: 'Instant, even offline',
                body: 'Recipes live on your phone. Search thousands of them in a tap, on the train, in the shop, with no signal.',
            },
            {
                title: 'Cook hands-free',
                body: 'A cook mode built for messy hands: big steps, timers that keep ringing, and a screen that stays awake.',
            },
            {
                title: 'One cookbook for the household',
                body: 'Share a library with your family so the same recipes are on everyone’s phone — no screenshots, no forwarding.',
            },
        ],
        closingTitle: 'Start with one recipe.',
        closingBody:
            'Save the next thing you want to cook. The rest of your collection can follow whenever you like.',
        footerPrivacy: 'Privacy',
        footerTerms: 'Terms',
        footerDelete: 'Delete account',
        footerContact: 'Contact',
    },
}

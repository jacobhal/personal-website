import type { Locale } from '../../i18n/locale'

export interface Feature {
    title: string
    body: string
}

export interface SkarpCopy {
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    tagline: string
    appStore: string
    playStore: string
    trustLine: string
    features: Feature[]
    footerPrivacy: string
    footerTerms: string
    footerDelete: string
    footerContact: string
}

/**
 * Swedish is written, not translated. The English page is longer and more
 * enthusiastic because English marketing copy is; the Swedish page is shorter
 * and flatter because that is what reads as confident in Swedish.
 */
export const SKARP_COPY: Record<Locale, SkarpCopy> = {
    sv: {
        metaTitle: 'Skarp — quizet som gör dig vassare',
        metaDescription:
            'Skarp är quizappen för dig som vill lära dig något på riktigt. Utmana vänner, klättra på topplistan och träna på historia, vetenskap, konst och geografi. Svenska och engelska.',
        ogTitle: 'Skarp — quizet som gör dig vassare',
        ogDescription:
            'Utmana vänner i realtid, klättra på topplistan och lär dig det som är värt att kunna.',
        tagline:
            'Quizet som gör dig vassare. Utmana vänner, klättra på topplistan och lär dig det som är värt att kunna — på svenska och engelska.',
        appStore: 'Ladda ner på App Store',
        playStore: 'Hämta på Google Play',
        trustLine: 'Gratis att spela · Svenska och engelska',
        features: [
            {
                title: 'Lär dig det som betyder något',
                body: 'En utvald bank med genomarbetade frågor om historia, vetenskap, konst, geografi och mycket mer — byggd för riktig kunskap, inte slit-och-släng-trivia.',
            },
            {
                title: 'Utmana dina vänner',
                body: 'Möt varandra i realtid. Ni svarar på samma frågor var för sig och ser vem som klarade sig bäst.',
            },
            {
                title: 'Klättra och utvecklas',
                body: 'Följ din kunskapsnivå per svårighetsgrad, ta dig från Nybörjare till Mästare och klättra på den globala topplistan.',
            },
            {
                title: 'Gör den till din',
                body: 'Tjäna mynt när du spelar och lås upp avatarer, ramar, titlar och reaktioner till din profil.',
            },
        ],
        footerPrivacy: 'Integritetspolicy',
        footerTerms: 'Användarvillkor',
        footerDelete: 'Radera konto',
        footerContact: 'Kontakt',
    },
    en: {
        metaTitle: 'Skarp — the quiz that makes you sharper',
        metaDescription:
            'Skarp is an educational trivia quiz app. Challenge friends in real time, track your progress, and learn the topics that make a well-rounded mind. Available in Swedish and English.',
        ogTitle: 'Skarp — the quiz that makes you sharper',
        ogDescription:
            'Challenge friends in real time, climb the leaderboard, and learn the topics worth knowing.',
        tagline:
            'The educational trivia quiz that makes you sharper. Challenge friends, climb the leaderboard, and learn the topics worth knowing — in Swedish and English.',
        appStore: 'Download on the App Store',
        playStore: 'Get it on Google Play',
        trustLine: 'Free to play · Swedish and English',
        features: [
            {
                title: 'Learn what matters',
                body: 'A curated bank of high-quality questions across history, science, art, geography and more — built for genuine learning, not disposable trivia.',
            },
            {
                title: 'Challenge your friends',
                body: 'Go head-to-head in real-time multiplayer battles. Answer the same questions independently and see who comes out on top.',
            },
            {
                title: 'Climb and progress',
                body: 'Track skill progression per difficulty, rise from Novice to Master, and climb the global leaderboard.',
            },
            {
                title: 'Make it yours',
                body: 'Earn coins through play and unlock avatars, frames, titles and reactions to customize your profile.',
            },
        ],
        footerPrivacy: 'Privacy',
        footerTerms: 'Terms',
        footerDelete: 'Delete account',
        footerContact: 'Contact',
    },
}

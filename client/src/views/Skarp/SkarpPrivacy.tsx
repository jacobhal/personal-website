import React from 'react'
import SkarpLegalLayout, { LegalSection } from './SkarpLegalLayout'

const sections: { sv: LegalSection[]; en: LegalSection[] } = {
    sv: [
        {
            title: 'Vilka uppgifter Skarp behandlar',
            paragraphs: [
                'Skarp är en quiz- och trivia-app. För att kunna spara dina framsteg, visa topplistor och låta dig utmana andra spelare behandlar vi de uppgifter som behövs för att driva tjänsten.',
            ],
            bullets: [
                'Kontouppgifter som e-postadress samt profilinformation som visningsnamn, användarnamn och valda kosmetiska föremål (avatar, ramar, titlar, reaktioner).',
                'Speldata som statistik, nivåer, kunskapsframsteg per svårighetsgrad, topplisteplacering och resultat i utmaningar.',
                'Virtuella föremål som mynt, ädelstenar och Battle Pass-framsteg.',
                'Köp- och entitlementstatus när du köper mynt eller andra föremål via RevenueCat och App Store eller Google Play.',
                'Teknisk felinformation om krascher eller allvarliga fel, om felrapportering är aktiverad i den build du använder.',
            ],
        },
        {
            title: 'Hur uppgifterna används',
            bullets: [
                'För att skapa och hantera ditt konto och synka dina framsteg mellan dina enheter.',
                'För att visa topplistor och låta dig spela mot och utmana andra spelare.',
                'För att hantera mynt, ädelstenar, Battle Pass, köp, återställning av köp och kundsupport.',
                'För att felsöka stabilitetsproblem och förbättra appens tillförlitlighet.',
            ],
        },
        {
            title: 'Delning med tredje parter',
            bullets: [
                'Supabase används för konto, autentisering, molnlagring av speldata och topplistor.',
                'RevenueCat används för att validera och hantera köp i appen.',
                'Apple App Store och Google Play hanterar själva betalningen när du gör ett köp.',
                'Sentry kan användas för kraschrapportering och teknisk felspårning.',
            ],
        },
        {
            title: 'Lagringstid och dina val',
            paragraphs: [
                'Kontodata lagras så länge ditt konto behövs för att leverera tjänsten eller tills du begär radering.',
                'Du kan radera ditt konto direkt i appen under Profil, eller begära radering via e-post om du inte längre har tillgång till appen. Vid radering tas konto, profil, kosmetiska föremål, virtuell valuta och Battle Pass-framsteg bort.',
            ],
        },
        {
            title: 'Dina rättigheter',
            paragraphs: [
                'Om du omfattas av dataskyddslagstiftning som GDPR kan du begära tillgång, rättelse eller radering av dina personuppgifter. Du kan också invända mot viss behandling eller begära begränsning där lagen ger dig den rätten.',
                'Kontakta mig på e-postadressen längst ned på sidan om du vill utöva någon av dessa rättigheter.',
            ],
        },
        {
            title: 'Barns integritet',
            paragraphs: [
                'Skarp är inte avsedd för barn under 13 år, och jag samlar inte medvetet in personuppgifter från barn under 13 år.',
            ],
        },
        {
            title: 'Ändringar i policyn',
            paragraphs: [
                'Jag kan uppdatera den här integritetspolicyn när appen utvecklas eller när lagkrav ändras. Den senaste versionen publiceras alltid på den här sidan.',
            ],
        },
    ],
    en: [
        {
            title: 'What data Skarp processes',
            paragraphs: [
                'Skarp is a quiz and trivia app. To save your progress, show leaderboards, and let you challenge other players, we process the data needed to operate the service.',
            ],
            bullets: [
                'Account data such as your email address, and profile information like a display name, username, and chosen cosmetic items (avatar, frames, titles, reactions).',
                'Gameplay data such as statistics, levels, knowledge progress per difficulty, leaderboard standing, and challenge results.',
                'Virtual items such as coins, gems, and Battle Pass progress.',
                'Purchase and entitlement status when you buy coins or other items through RevenueCat and the App Store or Google Play.',
                'Technical diagnostics about crashes or serious errors, if crash reporting is enabled in the build you are using.',
            ],
        },
        {
            title: 'How data is used',
            bullets: [
                'To create and manage your account and sync your progress across your devices.',
                'To show leaderboards and let you play against and challenge other players.',
                'To manage coins, gems, the Battle Pass, purchases, restore flows, and support.',
                'To diagnose stability issues and improve app reliability.',
            ],
        },
        {
            title: 'Sharing with third parties',
            bullets: [
                'Supabase is used for account services, authentication, cloud storage of gameplay data, and leaderboards.',
                'RevenueCat is used to validate and manage in-app purchases.',
                'Apple App Store and Google Play process payments when you make a purchase.',
                'Sentry may be used for crash reporting and technical error monitoring.',
            ],
        },
        {
            title: 'Retention and your choices',
            paragraphs: [
                'Account data is kept as long as your account is needed to provide the service or until you request deletion.',
                'You can delete your account directly in the app under Profile, or request deletion by email if you no longer have access to the app. Deletion removes your account, profile, cosmetic items, virtual currency, and Battle Pass progress.',
            ],
        },
        {
            title: 'Your rights',
            paragraphs: [
                'If you are covered by privacy laws such as the GDPR, you may have the right to request access to, correction of, or deletion of your personal data. You may also have the right to object to certain processing or request restriction where the law gives you that right.',
                'Contact me at the email address on this page if you want to exercise any of these rights.',
            ],
        },
        {
            title: 'Children’s privacy',
            paragraphs: [
                'Skarp is not intended for children under 13, and I do not knowingly collect personal data from children under 13.',
            ],
        },
        {
            title: 'Changes to this policy',
            paragraphs: [
                'I may update this Privacy Policy as the app evolves or if legal requirements change. The latest version will always be published on this page.',
            ],
        },
    ],
}

const SkarpPrivacy: React.FC = () => {
    return (
        <SkarpLegalLayout
            pageTitle={{
                sv: 'Integritetspolicy',
                en: 'Privacy Policy',
            }}
            pageDescription={{
                sv: 'Den här sidan beskriver vilka personuppgifter Skarp behandlar, varför de behandlas och vilka val du har som användare.',
                en: 'This page explains what personal data Skarp processes, why it is processed, and what choices you have as a user.',
            }}
            copy={{
                appLabel: { sv: 'Skarp', en: 'Skarp' },
                byline: { sv: 'av Jacob Hallman', en: 'by Jacob Hallman' },
                updated: '2026-06-25',
                lastUpdatedLabel: { sv: 'Senast uppdaterad', en: 'Last updated' },
                contactLabel: { sv: 'Kontakt', en: 'Contact' },
            }}
            sections={sections}
        />
    )
}

export default SkarpPrivacy

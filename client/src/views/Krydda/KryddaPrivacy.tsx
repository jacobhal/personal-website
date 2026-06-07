import React from 'react'
import KryddaLegalLayout, { LegalSection } from './KryddaLegalLayout'

const sections: { sv: LegalSection[]; en: LegalSection[] } = {
    sv: [
        {
            title: 'Vilka uppgifter Krydda behandlar',
            paragraphs: [
                'Krydda är byggd för att fungera offline först. Dina recept, ingredienser, anteckningar och kategorier sparas i första hand lokalt på din enhet.',
                'Om du väljer att skapa konto och använda molnsynk behandlar vi de uppgifter som behövs för att driva tjänsten.',
            ],
            bullets: [
                'Kontouppgifter som e-postadress samt eventuell profilinformation som visningsnamn eller användarnamn.',
                'Receptinnehåll som du själv lägger in eller importerar, inklusive text, ingredienser, kategorier, anteckningar och eventuella bilder.',
                'Prenumerations- och entitlementstatus om du använder premium via RevenueCat och App Store eller Google Play.',
                'Teknisk felinformation om krascher eller allvarliga fel, om felrapportering är aktiverad i den build du använder.',
            ],
        },
        {
            title: 'Hur uppgifterna används',
            bullets: [
                'För att spara, synka och säkerhetskopiera ditt receptbibliotek mellan dina enheter.',
                'För att leverera AI-funktioner som receptgenerering och fotoimport när du använder dem.',
                'För att hantera premiumfunktioner, köp, återställning av köp och kundsupport.',
                'För att felsöka stabilitetsproblem och förbättra appens tillförlitlighet.',
            ],
        },
        {
            title: 'AI-funktioner',
            paragraphs: [
                'När du använder Kryddas inbyggda AI-funktioner skickas den text och de bilder du väljer att använda via vår backend till den AI-leverantör som då driver funktionen. Detta sker bara när du aktivt använder AI-funktionen.',
                'Om du istället använder funktionen för egen API-nyckel lagras nyckeln endast lokalt på din enhet. Förfrågningar skickas då direkt från din enhet till den leverantör du själv valt.',
            ],
        },
        {
            title: 'Delning med tredje parter',
            bullets: [
                'Supabase används för konto, autentisering, molnsynk och lagring av synkade receptbilder.',
                'RevenueCat används för att validera och hantera prenumerationer.',
                'Apple App Store och Google Play hanterar själva betalningen när du köper en prenumeration.',
                'Sentry kan användas för kraschrapportering och teknisk felspårning.',
            ],
        },
        {
            title: 'Lagringstid och dina val',
            paragraphs: [
                'Lokala receptdata ligger kvar på din enhet tills du tar bort dem eller avinstallerar appen.',
                'Synkad kontodata lagras så länge ditt konto behövs för att leverera tjänsten eller tills du begär radering. Om du vill få kontodata raderad kan du kontakta mig via e-post.',
                'Om du inte vill använda molnsynk eller prenumeration kan du fortsätta använda Krydda lokalt utan att skapa konto.',
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
                'Krydda är inte avsedd för barn under 13 år, och jag samlar inte medvetet in personuppgifter från barn under 13 år.',
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
            title: 'What data Krydda processes',
            paragraphs: [
                'Krydda is designed to be offline-first. Your recipes, ingredients, notes, and categories are primarily stored locally on your device.',
                'If you choose to create an account and use cloud sync, we process the data needed to operate that service.',
            ],
            bullets: [
                'Account data such as your email address and any profile information you add, like a display name or username.',
                'Recipe content you create or import, including text, ingredients, categories, notes, and any attached images.',
                'Subscription and entitlement status if you use premium through RevenueCat and the App Store or Google Play.',
                'Technical diagnostics about crashes or serious errors, if crash reporting is enabled in the build you are using.',
            ],
        },
        {
            title: 'How data is used',
            bullets: [
                'To save, sync, and back up your recipe library across your devices.',
                'To provide AI features such as recipe generation and photo import when you use them.',
                'To manage premium features, purchases, restore flows, and support.',
                'To diagnose stability issues and improve app reliability.',
            ],
        },
        {
            title: 'AI features',
            paragraphs: [
                'When you use Krydda’s built-in AI features, the text and images you choose to submit are sent through our backend to the AI provider powering that feature at the time. This happens only when you actively use the AI feature.',
                'If you use the bring-your-own-key option instead, your API key is stored only locally on your device. Requests are then sent directly from your device to the provider you selected.',
            ],
        },
        {
            title: 'Sharing with third parties',
            bullets: [
                'Supabase is used for account services, authentication, cloud sync, and storage of synced recipe images.',
                'RevenueCat is used to validate and manage subscriptions.',
                'Apple App Store and Google Play process payments when you buy a subscription.',
                'Sentry may be used for crash reporting and technical error monitoring.',
            ],
        },
        {
            title: 'Retention and your choices',
            paragraphs: [
                'Local recipe data remains on your device until you delete it or uninstall the app.',
                'Synced account data is kept as long as your account is needed to provide the service or until you request deletion. If you want your account data deleted, contact me by email.',
                'If you do not want cloud sync or subscriptions, you can continue using Krydda locally without creating an account.',
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
                'Krydda is not intended for children under 13, and I do not knowingly collect personal data from children under 13.',
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

const KryddaPrivacy: React.FC = () => {
    return (
        <KryddaLegalLayout
            pageTitle={{
                sv: 'Integritetspolicy',
                en: 'Privacy Policy',
            }}
            pageDescription={{
                sv: 'Den här sidan beskriver vilka personuppgifter Krydda behandlar, varför de behandlas och vilka val du har som användare.',
                en: 'This page explains what personal data Krydda processes, why it is processed, and what choices you have as a user.',
            }}
            copy={{
                appLabel: { sv: 'Krydda', en: 'Krydda' },
                byline: { sv: 'av Jacob Hallman', en: 'by Jacob Hallman' },
                updated: '2026-06-07',
                lastUpdatedLabel: { sv: 'Senast uppdaterad', en: 'Last updated' },
                contactLabel: { sv: 'Kontakt', en: 'Contact' },
            }}
            sections={sections}
        />
    )
}

export default KryddaPrivacy

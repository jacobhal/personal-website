import React from 'react'
import KryddaLegalLayout, { LegalSection } from './KryddaLegalLayout'

const sections: { sv: LegalSection[]; en: LegalSection[] } = {
    sv: [
        {
            title: 'Godkännande av villkoren',
            paragraphs: [
                'Genom att ladda ned, installera eller använda Krydda godkänner du dessa användarvillkor. Om du inte godkänner villkoren ska du inte använda appen.',
            ],
        },
        {
            title: 'Vad Krydda erbjuder',
            paragraphs: [
                'Krydda är en receptapp för att spara, organisera, importera och synka recept samt använda AI-baserade funktioner för recepthjälp. Vissa funktioner kräver konto, internetuppkoppling eller en aktiv premiumprenumeration.',
            ],
        },
        {
            title: 'Ditt konto',
            bullets: [
                'Du ansvarar för att uppgifterna du lämnar är korrekta.',
                'Du ansvarar för att skydda inloggningsuppgifter och hålla din enhet säker.',
                'Du får inte använda Krydda för olaglig aktivitet eller för att försöka störa tjänsten.',
            ],
        },
        {
            title: 'Prenumerationer och betalningar',
            paragraphs: [
                'Premiumfunktioner kan säljas som auto-förnyande prenumerationer. Betalningar, uppsägningar och återbetalningar hanteras av App Store eller Google Play enligt deras villkor.',
                'Pris, provperiod och tillgängliga paket kan ändras över tid. Om du redan har en aktiv prenumeration gäller butikens regler för prisändringar och förnyelse.',
            ],
        },
        {
            title: 'Ditt innehåll',
            paragraphs: [
                'Du behåller ägandet till de recept, bilder och anteckningar du lägger in i Krydda. För att kunna driva molnsynk och säkerhetskopiering ger du mig en begränsad rätt att lagra, överföra och behandla det innehållet för att leverera tjänsten till dig.',
            ],
        },
        {
            title: 'AI-funktioner och viktigt ansvar',
            paragraphs: [
                'AI-genererat innehåll kan vara felaktigt, ofullständigt eller olämpligt för dina behov. Du ansvarar själv för att kontrollera ingredienser, allergener, mängder, tillagningstider och livsmedelssäkerhet innan du lagar eller serverar något.',
                'Krydda ger inte medicinsk, dietistrelaterad eller professionell kostrådgivning.',
            ],
        },
        {
            title: 'Tillgänglighet och förändringar',
            paragraphs: [
                'Jag kan uppdatera, ändra eller ta bort funktioner i Krydda när appen utvecklas. Jag försöker hålla tjänsten tillgänglig men kan inte lova att den alltid fungerar utan avbrott eller fel.',
            ],
        },
        {
            title: 'Ansvarsbegränsning',
            paragraphs: [
                'I den utsträckning lagen tillåter tillhandahålls Krydda i befintligt skick. Jag ansvarar inte för indirekta skador, utebliven dataåterställning, förlorad vinst eller skador som uppstår genom att du förlitar dig på AI-genererat innehåll eller felaktig receptinformation.',
                'Inget i dessa villkor begränsar rättigheter som du har enligt tvingande konsumentlagstiftning.',
            ],
        },
        {
            title: 'Uppsägning',
            paragraphs: [
                'Du kan när som helst sluta använda appen. Jag kan begränsa eller avsluta åtkomst om appen missbrukas eller används i strid med dessa villkor.',
            ],
        },
        {
            title: 'Ändringar i villkoren',
            paragraphs: [
                'Jag kan uppdatera dessa villkor när appen eller de juridiska kraven förändras. Den senaste versionen publiceras alltid på den här sidan.',
            ],
        },
    ],
    en: [
        {
            title: 'Acceptance of these terms',
            paragraphs: [
                'By downloading, installing, or using Krydda, you agree to these Terms of Use. If you do not agree, do not use the app.',
            ],
        },
        {
            title: 'What Krydda provides',
            paragraphs: [
                'Krydda is a recipe app for saving, organizing, importing, and syncing recipes, and for using AI-powered recipe assistance features. Some features require an account, an internet connection, or an active premium subscription.',
            ],
        },
        {
            title: 'Your account',
            bullets: [
                'You are responsible for providing accurate information.',
                'You are responsible for keeping your sign-in credentials and device secure.',
                'You may not use Krydda for unlawful activity or to interfere with the service.',
            ],
        },
        {
            title: 'Subscriptions and payments',
            paragraphs: [
                'Premium features may be sold as auto-renewing subscriptions. Billing, cancellations, and refunds are handled by the App Store or Google Play under their terms.',
                'Pricing, trial periods, and available packages may change over time. If you already have an active subscription, the store rules govern price changes and renewals.',
            ],
        },
        {
            title: 'Your content',
            paragraphs: [
                'You keep ownership of the recipes, images, and notes you add to Krydda. To operate cloud sync and backup, you grant me a limited right to store, transmit, and process that content solely to provide the service to you.',
            ],
        },
        {
            title: 'AI features and important responsibility',
            paragraphs: [
                'AI-generated content can be inaccurate, incomplete, or unsuitable for your needs. You are responsible for checking ingredients, allergens, quantities, cooking times, and food safety before preparing or serving anything.',
                'Krydda does not provide medical, dietetic, or professional nutritional advice.',
            ],
        },
        {
            title: 'Availability and changes',
            paragraphs: [
                'I may update, change, or remove features in Krydda as the app evolves. I aim to keep the service available, but I cannot guarantee uninterrupted or error-free operation.',
            ],
        },
        {
            title: 'Limitation of liability',
            paragraphs: [
                'To the extent permitted by law, Krydda is provided as is. I am not liable for indirect damages, failure to restore data, lost profits, or harm arising from reliance on AI-generated output or inaccurate recipe information.',
                'Nothing in these terms limits rights you may have under mandatory consumer protection law.',
            ],
        },
        {
            title: 'Termination',
            paragraphs: [
                'You may stop using the app at any time. I may limit or terminate access if the app is misused or used in breach of these terms.',
            ],
        },
        {
            title: 'Changes to these terms',
            paragraphs: [
                'I may update these terms as the app or legal requirements change. The latest version will always be published on this page.',
            ],
        },
    ],
}

const KryddaTerms: React.FC = () => {
    return (
        <KryddaLegalLayout
            pageTitle={{
                sv: 'Användarvillkor',
                en: 'Terms of Use',
            }}
            pageDescription={{
                sv: 'De här villkoren gäller när du använder Krydda och beskriver hur appen får användas, hur premium fungerar och vilka begränsningar som gäller.',
                en: 'These terms apply when you use Krydda and explain permitted use, how premium works, and the limits that apply.',
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

export default KryddaTerms

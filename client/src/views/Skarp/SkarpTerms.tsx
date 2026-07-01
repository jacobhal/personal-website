import React from 'react'
import SkarpLegalLayout, { LegalSection } from './SkarpLegalLayout'

const sections: { sv: LegalSection[]; en: LegalSection[] } = {
    sv: [
        {
            title: 'Godkännande av villkoren',
            paragraphs: [
                'Genom att ladda ned, installera eller använda Skarp godkänner du dessa användarvillkor. Om du inte godkänner villkoren ska du inte använda appen.',
            ],
        },
        {
            title: 'Vad Skarp erbjuder',
            paragraphs: [
                'Skarp är en utbildande quiz- och trivia-app med en frågebank, flerspelarlägen, progression, topplistor och kosmetiska belöningar. Vissa funktioner kräver konto, internetuppkoppling eller köp i appen.',
            ],
        },
        {
            title: 'Ditt konto',
            bullets: [
                'Du ansvarar för att uppgifterna du lämnar är korrekta.',
                'Du ansvarar för att skydda inloggningsuppgifter och hålla din enhet säker.',
                'Du får inte använda Skarp för fusk, otillåten manipulation, trakasserier eller annan olaglig aktivitet.',
            ],
        },
        {
            title: 'Köp, virtuell valuta och abonnemang',
            paragraphs: [
                'Skarp kan erbjuda köp i appen, som mynt, ädelstenar, Battle Pass eller andra digitala föremål. Betalningar, uppsägningar, återställning av köp och återbetalningar hanteras av App Store eller Google Play enligt deras villkor.',
                'Virtuell valuta och digitala föremål har inget kontantvärde och kan inte lösas in mot pengar om inte tvingande lag kräver något annat.',
            ],
        },
        {
            title: 'Rättvis användning',
            paragraphs: [
                'Du får inte försöka reverse engineera appen, kringgå säkerhetsfunktioner, automatisera spel på otillåtet sätt eller använda buggar för att skaffa en orättvis fördel i topplistor eller matcher.',
            ],
        },
        {
            title: 'Tillgänglighet och förändringar',
            paragraphs: [
                'Jag kan uppdatera, ändra eller ta bort funktioner i Skarp när appen utvecklas. Jag försöker hålla tjänsten tillgänglig men kan inte lova att den alltid fungerar utan avbrott eller fel.',
            ],
        },
        {
            title: 'Ansvarsbegränsning',
            paragraphs: [
                'I den utsträckning lagen tillåter tillhandahålls Skarp i befintligt skick. Jag ansvarar inte för indirekta skador, förlorad data, utebliven tillgång till digitala föremål efter plattforms- eller kontoproblem, eller förluster som uppstår genom att du förlitar dig på innehåll eller resultat i appen.',
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
                'By downloading, installing, or using Skarp, you agree to these Terms of Use. If you do not agree, do not use the app.',
            ],
        },
        {
            title: 'What Skarp provides',
            paragraphs: [
                'Skarp is an educational quiz and trivia app with a question bank, multiplayer modes, progression, leaderboards, and cosmetic rewards. Some features require an account, an internet connection, or in-app purchases.',
            ],
        },
        {
            title: 'Your account',
            bullets: [
                'You are responsible for providing accurate information.',
                'You are responsible for keeping your sign-in credentials and device secure.',
                'You may not use Skarp to cheat, manipulate gameplay, harass others, or engage in unlawful activity.',
            ],
        },
        {
            title: 'Purchases, virtual currency, and subscriptions',
            paragraphs: [
                'Skarp may offer in-app purchases such as coins, gems, Battle Pass access, or other digital items. Billing, cancellations, restore flows, and refunds are handled by the App Store or Google Play under their terms.',
                'Virtual currency and digital items have no cash value and cannot be redeemed for money unless mandatory law requires otherwise.',
            ],
        },
        {
            title: 'Fair use',
            paragraphs: [
                'You may not reverse engineer the app, bypass security features, automate gameplay in unauthorized ways, or exploit bugs to gain an unfair advantage in leaderboards or matches.',
            ],
        },
        {
            title: 'Availability and changes',
            paragraphs: [
                'I may update, change, or remove features in Skarp as the app evolves. I aim to keep the service available, but I cannot guarantee uninterrupted or error-free operation.',
            ],
        },
        {
            title: 'Limitation of liability',
            paragraphs: [
                'To the extent permitted by law, Skarp is provided as is. I am not liable for indirect damages, lost data, loss of access to digital items after platform or account issues, or losses arising from reliance on content or outcomes in the app.',
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

const SkarpTerms: React.FC = () => {
    return (
        <SkarpLegalLayout
            pageTitle={{
                sv: 'Användarvillkor',
                en: 'Terms of Use',
            }}
            pageDescription={{
                sv: 'De här villkoren gäller när du använder Skarp och beskriver hur appen får användas, hur köp fungerar och vilka begränsningar som gäller.',
                en: 'These terms apply when you use Skarp and explain permitted use, how purchases work, and the limits that apply.',
            }}
            copy={{
                appLabel: { sv: 'Skarp', en: 'Skarp' },
                byline: { sv: 'av Jacob Hallman', en: 'by Jacob Hallman' },
                updated: '2026-07-01',
                lastUpdatedLabel: { sv: 'Senast uppdaterad', en: 'Last updated' },
                contactLabel: { sv: 'Kontakt', en: 'Contact' },
            }}
            sections={sections}
        />
    )
}

export default SkarpTerms

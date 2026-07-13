import React from 'react'

import AppLandingPage, {
    AppFeature,
    AppStep,
    AppLandingTheme,
} from '../../components/AppLandingPage'
import icon from '../../assets/images/dagens_ord_icon.png'

const theme: AppLandingTheme = {
    background: '#17120F',
    surface: '#241B15',
    border: '#3B2B20',
    accent: '#F2B45C',
    secondaryAccent: '#E9D3A5',
    text: '#F5EADD',
    muted: '#B9A99A',
}

const features: AppFeature[] = [
    {
        title: 'A word worth noticing',
        body: 'Meet one unusual Swedish word every day, selected to make the language around you feel a little richer.',
    },
    {
        title: 'Context makes it stick',
        body: 'See the word class, full definition, synonyms, and an example sentence instead of memorizing a word in isolation.',
    },
    {
        title: 'Test the connection',
        body: 'Use the daily synonym challenge to turn a quick read into a small, satisfying moment of recall.',
    },
    {
        title: 'Build a quiet streak',
        body: 'Look back through your word history, follow your progress, and keep the daily word close with a home-screen widget.',
    },
]

const steps: AppStep[] = [
    {
        title: 'Meet today’s word',
        body: 'Open the app and get a new Swedish word with the context you need to understand it.',
    },
    {
        title: 'Guess the synonym',
        body: 'Make a quick guess and see whether the meaning has settled in.',
    },
    {
        title: 'Build your vocabulary',
        body: 'Return tomorrow, revisit your history, and let the words accumulate naturally.',
    },
]

const DagensOrd: React.FC = () => (
    <AppLandingPage
        appName="Dagens Ord"
        icon={icon}
        eyebrow="A daily Swedish word"
        title="One unusual Swedish word. Every day."
        description="A small daily ritual for curious language learners — with definitions, context, synonym challenges, and a history you can return to."
        appStoreUrl="https://apps.apple.com/se/app/dagens-ord/id6761329508"
        appStoreLabel="Get Dagens Ord on the App Store"
        theme={theme}
        features={features}
        steps={steps}
    />
)

export default DagensOrd

import React from 'react'

import AppLandingPage, {
    AppFeature,
    AppStep,
    AppLandingTheme,
} from '../../components/AppLandingPage'
import icon from '../../assets/images/hitquiz_icon.png'

const theme: AppLandingTheme = {
    background: '#0B100D',
    surface: '#151D17',
    border: '#29382B',
    accent: '#A5E632',
    secondaryAccent: '#F2C14E',
    text: '#F2F6EE',
    muted: '#A8B5AA',
}

const features: AppFeature[] = [
    {
        title: 'One host, everyone playing',
        body: 'The host controls the round while everyone else stays in the moment — no phone passing and no awkward setup.',
    },
    {
        title: 'More than naming the song',
        body: 'Score the artist, title, and year. The closest year gets a point, so a confident guess can still pay off.',
    },
    {
        title: 'Duels change the energy',
        body: 'Random duels give two players a chance to steal the spotlight with bonus points on the line.',
    },
    {
        title: 'Start free, keep playing',
        body: 'Jump in with free song bundles, then add the optional expansion when your group wants a bigger playlist.',
    },
]

const steps: AppStep[] = [
    {
        title: 'Play a clip',
        body: 'The host starts a song and the room gets a short window to recognize the moment.',
    },
    {
        title: 'Shout the answer',
        body: 'Call out the artist, title, or year before the next song takes over.',
    },
    {
        title: 'Score the room',
        body: 'The host marks the answers, awards the closest guesses, and keeps the leaderboard moving.',
    },
]

const HitQuiz: React.FC = () => (
    <AppLandingPage
        appName="HitQuiz"
        icon={icon}
        eyebrow="A party music game"
        title="The party music game where everyone shouts the answer."
        description="Turn a room full of friends into a live music quiz. Play a clip, call your shot, and find out who really knows their songs."
        appStoreUrl="https://apps.apple.com/se/app/hitquiz/id6761611878"
        appStoreLabel="Get HitQuiz on the App Store"
        theme={theme}
        features={features}
        steps={steps}
    />
)

export default HitQuiz

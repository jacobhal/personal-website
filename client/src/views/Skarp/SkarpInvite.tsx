import React from 'react'

import AppInvitePage from '../../components/AppInvitePage'
import '../../components/AppInvitePage.scss'
import {
    SKARP_APP_STORE_URL,
    SKARP_PLAY_STORE_URL,
} from '../../config/appStores'
import owl from '../../assets/images/skarp_owl.png'

const SkarpInvite: React.FC = () => (
    <AppInvitePage
        config={{
            appName: 'Skarp',
            appIcon: owl,
            appStoreUrl: SKARP_APP_STORE_URL,
            playStoreUrl: SKARP_PLAY_STORE_URL,
            marketingPath: '/skarp',
            eyebrow: 'One-shot challenge',
            headline: 'A friend challenged you in Skarp',
            description:
                'Play the same five questions and see who scores higher. Install Skarp, then use this challenge code.',
            codeLabel: 'Challenge code',
            accent: '#5C6BC0',
            background: '#0E0E14',
            surface: '#1A1A28',
            text: '#ECECF2',
            muted: '#A0A0B4',
        }}
    />
)

export default SkarpInvite

import React from 'react'

import AppInvitePage from '../../components/AppInvitePage'
import '../../components/AppInvitePage.scss'
import {
    KRYDDA_APP_STORE_URL,
    KRYDDA_PLAY_STORE_URL,
} from '../../config/appStores'
import icon from '../../assets/images/krydda_icon.png'

const KryddaInvite: React.FC = () => (
    <AppInvitePage
        config={{
            appName: 'Krydda',
            appIcon: icon,
            appStoreUrl: KRYDDA_APP_STORE_URL,
            playStoreUrl: KRYDDA_PLAY_STORE_URL,
            marketingPath: '/krydda',
            eyebrow: 'Friend invite',
            headline: 'You have been invited to Krydda',
            description:
                'Install Krydda, then enter this invite code after creating your account. Keep it handy until setup is complete.',
            codeLabel: 'Invite code',
            accent: '#E2671C',
            background: '#14110E',
            surface: '#211B15',
            text: '#EFE7DD',
            muted: '#A89B8C',
        }}
    />
)

export default KryddaInvite

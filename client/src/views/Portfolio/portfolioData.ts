import githubImage from '../../assets/images/github.jpg'
import reactImage from '../../assets/images/react.jpg'
import coronaImage from '../../assets/images/corona.jpg'
import webscrapingImage from '../../assets/images/webscraping.png'
import stockmarketImage from '../../assets/images/stockmarket.jpg'
import skarpImage from '../../assets/images/skarp_owl.png'
import kryddaImage from '../../assets/images/krydda_icon.png'
import hitquizImage from '../../assets/images/hitquiz_icon.png'
import dagensOrdImage from '../../assets/images/dagens_ord_icon.png'

export interface PortfolioProject {
    id: string
    title: string
    kind: string
    description: string
    route: string
    image: string
    accent: string
    status: string
    external?: boolean
    actionLabel?: string
}

export const portfolioProjects: PortfolioProject[] = [
    {
        id: 'HITQUIZ',
        title: 'HitQuiz',
        kind: 'Product · iOS',
        description:
            'A host-led music party game where the room shouts the answer and every round tells a story.',
        route: '/hitquiz',
        image: hitquizImage,
        accent: '#A5E632',
        status: 'New',
        actionLabel: 'See the game',
    },
    {
        id: 'DAGENS_ORD',
        title: 'Dagens Ord',
        kind: 'Product · iOS',
        description:
            'One unusual Swedish word a day, with enough context to make it stick beyond today.',
        route: '/dagens-ord',
        image: dagensOrdImage,
        accent: '#F2B45C',
        status: 'New',
        actionLabel: 'See the app',
    },
    {
        id: 'SKARP',
        title: 'Skarp',
        kind: 'Product · iOS & Android',
        description:
            'An educational trivia game built around curiosity, competition, and steady progression.',
        route: '/skarp',
        image: skarpImage,
        accent: '#8E9BFF',
        status: 'Live',
        actionLabel: 'Explore app',
    },
    {
        id: 'KRYDDA',
        title: 'Krydda',
        kind: 'Product · iOS & Android',
        description:
            'A calm recipe companion for collecting, organizing, and actually cooking the food you save.',
        route: '/krydda',
        image: kryddaImage,
        accent: '#F39A51',
        status: 'Live',
        actionLabel: 'Explore app',
    },
    {
        id: 'CONGRESS',
        title: 'Congress Filings',
        kind: 'Data product · Web',
        description:
            'A focused interface for exploring US congressional trading disclosures and the people behind them.',
        route: '/congress',
        image: stockmarketImage,
        accent: '#67D1C0',
        status: 'Live',
        actionLabel: 'Open project',
    },
    {
        id: 'REACTPLAYG',
        title: 'React Playground',
        kind: 'Experiment · Web',
        description:
            'A living sandbox for trying new React ideas, interaction patterns, and component approaches.',
        route: '/react-playground',
        image: reactImage,
        accent: '#61DAFB',
        status: 'Ongoing',
        actionLabel: 'Open project',
    },
    {
        id: 'CORDASH',
        title: 'Corona Dashboard',
        kind: 'Data visualization · Web',
        description:
            'A live dashboard that turns public health data into a clear, browsable snapshot.',
        route: '/corona-dashboard',
        image: coronaImage,
        accent: '#F56B6B',
        status: 'Archive',
        actionLabel: 'Open project',
    },
    {
        id: 'RESTOCKER',
        title: 'Restocker',
        kind: 'Automation · GitHub',
        description:
            'A scheduled scraping service that watches product pages and reports when the stock comes back.',
        route: 'https://github.com/jacobhal/restocker-api',
        image: webscrapingImage,
        accent: '#E78BE7',
        status: 'Open source',
        external: true,
        actionLabel: 'View on GitHub',
    },
    {
        id: 'GITGUIDE',
        title: 'Complete Git Guide',
        kind: 'Course · GitHub',
        description:
            'A practical guide to Git, from low-level commands to rebasing and collaborative workflows.',
        route: 'https://github.com/jacobhal/git-course',
        image: githubImage,
        accent: '#F1F1F1',
        status: 'Course',
        external: true,
        actionLabel: 'View course',
    },
]

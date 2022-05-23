import React, { Suspense, lazy, useRef } from 'react'

import MainJumbotron from '../../components/MainJumbotron'
import './../../styles/portfolio.scss'
import { Container, Alert } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import DefaultLoader from './../../components/DefaultLoader'

// Import project images
import githubImage from './../../assets/images/github.jpg'
import reactImage from './../../assets/images/react.jpg'
import coronaImage from './../../assets/images/corona.jpg'
import webscrapingImage from './../../assets/images/webscraping.png'
import stockmarketImage from './../../assets/images/stockmarket.jpg'
import graphicscardImage from './../../assets/images/graphicscard.jpg'

// Lazy load project image grid
const ProjectImageGrid = lazy(() => import('./components/ProjectImageGrid'))

export default function Portfolio() {
    const projectStatus = {
        TODO: 'In development',
        FINISHED: 'Finished',
        ABANDONED: 'Abandoned',
    }
    let projects = [
        {
            id: 'REACTPLAYG',
            hasCourseWatermark: false,
            title: 'React playground',
            route: '/react-playground',
            image: reactImage,
            description:
                'This is a playground for exploring new React features since this entire website is built with React.',
            status: projectStatus.FINISHED,
        },
        {
            id: 'CORDASH',
            hasCourseWatermark: false,
            title: 'Corona dashboard',
            route: '/corona-dashboard',
            image: coronaImage,
            description:
                'A live update corona dashboard using data from John Hopkins.',
            status: projectStatus.FINISHED,
        },
        {
            id: 'RESTOCKER',
            hasCourseWatermark: false,
            title: 'Restocker (Github)',
            image: webscrapingImage,
            route: 'https://github.com/jacobhal/restocker-api',
            description:
                "Find out when your favourite products are back in stock by scraping the seller's website." +
                ' The project uses Selenium + Python + Beautifulsoup to scrape websites and is scheduled to run every hour.',
            status: projectStatus.FINISHED,
        },
        {
            id: 'GAMEREV',
            hasCourseWatermark: false,
            title: 'Game review website',
            route: 'http://www.codehalls.com',
            image: graphicscardImage,
            description:
                'An old school project built with Laravel and PHP (not responsive).',
            status: projectStatus.FINISHED,
        },
        {
            id: 'STOCKPRED',
            hasCourseWatermark: false,
            title: 'Stock predictor',
            route: '/stockpredictor',
            image: stockmarketImage,
            description:
                'Financial market predictor using Machine learning and realtime data Stock API:s. A separate API' +
                ' was deployed to Heroku using Flask + MySQL which is where the data actual data fetching occurrs. The financial API:s' +
                ' being used are free versions of Yahoo Finance and Alphavantage.',
            status: projectStatus.TODO,
        },
    ]

    const courseStatus = {
        TODO: 'In progress',
        FINISHED: 'Finished',
        ABANDONED: 'Abandoned',
    }

    let courses = [
        {
            id: 'GITGUIDE',
            hasCourseWatermark: true,
            title: 'Complete Git Guide',
            route: 'https://github.com/jacobhal/git-course',
            image: githubImage,
            description:
                'A Git course on Udemy. It covers everything from git low-level commands to more advanced featues' +
                ' such as rebasing and cherry-picking.',
            status: courseStatus.FINISHED,
        },
    ]

    const containerRef = useRef(null)

    return (
        <div>
            <Helmet>
                <title>
                    Jacob Hallman - Portfolio of personal web projects
                </title>
                <meta
                    name="description"
                    content="The personal web portfolio of Jacob Hallman includes various personal projects that I have been working on in my freetime. 
                The projects ranges from exploring third-party libraries to implementing ideas that are on my mind."
                />
            </Helmet>
            <MainJumbotron
                title="PERSONAL PROJECTS"
                subtitle="Check out some passion projects of mine"
                backgroundClass="has-bg-img-bulb"
                scrollRef={containerRef}
            />
            <Container
                className="pb-3 justify-content-center align-items-center text-center"
                ref={containerRef}
            >
                <h1 className="title">My Projects and Courses</h1>
                <p>
                    This is a list of some of the projects that I have done or
                    that I am currently working on in my free time. The projects
                    are either things I can use in my daily life or simply
                    technologies that I want to learn more about.
                </p>
                <Alert variant="secondary">
                    Images marked with <strong>Udemy</strong> are tied to
                    completed courses at Udemy.
                </Alert>
                <Suspense fallback={<DefaultLoader />}>
                    <ProjectImageGrid projects={[...projects, ...courses]} />
                </Suspense>
            </Container>
        </div>
    )
}

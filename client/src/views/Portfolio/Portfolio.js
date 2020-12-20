import React from 'react';

import MainJumbotron from '../../components/MainJumbotron';
import Table from './components/ProjectTable';

import { Container } from 'react-bootstrap';
import { Helmet } from "react-helmet";

export default function Portfolio() {
    const projectStatus = {
        TODO:   "In development",
        FINISHED:  "Finished",
        ABANDONED: "Abandoned"
    };
    let projects = [
        {
            id: 1,
            title: "React playground",
            route: "/react-playground",
            description: "This is a playground for exploring new React features since this entire website is built with React.",
            status: projectStatus.FINISHED
        },
        {
            id: 2,
            title: "Corona dashboard",
            route: "/corona-dashboard",
            description: "A live update corona dashboard using data from John Hopkins.",
            status: projectStatus.FINISHED
        },
        {
            id: 3,
            title: "Restocker (Github)",
            route: "https://github.com/jacobhal/restocker-api",
            description: "Find out when your favourite products are back in stock by scraping the seller's website." + 
             " The project uses Selenium + Python + Beautifulsoup to scrape websites and is scheduled to run every hour.",
            status: projectStatus.FINISHED
        },
        {
            id: 4,
            title: "Game review website",
            route: "http://www.codehalls.com",
            description: "An old school project built with Laravel and PHP (not responsive).",
            status: projectStatus.FINISHED
        },
        {
            id: 5,
            title: "Stock predictor",
            route: "/stockpredictor",
            description: "Financial market predictor using Machine learning and realtime data Stock API:s. A separate API" + 
             " was deployed to Heroku using Flask + MySQL which is where the data actual data fetching occurrs. The financial API:s" +
             " being used are free versions of Yahoo Finance and Alphavantage.",
            status: projectStatus.TODO
        }
    ]

    const courseStatus = {
        TODO:   "In progress",
        FINISHED:  "Finished",
        ABANDONED: "Abandoned"
    };

    let courses = [
        {
            id: 1,
            title: "Complete Git Guide: Understand and master Git and GitHub",
            route: "https://github.com/jacobhal/git-course",
            description: "A Git course on Udemy. It covers everything from git low-level commands to more advanced featues" +
            " such as rebasing and cherry-picking.",
            status: courseStatus.FINISHED
        }     
    ]
    return (
        <div>
            <Helmet>
            <title>Jacob Hallman - Portfolio of personal web projects</title>
            <meta name="description" content="The personal web portfolio of Jacob Hallman includes various personal projects that I have been working on in my freetime. 
                The projects ranges from exploring third-party libraries to implementing ideas that are on my mind." />
            </Helmet>
            <MainJumbotron 
                title="PERSONAL PROJECTS" 
                subtitle="Check out some passion projects of mine" 
                backgroundClass="has-bg-img-bulb" />
            <Container>
                <h1 className="title">My Udemy Courses</h1>
                <p>This is a list of Udemy courses that I have either completed or that I am currently taking in my freetime. 
                    These courses either contain skills that I use every day at work and want to improve on or things I am
                    intrigued by and want to learn more about. Click the links to go to the Github repository corresponding
                    to each course (certificates are shown in the main repository README file).</p>
                < Table projects={courses} tableFirstColumnTitle="Course"/>
                <h1 className="title">My Projects</h1>
                <p>This is a list of some of the projects that I have done or that I am currently working on in my freetime. 
                    The projects are either things I can use in my daily life or simply technologies that I want to learn more about.</p>
                < Table projects={projects} tableFirstColumnTitle="Project"/>
            </Container>
        </div>
    );
}

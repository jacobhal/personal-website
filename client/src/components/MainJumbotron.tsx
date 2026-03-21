import React from 'react'
import { Box, Container } from '@mui/material'
import { NavBar } from './NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

interface MainJumbotronProps {
    title: string
    subtitle: string
    backgroundClass: string
    isFullHeight?: boolean
    children?: React.ReactNode
    scrollRef?: React.RefObject<HTMLElement>
}

const MainJumbotron: React.FC<MainJumbotronProps> = ({
    title,
    subtitle,
    backgroundClass,
    isFullHeight,
    children,
    scrollRef,
}) => {
    const executeScroll = (e: React.MouseEvent) => {
        e.preventDefault()
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <Box className={backgroundClass + ' jumbotron-full-page'}>
            <NavBar />
            <Container className="jumbotron-content">
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <h1
                        className="outline text-center"
                        id="jumbotron-subtitle"
                    >
                        {subtitle}
                    </h1>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <h3 className="outline text-center" id="jumbotron-title">
                        {title}
                    </h3>
                </Box>
                {children}
                {!isFullHeight && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        id="scroll-arrow"
                    >
                        {scrollRef && (
                            <div className="arrow bounce">
                                <span onClick={executeScroll}>
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </span>
                            </div>
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    )
}

export default MainJumbotron

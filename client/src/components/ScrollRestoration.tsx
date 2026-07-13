import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface ScrollTarget {
    scrollIntoView: (options?: ScrollIntoViewOptions) => void
}

export const scrollToLocation = (
    hash: string,
    findElement: (id: string) => ScrollTarget | null,
    scrollToTop: () => void
) => {
    if (hash) {
        const id = hash.slice(1)
        const element = findElement(id)

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
        }
    }

    scrollToTop()
}

const ScrollRestoration: React.FC = () => {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        scrollToLocation(
            hash,
            (id) => document.getElementById(id),
            () => window.scrollTo(0, 0)
        )
    }, [pathname, hash])

    return null
}

export default ScrollRestoration

import React, { useState } from 'react'
import logo from '../../assets/images/favicon-256.png'
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Link,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import './NavBar.scss'

interface NavBarProps {
    noImage?: boolean
}

const NavBar: React.FC<NavBarProps> = ({ noImage }) => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Resume', href: '/resume' },
        { label: 'About', href: '/about' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Contact', href: '/contact' },
    ]

    return (
        <AppBar
            position={noImage ? 'static' : 'absolute'}
            elevation={0}
            sx={{
                backgroundColor: noImage ? 'rgba(20,20,20,0.95)' : 'transparent',
                zIndex: 10,
            }}
        >
            <Toolbar>
                <Link href="/" sx={{ flexGrow: 0 }}>
                    <img
                        src={logo}
                        alt="Jacob Hallman"
                        style={{ height: '28px', width: '28px' }}
                    />
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 2 }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            underline="none"
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                color: '#fff',
                                fontWeight: 500,
                                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                                transition: 'color 0.15s',
                                '&:hover': {
                                    color: 'rgba(255,255,255,0.6)',
                                },
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </Box>
                <IconButton
                    sx={{ display: { xs: 'flex', lg: 'none' } }}
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <List sx={{ width: 250 }}>
                        {navLinks.map((link) => (
                            <ListItem key={link.href} disablePadding>
                                <ListItemButton
                                    component="a"
                                    href={link.href}
                                >
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar

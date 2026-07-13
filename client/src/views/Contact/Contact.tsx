import React, { useState } from 'react'

import { Helmet } from 'react-helmet'
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Typography,
} from '@mui/material'
import axios from 'axios'

import DefaultLoader from '../../components/DefaultLoader'
import PersonalPageShell from '../../components/PersonalPageShell'

const Contact: React.FC = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [mailInProgress, setMailInProgress] = useState(false)
    const [mailSent, setMailSent] = useState(false)
    const [response, setResponse] = useState('')
    const [status, setStatus] = useState(false)

    const onSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault()
        setMailInProgress(true)

        try {
            const params = new URLSearchParams()
            params.append('form_name', name)
            params.append('form_email', email)
            params.append('form_subject', subject)
            params.append('form_msg', message)

            const res = await axios.post('https://jacobhal.se/mailer.php', params, {
                timeout: 10000,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
            setMailInProgress(false)
            setMailSent(true)
            setResponse(typeof res.data === 'string' ? res.data : 'Message sent!')
            setStatus(true)
        } catch (err: any) {
            setMailInProgress(false)
            setMailSent(true)
            const serverMsg = err?.response?.data
            setResponse(
                typeof serverMsg === 'string' && serverMsg
                    ? serverMsg
                    : 'Something went wrong. Please try again later.'
            )
            setStatus(false)
        }
    }

    let formContent: React.ReactNode

    if (mailInProgress) {
        formContent = <DefaultLoader />
    } else if (mailSent) {
        const header = status ? 'Email has been sent' : 'An error occurred'
        const msg = response || 'Something went wrong.'
        formContent = (
            <Alert severity={status ? 'success' : 'error'} sx={{ textAlign: 'left' }}>
                <AlertTitle>{header}</AlertTitle>
                {msg}
            </Alert>
        )
    } else {
        formContent = (
            <Box component="form" onSubmit={onSubmit} id="contact-form" className="contact-form">
                <Box className="contact-field">
                    <label htmlFor="contact-name">
                        Your name <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={name}
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Box>
                <Box className="contact-field">
                    <label htmlFor="contact-email">
                        Email address <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={email}
                        required
                        autoComplete="email"
                        aria-describedby="contact-email-helper"
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Typography component="p" id="contact-email-helper" className="contact-field-helper">
                        I’ll only use it to reply to your message.
                    </Typography>
                </Box>
                <Box className="contact-field">
                    <label htmlFor="contact-subject">Subject</label>
                    <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        value={subject}
                        autoComplete="off"
                        placeholder="What’s on your mind?"
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </Box>
                <Box className="contact-field">
                    <label htmlFor="contact-message">
                        Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        value={message}
                        required
                        rows={6}
                        placeholder="Tell me a little about it."
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Box>
                <Button variant="contained" type="submit" className="contact-form-submit">
                    Send message
                </Button>
            </Box>
        )
    }

    return (
        <Box>
            <Helmet>
                <title>Jacob Hallman — Contact</title>
                <meta
                    name="description"
                    content="A way to get in touch with Jacob Hallman about a project, question, or idea."
                />
            </Helmet>
            <PersonalPageShell
                eyebrow="Contact / say hello"
                title={
                    <>
                        Found something interesting?
                        <em> Say hello.</em>
                    </>
                }
                description="If one of the projects caught your attention, or you just have a question, send me a note."
                heroAside={
                    <Box className="personal-page-note">
                        <Typography component="p" className="personal-page-label">
                            No pitch required
                        </Typography>
                        <Typography component="h2" className="personal-page-note-title">
                            A short note is enough.
                        </Typography>
                        <Typography component="p" className="personal-page-copy-text">
                            Questions, feedback, or a good conversation are all welcome.
                        </Typography>
                    </Box>
                }
            >
                <Container maxWidth="lg">
                    <Box component="section" className="personal-page-section">
                        <Box className="contact-layout">
                            <Box className="contact-context-panel">
                                <Typography component="p" className="personal-page-kicker">
                                    A note is enough
                                </Typography>
                                <Typography component="h2">
                                    Tell me what caught your attention.
                                </Typography>
                                <Typography component="p">
                                    Ask about a project, share some feedback, or just say hello.
                                    You don’t need a formal brief.
                                </Typography>
                                <Box component="ul" className="contact-context-list">
                                    <li>Questions about an app</li>
                                    <li>Feedback or ideas</li>
                                    <li>A good conversation</li>
                                </Box>
                            </Box>
                            <Box className="contact-form-panel">{formContent}</Box>
                        </Box>
                    </Box>
                </Container>
            </PersonalPageShell>
        </Box>
    )
}

export default Contact

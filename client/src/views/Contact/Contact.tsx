import React, { useRef, useState } from 'react'

import MainJumbotron from '../.././components/MainJumbotron'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faEnvelope,
    faFolderOpen,
} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet'
import DefaultLoader from './../../components/DefaultLoader'

import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'

import axios from 'axios'

const Contact: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
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
            const res = await axios.post('https://jacobhal.se/mailer.php', {
                form_name: name,
                form_email: email,
                form_subject: subject,
                form_msg: message,
            }, { timeout: 10000 })
            setMailInProgress(false)
            setMailSent(true)
            setResponse(res.data.message)
            setStatus(res.data.success)
        } catch (err) {
            setMailInProgress(false)
            setMailSent(true)
            setResponse(err instanceof Error ? err.message : 'Something went wrong. Please try again later.')
            setStatus(false)
        }
    }

    let htmlOutput

    if (mailInProgress) {
        htmlOutput = <DefaultLoader />
    } else if (mailSent) {
        const header = status ? 'Email has been sent' : 'An error occurred'
        const msg = response || 'Something went wrong.'
        htmlOutput = (
            <Alert severity={status ? 'success' : 'error'} sx={{ textAlign: 'center' }}>
                <AlertTitle>{header}</AlertTitle>
                {msg}
            </Alert>
        )
    } else {
        htmlOutput = (
            <Box component="form" onSubmit={onSubmit} id="contact-form">
                <TextField
                    fullWidth
                    label="Your name"
                    name="name"
                    type="text"
                    value={name}
                    required
                    placeholder="Enter name (required)"
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faUser} />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    fullWidth
                    label="Email address"
                    name="email"
                    type="email"
                    value={email}
                    required
                    placeholder="Enter email (required)"
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    helperText="I'll never share your email with anyone else."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    type="text"
                    value={subject}
                    placeholder="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faFolderOpen} />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={message}
                    required
                    multiline
                    rows={5}
                    placeholder="Message (required)"
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                />
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button variant="outlined" type="submit">
                        Send
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Contact me</title>
                <meta
                    name="description"
                    content="Don't hesitate to reach out to me! This form will send an email to me."
                />
            </Helmet>
            <MainJumbotron
                title="REACH OUT TO ME"
                subtitle="Let's get in touch"
                backgroundClass="has-bg-img-reach"
                scrollRef={containerRef}
            />
            <Container sx={{ pb: 3 }} id="form-container" ref={containerRef}>
                {htmlOutput}
            </Container>
        </div>
    )
}

export default Contact

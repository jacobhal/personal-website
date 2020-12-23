import React from 'react'

import MainJumbotron from '../.././components/MainJumbotron'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faEnvelope,
    faFolderOpen,
} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet'
import DefaultLoader from './../../components/DefaultLoader'

import { Button, Container, Alert, Form, InputGroup } from 'react-bootstrap'

import axios from 'axios'
import $ from 'jquery'

const Contact = () => {
    class ContactForm extends React.Component {
        constructor() {
            super()

            this.state = {
                email: '',
                name: '',
                subject: '',
                message: '',
                mailInProgress: false,
                mailSent: false,
                response: '',
                status: false,
            }
            this.onChange = this.onChange.bind(this)
            this.onSubmit = this.onSubmit.bind(this)

            this.httpClient = axios.create()
            this.httpClient.defaults.timeout = 5000
        }

        onChange = (evt) => {
            const value = evt.target.value
            this.setState({
                [evt.target.name]: value,
            })
        }

        async onSubmit(evt) {
            evt.preventDefault()
            const { name, email, subject, message } = this.state
            this.showSpinnerIcon()
            var parentState = this

            $.ajax({
                url: 'https://jacobhal.se/mailer.php',
                type: 'POST',
                data: {
                    form_name: name,
                    form_email: email,
                    form_subject: subject,
                    form_msg: message,
                },

                success: function (data) {
                    // Success..
                    parentState.setState({
                        mailInProgress: false,
                        mailSent: true,
                        response: data.message,
                        status: data.success,
                    })
                },

                error: function (data) {
                    parentState.setState({
                        mailInProgress: false,
                        mailSent: true,
                        response: data.message,
                        status: data.success,
                    })
                },
            })
        }

        showSpinnerIcon() {
            this.setState({
                mailInProgress: true,
            })
        }

        render() {
            const {
                email,
                name,
                subject,
                message,
                mailInProgress,
                mailSent,
                response,
                status,
            } = this.state
            let htmlOutput

            if (mailInProgress) {
                htmlOutput = <DefaultLoader />
            } else if (mailSent) {
                let header
                let msg = response
                if (!msg) {
                    msg = 'Something went wrong.'
                }
                if (status) {
                    header = 'Email has been sent'
                } else {
                    header = 'An error occurred'
                }
                htmlOutput = (
                    <div>
                        <Alert
                            variant={status ? 'success' : 'danger'}
                            className="text-center"
                        >
                            <Alert.Heading>{header}</Alert.Heading>
                            {msg}
                        </Alert>
                    </div>
                )
            } else {
                htmlOutput = (
                    <Form onSubmit={this.onSubmit} id="contact-form">
                        <Form.Group controlId="formName">
                            <Form.Label>Your name</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faUser} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onChange={this.onChange}
                                    name="name"
                                    type="text"
                                    value={name}
                                    required
                                    placeholder="Enter name (required)"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onChange={this.onChange}
                                    name="email"
                                    value={email}
                                    required
                                    type="email"
                                    placeholder="Enter email (required)"
                                />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                I'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formSubject">
                            <Form.Label>Subject</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faFolderOpen} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onChange={this.onChange}
                                    name="subject"
                                    type="text"
                                    value={subject}
                                    placeholder="Subject"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="formMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                onChange={this.onChange}
                                name="message"
                                value={message}
                                required
                                as="textarea"
                                rows={5}
                                placeholder="Message (required)"
                            />
                        </Form.Group>
                        <Form.Group className="text-center">
                            <Button
                                variant="light"
                                type="submit"
                                className="text-center"
                            >
                                Send
                            </Button>
                        </Form.Group>
                    </Form>
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
                    />
                    <Container className="pb-3" id="form-container">
                        {htmlOutput}
                    </Container>
                </div>
            )
        }
    }
    return <ContactForm />
}

export default Contact

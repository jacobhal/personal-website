import React from 'react';

import MainHero from '../.././components/MainHero';

import { Button, Section, Container, Loader, Heading, Message, Form } from 'react-bulma-components/full';

import axios from 'axios';
import $ from 'jquery';

const Contact = props => {
  class ContactForm extends React.Component {
    constructor () {
      super()

      this.state = {
         email: '',
         name: '',
         subject: '',
         message: '',
         mailInProgress: false,
         mailSent: false,
         response: '',
         status: false
       };
       this.onChange = this.onChange.bind(this);
       this.onSubmit = this.onSubmit.bind(this);

       this.httpClient = axios.create();
       this.httpClient.defaults.timeout = 5000;
    }

    onChange = evt => {
      const value = evt.target.value;
      this.setState({
        [evt.target.name]: value,
      });
    };

    async onSubmit(evt) {
      evt.preventDefault();
      const { name, email, subject, message } = this.state;
      this.showSpinnerIcon();
      var parentState = this;

      $.ajax({
        url: 'https://jacobhal.se/mailer.php',
        type: 'POST',
        data: {
          "form_name": name,
          "form_email": email,
          "form_subject": subject,
          "form_msg": message
        },

        success: function(data) {
          // Success..
          parentState.setState({
            mailInProgress: false,
            mailSent: true,
            response: data.message,
            status: data.success
          });
        },

        error: function(data) {
          parentState.setState({
            mailInProgress: false,
            mailSent: true,
            response: data.message,
            status: data.success
          });
        }
      });
    }

    showSpinnerIcon() {
      this.setState({
        mailInProgress: true,
      });
    }

    render () {
      const { email, name, subject, message, mailInProgress, mailSent, response, status } = this.state;
      let htmlOutput;

      if(mailInProgress) {
      htmlOutput =
      <div>
        <Heading className="has-text-centered subtitle-style" subtitle>
          Sending Email
        </Heading>
        <Loader
          className="loading-spinner"
          style={{
            width: 200,
            height: 200,
            border: '8px solid grey',
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
          }} />
      </div>
    } else if (mailSent) {
      let header;
      let msg = response;
      if (!msg) { msg = "Something went wrong."}
      if(status) {
        header = "Email has been sent";
      } else {
        header = "An error occurred";
      }
      htmlOutput =
      <div>
        <Message color={status ? "success" : "danger"}>
          <Message.Header>
            {header}
          </Message.Header>
          <Message.Body>
            {msg}
          </Message.Body>
        </Message>
      </div>

    } else {
        htmlOutput =
        <form onSubmit={this.onSubmit} id="contact-form">
            <Container id="form-container">
              <Form.Field>
                <Form.Label>Your name</Form.Label>
                <Form.Control className="has-icons-left">
                  <Form.Input required onChange={this.onChange} name="name" id="form-name" type="text" placeholder="Your name (required)" value={name}/>
                  <span className="icon is-small is-left">
                    <i className="fa fa-home"></i>
                  </span>
                </Form.Control>
              </Form.Field>
              <Form.Field>
                <Form.Label>Your email</Form.Label>
                <Form.Control className="has-icons-left">
                  <Form.Input required onChange={this.onChange} name="email" id="form-email" type="email" placeholder="Your email (required)" value={email}/>
                  <span className="icon is-small is-left">
                    <i className="fa fa-envelope"></i>
                  </span>
                </Form.Control>
              </Form.Field>
              <Form.Field>
                <Form.Label>Subject</Form.Label>
                <Form.Control className="has-icons-left">
                  <Form.Input onChange={this.onChange} name="subject" id="form-subject" type="text" placeholder="Subject" value={subject}/>
                  <span className="icon is-small is-left">
                    <i className="fa fa-folder-open"></i>
                  </span>
                </Form.Control>
              </Form.Field>
              <Form.Field>
                <Form.Label>Message</Form.Label>
                <Form.Control>
                  <Form.Textarea required onChange={this.onChange} name="message" id="form-message" placeholder="Message (required)" value={message}/>
                </Form.Control>
              </Form.Field>
              <Form.Control className="has-text-centered">
                <Button id="btn-send">Send</Button>
              </Form.Control>
            </Container>
          </form>
      }
      return (
      <div>
        <MainHero title="REACH OUT TO ME" subtitle="Let's get in touch" background="has-bg-img-reach"/>
        <Section>
          {htmlOutput}
        </Section>
      </div>
      );
    }
  }
  return <ContactForm />;
}

export default Contact;

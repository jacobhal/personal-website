import React from 'react';

import MainHero from '../.././components/MainHero';
import { Helmet } from "react-helmet";

import { Button, Section, Container, Spinner, Alert, Form } from 'react-bootstrap';

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
        
        <Spinner
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
        <Alert color={status ? "success" : "danger"}>
          <Alert.Heading>
            {header}
          </Alert.Heading>
            {msg}
        </Alert>
      </div>

    } else {
        htmlOutput =
        <form onSubmit={this.onSubmit} id="contact-form">
            
          </form>
      }
      return (
      <div>
        <Helmet>
          <title>Jacob Hallman - Contact me</title>
          <meta name="description" content="Don't hesitate to reach out to me! This form will send an email to me." />
        </Helmet>
        <MainHero title="REACH OUT TO ME" subtitle="Let's get in touch" background="has-bg-img-reach"/>
        <Container>
          {htmlOutput}
        </Container>
      </div>
      );
    }
  }
  return <ContactForm />;
}

export default Contact;

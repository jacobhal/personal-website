const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const creds = require('./config.js');
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handles any requests
app.get('/', function (req, res) {
  res.send('Det funkar!!!');
  console.log('Det funkar!!!');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

//app.get('*', (req, res) => res.sendFile(path.resolve('build', 'client/build/index.html'));

app.post('/api/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul style="list-style: none !important;margin: 0 !important;padding: 0 !important;">
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: creds.USER, // generated ethereal user
          pass: creds.PASS // generated ethereal password
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <jacobhal.bot@gmail.com>', // sender address
      to: 'jacob@jacobhal.se', // list of receivers
      subject: 'Node Contact Request', // Subject line
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
          res.send('An error occurred')
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.send('Message has been sent successfully!')
  });
});

app.listen(5001, () => console.log('Server started...'));

// Handles any requests
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

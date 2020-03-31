// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC5454fb3a8dd75fb84b7d925fe7fa68d1';
const authToken = '235e4bff2663042d959e8403359a1d12';
const client = require('twilio')(accountSid, authToken);
console.log("called")
client.messages
    .create({
        body: 'Hi! Thanks for inquiring about 3hands. Tell us a little more about yourself. If you need help, respond with 1. If you are providing help, respond with 2. If you both need help, and can provide help, respond with 3.',
        from: '+12082955052', //phone number form twilio dashboard
        to: '+17326049342' //+ 1 607 - 279 - 3623
    })
    .then(message => console.log(message.sid));
/*
client.messages
    .create({
        body: 'Tell us a little more about yourself. If you need help, respond with 1. If you are providing help, respond with 2. If you both need help, and can provide help, respond with 3.',
        from: '+12082955052', //phone number form twilio dashboard
        to: '+17326049342' //+ 1 607 - 279 - 3623
    })
    .then(message => console.log(message.sid));
    */
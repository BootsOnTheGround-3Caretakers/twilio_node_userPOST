const http = require('http');
const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();
var handleResponses = require('./httpRequests')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(session({ secret: 'anything-you-want-but-keep-secret' }));

app.post('/sms', (req, res) => {
    const smsCount = req.session.counter || 0;
    const responseOne = req.session.response1 || "null"
    const responseTwo = req.session.response2 || "null"
    var body = req.body.Body
    const twiml = new MessagingResponse();

    //message handler
    //initial response
    if (smsCount == 0) {
        message = 'Hi! Thanks for reaching out to 3Hands. To get started respond with 1 if you are looking for help, 2 if you are providing help and 3 if both.';
    }
    //Note: to add an error response if not equal to 1, 2 or 3 for initial response

    //second response if correct
    if ((smsCount == 1) && (responseOne == 1)) {
        message = "Great, you're looking to help. Briefly describe how you're looking to help"
    }

    //final response
    if ((smsCount == 2)) {
        message = "Thanks for providing your information! We'll get back to you in 48-72 hours."
        var responseVar =
            handleResponses.postUserResponse()
    }

    //session variable handler, the below is utilized to track
    //what step in the conversation we are, and record
    //responses.
    if ((smsCount == 0) && (body = (1 || 2 || 3))) { //if first message response, and correct response of 1, 2 or 3
        req.session.response1 = body
        req.session.counter = smsCount + 1;
    }
    if ((smsCount == 1)) {
        req.session.response2 = body
        req.session.counter = smsCount + 1;
    }


    twiml.message(message);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

http.createServer(app).listen(3000, () => {
    console.log('Express server listening on port 1337');
});
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
    const responseTwoA = req.session.response2A || "null" //not currently utilized
    const responseTwoB = req.session.response2B || "null" //
    const twiml = new MessagingResponse();
    var body = req.body.Body
    body = body.toString();

    console.log(body);
    console.log(smsCount);
    //message handler
    //initial response
    if (smsCount == 0) {
        console.log("if one called");
        if ((body === "1" || body === "2" || body === "3")) {
            console.log("if one, part two called");
            req.session.response1 = body
            req.session.counter = smsCount + 1;
            var currentSessionsmsCount = smsCount + 1;
            var currentSessionResponse1 = body
            console.log(currentSessionResponse1)
        } else {
            message = 'Hi! Thanks for reaching out to 3Hands. To get started respond with 1 if you are looking for help, 2 if you are providing help and 3 if both.';
            /*
            if (body == undefined) {
                message = "Your response was something other than 1, 2 or 3. Please reply back with one of the three options."
            }
            */
        };
    }
    //Note: to add an error response if not equal to 1, 2 or 3 for initial response

    //second response if correct

    if ((currentSessionsmsCount === 1 || smsCount === 1)) {
        console.log("if two called")
        if (currentSessionResponse1 === "1") {
            console.log("if two, part one called")
            message = "Great, you're looking to help. Briefly describe how you're looking to help (grocery delivery, a friendly call, etc)."
                //req.session.response2A = body
                //req.session.response2B = ""
            jsonResponseObject = { "phoneNumber": 123, "needer": responseOne, "caretaker": responseOne, "needDescription": "", "careDesciprtion": body }
            req.session.counter = smsCount + 1;
            var currentSessionsmsCount = smsCount + 1;
        }
        if (currentSessionResponse1 === "2") {
            message = "Great, you're looking for help. Briefly describe what kind of help you're looking for (grocery delivery, a friendly call, etc). "
            req.session.response2A = ""
            req.session.response2B = body
            jsonResponseObject = { "phoneNumber": 123, "needer": responseOne, "caretaker": responseOne, "needDescription": body, "careDesciprtion": "" }
            req.session.counter = smsCount + 1;
            var currentSessionsmsCount = smsCount + 1;
        };
        if (currentSessionResponse1 === "3") {
            message = "Great, you're looking for help, AND providing help. First, briefly describe how you're looking to help"
            req.session.response2A = body
            if (responseTwoB = "") {
                req.session.response2B = ""
            }
        };
    };


    //final response
    if ((currentSessionsmsCount == 2)) {
        message = "Thanks for providing your information! We'll get back to you in 48-72 hours."

        console.log(jsonResponseObject)
        var responseVar = handleResponses.postUserResponse()
    }

    twiml.message(message);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

http.createServer(app).listen(3000, () => {
    console.log('Express server listening on port 1337');
});
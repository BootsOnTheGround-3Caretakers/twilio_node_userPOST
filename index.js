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
    //These variables represent responses, or helper variables to obtain responses.
    //All variables are set to session objects due to the stateless nature of the
    //sms sendings/receipts. The session objects take advantage of twilio's cookie
    //features which helps to track conversations under different numbers.
    const smsCount = req.session.counter || 0;
    const responseOne = req.session.response1 || "null" //responseOne needs a helper function to translate 1/2/3 options into a better "response" before placing in JSON object. Currently 1 represents needer, 2 helper, 3 both.
    const responseTwoA = req.session.response2A || "null" //
    const responseTwoAHelper = req.session.response2AHelper || "null"
    const responseTwoB = req.session.response2B || "null" //
    const responseTwoBHelper = req.session.response2BHelper || "null"

    const twiml = new MessagingResponse();

    //represents the request response (i.e. the users text)
    var body = req.body.Body
    body = body.toString();

    console.log(body);
    console.log(smsCount);
    //message handler
    //initial response
    if (smsCount == 0) {
        if ((body === "1" || body === "2" || body === "3")) {
            req.session.response1 = body
            req.session.counter = smsCount + 1;
            var currentSessionsmsCount = smsCount + 1;
            var currentSessionResponse1 = body
            console.log(currentSessionResponse1)
        } else {
            message = 'Hi! Thanks for reaching out to 3Hands. To get started respond with 1 if you are looking for help, 2 if you are providing help and 3 if both.';
        };
    }

    //second response handler
    if ((currentSessionsmsCount === 1 || smsCount === 1)) {
        console.log("if two called")
        if (currentSessionResponse1 === "1" || responseOne === "1") {
            console.log("if two, part one called")
            message = "Great, you're looking to help. Briefly describe how you're looking to help (grocery delivery, a friendly call, etc)."
                //req.session.response2A = body
                //req.session.response2B = ""
            jsonResponseObject = { "TwilioJSONBlob": { "phoneNumber": 123, "needer": responseOne, "caretaker": responseOne, "needDescription": body, "careDesciprtion": responseTwoA } }
            req.session.counter = smsCount + 1;
            var currentSessionsmsCount = smsCount + 1;
        }
        if (currentSessionResponse1 === "2" || responseOne === "2") {
            message = "Great, you're looking for help. Briefly describe what kind of help you're looking for (grocery delivery, a friendly call, etc). "
            req.session.response2A = ""
            req.session.response2B = body
            jsonResponseObject = { "TwilioJSONBlob": { "phoneNumber": 123, "needer": responseOne, "caretaker": responseOne, "needDescription": body, "careDesciprtion": responseTwoA } }
            req.session.counter = smsCount + 1;
            var currentSessionsmsCount = smsCount + 1;
        };
        if (currentSessionResponse1 === "3" || responseOne === "3") {
            message = "Great, you're looking for help, AND providing help. First, briefly describe how you're looking to help"
            req.session.response2AHelper = "set" //keeps stack of the step in the conversation
            if (responseTwoAHelper == "set") {
                message = "Now briefly describe what help you're looking for"
                req.session.response2A = body
                req.session.response2BHelper = "set" //keeps stack of the step in the conversation
            }
            if (responseTwoBHelper == "set") {
                req.session.response2B = body
                jsonResponseObject = { "TwilioJSONBlob": { "phoneNumber": 123, "needer": responseOne, "caretaker": responseOne, "needDescription": body, "careDesciprtion": responseTwoA } }
                req.session.counter = smsCount + 1;
                var currentSessionsmsCount = smsCount + 1;
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
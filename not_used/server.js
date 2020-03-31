const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});

//SK27c3853adf96c66892b6442423bf267e
//Open two command prompts and run:
//twilio phone-numbers:update "+12082955052" --sms-url="http://localhost:1337/sms"
//node
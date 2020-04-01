var request = require('request');

function postUserResponse(JSONObject) {
    // Build the post string from an object
    //var post_data = JSON.stringify(JSONObject)
    //var post_data = JSONObject

    var myJSONObject = JSONObject;

    request({
        url: "http://c29a9953.ngrok.io/api/v1/TwilioBlob",
        method: "POST",
        json: true, // <--Very important!!!
        headers: {
            "Authorization": "3CAREGIVERS",
            "content-Type": "application/json"
        },
        body: myJSONObject
    }, function(error, response, body) {
        console.log(response);
    });

}


module.exports = {
    postUserResponse: postUserResponse
};
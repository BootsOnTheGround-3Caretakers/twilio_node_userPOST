function postUserResponse() {
    console.log("post response called")
        //to add POST logic here
    return "Hello";
}


module.exports = {
    postUserResponse: postUserResponse,
    bar: function() {
        console.log("bar called")
    }
};
'use strict';

const got = require('got');

//async function webServiceInvoker(apiURL) {
const invokeWebService = async function (apiURL) {
    console.log(apiURL);
    try {
        const response = await got(apiURL);
        //console.log(response.body);
        return response.body;
    } catch (error) {
        console.log(error.response.body);
        //TODO: handle errors here
        //=> 'Internal server error ...'
        return "error";
    }
}

//module.exports.webServiceInvoker = webServiceInvoker;
module.exports = { invokeWebService };
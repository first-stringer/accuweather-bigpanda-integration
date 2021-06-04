'use strict';

const logger = require('./utilities/logger');
const got = require('got');
const fetch = require('node-fetch');

const invokeWebService = async function (apiURL) {
    logger.debug("invokeWebService-apiURL=" + apiURL);
    // try {
    let response = await got(apiURL);
    //    logger.debug("invokeWebService-response.body=" + JSON.stringify(response));
    //return response.body;
    return response;
    // } catch (error) {
    //     logger.error(error.response.body);
    //     //TODO: handle errors here
    //     //=> 'Internal server error ...'
    //     return "error";
    // }
}

const invokeBPWebService = async function (apiURL) {
    //logger.debug(apiURL);
    console.log(apiURL);
    // const payload = {
    //     "app_key": "840e5934c9fa2f9bb71b6c1ce7b71192",
    //     "status": "critical",
    //     "host": "production-database-1",
    //     "timestamp": 1402302570,
    //     "check": "CPU overloaded",
    //     "description": "CPU is above upper limit (70%)",
    //     "cluster": "production-databases",
    //     "my_unique_attribute": "my_unique_value"
    // };
    // const payload = {
    //     app_key: "840e5934c9fa2f9bb71b6c1ce7b71192",
    //     status: "critical",
    //     host: "production-database-1",
    //     timestamp: 1402302570,
    //     check: "CPU overloaded",
    //     description: "CPU is above upper limit (70%)",
    //     cluster: "production-databases",
    //     my_unique_attribute: "my_unique_value"
    // };
    const payload = {
        app_key: "840e5934c9fa2f9bb71b6c1ce7b71192",
        status: "critical",
        host: "productiondatabase1",
        timestamp: 1402302570,
        check: "CPU overloaded",
        description: "CPU is above upper limit (70)",
        cluster: "productiondatabases",
        my_unique_attribute: "myuniquevalue"
    };
    //logger.debug(payload);
    console.log("payload=" + payload);
    console.log(payload);
    // try {
    //     //const response = await got(apiURL);
    //     //const { body, statusCode } = await got.post(apiURL, { json: { payload } });
    //     //const { body, statusCode } = await got.post(apiURL, { json: payload });
    //     const { body, statusCode } = await got.post(apiURL, { Authorization: 'Bearer 95fbf41e1d3cd17dfd70ae89c07dc8c1', 'Content-Type': "application/json", json: { payload }, responseType: 'json' });
    //     // if (statusCode !== 200 || body.error) {
    //     //     throw new Error(body.error || 'Oops. Something went wrong! Try again please.');
    //     // }
    //     logger.debug(response.body);
    //     return response.body;
    // } catch (error) {
    //     //logger.error(error.response.body);
    //     logger.error(error);
    //     //TODO: handle errors here
    //     //=> 'Internal server error ...'
    //     return "error";
    // }

    const body = { a: 1 };

    return fetch(apiURL, {
        method: 'post',
        body: JSON.stringify(payload),
        headers: { 'Authorization': 'Bearer 95fbf41e1d3cd17dfd70ae89c07dc8c1', 'Content-Type': 'application/json' },
    })
        //.then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));

}

module.exports = { invokeWebService, invokeBPWebService };
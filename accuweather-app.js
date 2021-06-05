'use strict';

// Public modules
const logger = require('./utilities/logger');
const propertiesReader = require('properties-reader');
const fetch = require('node-fetch');
const { Producer } = require('sqs-producer');

// My code
const WeatherAlertMessage = require('./weather-alert-message');
const constructWeatherAlertMessage = require('./construct-weather-alert-message');

// Load all properties
const configurationPropertiesFileName = process.argv[2];
console.log('configurationPropertiesFileName=' + configurationPropertiesFileName);
const configurationProperties = propertiesReader(configurationPropertiesFileName);
var samplingInterval_ms = configurationProperties.get('sampling-interval-ms');
console.log('samplingInterval_ms=' + samplingInterval_ms);
const accuWeatherGetCurrentConditionsURL = configurationProperties.get('accuweather.get-current-conditions-url');
console.log('accuWeatherGetCurrentConditionsURL=' + accuWeatherGetCurrentConditionsURL);
const accuWeatherAPIKey = process.env.ACCUWEATHER_API_KEY;
console.log('accuWeatherAPIKey=' + accuWeatherAPIKey);

const producer = Producer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration',
    region: 'us-east-2'
});

async function processLocationKeys(locationKeys, apiURL, apiKey) {
    Object.keys(locationKeysJSON).forEach(function (key) {
        logger.debug("processLocationKeys-key=" + key);
        var value = locationKeysJSON[key];
        logger.debug("processLocationKeys-value.CityName=" + value.CityName);
        logger.debug("processLocationKeys-value.LocationKey=" + value.LocationKey);

        let completeAPIURL = apiURL + value.LocationKey + "?apikey=" + apiKey;
        logger.debug('processLocationKeys-completeAPIURL=' + completeAPIURL);

        let messageBody = { id: 'id9', body: "" };
        return fetch(completeAPIURL)
            // response.ok if response.status >= 200 && response.status < 300
            .then(response => response.ok ? response : (function () { throw response }()))
            .then(response => response.json())
            //.then(console.log)
            //.then(json => producer.send([json]))
            //.then(json => producer.send("hi"))
            //.then(json => producer.send(JSON.stringify(json)))
            //.then(json => function (json) { messageBody.body = "hihihih"; producer.send(messageBody) })
            //.then(json => { messageBody.body = json; producer.send(messageBody); })
            //.then(json => { messageBody.body = JSON.stringify(json); producer.send(messageBody); })
            //.then(response => { messageBody.body = JSON.stringify(response.json()); console.log(messageBody); })
            //.then(response => { messageBody.body = response.json(); console.log(messageBody); })
            //.then(response => { messageBody.body = response.json(); console.log(response.json()); })
            //.then(json => { messageBody.body = json; console.log(json); })
            //.then(json => { messageBody.body = json; console.log(messageBody); })
            //.then(json => { messageBody.body = json[0]; console.log(JSON.stringify(messageBody)); })
            //.then(json => { messageBody.body = JSON.stringify(json[0]); console.log(messageBody); })
            .then(json => { messageBody.body = JSON.stringify(json[0]); producer.send(messageBody); })
            //.then(json => { producer.send("lllll"); })
            //.then(json => producer.send("lllll"))
            .catch(err => { logger.error(err); });

        // TODO: include error handling!
        //TODO check for more than one result, i.e., the array size is greater than 1
    });
}


let intervalCount = 0;
var locationKeysJSON = require(process.argv[3]);
// setInterval(() => {
//     // Read location keys in from file here so that they can be reloaded after each interval.
//     logger.info('Processing location keys. intervalCount=' + ++intervalCount);
processLocationKeys(locationKeysJSON, accuWeatherGetCurrentConditionsURL, accuWeatherAPIKey);
// }, samplingInterval_ms);



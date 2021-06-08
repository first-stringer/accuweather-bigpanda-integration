'use strict';

// Load modules in order used
const logger = require('./utilities/logger');
const propertiesReader = require('properties-reader');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const { Producer } = require('sqs-producer');

// Load properties from config file 
const configurationPropertiesFileName = process.argv[2];
const locationKeysFileName = process.argv[3];
logger.debug('configurationPropertiesFileName=' + configurationPropertiesFileName);
const configurationProperties = propertiesReader(configurationPropertiesFileName);
var samplingInterval_ms = configurationProperties.get('SAMPLING-INTERVAL-MS');
logger.debug('samplingInterval_ms=' + samplingInterval_ms);
const accuWeatherGetCurrentConditionsURL = configurationProperties.get('ACCUWEATHER.GET-CURRENT-CONDITIONS-URL');
logger.debug('accuWeatherGetCurrentConditionsURL=' + accuWeatherGetCurrentConditionsURL);
const accuWeatherAPIKey = process.env.ACCUWEATHER_API_KEY;
//logger.debug('accuWeatherAPIKey=' + accuWeatherAPIKey);
const queueURL = configurationProperties.get('SQS.QUEUE-URL');
logger.debug('queueURL=' + queueURL);
const region = configurationProperties.get('SQS.REGION');
logger.debug('region=' + region);

const producer = Producer.create({
    queueUrl: queueURL,
    region: region
});

/**
* Iterates over a list of location keys consuming the AccuWeather API and publishing each response to a queue.
* @param {String[]} locationKeys - The location keys to query on and publish
* @param {String} apiURL - The alert to send
* @param {String} apiKey - The alert to send
*/
function processLocationKeys(locationKeys, apiURL, apiKey) {
    Object.keys(locationKeysJSON).forEach(function (key) {
        logger.debug("processLocationKeys-key=" + key);
        let value = locationKeysJSON[key];
        logger.debug("processLocationKeys-value.CityName=" + value.CityName);
        logger.debug("processLocationKeys-value.LocationKey=" + value.LocationKey);

        let completeAPIURL = apiURL + value.LocationKey + "?apikey=" + apiKey;
        logger.debug('processLocationKeys-completeAPIURL=' + completeAPIURL);

        let message = {
            id: uuidv4(),
            body: "",
            messageAttributes: { cityName: { DataType: 'String', StringValue: value.CityName } }
        };
        fetch(completeAPIURL)
            // response.ok if response.status >= 200 && response.status < 300
            .then(response => response.ok ? response : (function () { throw response }()))
            .then(response => response.json())
            .then(json => {
                message.body = JSON.stringify(json[0]);
                logger.debug("processLocationKeys-message=" + JSON.stringify(message, null, " "));
                return message;
            })
            .then(message => producer.send(message))
            .catch(response => {
                logger.error("Response: " + response);
                logger.error("Response Status: " + response.status + ", Response Status Text: " + response.statusText);
            });
    });
}

let intervalCount = 0;
let locationKeysJSON = require(locationKeysFileName);
setInterval(() => {
    logger.info('Processing location keys. intervalCount=' + ++intervalCount);
    processLocationKeys(locationKeysJSON, accuWeatherGetCurrentConditionsURL, accuWeatherAPIKey);
}, samplingInterval_ms);
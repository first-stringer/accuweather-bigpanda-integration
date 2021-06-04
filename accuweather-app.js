'use strict';

// Public modules
const logger = require('./utilities/logger');
const propertiesReader = require('properties-reader');
const fetch = require('node-fetch');

// My code
const webServiceInvoker = require('./web-service-invoker');
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


async function fetchWeather(locationKey, apiURL, apiKey) {
    logger.debug("fetchWeather locationKey=" + locationKey);
    let completeAPIURL = apiURL + locationKey + "?apikey=" + apiKey;
    logger.debug('fetchWeather completeAPIURL=' + completeAPIURL);

    return webServiceInvoker.invokeWebService(completeAPIURL).then(JSON.parse)

    //     .then(response => response.ok ? response : (function () { throw response }()))
    //     .then(response => response.json())
    //     //.then(jsonResponse => constructMessage(jsonResponse))
    //     //.then(objectMessage => { console.log(objectMessage); return objectMessage; })
    //     //.then(JSON.stringify)
    //     //.then(publishMessage)
    //     //.catch(err => { logger.error(err); throw Error("Bad response from AccuWeather API!"); });
    //     //.catch(err => { console.error(err); throw Error("Bad response from AccuWeather API!"); });
    //     .catch(err => { logger.error(err); throw err; });
}



async function processLocationKeys(locationKeys, apiURL, apiKey) {
    Object.keys(locationKeysJSON).forEach(function (key) {
        logger.debug("processLocationKeys-key=" + key);
        var value = locationKeysJSON[key];
        logger.debug("processLocationKeys-value.CityName=" + value.CityName);
        logger.debug("processLocationKeys-value.LocationKey=" + value.LocationKey);

        let completeAPIURL = apiURL + value.LocationKey + "?apikey=" + apiKey;
        logger.debug('processLocationKeys-completeAPIURL=' + completeAPIURL);

        // webServiceInvoker.invokeWebService(completeAPIURL)
        //     //.then(response => response.ok ? response : (function () { throw response }()))
        //    // .then(response => response.json())
        //     //.then(response => console.log('uuu' + response.ok))
        //     .then(response => response.ok)
        //     .then(console.log)
        //     //.then(console.log('xxx'))
        //     //.then(json => JSON.stringify(json, null, 4))
        //     //.then(console.log)
        //     //.then(publishMessage)
        //     .catch(err => { console.error(err); });

        return fetch(completeAPIURL)
            // response.ok if response.status >= 200 && response.status < 300
            .then(response => response.ok ? response : (function () { throw response }()))
            .then(response => response.json())
            .then(console.log)
            //.then(jsonResponse => constructMessage(jsonResponse))
            //.then(objectMessage => { console.log(objectMessage); return objectMessage; })
            //.then(JSON.stringify)
            //.then(publishMessage)
            //.catch(err => { logger.error(err); throw Error("Bad response from AccuWeather API!"); });
            //.catch(err => { console.error(err); throw Error("Bad response from AccuWeather API!"); });
            //.catch(err => { logger.error(err); throw err; });
            .catch(err => { logger.error(err); });



        // TODO: include error handling!
        //TODO check for more than one result, i.e., the array size is greater than 1
    });
}


let intervalCount = 0;
var locationKeysJSON = require(process.argv[3]);
setInterval(() => {
    // Read location keys in from file here so that they can be reloaded after each interval.
    logger.info('Processing location keys. intervalCount=' + ++intervalCount);
    processLocationKeys(locationKeysJSON, accuWeatherGetCurrentConditionsURL, accuWeatherAPIKey);
    logger.info('XXXXXXXXXXXXXX');
}, samplingInterval_ms);

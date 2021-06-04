'use strict';

// Public modules
const logger = require('./utilities/logger');
const propertiesReader = require('properties-reader');

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


async function fetchWeather(locationKey) {
    logger.debug("fetchWeather locationKey=" + locationKey);
    let apiURL = accuWeatherGetCurrentConditionsURL + locationKey + "?apikey=" + accuWeatherAPIKey;
    logger.debug('fetchWeather apiURL=' + apiURL);

    return webServiceInvoker.invokeWebService(apiURL).then(JSON.parse)

    // return fetch(apiURL)
    //     // response.ok if response.status >= 200 && response.status < 300
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



async function processLocationKeys(locationKeys) {
    Object.keys(locationKeysJSON).forEach(function (key) {
        logger.debug("key=" + key);
        var value = locationKeysJSON[key];
        logger.debug("value.CityName=" + value.CityName);
        logger.debug("value.LocationKey=" + value.LocationKey);

        fetchWeather(value.LocationKey)
            .then(constructWeatherAlertMessage)
            .then(JSON.stringify)
            .then(console.log)
            //.then(publishMessage)
            .catch(err => { console.error(err); });

        // TODO: include error handling!
        //TODO check for more than one result, i.e., the array size is greater than 1
    });
}



var locationKey = 347629;
let apiURL = accuWeatherGetCurrentConditionsURL + locationKey + "?apikey=" + accuWeatherAPIKey;
console.log('apiURL=' + apiURL);

webServiceInvoker.invokeWebService(apiURL).then(JSON.parse).then(constructWeatherAlertMessage).then(console.log);

let intervalCount = 0;
var locationKeysJSON = require(process.argv[3]);
setInterval(() => {
    // Read location keys in from file here so that they can be reloaded after each interval.
    logger.info('Processing location keys. intervalCount=' + ++intervalCount);
    processLocationKeys(locationKeysJSON);
}, samplingInterval_ms);

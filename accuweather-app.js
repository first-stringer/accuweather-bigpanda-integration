#!/usr/bin/env node
'use strict';

// Public modules
const propertiesReader = require('properties-reader');
//const got = require('got');
const webServiceInvoker = require('./web-service-invoker');

// My code
const WeatherAlertMessage = require('./weather-alert-message');
const constructWeatherAlertMessage = require('./construct-weather-alert-message');

// Load all properties
const configurationPropertiesFileName = process.argv[2];
console.log('configurationPropertiesFileName=' + configurationPropertiesFileName);
const privatePropertiesFileName = process.argv[3];
console.log('privatePropertiesFileName=' + privatePropertiesFileName);

const configurationProperties = propertiesReader(configurationPropertiesFileName);
const privateProperties = propertiesReader(privatePropertiesFileName);

var samplingInterval_ms = configurationProperties.get('sampling-interval-ms');
console.log('samplingInterval_ms=' + samplingInterval_ms);

const accuWeatherGetCurrentConditionsURL = configurationProperties.get('accuweather.get-current-conditions-url');
console.log('accuWeatherGetCurrentConditionsURL=' + accuWeatherGetCurrentConditionsURL);

const accuWeatherAPIKey = privateProperties.get('accuweather.api-key');
console.log('accuWeatherAPIKey=' + accuWeatherAPIKey);

var locationKey = 347629;
let apiURL = accuWeatherGetCurrentConditionsURL + locationKey + "?apikey=" + accuWeatherAPIKey;
console.log('apiURL=' + apiURL);

// async function requestWeather(apiURL) {
//     try {
//         const response = await got(apiURL);
//         //console.log(response.body);
//         return response.body;
//     } catch (error) {
//         console.log(error.response.body);
//         //TODO: handle errors here
//         //=> 'Internal server error ...'
//         return "error";
//     }
// }

//requestWeather(apiURL).then(console.log);
//requestWeather(apiURL).then(JSON.parse).then(constructWeatherAlertMessage).then(console.log);
webServiceInvoker.invokeWebService(apiURL).then(JSON.parse).then(constructWeatherAlertMessage).then(console.log);

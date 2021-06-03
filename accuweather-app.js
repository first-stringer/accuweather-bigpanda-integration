#!/usr/bin/env node
'use strict';

const propertiesReader = require('properties-reader');

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



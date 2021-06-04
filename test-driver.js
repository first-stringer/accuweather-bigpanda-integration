'use strict';

// WEB SERVICE INVOKER TEST
// const webServiceInvoker = require('./web-service-invoker');
// const locationKey = "347629";
// const accuWeatherAPIKey  = "VStA72HGBeQ5xfjmGUtTM6K8NmVzGCPV";
// const apiURL = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + accuWeatherAPIKey;
// console.log('apiURL=' + apiURL);
// webServiceInvoker.invokeWebService(apiURL).then(JSON.parse).then(console.log);

// QUEUE SERVICE SENDER TEST
// const queueService = require('./queue-service');
// queueService.sendMessage("mymessageooo").then(console.log);

// WEB SERVICE INVOKER TEST
const webServiceInvoker = require('./web-service-invoker');
const apiURL = "https://api.bigpanda.io/data/v2/alerts";
console.log('apiURL=' + apiURL);
//webServiceInvoker.invokeBPWebService(apiURL).then(JSON.parse).then(console.log);
//webServiceInvoker.invokeBPWebService(apiURL).then(console.log);
webServiceInvoker.invokeBPWebService(apiURL);

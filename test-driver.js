#!/usr/bin/env node
'use strict';

// const webServiceInvoker = require('./web-service-invoker');
// const locationKey = "347629";
// const accuWeatherAPIKey  = "VStA72HGBeQ5xfjmGUtTM6K8NmVzGCPV";
// const apiURL = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + accuWeatherAPIKey;
// console.log('apiURL=' + apiURL);
// webServiceInvoker.invokeWebService(apiURL).then(JSON.parse).then(console.log);

const queueService = require('./queue-service');
var params = {
    DelaySeconds: 10,
    MessageBody: "abc!!!!!!!!!!!!",
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration",
};
// queueService.sendMessage(params, function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Success", data.MessageId);
//     }
// });
queueService.sendMessage(params);


// var params = {
//     AttributeNames: [
//         "SentTimestamp"
//     ],
//     MaxNumberOfMessages: 10,
//     MessageAttributeNames: [
//         "All"
//     ],
//     QueueUrl: "https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration",
//     VisibilityTimeout: 20,
//     WaitTimeSeconds: 0
// };


'use strict';

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({ region: 'us-east-2' });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// var params = {
//     DelaySeconds: 10,
//     MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
//     QueueUrl: "https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration",
// };

const sendMessage = async function (params) {
    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
        }
    })
};


// var queueURL = "SQS_QUEUE_URL";

// var params = {
//     AttributeNames: [
//         "SentTimestamp"
//     ],
//     MaxNumberOfMessages: 10,
//     MessageAttributeNames: [
//         "All"
//     ],
//     QueueUrl: queueURL,
//     VisibilityTimeout: 20,
//     WaitTimeSeconds: 0
// };

// sqs.receiveMessage(params, function (err, data) {
//     if (err) {
//         console.log("Receive Error", err);
//     } else if (data.Messages) {
//         var deleteParams = {
//             QueueUrl: queueURL,
//             ReceiptHandle: data.Messages[0].ReceiptHandle
//         };
//         sqs.deleteMessage(deleteParams, function (err, data) {
//             if (err) {
//                 console.log("Delete Error", err);
//             } else {
//                 console.log("Message Deleted", data);
//             }
//         });
//     }
// });


module.exports = { sendMessage };
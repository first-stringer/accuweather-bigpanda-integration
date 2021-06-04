'use strict';

const { Producer } = require('sqs-producer');

// create simple producer
const producer = Producer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration',
    region: 'us-east-2'
});

const sendMessage = async function (message) {
    return producer.send([message]);
}

module.exports = { sendMessage };
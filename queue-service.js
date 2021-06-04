'use strict';

const logger = require('./utilities/logger');

const { Producer } = require('sqs-producer');

const producer = Producer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration',
    region: 'us-east-2'
});

const sendMessage = async function (message) {
    logger.debug(message);
    return producer.send([message]);
}

module.exports = { sendMessage };
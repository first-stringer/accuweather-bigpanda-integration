'use strict';

const propertiesReader = require('properties-reader');
const { Consumer } = require('sqs-consumer');

const logger = require('./utilities/logger');
const constructWeatherAlertMessage = require('./construct-weather-alert-message');
const WeatherMessage = require('./weather-alert-message');

const configurationPropertiesFileName = process.argv[2];
logger.debug('configurationPropertiesFileName=' + configurationPropertiesFileName);
const configurationProperties = propertiesReader(configurationPropertiesFileName);
const queueURL = configurationProperties.get('SQS.QUEUE-URL');
logger.debug('queueURL=' + queueURL);

var messagesProcessedCount = 0;
const app = Consumer.create({
    queueUrl: queueURL,
    handleMessage: async (message) => {
        ++messagesProcessedCount;
        logger.info("messagesProcessedCount=" + messagesProcessedCount);
        logger.debug(JSON.stringify(message, null, "  "));
        logger.debug(JSON.stringify(message.Body, null, "  "));
        logger.debug(message.Body);
        let wm = constructWeatherAlertMessage(JSON.parse(message.Body));
        logger.debug("wm=" + JSON.stringify(wm, null, " "));

        //TODO: Add if statement here to fail some messages so they go to the dead letter queue
        //TODO: Call BigPanda service.
    }
});

app.on('error', (err) => {
    logger.error(err.message);
});

app.on('processing_error', (err) => {
    logger.error(err.message);
});

app.start();
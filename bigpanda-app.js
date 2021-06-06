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
const bigPandaAlertsAPIEndPoint = configurationProperties.get('BIGPANDA.ALERTS-API-ENDPOINT');
logger.debug('bigPandaAlertsAPIEndPoint=' + bigPandaAlertsAPIEndPoint);

const bigPandaAppKey = process.env.BIGPANDA_APP_KEY;
logger.debug('bigPandaAppKey=' + bigPandaAppKey);
const bigPandaAlertsAPIBearerToken = process.env.BIGPANDA_ALERTS_API_BEARER_TOKEN;
//logger.debug('bigPandaAlertsAPIBearerToken=' + bigPandaAlertsAPIBearerToken);

let messagesProcessedCount = 0;
const app = Consumer.create({
    queueUrl: queueURL,
    messageAttributeNames: ['cityName'],
    handleMessage: async (message) => {
        ++messagesProcessedCount;
        logger.info("messagesProcessedCount=" + messagesProcessedCount);
        logger.debug(JSON.stringify(message, null, " "));
        //logger.debug(JSON.stringify(message.MessageAttributes, null, " "));
        //logger.debug(JSON.stringify(message.MessageAttributes.cityName, null, " "));
        let cityName = message.MessageAttributes.cityName.StringValue;
        logger.debug("cityName=" + cityName);
        logger.debug(JSON.stringify(message.Body, null, " "));
        let weatherMessage = constructWeatherAlertMessage(cityName, JSON.parse(message.Body), bigPandaAppKey);
        logger.debug("weatherMessage=" + JSON.stringify(weatherMessage, null, " "));

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
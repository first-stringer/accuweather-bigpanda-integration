'use strict';

const propertiesReader = require('properties-reader');
const { Consumer } = require('sqs-consumer');

const logger = require('./utilities/logger');
const constructWeatherAlertMessage = require('./construct-weather-alert-message');
const WeatherAlertMessage = require('./weather-alert-message');

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
        let weatherAlertMessage = constructWeatherAlertMessage(cityName, JSON.parse(message.Body), bigPandaAppKey);
        logger.debug("weatherAlertMessage=" + JSON.stringify(weatherAlertMessage, null, " "));

        // Code added to demonstrate working dead letter queue
        if (weatherAlertMessage.location_key == 1178447) throw Error("Retry-able Error");
        //TODO: Add if statement here to fail some messages so they go to the dead letter queue
        //TODO: Call BigPanda service.
    }
});

app.on('error', (err) => {
    logger.error("error");
    logger.error(err.message);
});

app.on('processing_error', (err) => {
    logger.error("processing_error");
    logger.error(err.message);
});

app.start();
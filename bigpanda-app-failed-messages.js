const propertiesReader = require('properties-reader');
const logger = require('./utilities/logger');
const { Consumer } = require('sqs-consumer');
const failedMessagesLogger = require('./utilities/failed-messages-logger');
const fetch = require('node-fetch');
const constructWeatherAlertMessage = require('./construct-weather-alert-message');
const WeatherAlertMessage = require('./weather-alert-message');

// Load configuration from file name specified on the command line and environment variables
const configurationPropertiesFileName = process.argv[2];
logger.debug('configurationPropertiesFileName=' + configurationPropertiesFileName);
const configurationProperties = propertiesReader(configurationPropertiesFileName);
const queueURL = configurationProperties.get('SQS.DEAD-LETTER-QUEUE-URL');
logger.debug('queueURL=' + queueURL);
const pollingWaitTimeMs = configurationProperties.get('SQS.POLLING-WAIT-TIME-MS');
logger.debug('pollingWaitTimeMs=' + pollingWaitTimeMs);
const maxApproximateReceiveCount = configurationProperties.get('SQS.MAX-APPROXIMATE-RECEIVE-COUNT');
logger.debug('maxApproximateReceiveCount=' + maxApproximateReceiveCount);
const bigPandaAlertsAPIEndPoint = configurationProperties.get('BIGPANDA.ALERTS-API-ENDPOINT');
logger.debug('bigPandaAlertsAPIEndPoint=' + bigPandaAlertsAPIEndPoint);

const bigPandaAppKey = process.env.BIGPANDA_APP_KEY;
logger.debug('bigPandaAppKey=' + bigPandaAppKey);
const bigPandaAlertsAPIBearerToken = process.env.BIGPANDA_ALERTS_API_BEARER_TOKEN;
//logger.debug('bigPandaAlertsAPIBearerToken=' + bigPandaAlertsAPIBearerToken);

// Keep a count of how many messages are consumed and processed 
let messagesProcessedCount = 0;

// Keep a count of how many messages are written to the failed messages log file
let messagesFailedCount = 0;

// Create and configure message consumer.
const app = Consumer.create({
    queueUrl: queueURL,
    pollingWaitTimeMs: pollingWaitTimeMs,
    attributeNames: ['ApproximateReceiveCount'],
    messageAttributeNames: ['cityName'],
    handleMessage: async (message) => {
        ++messagesProcessedCount;
        logger.info("messagesProcessedCount=" + messagesProcessedCount);
        logger.debug("message=" + JSON.stringify(message, null, " "));

        if (message.Attributes.ApproximateReceiveCount > maxApproximateReceiveCount) {
            ++messagesFailedCount;
            logger.info("messagesFailedCount=" + messagesFailedCount);
            failedMessagesLogger.info("message=" + JSON.stringify(message, null, ""));
        }
        else {
            let cityName = message.MessageAttributes.cityName.StringValue;
            logger.debug("cityName=" + cityName);
            logger.debug("message.Body=" + JSON.stringify(message.Body, null, " "));
            let weatherAlertMessage = constructWeatherAlertMessage(cityName, JSON.parse(message.Body), bigPandaAppKey);
            logger.debug("weatherAlertMessage=" + JSON.stringify(weatherAlertMessage, null, " "));

            // !!! Code added to demonstrate handling non-success status from BigPanda API call !!!
            // !!! This will also cause the messages for this location key to ultimately be writtern to the failed messages log file
            if (weatherAlertMessage.location_key == 1162619)
                weatherAlertMessage = constructWeatherAlertMessage(cityName, JSON.parse(message.Body), "invalid app key");

            // Call BigPanda API to post the alert
            let response = await fetch(bigPandaAlertsAPIEndPoint, {
                method: 'post',
                body: JSON.stringify(weatherAlertMessage),
                headers: { 'Authorization': `Bearer ${bigPandaAlertsAPIBearerToken}`, 'Content-Type': 'application/json' },
            })
                .then(res => res.json())
                .then(json => { logger.info("BigPanda API Response: " + JSON.stringify(json, null, "")); return json; })

            // Throw an error if not successfully so that we retry the message
            if (response.response.status != "success") {
                throw Error("BigPanda API Call Failed: " + JSON.stringify(response));
            }
        }
    }
});

app.on('error', (err) => {
    logger.error("Error occurred while interacting with the queue.");
    logger.error(err.message);
    // TODO: Add logic to handle transient and intransient errors differently
});

app.on('processing_error', (err) => {
    logger.error("Processing error occurred while processing the message.");
    logger.error(err.message);
    // TODO: Add logic to handle transient and intransient errors differently
});

app.start();
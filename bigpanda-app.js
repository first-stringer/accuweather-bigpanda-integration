// Load modules in order used
const propertiesReader = require('properties-reader');
const { Consumer } = require('sqs-consumer');
const fetch = require('node-fetch');
const logger = require('./utilities/logger');
const constructWeatherAlertMessage = require('./construct-weather-alert-message');
const WeatherAlertMessage = require('./weather-alert-message');

// Load configuration from file name specified on the command line and environment variables
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

// Keep a count of how many messages are consumed and processed 
let messagesProcessedCount = 0;

// Create and configure message consumer.
const app = Consumer.create({
    queueUrl: queueURL,
    messageAttributeNames: ['cityName'],
    handleMessage: async (message) => {
        ++messagesProcessedCount;
        logger.info("messagesProcessedCount=" + messagesProcessedCount);
        logger.debug(JSON.stringify(message, null, " "));
        //logger.debug(JSON.stringify(message.MessageAttributes, null, " "));
        //logger.debug(JSON.stringify(message.MessageAttributes.cityName, null, " "));
        // Pull the city name out of the message attribute so we can add it to the BigPanda alert as a custom tag
        let cityName = message.MessageAttributes.cityName.StringValue;
        logger.debug("cityName=" + cityName);
        logger.debug(JSON.stringify(message.Body, null, " "));
        let weatherAlertMessage = constructWeatherAlertMessage(cityName, JSON.parse(message.Body), bigPandaAppKey);
        logger.debug("weatherAlertMessage=" + JSON.stringify(weatherAlertMessage, null, " "));


        // !!! Code added to demonstrate working dead letter queue !!!
        if (weatherAlertMessage.location_key == 1178447)
            throw Error("Retry-able Error");
        // !!! Code added to demonstrate handling non-success status from BigPanda API call !!!
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
});

// Deal with errors that occur while consuming the message from the queue
app.on('error', (err) => {
    logger.error("error");
    logger.error(err.message);
    // TODO: Add logic to handle transient and intransient errors differently
});

// Deal with errors that occur while handling the message successfully retrieved from the queue
app.on('processing_error', (err) => {
    logger.error("processing_error");
    logger.error(err.message);
    // TODO: Add logic to handle transient and intransient errors differently
});

app.start();
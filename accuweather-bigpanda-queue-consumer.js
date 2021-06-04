'use strict';

const logger = require('./utilities/logger');
const { Consumer } = require('sqs-consumer');

var messagesProcessedCount = 0;
const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/421973658829/ccuweather-bigpanda-integration',
    handleMessage: async (message) => {
        ++messagesProcessedCount;
        logger.info("messagesProcessedCount=" + messagesProcessedCount);
        logger.debug(JSON.stringify(message, null, "  "));
        //TODO: Add if statement here to fail some messages to they go to the dead letter queue
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
# AccuWeather Integration for BigPanda

An integration that sends weather data from AccuWeather for a list of locations to BigPanda.


0) https://direnv.net is used to manage the below environment variables in an .envrc file.

    `export ACCUWEATHER_API_KEY=`\
    `export AWS_ACCESS_KEY_ID=`\
    `export AWS_SECRET_ACCESS_KEY=`\
    `export BIGPANDA_APP_KEY=`\
    `export BIGPANDA_ID=`\
    `export BIGPANDA_ALERTS_API_BEARER_TOKEN=`

    Node module dependencies: \
        `"dependencies": {`\
                   `"node-fetch": "^2.6.1",`\
                   `"properties-reader": "^2.2.0",`\
                   `"sqs-consumer": "^5.5.0",`\
                   `"sqs-producer": "^2.1.0",`\
                   `"uuid": "^3.3.2",`\
                   `"winston": "^3.3.3"`\
         `}`


1) Run "*node node accuweather-app.js accuweather-app-config.properties ./accuweather-app-all-location-keys.json*" to continuously request data from AccuWeather and publish it to an SQS queue.

2) Run "*node bigpanda-app.js bigpanda-app-config.properties*" to continuously consume messages from the SQS queue, transform them into BigPanda alerts, and call the BigPanda alerts API.  If a message fails to be processed it will be place back on the SQS queue for a maximum of ten times at which point it will be moved to an SQS dead letter queue.

    ** If no messages are published to the queue for more than one minute an email notification is sent via AWS Cloudwatch and an AWS SNS topic. **

3) Run "*node bigpanda-app-failed-messages.js bigpanda-app-failed-messages-config.properties*" to continuously consume messages from the SQS dead letter queue, transform them into BigPanda alerts, and call the BigPanda alerts API.  If a message fails to be processed it will be place back on the SQS queue for a maximum of ten times at which point it will be logged to the failed messages log file.

    ** If a message is published to the dead letter queue an email notification is sent via AWS Cloudwatch and an AWS SNS topic. **

Next Steps:
1) Modularize
2) tests

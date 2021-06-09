# AccuWeather Integration for BigPanda

An integration that sends weather data from AccuWeather for a list of locations to BigPanda.


* https://direnv.net is used to manage the below environment variables in a .envrc file.

`export ACCUWEATHER_API_KEY=`
`export AWS_ACCESS_KEY_ID=`
`export AWS_SECRET_ACCESS_KEY=`
`export BIGPANDA_APP_KEY=`
`export BIGPANDA_ID=`
`export BIGPANDA_ALERTS_API_BEARER_TOKEN=`


* Run "node node accuweather-app.js accuweather-app-config.properties ./accuweather-app-all-location-keys.json" to continuously request data from AccuWeather and publish it to an SQS queue.

* Run "node bigpanda-app.js bigpanda-app-config.properties" to continuously consume messages on the SQS queue, transform them to BigPanda alerts, and call the BigPanda alerts API.  If a message fails to be processed it will be place back on the SQS queue for a maximum of ten times at which point it will be moved to an SQS dead letter queue.

* Run "node bigpanda-app-failed-messages.js ./bigpanda-app-failed-messages-config.properties" to continuously consume messages on the SQS dead letter queue, transform them to BigPanda alerts, and call the BigPanda alerts API.  If a message fails to be processed it will be place back on the SQS queue for a maximum of ten times at which point it will be logged to the failed messages log file.
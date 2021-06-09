# AccuWeather Integration for BigPanda

An integration that sends weather data from AccuWeather for a list of locations to BigPanda.

1) Run "node node accuweather-app.js accuweather-app-config.properties ./accuweather-app-all-location-keys.json" to request data from AccuWeather and publish it to an SQS queue.

2) Run "node bigpanda-app.js bigpanda-app-config.properties" to consume messages on the SQS queue, transform them to BigPanda alerts, and call the BigPanda alerts API.  If a message fails to be processed it will be place back on the SQS queue for a maximum of ten times at which point it will be moved to an SQS dead letter queue.

3) Run "" to consume messages on the SQS dead letter queue, transform them to BigPanda alerts, and call the BigPanda alerts API.  If a message fails to be processed it will be place back on the SQS queue for a maximum of ten times at which point it will be logged to the failed messages log file.
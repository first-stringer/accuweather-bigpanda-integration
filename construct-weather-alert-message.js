'use strict';

const logger = require('./utilities/logger');

const WeatherMessage = require('./weather-alert-message');

module.exports = function constructMessage(cityName, weatherJSON, appKey) {
    logger.debug("constructMessage weatherJSON=" + JSON.stringify(weatherJSON, null, " "));

    let link = weatherJSON.Link;
    logger.debug("constructMessage link=" + link);
    let linkTokens = link.split("/");
    let locationKey = linkTokens[8].substring(0, linkTokens[8].indexOf("?"));
    logger.debug("constructMessage weatherJSON.HasPrecipitation=" + weatherJSON.HasPrecipitation);

    let weatherMessage = new WeatherMessage();
    weatherMessage.app_key = appKey;
    //weatherMessage.host = linkTokens[5] + "#" + linkTokens[6];
    weatherMessage.host = cityName;
    weatherMessage.postal_code = linkTokens[6];
    weatherMessage.check = "Weather Check";
    weatherMessage.incident_identifier =
        locationKey + weatherJSON.EpochTime + Math.floor(Math.random() * 1000000);
    weatherMessage.description =
        (weatherJSON.IsDayTime ? "Day Time" : "Night Time") + " with " +
        (weatherJSON.HasPrecipitation ? weatherJSON.PrecipitationType : "No Rain") + " at " +
        weatherJSON.Temperature.Imperial.Value + " Degrees Fahrenheit" + " and " +
        weatherJSON.Temperature.Metric.Value + " Degrees Celsius";
    weatherMessage.condition = weatherJSON.WeatherText;
    weatherMessage.link = weatherJSON.Link;
    weatherMessage.location_key = locationKey;
    weatherMessage.status = "NORMAL";
    weatherMessage.local_time = weatherJSON.LocalObservationDateTime;
    weatherMessage.epoch_time = weatherJSON.EpochTime

    logger.debug("constructMessage weatherMessage=" + JSON.stringify(weatherMessage, null, " "));
    return weatherMessage;
}
const logger = require('./utilities/logger');

const WeatherAlertMessage = require('./weather-alert-message');

module.exports = function constructWeatherAlertMessage(cityName, weatherJSON, appKey) {
    logger.debug("constructWeatherAlertMessage weatherJSON=" + JSON.stringify(weatherJSON, null, " "));

    let link = weatherJSON.Link;
    logger.debug("constructWeatherAlertMessage link=" + link);
    let linkTokens = link.split("/");
    let locationKey = linkTokens[8].substring(0, linkTokens[8].indexOf("?"));
    logger.debug("constructWeatherAlertMessage weatherJSON.HasPrecipitation=" + weatherJSON.HasPrecipitation);

    let weatherAlertMessage = new WeatherAlertMessage();
    weatherAlertMessage.app_key = appKey;
    //weatherAlertMessage.host = linkTokens[5] + "#" + linkTokens[6];
    weatherAlertMessage.host = cityName;
    weatherAlertMessage.postal_code = linkTokens[6];
    weatherAlertMessage.check = "Weather Check";
    weatherAlertMessage.incident_identifier =
        locationKey + weatherJSON.EpochTime + Math.floor(Math.random() * 1000000);
    weatherAlertMessage.description =
        (weatherJSON.IsDayTime ? "Day Time" : "Night Time") + " with " +
        (weatherJSON.HasPrecipitation ? weatherJSON.PrecipitationType : "No Rain") + " at " +
        weatherJSON.Temperature.Imperial.Value + " Degrees Fahrenheit" + " and " +
        weatherJSON.Temperature.Metric.Value + " Degrees Celsius";
    weatherAlertMessage.condition = weatherJSON.WeatherText;
    weatherAlertMessage.link = weatherJSON.Link;
    weatherAlertMessage.location_key = locationKey;
    weatherAlertMessage.status = "warning";
    weatherAlertMessage.local_time = weatherJSON.LocalObservationDateTime;
    weatherAlertMessage.epoch_time = weatherJSON.EpochTime

    logger.debug("constructWeatherAlertMessage weatherAlertMessage=" + JSON.stringify(weatherAlertMessage, null, " "));
    return weatherAlertMessage;
}
//const logger = require('./utilities/logger');

const WeatherMessage = require('./weather-alert-message');

module.exports = function constructMessage(weatherJSONArray) {
    //TODO: Check if this is an array first!
    //logger.debug("constructMessage weatherJSONArray=" + weatherJSONArray);
    console.log("constructMessage weatherJSONArray=" + weatherJSONArray);
    //logger.debug("weatherJSONArray.length=" + weatherJSONArray.length);
    console.log("weatherJSONArray.length=" + weatherJSONArray.length);
    if (weatherJSONArray.length > 1) throw Error;

    let weatherJSON = weatherJSONArray[0];
    let link = weatherJSON.Link;
    let linkTokens = link.split("/");
    let locationKey = linkTokens[8].substring(0, linkTokens[8].indexOf("?"));
    //logger.debug("weatherJSON.HasPrecipitation=" + weatherJSON.HasPrecipitation);
    console.log("weatherJSON.HasPrecipitation=" + weatherJSON.HasPrecipitation);

    const weatherMessage = new WeatherMessage();
    weatherMessage.host = linkTokens[5] + "#" + linkTokens[6];
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

    return weatherMessage;
}
import axios from 'axios';

export default async function getFiveDayCityForecast(latitude, longitude) {
  try {
    const apiKeyWeather = process.env.VUE_APP_OPENWEATHERMAP_API_KEY;

    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?&cnt=40&lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKeyWeather}`
    );

    console.log('Current Weather Response:', currentWeatherResponse);

    // Check if the request for current weather was successful
    if (currentWeatherResponse.status !== 200) {
      throw new Error('Failed to fetch current weather data');
    }

    // Extract the current weather data
    const currentWeatherData = currentWeatherResponse.data.list;
    console.log(currentWeatherData)

    // Splitting data into days
    let days = new Array();
    let dayPeriods = new Array(8);
    for (let period = 0; period < 40; period++) {
      dayPeriods[period % 8] = currentWeatherData[period];
      if (period % 8 == 7) {
        let day = { avgTemp: 0, rainfall: 0, avgWindSpeed: 0, weatherType: "", itRains: false, dayNum: 0 };
        const averageTemp = Math.round(dayPeriods.reduce((accumulator, object) => {
          return accumulator + object.main.temp;
        }, 0) / 8);
        const rain = (dayPeriods.reduce((accumulator, object) => {
          if (object && object.rain && object.rain["3h"] !== undefined) {
            return accumulator + object.rain["3h"];
          } else {
            return accumulator;
          }
        }, 0)).toFixed(3);
        const averageWindSpeed = (dayPeriods.reduce((accumulator, object) => {
          if (object && object.rain && object.wind.speed !== undefined) {
            return accumulator + object.wind.speed;
          } else {
            return accumulator;
          }
        }, 0) / 8).toFixed(3);
        var tempRange = "";

        if (averageTemp < 13) {
          tempRange = "Cold";
        } else if (averageTemp <= 23) {
          tempRange = "Mild";
        } else {
          tempRange = "Hot";
        }

        var itRains = false;
        if (rain > 0) {
          itRains = true;
        }

        day.avgTemp = averageTemp;
        day.rainfall = rain;
        day.avgWindSpeed = averageWindSpeed;
        day.weatherType = tempRange;
        day.itRains = itRains;
        day.dayNum = days.length + 1;
        days.push(day);
      }
      console.log(days)
    }
    return days

  } catch (error) {
    throw new Error('Error fetching weather data: ' + error.message);
  }
}

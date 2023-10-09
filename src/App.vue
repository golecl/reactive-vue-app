<template>
    <div>
        <h1>Weather App</h1>
        <Search @location-selected="getCityForecast" />
        <div class="weather-display">
            <h2>Weather for {{ weatherData.location }}</h2>
            <ul>
                <li v-for="(forecast, index) in forecastData" :key="index">
                    <p>Day: {{ forecast.dayNum }}</p>
                    <p>Average Temperature: {{ forecast.avgTemp }}°C</p>
                    <p>Rainfall: {{ forecast.rainfall }} mm</p>
                    <p>Average Wind Speed: {{ forecast.avgWindSpeed }} m/s</p>
                    <p>Weather Type: {{ forecast.weatherType }}</p>
                    <p v-if="forecast.itRains">It Rains</p>
                    <p v-else>No Rain</p>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
import Search from './components/Search.vue';
import { getFiveDayCityForecast, getFiveDayPollution } from './services/index.js';

export default {
    data() {
        return {
            message: 'Hello from Laura',
            cityName: '',
            weatherData: {
                location: '',
            },
            forecastData: [],
        };
    },
    components: {
        Search,
    },
    methods: {
        getCityForecast(location) {
            this.weatherData.location = `${location.placeName}`;
            getFiveDayPollution(location.latitude, location.longitude)
            // Call the getFiveDayCityForecast function with the selected location's latitude and longitude
            getFiveDayCityForecast(location.latitude, location.longitude)
                .then((forecastData) => {
                    // Handle the forecast data
                    console.log("Five-day forecast for", location, forecastData);
                    this.forecastData = forecastData;
                })
                .catch((error) => {
                    console.error("Error fetching forecast data:", error);
                });
        },

    },
};
</script>
  
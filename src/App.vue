<template>
    <div>
        <h1>Weather App</h1>
        <div>
            <Search @location-selected="getCityForecast" />
            <button @click="openMapView">Toggle Map View</button>
        </div>

        <Map v-if="isMapViewOpen" @location-selected="getCityForecast"></Map>
        <div class="weather-display">
            <h2>Weather for {{ weatherData.location }}</h2>
            <ul>
                <li v-for="(forecast, index) in combinedData" :key="index">
                    <p>Day: {{ forecast.dayNum }}</p>
                    <p>Average Temperature: {{ forecast.avgTemp }}°C</p>
                    <p>Rainfall: {{ forecast.rainfall }} mm</p>
                    <p>Average Wind Speed: {{ forecast.avgWindSpeed }} m/s</p>
                    <p>Pack for {{ forecast.weatherType }} weather</p>
                    <p v-if="forecast.itRains">Need an umbrella</p>
                    <p v-else>No Rain</p>
                    <p v-if="forecast.needMask">Mask is needed</p>
                    <p v-else>No mask necessary</p>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
import Search from './components/Search.vue';
import Map from './components/Map.vue';
import { getFiveDayCityForecast, getFiveDayPollution } from './services/index.js';

export default {
    data() {
        return {
            isMapViewOpen: false,
            cityName: '',
            weatherData: {
                location: '',
            },
            forecastData: [],
            pollutionData: [],
            combinedData: [],
        };
    },
    components: {
        Search, Map
    },
    methods: {
        openMapView() {
            // Toggle the isMapViewOpen property to show/hide the map view
            this.isMapViewOpen = !this.isMapViewOpen;
        },
        getCityForecast(location) {
            this.weatherData.location = `${location.placeName}`;

            // Call the getFiveDayPollution function with the selected location's latitude and longitude
            getFiveDayPollution(location.latitude, location.longitude)
                .then((pollutionData) => {
                    // Handle the forecast data
                    console.log("Five-day pollution for", location, pollutionData);
                    this.pollutionData = pollutionData;

                    // Combine forecastData and pollutionData
                    this.combinedData = this.forecastData.map((forecast, index) => {
                        return {
                            ...forecast,
                            needMask: pollutionData[index], // Assuming pollutionData is an array of booleans
                        };
                    });
                })
                .catch((error) => {
                    console.error("Error fetching forecast data:", error);
                });

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
  
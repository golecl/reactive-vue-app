<template>
    <div>
        <input type="text" v-model="searchQuery" placeholder="Search for a city" @input="autocomplete" />
        <ul v-if="predictions.length > 0">
            <li v-for="(prediction, index) in predictions" :key="index">
                <button @click="selectCity(prediction)">{{ prediction.description }}</button>
            </li>
        </ul>
    </div>
</template>
  
<script>
const apiKeyGoogle = process.env.VUE_APP_GOOGLE_API_KEY;

export default {
    data() {
        return {
            searchQuery: "",
            predictions: [],
        };
    },
    methods: {
        loadGoogleMapsScript(callback) {
            if (!window.google) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeyGoogle}&libraries=places`;
                script.onload = callback;
                document.body.appendChild(script);
            } else {
                callback();
            }
        },
        autocomplete() {
            if (this.searchQuery.length > 0) {
                this.loadGoogleMapsScript(() => {
                    const service = new window.google.maps.places.AutocompleteService();
                    service.getPlacePredictions(
                        {
                            input: this.searchQuery,
                            types: ["(cities)"],
                        },
                        (predictions, status) => {
                            if (status === "OK") {
                                this.predictions = predictions;
                            } else {
                                this.predictions = [];
                            }
                        }
                    );
                });
            } else {
                this.predictions = [];
            }
        },
        selectCity(prediction) {
            this.searchQuery = prediction.description;
            this.predictions = [];

            // Use the Google Places API to get the details of the selected place
            const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
            placesService.getDetails(
                {
                    placeId: prediction.place_id,
                },
                (place, status) => {
                    if (status === "OK" && place.geometry && place.geometry.location) {
                        const latitude = place.geometry.location.lat();
                        const longitude = place.geometry.location.lng();
                        const addressComponents = place.address_components;
                        let cityLongName = "";
                        let countryShortName = "";

                        // Iterate through the address components to find city and country
                        for (const component of addressComponents) {
                            if (component.types.includes("locality")) {
                                cityLongName = component.long_name;
                            } else if (component.types.includes("country")) {
                                countryShortName = component.short_name;
                            }
                        }
                        const placeName = cityLongName + ', ' + countryShortName;
                        this.$emit("location-selected", { latitude, longitude, placeName });
                    }
                }
            );
        },
    },
};
</script>
  
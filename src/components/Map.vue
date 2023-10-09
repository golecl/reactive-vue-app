<template>
    <div>
      <h2>Select a Location on the Map</h2>
      <div id="map" style="height: 400px;"></div>
      <button @click="closeMapView">Close Map</button>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      // Load the Google Maps JavaScript API script using your API key
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_API_KEY}&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = this.initMap;
      document.head.appendChild(script);
    },
    methods: {
      initMap() {
        // Initialize the map
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 0, lng: 0 }, // Center of the world
          zoom: 2, // Adjust the zoom level as needed
        });
  
        // Add a click event listener to the map to get coordinates
        map.addListener("click", (event) => {
          const clickedLocation = {
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          };
  
          // Use Google's Geocoder service to get city name and country
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            {
              location: event.latLng,
            },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const city = results[0].address_components.find(
                  (component) =>
                    component.types.includes("locality") || component.types.includes("administrative_area_level_1")
                );
                const country = results[0].address_components.find((component) =>
                  component.types.includes("country")
                );
  
                if (city && country) {
                  const cityName = city.long_name;
                  const countryName = country.short_name;
                  const placeName = `${cityName}, ${countryName}`;
  
                  // Emit the selected location with city and country back to the parent component
                  this.$emit("location-selected", {...clickedLocation, placeName });
                }
              }
            }
          );
  
          // Close the map view
          this.closeMapView();
        });
      },
      closeMapView() {
        // Close the map view here
        // You can emit an event to notify the parent component to close the map view.
      },
    },
  };
  </script>
  
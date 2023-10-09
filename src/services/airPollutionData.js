import axios from 'axios';

export default async function getFiveDayPollution(latitude, longitude) {
    try {
        const apiKeyPollution = process.env.VUE_APP_OPENWEATHERMAP_API_KEY;

        const currentDate = new Date();

        // Calculate the Unix timestamp for the next day at midnight
        const startDate = Math.floor(currentDate.setHours(0, 0, 0, 0) / 1000) + 86400; // 86400 seconds in a day

        // Calculate the Unix timestamp for 4 days later at midnight
        const fourDayEnd = startDate + (86400 * 4);

        const fourDayPollutionResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution/history?&lat=${latitude}&lon=${longitude}&start=${startDate}&end=${fourDayEnd}&appid=${apiKeyPollution}`
        );

        if (fourDayPollutionResponse.status !== 200) {
            throw new Error('Failed to fetch current weather data');
        }

        const endDate = fourDayEnd + 86400;

        const fifthDayPollutionResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution/history?&lat=${latitude}&lon=${longitude}&start=${fourDayEnd}&end=${endDate}&appid=${apiKeyPollution}`
        );

        if (fifthDayPollutionResponse.status !== 200) {
            throw new Error('Failed to fetch current weather data');
        }

        console.log(fifthDayPollutionResponse)

        const mergedData = fourDayPollutionResponse.data.list.concat(fifthDayPollutionResponse.data.list);

        console.log(mergedData)

    }
    catch (error) {
        throw new Error('Error fetching pollution data: ' + error.message);
    }
}
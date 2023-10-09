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

        // Function to split array into chunks
        function chunkArray(arr, chunkSize) {
            const chunkedArray = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                chunkedArray.push(arr.slice(i, i + chunkSize));
            }
            return chunkedArray;
        }

        // Split mergedData into chunks of 24 values each
        const chunkedData = chunkArray(mergedData, 24);

        // Initialize an array to store the highest pm2_5 values
        const highestPm2_5Values = [];

        // Iterate through each chunk and find the highest pm2_5 value
        chunkedData.forEach(chunk => {
            let highestPm2_5 = chunk[0].components.pm2_5; // Initialize with the first pm2_5 value in the chunk
            chunk.forEach(obj => {
                const pm2_5Value = obj.components.pm2_5;
                if (pm2_5Value > highestPm2_5) {
                    highestPm2_5 = pm2_5Value; // Update if a higher pm2_5 value is found
                }
            });
            highestPm2_5Values.push(highestPm2_5); // Add the highest value to the result array
        });

        console.log(highestPm2_5Values);

        const needMask = highestPm2_5Values.map(value => value >= 10);

        console.log(needMask);

        return needMask;

    }
    catch (error) {
        throw new Error('Error fetching pollution data: ' + error.message);
    }
}
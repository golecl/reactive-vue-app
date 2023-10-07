import axios from 'axios';

const baseURL = 'https://api.openweathermap.org/data/3.0/';
const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;

const api = axios.create({
  baseURL,
});

export async function fetchSomeData() {
  try {
    // onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default api;

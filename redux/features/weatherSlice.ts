import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { WeatherData, WeatherHistoryData } from "@/types/weather"

interface WeatherState {
  data: WeatherData[]
  history: Record<string, WeatherHistoryData[]>
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: WeatherState = {
  data: [],
  history: {},
  status: "idle",
  error: null,
}

// Sample cities to fetch weather data for
const cities = [
  { id: "5128581", name: "New York", country: "US" },
  { id: "2643743", name: "London", country: "GB" },
  { id: "1850147", name: "Tokyo", country: "JP" },

]


export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async (_, { rejectWithValue }) => {
  try {
    // Simulate API call to OpenWeatherMap
    // In a real app, you would use the actual API with your API key
    // const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

    // Simulate API response with mock data
    const mockWeatherData: WeatherData[] = cities.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      main: {
        temp: 15 + Math.random() * 15,
        feels_like: 14 + Math.random() * 15,
        temp_min: 12 + Math.random() * 10,
        temp_max: 18 + Math.random() * 15,
        pressure: 1010 + Math.floor(Math.random() * 20),
        humidity: 40 + Math.floor(Math.random() * 50),
      },
      weather: {
        main: ["Clear", "Clouds", "Rain", "Snow", "Thunderstorm"][Math.floor(Math.random() * 5)],
        description: ["clear sky", "few clouds", "light rain", "moderate rain", "heavy snow"][
          Math.floor(Math.random() * 5)
        ],
      },
      wind: {
        speed: 1 + Math.random() * 10,
        deg: Math.floor(Math.random() * 360),
      },
      visibility: 8000 + Math.floor(Math.random() * 2000),
      dt: Date.now(),
    }))

    return mockWeatherData
  } catch (error) {
    return rejectWithValue("Failed to fetch weather data. Please try again later.")
  }
})

export const fetchWeatherHistory = createAsyncThunk(
  "weather/fetchWeatherHistory",
  async (cityId: string, { rejectWithValue }) => {
    try {
      // Simulate API call to get historical weather data
      // In a real app, you would use the actual API with your API key

      // Generate mock historical data for the past 5 days
      const mockHistoryData: WeatherHistoryData[] = Array.from({ length: 5 }).map((_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (4 - index))

        return {
          date: date.toISOString(),
          temperature: 10 + Math.random() * 20,
          condition: ["clear", "cloudy", "rainy", "snowy", "stormy"][Math.floor(Math.random() * 5)],
          humidity: 40 + Math.floor(Math.random() * 50),
          windSpeed: 1 + Math.random() * 10,
        }
      })

      return { cityId, data: mockHistoryData }
    } catch (error) {
      return rejectWithValue("Failed to fetch weather history. Please try again later.")
    }
  },
)

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<WeatherData[]>) => {
        state.status = "succeeded"
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
        const { cityId, data } = action.payload
        state.history[cityId] = data
      })
  },
})

export default weatherSlice.reducer



// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import type { WeatherData, WeatherHistoryData } from "@/types/weather";

// // Define initial state
// interface WeatherState {
//   data: WeatherData[]; // Store weather data for all cities, including the current user location
//   currentLocationWeather: WeatherData | null; // Store weather for the user's location
//   history: Record<string, WeatherHistoryData[]>;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: WeatherState = {
//   data: [],
//   currentLocationWeather: null,
//   history: {},
//   status: "idle",
//   error: null,
// };

// // Sample cities to fetch weather data for (other than user's location)
// const cities = [
//   { id: "5128581", name: "New York", country: "US" },
//   { id: "2643743", name: "London", country: "GB" },
//   { id: "1850147", name: "Tokyo", country: "JP" },
//   { id: "2147714", name: "Sydney", country: "AU" },
//   { id: "2988507", name: "Paris", country: "FR" },
// ];

// // Function to get user's location dynamically
// const getUserLocation = async () => {
//   return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//           });
//         },
//         (error) => {
//           reject(error.message);
//         }
//       );
//     } else {
//       reject("Geolocation is not supported by this browser.");
//     }
//   });
// };

// // Fetch weather data for the user's location
// export const fetchWeatherData = createAsyncThunk(
//   "weather/fetchWeatherData",
//   async (_, { rejectWithValue }) => {
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
//       if (!apiKey) {
//         throw new Error("API key is missing. Please check your .env file.");
//       }

//       // Get user location dynamically
//       const { lat, lon } = await getUserLocation();

//       // Fetch weather data based on user location
//       const userWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
//       const userWeatherResponse = await fetch(userWeatherUrl);

//       if (!userWeatherResponse.ok) {
//         throw new Error("Failed to fetch user weather data.");
//       }

//       const userWeatherData = await userWeatherResponse.json();

//       // Fetch weather data for other cities
//       const citiesWeatherPromises = cities.map((city) => {
//         const cityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${apiKey}`;
//         return fetch(cityWeatherUrl).then((response) => response.json());
//       });

//       // Wait for all city weather data
//       const citiesWeatherData = await Promise.all(citiesWeatherPromises);

//       // Return both user location weather and other cities' weather
//       const allWeatherData = citiesWeatherData.map((data, index) => ({
//         id: data.id,
//         name: data.name,
//         country: data.sys.country,
//         main: {
//           temp: data.main.temp,
//           feels_like: data.main.feels_like,
//           temp_min: data.main.temp_min,
//           temp_max: data.main.temp_max,
//           pressure: data.main.pressure,
//           humidity: data.main.humidity,
//         },
//         weather: {
//           main: data.weather[0].main,
//           description: data.weather[0].description,
//         },
//         wind: {
//           speed: data.wind.speed,
//           deg: data.wind.deg,
//         },
//         visibility: data.visibility,
//         dt: data.dt * 1000, // Convert Unix timestamp to milliseconds
//       }));

//       return {
//         userWeather: {
//           id: userWeatherData.id,
//           name: userWeatherData.name,
//           country: userWeatherData.sys.country,
//           main: {
//             temp: userWeatherData.main.temp,
//             feels_like: userWeatherData.main.feels_like,
//             temp_min: userWeatherData.main.temp_min,
//             temp_max: userWeatherData.main.temp_max,
//             pressure: userWeatherData.main.pressure,
//             humidity: userWeatherData.main.humidity,
//           },
//           weather: {
//             main: userWeatherData.weather[0].main,
//             description: userWeatherData.weather[0].description,
//           },
//           wind: {
//             speed: userWeatherData.wind.speed,
//             deg: userWeatherData.wind.deg,
//           },
//           visibility: userWeatherData.visibility,
//           dt: userWeatherData.dt * 1000,
//         },
//         citiesWeather: allWeatherData,
//       };
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch weather data.");
//     }
//   }
// );

// // Fetch weather history for the user's location
// export const fetchWeatherHistory = createAsyncThunk(
//   "weather/fetchWeatherHistory",
//   async (cityId: string, { rejectWithValue }) => {
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
//       if (!apiKey) {
//         throw new Error("API key is missing. Please check your .env file.");
//       }

//       // Get user location dynamically
//       const { lat, lon } = await getUserLocation();

//       // Fetch historical weather using lat/lon dynamically
//       const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${Math.floor(
//         Date.now() / 1000
//       ) - 86400}&appid=${apiKey}`;

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch weather history.");
//       }

//       const data = await response.json();

//       const historyData: WeatherHistoryData[] = data.hourly.map((hour: any) => ({
//         date: new Date(hour.dt * 1000).toISOString(),
//         temperature: hour.temp,
//         condition: hour.weather[0].main.toLowerCase(),
//         humidity: hour.humidity,
//         windSpeed: hour.wind_speed,
//       }));

//       return { cityId, data: historyData };
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch weather history.");
//     }
//   }
// );

// // Define weather slice for state management
// const weatherSlice = createSlice({
//   name: "weather",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWeatherData.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.status = "succeeded";
//         state.currentLocationWeather = action.payload.userWeather;
//         state.data = action.payload.citiesWeather;
//         state.error = null;
//       })
//       .addCase(fetchWeatherData.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })
//       .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
//         const { cityId, data } = action.payload;
//         state.history[cityId] = data;
//       });
//   },
// });

// export default weatherSlice.reducer;

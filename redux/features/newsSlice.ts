// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import type { NewsArticle } from "@/types/news";

// // Define initial state
// interface NewsState {
//   data: NewsArticle[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: NewsState = {
//   data: [],
//   status: "idle",
//   error: null,
// };

// // Fetch News Data based on dynamic parameters (e.g., keyword, category, language)
// export const fetchNewsData = createAsyncThunk(
//   "news/fetchNewsData",
//   async (
//     { query = "", category = "", language = "en" }: { query?: string; category?: string; language?: string },
//     { rejectWithValue }
//   ) => {
//     console.log("hello working")
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
//       console.log(apiKey) // Store your real API key in .env
//       if (!apiKey) {
//         throw new Error("API key is missing. Please check your .env file.");
//       }

//       console.log(apiKey, "API Key"); // Check if the API key is available

//       // Construct dynamic API URL based on parameters
//       let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&language=${language}`;
//       if (query) {
//         url += `&q=${query}`;
//       }
//       if (category) {
//         url += `&category=${category}`;
//       }

//       // Fetch news data
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch news data.");
//       }

//       const data = await response.json();
//       console.log(data, "from the news slice");

//       // Return news articles data
//       return data.articles.map((article: any) => ({
//         id: article.url, // Use article's URL as unique ID
//         title: article.title,
//         description: article.description,
//         url: article.url,
//         source: article.source.name,
//         publishedAt: article.publishedAt,
//       }));
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch news data.");
//     }
//   }
// );

// const newsSlice = createSlice({
//   name: "news",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // .addCase(fetchNewsData.pending, (state) => {
//       //   state.status = "loading";
//       // })
//       .addCase(fetchNewsData.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
//         state.status = "succeeded";
//         state.data = action.payload;
//         state.error = null;
//       })
//       // .addCase(fetchNewsData.rejected, (state, action) => {
//       //   // state.status = "failed";
//       //   // state.error = action.payload as string;
//       // });
//   },
// });

// export default newsSlice.reducer;


import { createSlice } from '@reduxjs/toolkit'

interface NewsState {
  data: any[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: NewsState = {
  data: [],
  status: 'idle',
  error: null,
}

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNewsData(state, action) {
      state.data = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    setLoading(state) {
      state.status = 'loading'
    },
    setError(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const { setNewsData, setLoading, setError } = newsSlice.actions

export default newsSlice.reducer

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import type { CryptoData, CryptoHistoryData } from "@/types/crypto";

interface CryptoState {
  data: CryptoData[];
  history: Record<string, CryptoHistoryData[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CryptoState = {
  data: [],
  history: {},
  status: "idle",
  error: null,
};

// Sample cryptocurrencies to fetch data for
const cryptos = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
  { id: "ethereum", symbol: "eth", name: "Ethereum" },
  { id: "dogecoin", symbol: "doge", name: "Dogecoin" },
  { id: "cardano", symbol: "ada", name: "Cardano" },
  { id: "solana", symbol: "sol", name: "Solana" },
];

// API call to fetch crypto data from CoinGecko
export const fetchCryptoData = createAsyncThunk(
  "crypto/fetchCryptoData",
  async (_, { rejectWithValue }) => {
    try {
      const ids = cryptos.map((crypto) => crypto.id).join(',');
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: ids,
        },
      });

      // Return the API response directly (CoinGecko API provides data in a structured way)
      const cryptoData: CryptoData[] = response.data.map((crypto: any) => ({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        image: crypto.image.large,
        currentPrice: crypto.current_price,
        marketCap: crypto.market_cap,
        totalVolume: crypto.total_volume,
        high24h: crypto.high_24h,
        low24h: crypto.low_24h,
        priceChangePercentage24h: crypto.price_change_percentage_24h,
        priceChangePercentage7d: crypto.price_change_percentage_7d,
        priceChangePercentage30d: crypto.price_change_percentage_30d,
        circulatingSupply: crypto.circulating_supply,
        totalSupply: crypto.total_supply,
        maxSupply: crypto.max_supply,
        ath: crypto.ath,
        athDate: Date.parse(crypto.ath_date),
        atl: crypto.atl,
        atlDate: Date.parse(crypto.atl_date),
      }));

      return cryptoData;
    } catch (error) {
      return rejectWithValue("Failed to fetch cryptocurrency data. Please try again later.");
    }
  }
);

// API call to fetch historical data for a specific crypto
export const fetchCryptoHistory = createAsyncThunk(
  "crypto/fetchCryptoHistory",
  async (cryptoId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: '30', // Last 30 days
        },
      });

      const historyData: CryptoHistoryData[] = response.data.prices.map((priceData: any) => ({
        timestamp: priceData[0], // timestamp of the price
        price: priceData[1], // price at the timestamp
        volume: 0, // You can choose to calculate volume if available from API
        marketCap: 0, // You can calculate market cap if needed
      }));

      return { cryptoId, data: historyData };
    } catch (error) {
      return rejectWithValue("Failed to fetch cryptocurrency history. Please try again later.");
    }
  }
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload;
      const crypto = state.data.find((c) => c.id === id);

      if (crypto) {
        const oldPrice = crypto.currentPrice;
        crypto.currentPrice = price;

        // Update 24h price change percentage based on new price
        const priceChangePercentage = ((price - oldPrice) / oldPrice) * 100;
        crypto.priceChangePercentage24h += priceChangePercentage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCryptoData.fulfilled, (state, action: PayloadAction<CryptoData[]>) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        const { cryptoId, data } = action.payload;
        state.history[cryptoId] = data;
      });
  },
});

export const { updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserPreferencesState {
  favoriteCities: string[]
  favoriteCryptos: string[]
  theme: "light" | "dark" | "system"
}

const initialState: UserPreferencesState = {
  favoriteCities: [],
  favoriteCryptos: [],
  theme: "system",
}

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const cityId = action.payload
      const index = state.favoriteCities.indexOf(cityId)

      if (index === -1) {
        state.favoriteCities.push(cityId)
      } else {
        state.favoriteCities.splice(index, 1)
      }
    },
    toggleFavoriteCrypto: (state, action: PayloadAction<string>) => {
      const cryptoId = action.payload
      const index = state.favoriteCryptos.indexOf(cryptoId)

      if (index === -1) {
        state.favoriteCryptos.push(cryptoId)
      } else {
        state.favoriteCryptos.splice(index, 1)
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
  },
})

export const { toggleFavoriteCity, toggleFavoriteCrypto, setTheme } = userPreferencesSlice.actions
export default userPreferencesSlice.reducer


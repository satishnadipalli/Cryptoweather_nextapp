import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Notification {
  id: string
  type: "price_alert" | "weather_alert"
  title: string
  message: string
  timestamp: number
  read: boolean
}

interface NotificationsState {
  items: Notification[]
}

const initialState: NotificationsState = {
  items: [],
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "read">>) => {
      state.items.unshift({ ...action.payload, read: false })

      // Keep only the most recent 20 notifications
      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20)
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true
      })
    },
    clearAllNotifications: (state) => {
      state.items = []
    },
  },
})

export const {
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
} = notificationsSlice.actions
export default notificationsSlice.reducer


CryptoWeather Nexus


CryptoWeather Nexus is a modern dashboard that combines weather data, cryptocurrency information, and real-time notifications using WebSockets. It provides live weather updates, cryptocurrency prices, and crypto-related news. Built using Next.js, React, Redux, and Tailwind CSS, this project aims to offer a smooth and interactive user experience.

Features
Weather Dashboard: Displays the current temperature, humidity, and conditions for multiple cities.

Cryptocurrency Dashboard: Shows live price, 24h price change, and market cap for cryptocurrencies like Bitcoin and Ethereum.

Crypto News: Displays the top 5 crypto-related headlines.

Real-Time Updates: WebSocket integration to get live updates for cryptocurrency prices and weather alerts.

Favorites: Users can "favorite" cities or cryptocurrencies, and they will be saved across sessions.

Tech Stack
Next.js (v13+): File-based routing and server-side rendering.

React: For building components and managing state.

Redux: For global state management, including async actions (via Redux Thunk).

Tailwind CSS: For styling with utility-first classes.

WebSocket: For live price updates and simulated weather alerts.

Setup and Installation
To run this project locally, follow these steps:

1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/crypto-weather-nexus.git
cd crypto-weather-nexus
2. Install Dependencies
Make sure you have Node.js installed, then run the following command:

bash
Copy
Edit
npm install
3. Set Up Environment Variables
Create a .env.local file in the root directory of the project and add the following environment variables:

bash
Copy
Edit
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
You can get these API keys by signing up for the respective services:

OpenWeatherMap API

CoinGecko API

NewsData API

4. Run the Project Locally
Once you’ve set up the environment variables, run the following command to start the development server:

bash
Copy
Edit
npm run dev
Your app should now be running at http://localhost:3000.

Project Structure
Here's a brief overview of the project structure:

bash
Copy
Edit
/pages
  /index.js        - Dashboard page with weather, crypto, and news sections.
  /crypto/[id].js  - Crypto details page (e.g., Bitcoin, Ethereum).
  /weather/[id].js - City details page (weather history, chart/table).
/components
  /WeatherCard.js  - Displays weather information for a city.
  /CryptoCard.js   - Displays cryptocurrency information.
  /NewsCard.js     - Displays a news headline.
  /Notification.js - Displays real-time WebSocket notifications.
/redux
  /features
    /weatherSlice.js - Redux slice for weather data.
    /cryptoSlice.js  - Redux slice for cryptocurrency data.
    /userPreferencesSlice.js - Redux slice for storing favorite cities and cryptos.
  /store.js         - Redux store setup.
Deployment
To deploy the app, you can use a platform like Vercel or Netlify. Here’s how you can deploy it to Vercel:

Push your code to a GitHub repository.

Go to Vercel, sign in, and create a new project.

Connect your GitHub repository and deploy.

Vercel will automatically detect the Next.js framework and set up everything for you.

Usage
Once the app is deployed or running locally, you can:

View Weather Data: See the current weather for multiple cities.

View Cryptocurrency Data: Check live prices and market data for cryptocurrencies.

Favorite Cities/Cryptos: Click the star button to save your favorite cities or cryptocurrencies.

Real-Time Notifications: Receive updates about significant price changes or weather alerts.

Challenges & Solutions
WebSocket Integration: Handling real-time data with WebSocket was challenging, but the CoinCap WebSocket API provided a simple interface to stream live price updates.

API Rate Limits: To handle rate limits for external APIs, we implemented data caching and periodic refreshing every 60 seconds.

Responsive Design: Tailwind CSS made it easier to build a responsive layout that looks great on mobile and desktop.

License
This project is open-source and available under the MIT License. See the LICENSE file for more details.


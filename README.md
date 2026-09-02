# SkyCast Weather App

## Project Purpose

SkyCast is a React weather app that lets the user search for a city and view current weather details plus a five-day forecast. The app uses the OpenWeatherMap API and Material UI to create a clean, responsive interface.

## Features

- Search for weather by city name
- Detect the current location with one button press
- Save favorite cities and switch between them from the settings menu
- Optionally detect the location automatically on startup
- View current weather details
- View a five-day forecast
- Switch between Celsius and Fahrenheit
- Follow the device light or dark setting, or pick light or dark manually
- See clear loading and error states
- Use a responsive layout for mobile, tablet, and desktop

## Tools And Libraries Used

- React: builds the user interface with components and state
- Vite: runs the development server and creates the production build
- Material UI: provides UI components and theme support
- Emotion: supports Material UI styling
- OpenWeatherMap API: provides current weather, forecast, and place name lookup
- Browser Geolocation API: finds the current location when the user asks for it

## Project Structure

- `src/App.jsx`: main layout, search state, API fetching, and settings menu
- `src/main.jsx`: app entry point
- `src/RootApp.jsx`: Material UI theme setup and light or dark mode state
- `src/index.css`: global styles and app background styling
- `src/deviceLocation.js`: reads the device location from the browser
- `src/favoriteCities.js`: rules for the saved favorite city list
- `src/appStorage.js`: saves settings in the browser
- `src/components/SearchBar.jsx`: search input and search button
- `src/components/LocationButton.jsx`: button that detects the current location
- `src/components/FavoriteButton.jsx`: star button that saves the current city
- `src/components/WeatherCard.jsx`: current weather display
- `src/components/ForecastList.jsx`: five-day forecast display
- `src/components/ErrorAlert.jsx`: error message display
- `src/components/LoadingSpinner.jsx`: loading state display

## Setup Instructions

1. Install Node.js if it is not already installed.
1. Open the project folder in a terminal.
1. Install dependencies:

```bash
npm install
```

## Environment Variable Instructions

1. Create a `.env` file in the project root.
1. Add your OpenWeatherMap API key like this:

```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

1. Save the file.

You can use `.env.example` as a guide.

## Run The Project

Start the development server:

```bash
npm start
```

Vite will show a local URL such as `http://localhost:5173/`.

## Build The Project

Create a production build:

```bash
npm run build
```

## Notes

- The app reads weather data from the OpenWeatherMap API.
- Material UI is used for most of the layout and interface components.
- If the API key is missing or the city name is invalid, the app shows a clear error message.

## Evaluation Notes

- The app uses a `.env` file for the OpenWeatherMap API key, so the key is not hardcoded in the source code.
- The project was built with React and Vite, and Material UI was used for the main UI components and layout.
- The app includes a settings menu for theme mode and temperature unit selection.
- The app handles empty search input, invalid city names, missing API keys, and failed weather requests with clear feedback.
- `npm run build` completed successfully before submission.
- Development planning was tracked with a GitHub Projects board and summarized in `planning.md` inside this repository.

## Live Site

<https://skycast-nine-livid.vercel.app/>

## Repository Link

<https://github.com/Cory71/weather-app-cs>

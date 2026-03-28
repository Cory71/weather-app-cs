# Weather App Project Plan

## Project Goal

Build a Weather Forecasting App with React, Vite, and JSX that uses the OpenWeatherMap API, supports user-driven weather lookups, shows current conditions and forecast data, handles errors clearly, and is ready for deployment.

## Main Stack

- React
- Vite
- JSX
- Material UI
- CSS
- OpenWeatherMap API
- `useState`
- `useEffect`

## Suggested Folder Structure

```text
src/
    components/
        SearchBar.jsx
        WeatherCard.jsx
        ForecastList.jsx
        ForecastCard.jsx
        UnitToggle.jsx
        ErrorAlert.jsx
        LoadingSpinner.jsx
    services/
        weatherApi.js
    utils/
        formatWeather.js
        temperature.js
    App.jsx
    main.jsx
    index.css
```

## Material UI Components To Use

- `Container` for page width
- `Box` for spacing and layout wrappers
- `Stack` for vertical and horizontal layout
- `Typography` for headings and text
- `TextField` for the city search input
- `Button` for search and toggle actions
- `Card` and `CardContent` for weather display
- `Alert` for error messages
- `CircularProgress` for loading state
- `Divider` if needed for section separation

## Phase 1: Setup And Project Base

### Phase 1 Goal

Set up the React and Vite project so development can start with a clean structure.

### Phase 1 Checklist

- [x] Create the app with Vite using the React template.
- [x] Confirm the project uses JSX files for components.
- [x] Install dependencies.
- [x] Install Material UI and its required packages.
- [x] Create the basic `src/` folder structure.
- [x] Clean up starter files that are not needed.
- [x] Confirm the app runs locally.

### Phase 1 Commit Point

- [x] The app starts locally.
- [x] The starter code is cleaned up.
- [x] The folder structure is ready for feature work.
- [ ] Commit and push Phase 1.

### Phase 1 Deliverable

A working Vite app with Material UI installed and ready for weather features.

## Phase 2: Layout, State, And Search

### Phase 2 Goal

Build the app shell, add state, and make the search flow work.

### Phase 2 Checklist

- [ ] Create the main `App.jsx` layout.
- [ ] Use `Container`, `Box`, `Stack`, and `Typography` for the page layout.
- [ ] Add state for search input.
- [ ] Add state for weather data.
- [ ] Add state for forecast data.
- [ ] Add state for loading.
- [ ] Add state for errors.
- [ ] Add state for the temperature unit toggle.
- [ ] Build a search form component.
- [ ] Use MUI `TextField` for city input.
- [ ] Use MUI `Button` for submit.
- [ ] Allow city-name input.
- [ ] Validate empty input before making requests.
- [ ] Run the search on form submit.
- [ ] Show helpful feedback for invalid searches.

### Phase 2 Commit Point

- [ ] The app layout is in place.
- [ ] State is organized in a clear way.
- [ ] The search form works and validates input.
- [ ] Commit and push Phase 2.

### Phase 2 Deliverable

A clear Material UI app structure with a working search flow.

## Phase 3: API Setup And Fetch Flow

### Phase 3 Goal

Connect the project to OpenWeatherMap in a safe and simple way and fetch data with `useEffect`.

### Phase 3 Checklist

- [ ] Register for an OpenWeatherMap API key.
- [ ] Add the key to an environment file with a `VITE_` name.
- [ ] Create a small API service file for requests.
- [ ] Add functions for current weather data.
- [ ] Add functions for forecast data.
- [ ] Keep fetch logic readable and beginner-friendly.
- [ ] Decide what state change should trigger the fetch.
- [ ] Use `useEffect` to run the fetch when that value changes.
- [ ] Keep the fetch out of the component body.
- [ ] Use `async/await` with `try/catch/finally`.
- [ ] Update loading, success, and error state correctly.
- [ ] Confirm repeated searches update the weather cleanly.
- [ ] Auto-load weather for Nanaimo, BC, Canada on first visit.
- [ ] Confirm requests work with a test city.

### Phase 3 Commit Point

- [ ] The API key is wired in through `VITE_` env config.
- [ ] Weather requests work for a test city.
- [ ] `useEffect` updates the data correctly after a search.
- [ ] The first app load shows weather for Nanaimo, BC, Canada.
- [ ] Commit and push Phase 3.

### Phase 3 Deliverable

A reusable API layer with a course-aligned fetch flow.

## Phase 4: Weather UI And Forecast

### Phase 4 Goal

Show the weather results in a clean, readable interface.

### Phase 4 Checklist

- [ ] Create a current weather display component.
- [ ] Use MUI `Card`, `CardContent`, and `Typography`.
- [ ] Show city name.
- [ ] Show temperature.
- [ ] Show humidity.
- [ ] Show wind speed.
- [ ] Show weather condition text.
- [ ] Show an icon if it improves clarity.
- [ ] Add a five-day forecast section.
- [ ] Display forecast entries with `.map()`.
- [ ] Show each forecast item in a simple MUI card or box.
- [ ] Add a Celsius and Fahrenheit toggle.
- [ ] Make sure temperature values update correctly when toggled.
- [ ] Add weather icons or condition labels.
- [ ] Show the local date and time for the searched city.
- [ ] Keep the extra feature inside course-level complexity.

### Phase 4 Deliverable

A working weather dashboard with current weather and forecast results.

### Phase 4 Commit Point

- [ ] Current weather data renders clearly.
- [ ] Forecast data renders correctly.
- [ ] The unit toggle works.
- [ ] Selected extra weather details render correctly.
- [ ] Commit and push Phase 4.

## Phase 5: Styling, Responsiveness, And Reliability

### Phase 5 Goal

Polish the app so it looks clean, responds well on different screens, and handles errors clearly.

### Phase 5 Checklist

- [ ] Use Material UI spacing and layout props for most styling.
- [ ] Keep spacing, typography, and colors consistent.
- [ ] Make the layout work on mobile, tablet, and desktop.
- [ ] Use `sx` for small one-off styling changes.
- [ ] Keep custom styling minimal and readable.
- [ ] Handle empty search input.
- [ ] Handle invalid city names.
- [ ] Handle failed API requests.
- [ ] Handle slow-loading states.
- [ ] Show clear and beginner-friendly error messages with MUI `Alert`.
- [ ] Show loading state with MUI `CircularProgress`.
- [ ] Prevent broken UI when data is missing.

### Phase 5 Deliverable

A polished and reliable app that feels ready for review.

### Phase 5 Commit Point

- [ ] The app looks clean on common screen sizes.
- [ ] Loading and error states work clearly.
- [ ] The UI stays stable when data is missing or requests fail.
- [ ] Commit and push Phase 5.

## Phase 6: Final Cleanup, README, Publish, And Submit

### Phase 6 Goal

Prepare the project for grading, deployment, and submission.

### Phase 6 Checklist

- [ ] Review component names and file names.
- [ ] Remove unused code and files.
- [ ] Add simple comments only where needed.
- [ ] Write the README with setup and run steps.
- [ ] Document the tools and libraries used.
- [ ] Explain the project structure in simple terms.
- [ ] Mention Material UI and OpenWeatherMap in the README.
- [ ] Include project purpose.
- [ ] Include setup instructions.
- [ ] Include environment variable instructions.
- [ ] Include the run command.
- [ ] Include the build command.
- [ ] Run `npm run build` successfully before the final commit.
- [ ] Include deployment link after publishing.
- [ ] Push the complete project to GitHub.
- [ ] Publish the website.
- [ ] Test the live site.
- [ ] Confirm the README is complete.
- [ ] Gather any extra notes for the instructor.
- [ ] Submit the GitHub link and published site link.

### Phase 6 Commit Point

- [ ] The repo is clean and documented.
- [ ] `npm run build` completes without errors.
- [ ] The live site works.
- [ ] Submission links are ready.
- [ ] Commit and push Phase 6.

### Phase 6 Deliverable

A submitted project that includes the repo, README, live site, and any helpful notes.

## Recommended Component Plan

- `App.jsx` manages the main layout and top-level state.
- `SearchBar.jsx` handles the controlled input and submit action.
- `WeatherCard.jsx` shows the current weather data.
- `ForecastList.jsx` maps forecast items into visible UI.
- `ForecastCard.jsx` renders one forecast item.
- `UnitToggle.jsx` switches between Celsius and Fahrenheit.
- `ErrorAlert.jsx` renders API and validation errors.
- `LoadingSpinner.jsx` renders the loading state.

## Suggested Build Order

1. Set up Vite and clean the starter project.
2. Install Material UI.
3. Add the API service and environment variable.
4. Build the app layout with Material UI.
5. Build the search form and app state.
6. Add `useEffect` fetching.
7. Show current weather data.
8. Add forecast data.
9. Add the temperature toggle.
10. Add loading and error states.
11. Make the layout responsive.
12. Write the README.
13. Deploy and submit.

## Definition Of Done

- [ ] The app runs locally without errors.
- [ ] The app fetches weather data from OpenWeatherMap.
- [ ] The user can search by location.
- [ ] The app shows current weather details.
- [ ] The app shows a five-day forecast or similar forecast view.
- [ ] The app includes a Celsius and Fahrenheit toggle or another course-safe extra feature.
- [ ] The app uses Material UI for the main visual components.
- [ ] The app uses `useEffect` for API requests.
- [ ] The UI is responsive.
- [ ] Errors are handled clearly.
- [ ] The README explains setup and usage.
- [ ] The project is on GitHub.
- [ ] The project is deployed.

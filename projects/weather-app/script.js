/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            WEATHER APP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY CONCEPTS COVERED:
- Async/Await & Promises (API calls)
- Fetch API (HTTP requests)
- Error Handling (try/catch)
- Geolocation API
- Local Storage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// ═══════════════════════════════════════════════════════════
// API CONFIGURATION
// ═══════════════════════════════════════════════════════════
// These come from config.js (loaded before this script in HTML)
// We keep API keys in a separate gitignored file for security

const API_KEY = CONFIG.API_KEY;
const BASE_URL = CONFIG.BASE_URL;
const ICON_URL = CONFIG.ICON_URL;

// ═══════════════════════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════════════════════
// Caching DOM elements at the top is more efficient than
// calling getElementById() every time we need an element

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");
const weatherContent = document.getElementById("weatherContent");

const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");

const cityNameEl = document.getElementById("cityName");
const countryNameEl = document.getElementById("countryName");
const currentDateEl = document.getElementById("currentDate");

const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const feelsLikeEl = document.getElementById("feelsLike");

const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

const windSpeedEl = document.getElementById("windSpeed");
const humidityEl = document.getElementById("humidity");
const uvIndexEl = document.getElementById("uvIndex");
const pressureEl = document.getElementById("pressure");
const cloudsEl = document.getElementById("clouds");
const visibilityEl = document.getElementById("visibility");

const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const sunDot = document.getElementById("sunDot");
const arcFill = document.getElementById("arcFill");

const forecastContainer = document.getElementById("forecastContainer");
const lastUpdatedEl = document.getElementById("lastUpdated");

const recentSearches = document.getElementById("recentSearches");
const recentList = document.getElementById("recentList");
const clearRecent = document.getElementById("clearRecent");

const particles = document.getElementById("particles");

const WEATHER_CLASSES = [
  "weather-clear",
  "weather-clouds",
  "weather-rain",
  "weather-storm",
  "weather-snow",
  "weather-mist",
  "weather-night",
];

// ═══════════════════════════════════════════════════════════
// STATE VARIABLES
// ═══════════════════════════════════════════════════════════

let currentWeatherData = null;
let currentUnit = "celsius";
let lastSearchedCity = "";
let recentSearchesArr = [];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function showState(stateName) {
  loadingState.classList.remove("show");
  errorState.classList.remove("show");
  emptyState.classList.add("hide");
  weatherContent.classList.remove("show");

  switch (stateName) {
    case "loading":
      loadingState.classList.add("show");
      break;
    case "error":
      errorState.classList.add("show");
      break;
    case "empty":
      emptyState.classList.remove("hide");
      break;
    case "weather":
      weatherContent.classList.add("show");
      break;
  }
}

/**
 * Converts Unix timestamp to readable time
 *
 * Unix timestamp = seconds since January 1, 1970
 * JavaScript Date needs MILLISECONDS, so we multiply by 1000
 */
function formatTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function getWeatherIconUrl(iconCode) {
  const iconMap = {
    "01d": "clear-day",
    "01n": "clear-night",
    "02d": "partly-cloudy-day",
    "02n": "partly-cloudy-night",
    "03d": "cloudy",
    "03n": "cloudy",
    "04d": "overcast-day",
    "04n": "overcast-night",
    "09d": "drizzle",
    "09n": "drizzle",
    "10d": "partly-cloudy-day-rain",
    "10n": "partly-cloudy-night-rain",
    "11d": "thunderstorms-day",
    "11n": "thunderstorms-night",
    "13d": "snow",
    "13n": "snow",
    "50d": "mist",
    "50n": "mist",
  };

  const iconName = iconMap[iconCode];

  if (iconName) {
    return `https://basmilius.github.io/weather-icons/production/fill/all/${iconName}.svg`;
  }

  return `${ICON_URL}/${iconCode}@2x.png`;
}

function getWeatherEmoji(iconCode) {
  const emojiMap = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return emojiMap[iconCode] ?? "🌡️";
}

/**
 * Converts country code to full country name using Intl.DisplayNames API
 * Example: "IN" → "India", "US" → "United States"
 */
function getCountryName(countryCode) {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode) || countryCode;
  } catch (error) {
    return countryCode;
  }
}

function convertTemp(celsius, toUnit) {
  if (toUnit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// ═══════════════════════════════════════════════════════════
// FETCH WEATHER DATA
// ═══════════════════════════════════════════════════════════

/**
 * KEY CONCEPT: Async/Await & Fetch API
 *
 * This is the core of working with APIs in JavaScript!
 *
 * async: Marks a function as asynchronous (returns a Promise)
 * await: Pauses execution until the Promise resolves
 *
 * Why do we need it?
 * - API calls take TIME (network request to server and back)
 * - JavaScript is SINGLE-THREADED
 * - Without async, the page would FREEZE while waiting
 * - With async, browser can do other things while waiting
 *
 * The Flow:
 * 1. fetch(url) → Sends HTTP request to server
 * 2. await → Waits for server response
 * 3. response.json() → Parses response body as JSON
 * 4. await → Waits for parsing to complete
 * 5. Now we have usable data!
 */
async function fetchWeather(city) {
  lastSearchedCity = city;
  showState("loading");

  try {
    // encodeURIComponent makes special characters URL-safe
    // "New York" → "New%20York"
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    // HTTP Status Codes:
    // 200: Success | 401: Bad API key | 404: Not found | 429: Rate limited
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "City not found. Please check the spelling and try again."
        );
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please check your configuration.");
      } else if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again."
        );
      } else {
        throw new Error(
          "Unable to fetch weather data. Please try again later."
        );
      }
    }

    const data = await response.json();
    currentWeatherData = data;

    displayWeather(data);
    fetchForecast(city);
    showState("weather");
    addToRecentSearches(city);
  } catch (error) {
    errorMessage.textContent = error.message;
    showState("error");
  }
}

async function fetchWeatherByCoords(lat, lon) {
  showState("loading");

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not fetch weather for your location.");
    }

    const data = await response.json();
    lastSearchedCity = data.name;
    currentWeatherData = data;

    displayWeather(data);
    fetchForecast(data.name);
    showState("weather");
    addToRecentSearches(data.name);
  } catch (error) {
    errorMessage.textContent = error.message;
    showState("error");
  }
}

// ═══════════════════════════════════════════════════════════
// DISPLAY WEATHER
// ═══════════════════════════════════════════════════════════

function displayWeather(data) {
  const city = data.name;
  const country = getCountryName(data.sys.country);

  const tempCelsius = data.main.temp;
  const feelsLikeCelsius = data.main.feels_like;
  const temp = convertTemp(tempCelsius, currentUnit);
  const feelsLike = convertTemp(feelsLikeCelsius, currentUnit);

  // weather is an array - we use the first item [0]
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const weatherMain = data.weather[0].main;

  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const pressure = data.main.pressure;
  const visibility = (data.visibility / 1000).toFixed(1);
  const clouds = data.clouds.all;
  const sunrise = formatTime(data.sys.sunrise);
  const sunset = formatTime(data.sys.sunset);

  cityNameEl.textContent = city;
  countryNameEl.textContent = country;
  currentDateEl.textContent = formatDate();

  weatherIconEl.src = getWeatherIconUrl(iconCode);
  weatherIconEl.alt = description;

  temperatureEl.textContent = temp;
  descriptionEl.textContent = description;
  feelsLikeEl.textContent = feelsLike;

  windSpeedEl.textContent = `${windSpeed} m/s`;
  humidityEl.textContent = `${humidity}%`;
  uvIndexEl.textContent = "N/A";
  pressureEl.textContent = `${pressure} hPa`;
  cloudsEl.textContent = `${clouds}%`;
  visibilityEl.textContent = `${visibility} km`;

  sunriseEl.textContent = sunrise;
  sunsetEl.textContent = sunset;

  lastUpdatedEl.textContent = formatTime(Date.now() / 1000);

  updateWeatherTheme(weatherMain, iconCode);
  updateSunPosition(data.sys.sunrise, data.sys.sunset);
}

// ═══════════════════════════════════════════════════════════
// SEARCH HANDLING
// ═══════════════════════════════════════════════════════════

function handleSearch() {
  const city = searchInput.value.trim();
  if (city === "") return;

  searchInput.value = "";
  recentSearches.classList.remove("show");
  fetchWeather(city);
}

function setUnit(unit) {
  if (unit === currentUnit) return;

  currentUnit = unit;

  if (unit === "celsius") {
    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
  } else {
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
  }

  if (currentWeatherData !== null) {
    const temp = convertTemp(currentWeatherData.main.temp, unit);
    const feelsLike = convertTemp(currentWeatherData.main.feels_like, unit);

    temperatureEl.textContent = temp;
    feelsLikeEl.textContent = feelsLike;
  }
}

// ═══════════════════════════════════════════════════════════
// GEOLOCATION
// ═══════════════════════════════════════════════════════════

/**
 * KEY CONCEPT: Geolocation API
 *
 * Browser API that gets user's physical location
 * - Requires user permission (browser popup)
 * - Returns latitude and longitude coordinates
 * - Can be denied by user or fail due to various reasons
 *
 * navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
 */
function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  locationBtn.classList.add("locating");

  navigator.geolocation.getCurrentPosition(
    // Success callback
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      locationBtn.classList.remove("locating");
      fetchWeatherByCoords(lat, lon);
    },
    // Error callback
    (error) => {
      locationBtn.classList.remove("locating");
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location access denied. Please enable location permissions.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information unavailable.");
          break;
        case error.TIMEOUT:
          alert("Location request timed out.");
          break;
        default:
          alert("An unknown error occurred.");
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════
// WEATHER THEME
// ═══════════════════════════════════════════════════════════

function updateWeatherTheme(weatherMain, iconCode) {
  WEATHER_CLASSES.forEach((cls) => document.body.classList.remove(cls));
  clearParticles();

  const isNight = iconCode.endsWith("n");

  if (isNight && weatherMain === "Clear") {
    document.body.classList.add("weather-night");
    return;
  }

  switch (weatherMain) {
    case "Clear":
      document.body.classList.add("weather-clear");
      break;
    case "Clouds":
      document.body.classList.add("weather-clouds");
      break;
    case "Rain":
    case "Drizzle":
      document.body.classList.add("weather-rain");
      createRainEffect();
      break;
    case "Thunderstorm":
      document.body.classList.add("weather-storm");
      createRainEffect();
      break;
    case "Snow":
      document.body.classList.add("weather-snow");
      createSnowEffect();
      break;
    case "Mist":
    case "Fog":
    case "Haze":
    case "Smoke":
    case "Dust":
      document.body.classList.add("weather-mist");
      break;
    default:
      document.body.classList.add("weather-clear");
  }
}

// ═══════════════════════════════════════════════════════════
// 5-DAY FORECAST
// ═══════════════════════════════════════════════════════════

async function fetchForecast(city) {
  try {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) return;

    const data = await response.json();

    // Filter to get only noon (12:00) forecasts
    const dailyForecasts = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    displayForecast(dailyForecasts.slice(0, 5));
  } catch (error) {
    console.error("Forecast fetch error:", error);
  }
}

function displayForecast(forecastList) {
  forecastContainer.innerHTML = "";

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const emoji = getWeatherEmoji(item.weather[0].icon);
    const tempMax = Math.round(item.main.temp_max);
    const tempMin = Math.round(item.main.temp_min);

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <span class="forecast-day">${dayName}</span>
      <span class="forecast-icon">${emoji}</span>
      <div class="forecast-temps">
        <span class="forecast-high">${tempMax}°</span>
        <span class="forecast-low">${tempMin}°</span>
      </div>
    `;

    forecastContainer.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════
// RECENT SEARCHES (localStorage)
// ═══════════════════════════════════════════════════════════

function loadRecentSearches() {
  const stored = localStorage.getItem("weatherAppRecentSearches");
  recentSearchesArr = stored ? JSON.parse(stored) : [];
  renderRecentSearches();
}

function saveRecentSearches() {
  localStorage.setItem(
    "weatherAppRecentSearches",
    JSON.stringify(recentSearchesArr)
  );
}

function addToRecentSearches(city) {
  // Title case the city name
  city = city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Remove if already exists (to move to front)
  recentSearchesArr = recentSearchesArr.filter(
    (s) => s.toLowerCase() !== city.toLowerCase()
  );

  // Add to front
  recentSearchesArr.unshift(city);

  // Keep only 5 most recent
  recentSearchesArr = recentSearchesArr.slice(0, 5);

  saveRecentSearches();
  renderRecentSearches();
}

function renderRecentSearches() {
  recentList.innerHTML = "";

  if (recentSearchesArr.length === 0) return;

  recentSearchesArr.forEach((city) => {
    const li = document.createElement("li");
    li.classList.add("recent-item");
    li.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span>${city}</span>
    `;

    li.addEventListener("click", () => {
      searchInput.value = city;
      recentSearches.classList.remove("show");
      fetchWeather(city);
    });

    recentList.appendChild(li);
  });
}

function clearAllRecentSearches() {
  recentSearchesArr = [];
  saveRecentSearches();
  renderRecentSearches();
  recentSearches.classList.remove("show");
}

// ═══════════════════════════════════════════════════════════
// SUN POSITION ARC
// ═══════════════════════════════════════════════════════════

function updateSunPosition(sunriseTimestamp, sunsetTimestamp) {
  const now = Math.floor(Date.now() / 1000);
  const totalDaylight = sunsetTimestamp - sunriseTimestamp;
  const elapsed = now - sunriseTimestamp;

  // Progress from 0 (sunrise) to 1 (sunset)
  let progress = Math.max(0, Math.min(1, elapsed / totalDaylight));

  // X: linear from 5% to 95%
  const xPercent = 5 + progress * 90;

  // Y: follows sine curve (parabola shape)
  const yPercent = 100 - Math.sin(progress * Math.PI) * 100;

  sunDot.style.left = `${xPercent}%`;
  sunDot.style.top = `${yPercent}%`;

  // Arc fill animation
  const arcLength = 283;
  arcFill.style.strokeDashoffset = arcLength * (1 - progress);
}

// ═══════════════════════════════════════════════════════════
// WEATHER PARTICLES (Rain & Snow) - FIXED
// ═══════════════════════════════════════════════════════════

function clearParticles() {
  particles.innerHTML = "";
}

function createRainEffect() {
  clearParticles();

  // Create 100 rain drops for better coverage
  for (let i = 0; i < 100; i++) {
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");

    // Random horizontal position across full width
    drop.style.left = `${Math.random() * 100}%`;

    // Random starting vertical position (negative values = start above viewport)
    // This creates drops at different stages of falling
    drop.style.top = `${-Math.random() * 100}%`;

    // Staggered animation delay for continuous effect
    drop.style.animationDelay = `${Math.random() * 2}s`;

    // Varied animation duration for natural look
    drop.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;

    particles.appendChild(drop);
  }
}

function createSnowEffect() {
  clearParticles();

  // Create 60 snowflakes
  for (let i = 0; i < 60; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");

    // Random horizontal position
    flake.style.left = `${Math.random() * 100}%`;

    // Random starting position (some already on screen)
    flake.style.top = `${-Math.random() * 50}%`;

    // Staggered animation delay
    flake.style.animationDelay = `${Math.random() * 5}s`;

    // Longer, varied duration for floating effect
    flake.style.animationDuration = `${4 + Math.random() * 4}s`;

    // Random size for depth perception
    const size = 4 + Math.random() * 8;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;

    particles.appendChild(flake);
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

retryBtn.addEventListener("click", () => {
  if (lastSearchedCity !== "") fetchWeather(lastSearchedCity);
});

celsiusBtn.addEventListener("click", () => setUnit("celsius"));
fahrenheitBtn.addEventListener("click", () => setUnit("fahrenheit"));

locationBtn.addEventListener("click", getCurrentLocation);

searchInput.addEventListener("focus", () => {
  if (recentSearchesArr.length > 0) {
    recentSearches.classList.add("show");
  }
});

document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".search-container") &&
    !e.target.closest(".recent-searches")
  ) {
    recentSearches.classList.remove("show");
  }
});

clearRecent.addEventListener("click", clearAllRecentSearches);

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

function init() {
  showState("empty");
  loadRecentSearches();
  console.log("Weather app initialized!");
}

init();

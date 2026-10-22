/**
 * api.js — Weather API integration with OpenWeatherMap
 * Handles async fetching, error handling, offline fallback, caching, and UI rendering
 * PixelCraft Studio
 */

(function (window, document) {
  'use strict';

  const CACHE_KEY = 'pixelcraft_weather_last';
  const HISTORY_KEY = 'pixelcraft_weather_history';

  // Fallback realistic mock data for offline testing or when key is omitted
  const MOCK_WEATHER = {
    'london': { name: 'London', country: 'GB', temp: 16, feels_like: 15, humidity: 72, wind: 4.6, pressure: 1014, visibility: 10, desc: 'Scattered clouds', icon: '03d' },
    'new york': { name: 'New York', country: 'US', temp: 22, feels_like: 21, humidity: 58, wind: 3.1, pressure: 1018, visibility: 10, desc: 'Clear sky', icon: '01d' },
    'tokyo': { name: 'Tokyo', country: 'JP', temp: 19, feels_like: 19, humidity: 65, wind: 2.8, pressure: 1012, visibility: 9, desc: 'Light rain', icon: '10d' },
    'paris': { name: 'Paris', country: 'FR', temp: 18, feels_like: 17, humidity: 68, wind: 3.5, pressure: 1016, visibility: 10, desc: 'Partly cloudy', icon: '02d' },
    'sydney': { name: 'Sydney', country: 'AU', temp: 25, feels_like: 26, humidity: 60, wind: 5.2, pressure: 1020, visibility: 10, desc: 'Sunny', icon: '01d' },
    'san francisco': { name: 'San Francisco', country: 'US', temp: 17, feels_like: 16, humidity: 75, wind: 6.2, pressure: 1015, visibility: 10, desc: 'Breezy fog', icon: '50d' }
  };

  class WeatherApp {
    constructor() {
      this.unit = 'C'; // 'C' or 'F'
      this.currentData = null;
      this.initElements();
      if (!this.container) return;
      this.initEvents();
      this.loadInitialData();
    }

    initElements() {
      this.container = document.getElementById('weather-app');
      this.form = document.getElementById('weather-form');
      this.input = document.getElementById('weather-city-input');
      this.submitBtn = document.getElementById('weather-submit');
      this.resultsContainer = document.getElementById('weather-result');
      this.historyContainer = document.getElementById('weather-history');
      this.unitToggle = document.getElementById('weather-unit-toggle');
      this.statusMessage = document.getElementById('weather-status');
      this.apiKeyInput = document.getElementById('weather-api-key');
    }

    initEvents() {
      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          const city = this.input.value.trim();
          if (city) {
            this.fetchWeather(city);
          }
        });
      }

      if (this.unitToggle) {
        this.unitToggle.addEventListener('click', () => {
          this.unit = this.unit === 'C' ? 'F' : 'C';
          this.unitToggle.textContent = `Displaying in °${this.unit} (Click to switch)`;
          if (this.currentData) {
            this.renderWeather(this.currentData);
          }
        });
      }

      // Check online / offline status changes
      window.addEventListener('online', () => this.showStatus('Back online!', 'success'));
      window.addEventListener('offline', () => this.showStatus('You are offline. Showing cached weather if available.', 'warning'));
    }

    getApiKey() {
      // Priority 1: User-entered in UI
      if (this.apiKeyInput && this.apiKeyInput.value.trim()) {
        return this.apiKeyInput.value.trim();
      }
      // Priority 2: window.CONFIG
      if (window.CONFIG && window.CONFIG.WEATHER_API_KEY && window.CONFIG.WEATHER_API_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
        return window.CONFIG.WEATHER_API_KEY;
      }
      return null;
    }

    async fetchWeather(city) {
      this.showStatus('Fetching latest weather...', 'loading');
      this.setLoading(true);

      const apiKey = this.getApiKey();

      // Offline check
      if (!navigator.onLine) {
        this.handleOffline(city);
        this.setLoading(false);
        return;
      }

      // If no valid API key is present, fallback gracefully to mock demo data
      if (!apiKey) {
        setTimeout(() => {
          const mock = MOCK_WEATHER[city.toLowerCase()] || {
            name: city.charAt(0).toUpperCase() + city.slice(1),
            country: 'Earth',
            temp: 20,
            feels_like: 19,
            humidity: 62,
            wind: 4.1,
            pressure: 1013,
            visibility: 10,
            desc: 'Partly sunny (Demo mode)',
            icon: '02d'
          };
          this.handleSuccess(mock, city, true);
          this.setLoading(false);
        }, 600);
        return;
      }

      const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`City "${city}" not found. Please check spelling.`);
          } else if (response.status === 401) {
            throw new Error('Invalid OpenWeatherMap API Key. Please verify your key.');
          } else {
            throw new Error(data.message || `API error (${response.status})`);
          }
        }

        const normalized = {
          name: data.name,
          country: data.sys ? data.sys.country : '',
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind: data.wind ? data.wind.speed : 0,
          pressure: data.main.pressure,
          visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
          desc: data.weather && data.weather[0] ? data.weather[0].description : 'Clear',
          icon: data.weather && data.weather[0] ? data.weather[0].icon : '01d'
        };

        this.handleSuccess(normalized, city, false);
      } catch (err) {
        this.handleError(err.message, city);
      } finally {
        this.setLoading(false);
      }
    }

    handleSuccess(data, query, isDemo = false) {
      this.currentData = data;
      this.saveToCache(data);
      this.addToHistory(data.name);
      this.renderWeather(data);
      if (isDemo) {
        this.showStatus(`Showing simulated weather for "${data.name}". (To fetch live data, enter your OpenWeatherMap API key below)`, 'info');
      } else {
        this.showStatus(`Live weather data for ${data.name} loaded successfully.`, 'success');
      }
    }

    handleError(message, query) {
      this.showStatus(message, 'error');
      // If cached data exists for this or another city, note it
      const cached = this.getFromCache();
      if (cached && this.resultsContainer) {
        this.resultsContainer.innerHTML = `
          <div class="weather-card weather-card--error">
            <p class="weather-error-text">⚠️ ${message}</p>
            <p style="font-size:var(--fs-sm); color:var(--clr-text-muted); margin-top:0.5rem;">
              Showing last cached weather (${cached.name}):
            </p>
          </div>
        `;
        this.renderWeather(cached);
      }
    }

    handleOffline(city) {
      const cached = this.getFromCache();
      if (cached) {
        this.showStatus(`Offline mode: Showing cached weather for ${cached.name}.`, 'warning');
        this.renderWeather(cached);
      } else {
        this.showStatus('You are currently offline and no cached weather data is stored.', 'error');
      }
    }

    saveToCache(data) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('Cache write failed:', e);
      }
    }

    getFromCache() {
      try {
        const item = localStorage.getItem(CACHE_KEY);
        return item ? JSON.parse(item).data : null;
      } catch (e) {
        return null;
      }
    }

    addToHistory(city) {
      try {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
        history.unshift(city);
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        this.renderHistory();
      } catch (e) {
        console.warn('History write failed:', e);
      }
    }

    renderHistory() {
      if (!this.historyContainer) return;
      try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        if (history.length === 0) {
          this.historyContainer.innerHTML = '';
          return;
        }

        this.historyContainer.innerHTML = `
          <span class="weather-history-label">Recent:</span>
          ${history.map(city => `
            <button type="button" class="weather-chip" data-city="${city}">
              ${city}
            </button>
          `).join('')}
        `;

        this.historyContainer.querySelectorAll('.weather-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            const city = btn.getAttribute('data-city');
            if (this.input) this.input.value = city;
            this.fetchWeather(city);
          });
        });
      } catch (e) {
        console.warn('History render failed:', e);
      }
    }

    renderWeather(data) {
      if (!this.resultsContainer) return;

      const tempValue = this.unit === 'C' ? data.temp : Math.round((data.temp * 9 / 5) + 32);
      const feelsLike = this.unit === 'C' ? data.feels_like : Math.round((data.feels_like * 9 / 5) + 32);

      const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

      this.resultsContainer.innerHTML = `
        <div class="weather-card">
          <div class="weather-card__header">
            <div>
              <h2 class="weather-card__city">${data.name}</h2>
              <span class="weather-card__country">${data.country}</span>
            </div>
            <div class="weather-card__condition">
              <img src="${iconUrl}" alt="${data.desc}" class="weather-card__icon" width="64" height="64"
                   onerror="this.src='assets/icons/design.svg'">
              <span class="weather-card__desc">${data.desc}</span>
            </div>
          </div>

          <div class="weather-card__main">
            <div class="weather-card__temp">
              ${tempValue}<span class="weather-card__degree">°${this.unit}</span>
            </div>
            <div class="weather-card__feels">
              Feels like ${feelsLike}°${this.unit}
            </div>
          </div>

          <div class="weather-card__details">
            <div class="weather-detail-item">
              <span class="weather-detail-label">Humidity</span>
              <span class="weather-detail-value">${data.humidity}%</span>
            </div>
            <div class="weather-detail-item">
              <span class="weather-detail-label">Wind</span>
              <span class="weather-detail-value">${data.wind} m/s</span>
            </div>
            <div class="weather-detail-item">
              <span class="weather-detail-label">Pressure</span>
              <span class="weather-detail-value">${data.pressure} hPa</span>
            </div>
            <div class="weather-detail-item">
              <span class="weather-detail-label">Visibility</span>
              <span class="weather-detail-value">${data.visibility} km</span>
            </div>
          </div>
        </div>
      `;
    }

    showStatus(msg, type = 'info') {
      if (!this.statusMessage) return;
      this.statusMessage.className = `weather-status weather-status--${type}`;
      this.statusMessage.textContent = msg;
    }

    setLoading(isLoading) {
      if (this.submitBtn) {
        this.submitBtn.disabled = isLoading;
        this.submitBtn.textContent = isLoading ? 'Loading...' : 'Check Weather';
      }
    }

    loadInitialData() {
      this.renderHistory();
      const cached = this.getFromCache();
      if (cached) {
        this.currentData = cached;
        this.renderWeather(cached);
        this.showStatus(`Loaded cached weather for ${cached.name}.`, 'info');
      } else {
        // Load default city
        this.fetchWeather('London');
      }
    }
  }

  window.PixelCraft = window.PixelCraft || {};
  window.PixelCraft.WeatherApp = WeatherApp;

  // Auto-initialize if on weather page
  if (document.readyState !== 'loading') {
    new WeatherApp();
  } else {
    document.addEventListener('DOMContentLoaded', () => new WeatherApp());
  }
})(window, document);

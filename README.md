# PixelCraft Studio 🚀

A responsive, high-performance multi-page website and web application built strictly with **vanilla HTML5, CSS3, and ES6+ JavaScript**. No frameworks, no external libraries, no npm packages, and zero build tools required.

Everything works 100% offline (including full offline mock simulation for the weather widget), with optional live integration for OpenWeatherMap.

---

## 🌟 Key Features

- **Multi-Page Architecture**: 6 fully linked pages:
  - `index.html` — Studio home, hero banner, interactive portfolio carousel, services highlights, animated counters, CTA, and quote request modal.
  - `about.html` — Studio story, core values, team showcase, and portfolio grid.
  - `services.html` — Complete agency services breakdown and 4-step creative workflow.
  - `weather.html` — Live weather widget with OpenWeatherMap API, temperature unit toggle (°C/°F), recent search history chips, offline detection, and fallback demo mode.
  - `todo.html` — Interactive client deliverable task board with full CRUD, filter pills (All/Active/Completed), item counters, inline editing, and XSS-safe local storage persistence.
  - `contact.html` — Validated contact form with real-time regex feedback, office details, and embedded map.

- **Theme Engine**:
  - Dark and Light mode toggle with instant persistence in `localStorage`.
  - Flash-of-Unstyled-Theme (FOUC) prevention script in `<head>`.
  - Automatic detection of user's OS `prefers-color-scheme`.

- **Design & Performance**:
  - Modular CSS architecture with CSS custom properties (colors, typography, spacing, shadows).
  - Responsive CSS Grid and Flexbox layouts (tested for mobile, tablet, and desktop).
  - WebP images with explicit `width` and `height` dimensions to prevent Cumulative Layout Shift (CLS).
  - Native SVG icons and dual SVG/ICO favicon.
  - `prefers-reduced-motion` compliance across all CSS animations and transitions.

- **Interactive Vanilla JavaScript**:
  - Accessible mobile drawer menu with `aria-expanded` and focus management.
  - Touch-enabled image carousel with auto-play, pause on hover/focus, dot indicators, and keyboard navigation.
  - Accessible modal dialog with focus trapping, backdrop blur, and ESC key listener.
  - Real-time form validation powered by regex with accessible error messages.
  - Smooth anchor scrolling with dynamic header offset compensation.
  - Animated stats counters using `IntersectionObserver` and smooth quadratic easing.

- **1-Step Brand Customization**:
  The brand name **"PixelCraft Studio"** is configured centrally:
  - In CSS: `--brand-name` token in `css/base.css`
  - In JavaScript: `BRAND_NAME` constant in `js/utils.js`

---

## 📁 Project Structure

```
pixelcraft-studio/
├── index.html              # Homepage
├── about.html              # About Studio & Team
├── services.html           # Services & Process
├── weather.html            # Weather API Widget Page
├── todo.html               # Studio Task Board App
├── contact.html            # Contact & Validation Form
├── favicon.svg             # Modern vector favicon
├── favicon.ico             # Standard 32x32 favicon
├── config.example.js       # Weather API configuration template
├── README.md               # Documentation
├── TESTING.md              # Manual testing checklist
├── DEMO_SCRIPT.md          # Live presentation script
├── .gitignore              # Ignores local API keys & system files
├── css/
│   ├── base.css            # Reset, typography, spacing, CSS variables
│   ├── theme.css           # Light and dark color palettes
│   ├── header.css          # Navigation and header layout
│   ├── footer.css          # Footer layout and links
│   ├── components.css      # Reusable buttons, cards, modals, carousel
│   ├── home.css            # Homepage-specific styling
│   ├── about.css           # About page styling & gallery grid
│   ├── services.css        # Services grid & process steps
│   ├── contact.css         # Form controls and error/success states
│   ├── weather.css         # Weather widget card & history chips
│   ├── todo.css            # Task board, checkboxes, and filters
│   └── bundle.min.css      # Production-ready minified stylesheet bundle
├── js/
│   ├── utils.js            # Storage wrapper, regex validators, XSS escaper
│   ├── ui.js               # Menu, theme, carousel, modal, counters, form validation
│   ├── api.js              # Weather API fetch, cache, offline fallback
│   ├── todo.js             # Todo app CRUD & filtering
│   ├── main.js             # Application initialization
│   └── bundle.min.js       # Production-ready minified script bundle
└── assets/
    ├── icons/              # Scalable SVG icons (logo, branding, email, etc.)
    └── images/             # Optimized WebP photography (hero, team, portfolio)
```

---

## 🚀 Getting Started

### 1. View Directly (Zero Setup)
Simply open `index.html` in any modern web browser:
```bash
open index.html
```

### 2. Run with Local HTTP Server (Recommended)
You can run a lightweight local server using Python or Node:

**Using Python 3:**
```bash
python3 -m http.server 3000
```
Then visit: [http://localhost:3000](http://localhost:3000)

**Using Node / npx:**
```bash
npx -y serve .
```

---

## ⛅ Weather API Setup (Optional)

By default, `weather.html` operates with built-in high-fidelity simulated weather for cities worldwide, allowing offline demonstrations.

To connect live data:
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api).
2. Copy `config.example.js` to `js/config.js`:
   ```bash
   cp config.example.js js/config.js
   ```
3. Insert your API key into `js/config.js`:
   ```javascript
   window.CONFIG = {
     WEATHER_API_KEY: 'YOUR_ACTUAL_API_KEY'
   };
   ```
   *(Note: `js/config.js` is automatically excluded by `.gitignore` to keep credentials secure).*
4. Alternatively, you can paste the key directly into the input field at the bottom of `weather.html`.

---

## ♿ Accessibility (a11y) & Standards Compliance

- **W3C Semantic HTML5**: Proper landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`).
- **Skip Links**: Accessible `#main-content` skip link for keyboard/screen-reader users.
- **Focus Management**: Focus states (:focus-visible) styled on all interactive buttons and links.
- **Keyboard Navigation**:
  - `Escape` key closes modals and mobile menus.
  - `ArrowLeft` and `ArrowRight` navigate image slides.
  - Modal traps tab focus within dialog while active.
- **Color Contrast**: Compliant with WCAG 2.1 AA standards in both light and dark themes.

---

## 📄 License
MIT License. Created for PixelCraft Studio.

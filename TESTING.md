# Manual Testing Checklist & Verification Guide

This document outlines the step-by-step test procedures for validating the functionality, accessibility, and visual fidelity of the **PixelCraft Studio** website.

---

## 1. Cross-Page Navigation & Responsive Layout

- [ ] **Desktop Navigation (>= 1024px)**:
  - Header displays full horizontal navigation bar (`Home`, `About`, `Services`, `Weather`, `Studio Tasks`, `Contact`).
  - Active page is visually highlighted with underbar indicator and `aria-current="page"`.
  - "Get a Quote" CTA button is visible and clickable.
  - Theme toggle button is accessible.

- [ ] **Mobile Drawer Navigation (< 768px)**:
  - Hamburger icon replaces horizontal menu.
  - Clicking hamburger opens the slide-in navigation drawer with smooth animation.
  - `aria-expanded` toggles between `"true"` and `"false"`.
  - Body scroll is locked while drawer is open.
  - Clicking any navigation link closes the drawer.
  - Clicking outside the drawer closes the drawer.
  - Pressing `Escape` closes the drawer and restores focus to hamburger.

---

## 2. Dark / Light Theme Engine

- [ ] **Theme Switching**:
  - Clicking the theme toggle icon switches immediately between Light and Dark mode.
  - CSS custom properties update without page reload or glitching.
  - Sun icon displays in Dark mode; Moon icon displays in Light mode.
- [ ] **Persistence**:
  - Set theme to Dark mode and refresh the page.
  - Verify that theme remains Dark with zero white flash (FOUC).
  - Inspect `localStorage['pixelcraft-theme']` and ensure value matches `"dark"`.
- [ ] **System Default Matching**:
  - Clear localStorage key. Change OS appearance between Dark/Light in System Settings.
  - Page dynamically adapts to match `prefers-color-scheme`.

---

## 3. Homepage Interactivity (`index.html`)

- [ ] **Animated Counters**:
  - Scroll down to the "Delivering Digital Excellence" stats section.
  - Verify numbers smoothly count up to their target values (150+, 98%, 12, 8+).
  - Verify animation triggers only once when entering viewport via `IntersectionObserver`.

- [ ] **Portfolio Image Carousel**:
  - Verify automatic slide advance every ~4.5 seconds.
  - Hovering mouse over carousel pauses auto-play; leaving mouse resumes it.
  - Focusing on carousel buttons pauses auto-play.
  - Clicking `Next` (right arrow) transitions to next slide.
  - Clicking `Prev` (left arrow) loops back to previous slide.
  - Clicking any dot indicator jumps directly to the corresponding slide and updates active dot pill.
  - Pressing `ArrowLeft` / `ArrowRight` on keyboard navigates slides.
  - On mobile/touch, swiping left or right advances slides.

- [ ] **"Request a Quote" Modal Dialog**:
  - Click any "Get a Quote" button or CTA link.
  - Verify modal opens smoothly with blurred backdrop.
  - Focus is automatically placed on the first input field ("Full Name").
  - Background scrolling is disabled.
  - Press `Tab` repeatedly and verify focus cycles only within the modal (focus trap).
  - Press `Escape` key: verify modal closes and focus returns to trigger button.
  - Fill form and submit: verify confirmation screen with checkmark is rendered.

- [ ] **Back-to-Top Button**:
  - Scroll down more than 300px from top.
  - Verify round floating button fades in at bottom right.
  - Clicking button smoothly scrolls window back to top.
  - Button fades out when near top.

---

## 4. Contact Form Validation (`contact.html`)

- [ ] **Real-Time Validation**:
  - Leave fields empty and click "Send Message":
    - Error messages become visible below invalid fields.
    - Fields receive red border indicator (`.form__input--error`).
    - Focus moves to the first invalid field.
  - **Name validation**:
    - Type `1` -> shows error (letters only, min 2 chars).
    - Type `Jane Doe` -> error clears, field gets green valid indicator.
  - **Email validation**:
    - Type `jane@` -> shows error.
    - Type `jane@example.com` -> valid.
  - **Phone validation**:
    - Type `123` -> shows error (requires 10-15 digits).
    - Type `(555) 234-5678` -> valid.
  - **Message validation**:
    - Type `Hi` -> shows error (min 10 characters).
    - Type `I would like to discuss a redesign project.` -> valid.
- [ ] **Successful Submission**:
  - When all fields are valid, submit form:
    - Success banner displays: *"✓ Thank you! Your message has been sent successfully."*
    - Form inputs are cleanly reset.

---

## 5. Weather Widget Page (`weather.html`)

- [ ] **Offline / Simulated Demo Mode**:
  - By default (no API key entered), search for `Tokyo`, `Paris`, or `Sydney`.
  - Widget renders temperature, feels like, humidity, wind speed, pressure, and visibility with simulated conditions.
- [ ] **Unit Toggle**:
  - Click "Displaying in °C (Click to switch)".
  - Temperatures convert instantly to Fahrenheit (°F).
  - Clicking again toggles back to Celsius (°C).
- [ ] **Recent Search History**:
  - Search multiple cities (`London`, `New York`, `Berlin`).
  - Recent search chips appear horizontally under search bar.
  - Clicking any chip re-fetches and displays weather for that city immediately.
- [ ] **Offline Detection**:
  - Disconnect network in browser dev tools (Offline mode).
  - Notice status banner updates to offline mode and renders cached weather data if available.
- [ ] **Live API Key Mode (Optional)**:
  - Enter valid OpenWeatherMap API key in the configuration field.
  - Search any city worldwide -> live data and current OpenWeatherMap icons render.

---

## 6. Studio Task Board App (`todo.html`)

- [ ] **CRUD Operations**:
  - **Create**: Type "Design typography system" and press `Enter` or click "Add Task" -> item appears at top of list.
  - **Read**: Initial sample items load from localStorage.
  - **Update (Toggle)**: Click checkbox -> item strikes through, text turns muted, active items counter decrements.
  - **Update (Edit)**: Double-click task text or click edit icon -> input replaces text. Change title and press `Enter` -> updates in place.
  - **Update (Cancel Edit)**: Double click to edit, press `Escape` -> reverts without saving changes.
  - **Delete**: Click trash icon -> item is removed immediately.
- [ ] **Filter Pills**:
  - Click **Active** -> only unchecked items are shown.
  - Click **Completed** -> only checked items are shown.
  - Click **All** -> all items are shown.
- [ ] **Clear Completed**:
  - "Clear Completed" button is visible only when one or more items are completed.
  - Clicking it removes all completed tasks and updates storage.
- [ ] **XSS Prevention**:
  - Try adding task with: `<script>alert("xss")</script><b>Bold</b>`.
  - Verify that script tag does NOT execute and HTML tags are safely escaped in DOM.

---

## 7. Accessibility & Performance Verification

- [ ] **Keyboard Navigation**: Entire site can be navigated using `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, and `Arrow` keys.
- [ ] **Skip Link**: Pressing `Tab` upon initial page load focuses `#main-content` skip link.
- [ ] **Motion Sensitivity**: With OS `prefers-reduced-motion` enabled, animations and smooth scrolling disable gracefully.
- [ ] **Image Optimization**: All images use `.webp` format and contain explicit `width` and `height` attributes to prevent layout shift.

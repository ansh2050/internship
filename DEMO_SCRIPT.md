# PixelCraft Studio — Live Demo Script 🎬

Use this 3 to 5 minute structured presentation script when demonstrating the project to clients, evaluators, or stakeholders.

---

## Part 1: Project Overview & Core Philosophy (1 minute)

1. **Open the Homepage (`http://localhost:3000/index.html` or `index.html`)**:
   > *"Welcome to PixelCraft Studio. This is a multi-page website and web application built strictly with vanilla web technologies: HTML5, CSS3, and ES6+ JavaScript. There are zero frameworks, zero npm packages, and zero build tools."*

2. **Demonstrate Theme Engine**:
   > *"Notice the theme toggle in the header. With a single click, the entire site smoothly switches between Light and Dark mode using CSS custom properties. It honors the user's OS preference, prevents flash-of-unstyled-content on page reload, and persists preferences in localStorage."*
   - *Action*: Click theme toggle back and forth. Refresh the page in dark mode to prove zero flash.

3. **Demonstrate 1-Step Rebranding**:
   > *"If we ever decide to rebrand the studio, the brand name is defined in a single CSS custom property `--brand-name` and a single JS constant `BRAND_NAME`, making global rebranding instantaneous."*

---

## Part 2: Visual Experience & Homepage Interactivity (1.5 minutes)

1. **Animated Stats Counter**:
   > *"As we scroll down through the studio introduction into our stats section, IntersectionObserver activates our number counters, smoothly interpolating from 0 to 150+ delivered projects and 98% client satisfaction with ease-out quadratic easing."*
   - *Action*: Scroll down smoothly to show counters firing.

2. **Touch-Enabled Portfolio Carousel**:
   > *"Here is our portfolio showcase carousel. It features automatic progression, next and previous controls, accessible navigation dot pills, keyboard arrow support, and mobile touch swiping. Notice that when I hover my mouse over it, the auto-play intelligently pauses."*
   - *Action*: Hover to pause, click right arrow, then click a dot indicator, and hit Arrow keys on the keyboard.

3. **Accessible "Request a Quote" Modal**:
   > *"Clicking 'Get a Quote' opens a custom accessible modal dialog with backdrop blur and focus trapping. You can cycle focus through the inputs with Tab, close it with Escape or backdrop click, and test the inline quote submission."*
   - *Action*: Click CTA, tab through inputs, submit or press Escape to close.

4. **Back to Top**:
   - *Action*: Scroll to footer and click the floating bottom-right back-to-top button to smoothly return to top.

---

## Part 3: Mini Apps & Utilities (1.5 minutes)

1. **Weather Widget (`weather.html`)**:
   > *"Moving to our Weather page, this widget was engineered to work seamlessly both online and offline. Users can query any city globally via OpenWeatherMap or test with built-in realistic mock data when offline."*
   - *Action*:
     - Search for `Tokyo` or `Paris`.
     - Click the °C / °F toggle to demonstrate instant unit recalculation.
     - Click one of the recent search chips below the bar.
     - Highlight the offline detection and local caching capabilities.

2. **Studio Task Board App (`todo.html`)**:
   > *"Next is our Deliverable Task Board. This is a client-side productivity application featuring full CRUD capabilities, localStorage persistence, and XSS sanitization."*
   - *Action*:
     - Add a new task: `"Finalize client brand guidelines"`.
     - Check off an existing task to demonstrate the custom checkbox animation and strike-through.
     - Double-click a task title to demonstrate inline editing, edit it, and press Enter.
     - Switch filter pills between `All`, `Active`, and `Completed`.
     - Click `Clear Completed`.

---

## Part 4: Form Validation & Accessibility (1 minute)

1. **Contact Page (`contact.html`)**:
   > *"Finally, on our Contact page, we implemented real-time regex form validation. Errors appear immediately when typing invalid inputs and clear dynamically as requirements are met."*
   - *Action*:
     - Click "Send Message" with blank fields to trigger the accessible error highlights.
     - Type a valid name, valid email, 10-digit phone number, and a message.
     - Hit Send to show the success confirmation banner.

2. **Conclusion**:
   > *"PixelCraft Studio demonstrates that high performance, rich modern aesthetics, responsive layouts, and robust interactive web applications can be built cleanly with pure vanilla web standards."*

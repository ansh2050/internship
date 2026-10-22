/**
 * main.js — Main application entry point for PixelCraft Studio
 * Orchestrates initialization of UI, utilities, and components
 */

(function (window, document) {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  onReady(() => {
    // Initialize all UI components
    if (window.PixelCraft && window.PixelCraft.ui) {
      window.PixelCraft.ui.initAll();
    }

    console.info(`%c${window.PixelCraft?.BRAND_NAME || 'PixelCraft Studio'}%c initialized successfully.`,
      'color: #6366f1; font-weight: bold; font-size: 14px;',
      'color: inherit;'
    );
  });
})(window, document);

/**
 * utils.js — Helper utilities, validation regexes, and safe storage wrapper
 * PixelCraft Studio
 */

(function (window) {
  'use strict';

  // Single source of truth for studio brand name
  const BRAND_NAME = 'PixelCraft Studio';

  /**
   * Safe LocalStorage wrapper with fallback in case cookies/storage are blocked
   */
  const storage = {
    get(key, fallback = null) {
      try {
        const item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : fallback;
      } catch (err) {
        console.warn(`[Storage] Failed to read key "${key}":`, err);
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn(`[Storage] Failed to set key "${key}":`, err);
        return false;
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn(`[Storage] Failed to remove key "${key}":`, err);
        return false;
      }
    }
  };

  /**
   * Input validation rules with regex patterns
   */
  const validators = {
    // 2-50 characters, letters, spaces, hyphens, and apostrophes
    name(val) {
      const trimmed = String(val || '').trim();
      const regex = /^[a-zA-Z\s\-']{2,50}$/;
      return regex.test(trimmed);
    },
    // Standard RFC-compliant email pattern
    email(val) {
      const trimmed = String(val || '').trim();
      const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      return regex.test(trimmed);
    },
    // 10 to 15 digits, allowing optional leading +, parentheses, dashes, spaces
    phone(val) {
      const trimmed = String(val || '').trim();
      const digitsOnly = trimmed.replace(/\D/g, '');
      const regex = /^(\+?[0-9\s\-()]{10,18})$/;
      return digitsOnly.length >= 10 && digitsOnly.length <= 15 && regex.test(trimmed);
    },
    // Minimum 10 characters for meaningful message
    message(val) {
      const trimmed = String(val || '').trim();
      return trimmed.length >= 10;
    },
    // Generic non-empty check
    required(val) {
      return String(val || '').trim().length > 0;
    }
  };

  /**
   * HTML escape utility to safely prevent XSS
   */
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Debounce helper
   */
  function debounce(fn, waitMs = 250) {
    let timeoutId = null;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), waitMs);
    };
  }

  /**
   * Easing function for smooth animations (easeOutQuad)
   */
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  // Expose to global namespace
  window.PixelCraft = window.PixelCraft || {};
  window.PixelCraft.BRAND_NAME = BRAND_NAME;
  window.PixelCraft.utils = {
    storage,
    validators,
    escapeHTML,
    debounce,
    easeOutQuad
  };
})(window);

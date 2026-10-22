/**
 * todo.js — Client-side Todo Application for PixelCraft Studio
 * Implements CRUD, local storage persistence, filtering, XSS sanitation, and accessible keyboard controls
 */

(function (window, document) {
  'use strict';

  const STORAGE_KEY = 'pixelcraft_todos';
  const utils = window.PixelCraft && window.PixelCraft.utils;

  const DEFAULT_TODOS = [
    { id: '1', title: 'Review client wireframes for EcoBrand redesign', completed: false, created: Date.now() - 3600000 },
    { id: '2', title: 'Export responsive SVG icons and WebP photography', completed: true, created: Date.now() - 7200000 },
    { id: '3', title: 'Schedule weekly sprint planning with PixelCraft design team', completed: false, created: Date.now() - 10800000 }
  ];

  class TodoApp {
    constructor() {
      this.todos = this.loadTodos();
      this.filter = 'all'; // 'all', 'active', 'completed'
      this.initElements();
      if (!this.container) return;
      this.initEvents();
      this.render();
    }

    initElements() {
      this.container = document.getElementById('todo-app');
      this.form = document.getElementById('todo-form');
      this.input = document.getElementById('todo-input');
      this.list = document.getElementById('todo-list');
      this.countEl = document.getElementById('todo-count');
      this.clearBtn = document.getElementById('todo-clear-completed');
      this.filterButtons = document.querySelectorAll('.todo-filter-btn');
    }

    initEvents() {
      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.addTodo();
        });
      }

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => {
          this.clearCompleted();
        });
      }

      if (this.filterButtons) {
        this.filterButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            this.setFilter(btn.getAttribute('data-filter'));
          });
        });
      }

      if (this.list) {
        // Event delegation for list actions
        this.list.addEventListener('click', (e) => {
          const item = e.target.closest('.todo-item');
          if (!item) return;
          const id = item.getAttribute('data-id');

          if (e.target.matches('.todo-checkbox') || e.target.closest('.todo-checkbox-label')) {
            this.toggleComplete(id);
          } else if (e.target.closest('.todo-delete-btn')) {
            this.deleteTodo(id);
          } else if (e.target.closest('.todo-edit-btn')) {
            this.startEdit(item, id);
          }
        });

        // Double click to edit
        this.list.addEventListener('dblclick', (e) => {
          const item = e.target.closest('.todo-item');
          if (!item) return;
          const id = item.getAttribute('data-id');
          this.startEdit(item, id);
        });
      }
    }

    loadTodos() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Failed to load todos from localStorage:', err);
      }
      return [...DEFAULT_TODOS];
    }

    saveTodos() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
      } catch (err) {
        console.warn('Failed to save todos:', err);
      }
    }

    addTodo() {
      const title = this.input.value.trim();
      if (!title) return;

      const newTodo = {
        id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title,
        completed: false,
        created: Date.now()
      };

      this.todos.unshift(newTodo);
      this.saveTodos();
      this.input.value = '';
      this.render();
      this.input.focus();
    }

    toggleComplete(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.saveTodos();
        this.render();
      }
    }

    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id);
      this.saveTodos();
      this.render();
    }

    clearCompleted() {
      this.todos = this.todos.filter(t => !t.completed);
      this.saveTodos();
      this.render();
    }

    setFilter(filter) {
      this.filter = filter;
      this.filterButtons.forEach(btn => {
        const isActive = btn.getAttribute('data-filter') === filter;
        btn.classList.toggle('todo-filter-btn--active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
      this.render();
    }

    startEdit(itemElement, id) {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) return;

      const textSpan = itemElement.querySelector('.todo-text');
      if (!textSpan || itemElement.classList.contains('todo-item--editing')) return;

      itemElement.classList.add('todo-item--editing');
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'todo-edit-input form__input';
      input.value = todo.title;

      const finishEdit = (save) => {
        if (!itemElement.classList.contains('todo-item--editing')) return;
        itemElement.classList.remove('todo-item--editing');
        const newTitle = input.value.trim();

        if (save && newTitle) {
          todo.title = newTitle;
          this.saveTodos();
        } else if (save && !newTitle) {
          // If empty title, delete item
          this.deleteTodo(id);
          return;
        }
        this.render();
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          finishEdit(true);
        } else if (e.key === 'Escape') {
          finishEdit(false);
        }
      });

      input.addEventListener('blur', () => finishEdit(true));

      textSpan.replaceWith(input);
      input.focus();
      input.select();
    }

    getFilteredTodos() {
      if (this.filter === 'active') {
        return this.todos.filter(t => !t.completed);
      }
      if (this.filter === 'completed') {
        return this.todos.filter(t => t.completed);
      }
      return this.todos;
    }

    render() {
      if (!this.list) return;

      const filtered = this.getFilteredTodos();
      const activeCount = this.todos.filter(t => !t.completed).length;

      // Update counters
      if (this.countEl) {
        this.countEl.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} remaining`;
      }

      if (this.clearBtn) {
        const hasCompleted = this.todos.some(t => t.completed);
        this.clearBtn.style.visibility = hasCompleted ? 'visible' : 'hidden';
      }

      if (filtered.length === 0) {
        this.list.innerHTML = `
          <li class="todo-empty">
            <span style="font-size: 2rem;">✨</span>
            <p>No tasks in this view</p>
          </li>
        `;
        return;
      }

      this.list.innerHTML = filtered.map(todo => {
        const safeTitle = utils ? utils.escapeHTML(todo.title) : todo.title;
        return `
          <li class="todo-item ${todo.completed ? 'todo-item--completed' : ''}" data-id="${todo.id}">
            <label class="todo-checkbox-label">
              <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark task as complete">
              <span class="todo-checkbox-custom"></span>
            </label>
            <span class="todo-text" title="Double click to edit">${safeTitle}</span>
            <div class="todo-actions">
              <button type="button" class="todo-edit-btn" aria-label="Edit task">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button type="button" class="todo-delete-btn" aria-label="Delete task">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </li>
        `;
      }).join('');
    }
  }

  window.PixelCraft = window.PixelCraft || {};
  window.PixelCraft.TodoApp = TodoApp;

  // Auto-initialize if on todo page
  if (document.readyState !== 'loading') {
    new TodoApp();
  } else {
    document.addEventListener('DOMContentLoaded', () => new TodoApp());
  }
})(window, document);

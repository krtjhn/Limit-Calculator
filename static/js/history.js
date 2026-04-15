

document.addEventListener('DOMContentLoaded', function () {
  const HISTORY_KEY = 'limitHistory';
  const HISTORY_RESET_VERSION_KEY = 'limitHistoryResetVersion';
  const HISTORY_RESET_VERSION = '1';
  const toggleBtn = document.getElementById('history-toggle');
  const closeBtn = document.getElementById('history-close');
  const panel = document.getElementById('history-panel');
  const overlay = document.getElementById('history-overlay');
  const list = document.getElementById('history-list');
  const seed = document.getElementById('history-seed');
  const functionInput = document.getElementById('function');
  const approachInput = document.getElementById('approach');

  function resetHistoryOnce() {
    const currentVersion = localStorage.getItem(HISTORY_RESET_VERSION_KEY);
    if (currentVersion === HISTORY_RESET_VERSION) {
      return;
    }

    localStorage.removeItem(HISTORY_KEY);
    localStorage.setItem(HISTORY_RESET_VERSION_KEY, HISTORY_RESET_VERSION);
  }

  resetHistoryOnce();

  
  function loadHistory() {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (err) {
      return [];
    }
  }

  
  function saveHistory(items) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  }

  
  function renderHistory(items) {
    list.innerHTML = '';

    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'history-empty';
      empty.textContent = 'No history yet.';
      list.appendChild(empty);
      return;
    }

    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'history-item-panel';

      
      const main = document.createElement('div');
      main.className = 'history-item-main';
      if (item.display && item.display.trim()) {
        const approachText = (item.approach && String(item.approach).trim()) ? item.approach : '?';
        
        main.innerHTML = `\\(\\lim_{x \\to ${approachText}} ${item.display}\\)`;
        
      } else {
        main.textContent = `${item.function} | x → ${item.approach}`;
      }

      const sub = document.createElement('div');
      sub.className = 'history-item-sub';
      sub.textContent = `Limit: ${item.limit}`;

      const actions = document.createElement('div');
      actions.className = 'history-item-actions';

      const del = document.createElement('button');
      del.className = 'history-delete-btn';
      del.textContent = 'Delete';

      
      del.addEventListener('click', function (e) {
        e.stopPropagation();
        const fresh = loadHistory();
        
        const key = makeKey(item);
        const idx = fresh.findIndex(it => makeKey(it) === key);
        if (idx !== -1) fresh.splice(idx, 1);
        saveHistory(fresh);
        renderHistory(fresh);
      });

      actions.appendChild(del);

      
      row.addEventListener('click', function () {
        if (functionInput) functionInput.value = item.function;
        if (approachInput) approachInput.value = item.approach;

        
        try {
          if (typeof closePanel === 'function') closePanel();
        } catch (e) {
          if (panel) panel.classList.remove('is-open');
          if (overlay) overlay.classList.remove('is-open');
        }

        
        const form = document.querySelector('.calculator-form');
        if (form) {
          
          try {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          } catch (err) {}
          try {
            form.submit();
          } catch (err) {}
        }
      });

      row.appendChild(main);
      row.appendChild(sub);
      row.appendChild(actions);
      list.appendChild(row);
    });

    
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise([list]).catch(() => {});
    }
  }

  
  function normalizeKeyPart(s) {
    if (!s && s !== 0) return '';
    return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
  }

  
  function makeKey(item) {
    return `${normalizeKeyPart(item.function)}||${normalizeKeyPart(item.approach)}`;
  }

  
  function addHistoryItem(newItem) {
    if (!newItem || !newItem.function) return;
    const items = loadHistory();
    const newKey = makeKey(newItem);

    
    const exists = items.some(it => makeKey(it) === newKey);
    if (exists) {
      
      renderHistory(items);
      return;
    }

    
    items.unshift(newItem);
    saveHistory(items);
    renderHistory(items);
  }

  
  if (seed) {
    const seedItem = {
      function: seed.getAttribute('data-function') || '',
      approach: seed.getAttribute('data-approach') || '',
      display: seed.getAttribute('data-display') || '',
      limit: seed.getAttribute('data-limit') || ''
    };

    if (seedItem.function && seedItem.approach) {
      addHistoryItem(seedItem);
    }
  } else {
    renderHistory(loadHistory());
  }

  
  function openPanel() {
    panel.classList.add('is-open');
    overlay.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) {
        closePanel();
      } else {
        openPanel();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (overlay) overlay.addEventListener('click', closePanel);
});

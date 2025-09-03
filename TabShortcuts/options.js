// Small HTML escaper for safety when rendering text
function esc(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m])); }

const COMMAND_LABELS = {
  "prev-tab":   "Go to previous tab (wrap)",
  "next-tab":   "Go to next tab (wrap)",
  "toggle-last":"Toggle previously active tab",
  "close-tab":  "Close current tab",
  "first-tab":  "Go to first tab",
  "last-tab":   "Go to last tab"
};

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua)) return "macOS";
  if (/Win/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown";
}

async function loadCommands() {
  const tbody = document.querySelector('#cmds tbody');
  tbody.innerHTML = '';

  // chrome.commands.getAll() returns every command declared in manifest.json
  const cmds = await chrome.commands.getAll();

  // Keep only our known commands, in a nice order
  const order = ["prev-tab","next-tab","toggle-last","close-tab","first-tab","last-tab"];
  const byName = Object.fromEntries(cmds.map(c => [c.name, c]));

  for (const name of order) {
    const info = byName[name] || { name, description: COMMAND_LABELS[name], shortcut: '' };
    const desc = info.description || COMMAND_LABELS[name] || '';
    const shortcut = info.shortcut ? `<span class="shortcut">${esc(info.shortcut)}</span>` : `<span class="empty">Unassigned</span>`;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${esc(name)}</code></td>
      <td>${esc(desc)}</td>
      <td>${shortcut}</td>
    `;
    tbody.appendChild(tr);
  }
}

document.getElementById('open-editor').addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

document.getElementById('refresh').addEventListener('click', loadCommands);

document.getElementById('platform').textContent = detectPlatform();
loadCommands();

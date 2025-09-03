// service_worker.js (Firefox + Chrome compatible)

// Use promise-based API when available
const api = (typeof browser !== "undefined") ? browser : chrome;

let lastActiveTabId = null;
let currentActiveTabId = null;

// Track last/previous active tab for toggle
api.tabs.onActivated.addListener(({ tabId }) => {
  if (currentActiveTabId !== null) lastActiveTabId = currentActiveTabId;
  currentActiveTabId = tabId;
});

async function getTabs() {
  // In Firefox, api.tabs.query returns a Promise; in Chrome it also works.
  return await api.tabs.query({ currentWindow: true });
}

async function activateTab(tabId) {
  return api.tabs.update(tabId, { active: true });
}

async function focusRelative(offset) {
  const tabs = await getTabs();
  if (!tabs || !tabs.length) return;
  const i = tabs.findIndex(t => t.active);
  if (i === -1) return;
  let idx = (i + offset + tabs.length) % tabs.length; // wrap around
  await activateTab(tabs[idx].id);
}

async function closeActive() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab) await api.tabs.remove(tab.id);
}

async function firstTab() {
  const tabs = await getTabs();
  if (tabs && tabs.length) await activateTab(tabs[0].id);
}

async function lastTab() {
  const tabs = await getTabs();
  if (tabs && tabs.length) await activateTab(tabs[tabs.length - 1].id);
}

async function toggleLast() {
  if (lastActiveTabId) {
    try { await activateTab(lastActiveTabId); }
    catch (_) { lastActiveTabId = null; } // tab might be gone
  }
}

async function newTab() {
  await api.tabs.create({});
}

async function refreshPage() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) api.tabs.reload(tab.id);
}

async function backPage() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) api.tabs.goBack(tab.id);
}

async function forwardPage() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) api.tabs.goForward(tab.id);
}

async function reopenClosed() {
  try {
    await api.sessions.restore();
  } catch (e) {
    console.warn("No closed tab to restore:", e);
  }
}

async function goToTab(num) {
  const tabs = await api.tabs.query({ currentWindow: true });
  if (num > 0 && num <= tabs.length) {
    await api.tabs.update(tabs[num - 1].id, { active: true });
  }
}

api.commands.onCommand.addListener((cmd) => {
  switch (cmd) {
    case "prev-tab":     focusRelative(-1); break;
    case "next-tab":     focusRelative(+1); break;
    case "toggle-last":  toggleLast();      break;
    case "close-tab":    closeActive();     break;
    case "first-tab":    firstTab();        break;
    case "last-tab":     lastTab();         break;
    case "new-tab":      newTab();          break;
    case "refresh-page": refreshPage();     break;
    case "back-page":    backPage();        break;
    case "forward-page": forwardPage();     break;
    case "reopen-closed": reopenClosed();   break;

    case "tab-1": goToTab(1); break;
    case "tab-2": goToTab(2); break;
    case "tab-3": goToTab(3); break;
    case "tab-4": goToTab(4); break;
    case "tab-5": goToTab(5); break;
    case "tab-6": goToTab(6); break;
    case "tab-7": goToTab(7); break;
    case "tab-8": goToTab(8); break;
    case "tab-9": goToTab(9); break;
  }
});

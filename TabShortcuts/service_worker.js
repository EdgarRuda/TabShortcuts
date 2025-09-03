let lastActiveTabId = null;
let currentActiveTabId = null;

// Track last active tab (for Alt+Q toggle)
chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (currentActiveTabId !== null) lastActiveTabId = currentActiveTabId;
  currentActiveTabId = tabId;
});

async function getTabs() {
  return chrome.tabs.query({ currentWindow: true });
}

async function activateTab(tabId) {
  return chrome.tabs.update(tabId, { active: true });
}

async function focusRelative(offset) {
  const tabs = await getTabs();
  const i = tabs.findIndex(t => t.active);
  if (i === -1) return;
  let idx = (i + offset + tabs.length) % tabs.length; // wrap around
  activateTab(tabs[idx].id);
}

async function closeActive() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) await chrome.tabs.remove(tab.id);
}

async function firstTab() {
  const tabs = await getTabs();
  if (tabs.length) activateTab(tabs[0].id);
}

async function lastTab() {
  const tabs = await getTabs();
  if (tabs.length) activateTab(tabs[tabs.length - 1].id);
}

async function toggleLast() {
  if (lastActiveTabId) {
    try {
      await activateTab(lastActiveTabId);
    } catch (_) {
      // Tab might be closed already
      lastActiveTabId = null;
    }
  }
}

async function newTab() {
  await chrome.tabs.create({});
}

chrome.commands.onCommand.addListener((cmd) => {
  switch (cmd) {
    case "prev-tab":   focusRelative(-1); break;
    case "next-tab":   focusRelative(+1); break;
    case "toggle-last":toggleLast();      break;
    case "close-tab":  closeActive();     break;
    case "first-tab":  firstTab();        break;
    case "last-tab":   lastTab();         break;
    case "new-tab":     newTab();          break;
  }
});

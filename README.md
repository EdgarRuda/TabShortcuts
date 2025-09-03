## Controls

| Shortcut        | Action                          |
|-----------------|---------------------------------|
| **Alt+E**       | Open a new tab                  |
| **Alt+W**       | Close current tab               |
| **Alt+R**       | Reload current tab              |
| **Alt+T**       | Reopen last closed tab          |
| **Alt+Z**       | Go back in tab history          |
| **Alt+X**       | Go forward in tab history       |
| **Alt+Q**       | Toggle previously active tab    |
| **Alt+S**       | Go to next tab (wrap)           |
| **Alt+A**       | Go to previous tab (wrap)       |
| **Alt+Shift+A** | Go to first tab                 |
| **Alt+Shift+S** | Go to last tab                  |
| **Alt+1/9**     | Activate tab 1 - 9              |


### Chrome
1. Clone or download this repo.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the extension folder.
5. Open `chrome://extensions/shortcuts` to set your preferred keys.

### Firefox
1. Clone or download this repo.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and select the `manifest.json`.
   - For a persistent install, [sign the add-on on AMO](https://addons.mozilla.org/developers/) (unlisted is fine) and install the `.xpi`.

## Notes

- Chrome only allows **4 default shortcuts**. The rest must be assigned manually in `chrome://extensions/shortcuts`.
- Firefox users: disable menu access keys (`about:config → ui.key.menuAccessKey = 0`) for plain `Alt+letter` shortcuts without conflicts.
- Permissions required:
  - `tabs` — for tab navigation
  - `sessions` — to restore closed tabs
  - `windows` — to scope reopen action to the current window

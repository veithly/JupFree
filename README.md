# Floating Jup Button Extension

This browser extension and Tampermonkey userscript adds a draggable floating button to any website. Clicking the button opens the Jupiter Swap interface in a small popup window, allowing for quick token swapping on Jupiter Exchange.

## Features

- **Draggable Floating Button:**  A "Jup" button appears in the top right corner of any website and can be dragged to any position on the page.
- **Quick Jupiter Swap Access:** Clicking the button opens a small popup window with the Jupiter Swap interface, pre-filled with the token address from supported websites (gmgn.ai, dexx.ai, debot.gg) when available, and defaults to SOL pair.
- **Auto-Open Option:** A checkbox is provided to enable automatic opening of the Jupiter Swap interface when navigating to a token webpage.
- **Clean UI:** The button uses a simple icon and minimal styling to blend in with any website.

## Installation

### Chrome Extension

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the `floating-jup-button-extension` folder (where you saved `manifest.json`, `content.js`, `styles.css`, and `icon.svg`).

### Tampermonkey Userscript

1. Install the Tampermonkey browser extension in your browser.
2. Create a new Tampermonkey script.
3. Copy and paste the code from `jup-trade-button.user.js` into the script editor.
4. Save the script.

## Usage

After installation, a "Jup" button will be visible in the top right corner of any website you visit.

1. **Drag the Button:** Click and drag the button to reposition it on the page as needed.
2. **Open Jupiter Swap:** Click the "Jup" button. A small popup window will open, displaying the Jupiter Swap interface.
3. **Auto-Open Feature:** Check the "Auto Open JUP" checkbox to automatically open the Jupiter Swap interface when navigating to a token webpage.
4. **Swap Tokens:** Use the Jupiter Swap interface in the popup window to quickly swap tokens. The interface will automatically attempt to use SOL as the output currency and pre-fill the input token address if you are on a supported token page.

## Supported Websites

Token address detection is specifically implemented for:

- gmgn.ai
- dexx.ai
- debot.gg

For other websites, the button will still function, but the token address will not be automatically pre-filled. You can manually enter the token address in the Jupiter Swap interface.

## Icon

The button uses a simple SVG icon (icon.svg for Chrome Extension, embedded in userscript) for a clean and unobtrusive look.

## License

[Optional: Add license information here]

## Author

Roo
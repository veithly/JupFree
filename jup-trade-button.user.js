// ==UserScript==
// @name         Floating Jup Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a draggable floating button to any website to open Jupiter Swap in a small popup window with auto-popup control.
// @author       Roo
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// ==/UserScript==

(function() {
    'use strict';

    // Get autoPopup setting from storage, default to false
    let autoPopupEnabled = GM_getValue('autoPopupEnabled', false);

    // Create button
    const button = document.createElement("button");
    button.id = "floating-button";
    button.textContent = ""; // Remove button text, use icon instead

    // Add drag functionality
    let isDragging = false;
    let initialX, initialY;

    button.addEventListener("mousedown", (e) => {
        isDragging = true;
        initialX = e.clientX - button.offsetLeft;
        initialY = e.clientY - button.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            button.style.left = `${e.clientX - initialX}px`;
            button.style.top = `${e.clientY - initialY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    button.onclick = function() {
        if (autoPopupEnabled) {
            openJupiterSwapPopup();
        } else {
            // Do nothing if auto-popup is disabled (or could show a menu later)
        }
    };

    function openJupiterSwapPopup() {
        let tokenAddress = null;
        const currentUrl = window.location.href;

        if (currentUrl.includes('gmgn.ai')) {
            const pathParts = currentUrl.split('/');
            tokenAddress = pathParts[pathParts.length - 1];
        } else if (currentUrl.includes('dexx.ai')) {
            const urlParams = new URLSearchParams(window.location.search);
            tokenAddress = urlParams.get('token_ca');
        } else if (currentUrl.includes('debot.ai')) {
            const pathParts = currentUrl.split('/');
            tokenAddress = pathParts[pathParts.length - 1];
        }

        if (tokenAddress) {
            window.open(`https://jup.ag/swap/SOL-${tokenAddress}`, 'popup', 'width=400,height=600'); // Open in a smaller popup
        } else {
            alert('Token address not found on this page.');
        }
    }

    // Append button to document.body - should be documentElement
    document.documentElement.appendChild(button);
    console.log('Floating button appended to documentElement'); // Debug log

    // Add CSS styles directly to the document
    const style = document.createElement('style');
    style.textContent = `
        #floating-button {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-image: url('data:image/webp;base64,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'); /* Use jupiter-logo.webp as background image */
            background-size: contain; /* Adjust background size */
            background-repeat: no-repeat;
            background-position: center;
            background-color: transparent; /* Make background transparent */
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 24px;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    // Create checkbox for auto-popup setting
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'autoPopupCheckbox';
    checkbox.checked = autoPopupEnabled;

    const label = document.createElement('label');
    label.htmlFor = 'autoPopupCheckbox';
    label.textContent = 'Auto Open Jup Popup';
    label.style.color = 'white'; // Style label for visibility

    const settingDiv = document.createElement('div');
    settingDiv.id = 'setting-div';
    settingDiv.style.position = 'fixed';
    settingDiv.style.top = '80px'; // Adjust position as needed
    settingDiv.style.right = '10px';
    settingDiv.style.zIndex = '9998'; // Below the button but above other content
    settingDiv.appendChild(checkbox);
    settingDiv.appendChild(label);


    checkbox.addEventListener('change', function() {
        autoPopupEnabled = checkbox.checked;
        GM_setValue('autoPopupEnabled', autoPopupEnabled);
    });

    document.documentElement.appendChild(settingDiv);


})();
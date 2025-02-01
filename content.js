console.log('Content script started'); // Log at the beginning

// Create container
const container = document.createElement("div");
container.id = "floating-button-container";
console.log('Container created'); // Log after container creation

// Create button
const button = document.createElement("button");
button.id = "floating-button";
button.textContent = ""; // Remove button text, use icon instead

// Create auto-open checkbox
const autoOpenCheckbox = document.createElement("input");
autoOpenCheckbox.type = "checkbox";
autoOpenCheckbox.id = "auto-open-checkbox";

// Load saved state from localStorage
autoOpenCheckbox.checked = localStorage.getItem('autoOpenEnabled') === 'true';

autoOpenCheckbox.addEventListener('change', () => {
    localStorage.setItem('autoOpenEnabled', autoOpenCheckbox.checked);
});

const label = document.createElement("label");
label.htmlFor = "auto-open-checkbox";
label.appendChild(document.createTextNode("Auto Open"));

// Create close button
const closeButton = document.createElement("button");
closeButton.id = "close-button";
closeButton.textContent = "X"; // Close icon

// Add hide/show functionality
closeButton.addEventListener('click', () => {
    container.style.display = 'none'; // Hide container
});

// Add drag functionality to container
let isDragging = false;
let initialX, initialY;

container.addEventListener("mousedown", (e) => { // Attach to container
    isDragging = true;
    initialX = e.clientX - container.offsetLeft;
    initialY = e.clientY - container.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        container.style.left = `${e.clientX - initialX}px`;
        container.style.top = `${e.clientY - initialY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// Create checkbox container
const checkboxContainer = document.createElement("div");
checkboxContainer.className = "checkbox-container";
checkboxContainer.appendChild(label);
checkboxContainer.appendChild(autoOpenCheckbox);

container.appendChild(closeButton);
container.appendChild(button);
container.appendChild(checkboxContainer);

// Append container to document.documentElement - using documentElement instead of body
document.documentElement.appendChild(container);
console.log('Container appended to documentElement');

// Append container to document.body after DOM is loaded - fallback, should not be needed now
document.addEventListener('DOMContentLoaded', () => {
    // Redundant append, but ensures it's added in DOMContentLoaded as well
    document.documentElement.appendChild(container);
    console.log('Container appended to DOMContentLoaded'); // Log inside DOMContentLoaded
});


button.onclick = function() {
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
};

console.log('Floating button appended to container'); // Debug log - this log is misleading, it should be after DOMContentLoaded

// Auto-open logic
function checkAndOpenJUP() {
    if (autoOpenCheckbox.checked) {
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
        }
    }
}

// Check on page load
checkAndOpenJUP();

// Optionally, you can set up a MutationObserver to detect URL changes and trigger checkAndOpenJUP
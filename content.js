console.log('Content script started'); // Log at the beginning

// Create container
const container = document.createElement("div");
container.id = "floating-button-container";
container.style.display = 'none'; // 初始隐藏
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

// 在文件顶部添加页面有效性检查函数
function checkPageValidity() {
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    return currentUrl.includes('/chart/') || // 假设K线页面包含/chart/路径
        currentUrl.includes('gmgn.ai/sol/token/') ||
        currentUrl.includes('www.dexx.ai/deal') ||
        currentUrl.includes('debot.ai/token/');
}

// 监听URL变化
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        handleUrlChange();
    }
}).observe(document, {subtree: true, childList: true});

// 添加popstate和hashchange监听
window.addEventListener('popstate', handleUrlChange);
window.addEventListener('hashchange', handleUrlChange);

function handleUrlChange() {
    const isValidPage = checkPageValidity();
    container.style.display = isValidPage ? 'block' : 'none';

    if (isValidPage) {
        // 更新按钮点击处理
        button.onclick = createButtonHandler();
        // 如果开启自动打开则执行
        if (autoOpenCheckbox.checked) {
            checkAndOpenJUP();
        }
    }
}

// 封装按钮处理函数
function createButtonHandler() {
    return function() {
        const tokenAddress = getCurrentTokenAddress();
        if (tokenAddress) {
            window.open(`https://jup.ag/swap/SOL-${tokenAddress}`, 'popup', 'width=400,height=600');
        } else {
            alert('Token address not found on this page.');
        }
    };
}

// 提取获取token地址的逻辑
function getCurrentTokenAddress() {
    const currentUrl = window.location.href;
    // 根据具体网站结构调整匹配规则
    if (currentUrl.includes('gmgn.ai/sol/token/')) {
        return currentUrl.split('/').pop();
    } else if (currentUrl.includes('www.dexx.ai/deal')) {
        return new URLSearchParams(window.location.search).get('token_ca');
    } else if (currentUrl.includes('debot.ai/token/')) {
        return currentUrl.split('/').pop();
    }
    return null;
}

// 修改原始按钮点击处理
button.onclick = createButtonHandler();

// 修改自动打开逻辑
function checkAndOpenJUP() {
    if (autoOpenCheckbox.checked && getCurrentTokenAddress()) {
        window.open(`https://jup.ag/swap/SOL-${getCurrentTokenAddress()}`, 'popup', 'width=400,height=600');
    }
}

// 初始页面检查
setTimeout(() => {
    container.style.display = checkPageValidity() ? 'block' : 'none';
}, 1000);

console.log('Floating button appended to container'); // Debug log - this log is misleading, it should be after DOMContentLoaded
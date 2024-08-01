let isDragging = false;
let startX, startY;
let selectionBox;
let shortcutKey = 'Z';  // 默认快捷键

// 读取用户设置的快捷键
chrome.storage.sync.get('shortcutKey', function(data) {
  if (data.shortcutKey) {
    shortcutKey = data.shortcutKey;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key.toUpperCase() === shortcutKey && !isDragging) {
    document.addEventListener('mousedown', startSelection);
    document.addEventListener('mousemove', updateSelection);
    document.addEventListener('mouseup', endSelection);
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key.toUpperCase() === shortcutKey) {
    document.removeEventListener('mousedown', startSelection);
    document.removeEventListener('mousemove', updateSelection);
    document.removeEventListener('mouseup', endSelection);
  }
});

function startSelection(event) {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;

  selectionBox = document.createElement('div');
  selectionBox.style.position = 'absolute';
  selectionBox.style.border = '2px dashed #000';
  selectionBox.style.background = 'rgba(0, 0, 0, 0.1)';
  selectionBox.style.pointerEvents = 'none';
  document.body.appendChild(selectionBox);

  updateSelection(event);

  // 禁用文本选择
  document.body.style.userSelect = 'none';
}

function updateSelection(event) {
  if (!isDragging) return;

  const currentX = event.clientX;
  const currentY = event.clientY;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(startX - currentX);
  const height = Math.abs(startY - currentY);

  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';
}

function endSelection(event) {
  isDragging = false;
  const links = document.querySelectorAll('a');
  const rect = selectionBox.getBoundingClientRect();

  links.forEach(link => {
    const linkRect = link.getBoundingClientRect();
    if (
      linkRect.left >= rect.left &&
      linkRect.right <= rect.right &&
      linkRect.top >= rect.top &&
      linkRect.bottom <= rect.bottom
    ) {
      chrome.runtime.sendMessage({ url: link.href });
    }
  });

  document.body.removeChild(selectionBox);
  selectionBox = null;

  // 重新启用文本选择
  document.body.style.userSelect = 'auto';
}
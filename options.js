document.addEventListener('DOMContentLoaded', function() {
  const shortcutKeyInput = document.getElementById('shortcutKey');
  const saveButton = document.getElementById('saveButton');

  // 加载保存的按键设置
  chrome.storage.sync.get('shortcutKey', function(data) {
    if (data.shortcutKey) {
      shortcutKeyInput.value = data.shortcutKey;
    }
  });

  saveButton.addEventListener('click', function() {
    const shortcutKey = shortcutKeyInput.value.trim().toUpperCase();
    if (shortcutKey.length === 1) {
      chrome.storage.sync.set({ shortcutKey: shortcutKey }, function() {
        alert('Shortcut key saved!');
      });
    } else {
      alert('Please enter a single key.');
    }
  });
});
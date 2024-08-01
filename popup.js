document.getElementById('limitUrlsCheckbox').addEventListener('change', function() {
  document.getElementById('urlCount').disabled = !this.checked;
});

document.getElementById('openUrlsButton').addEventListener('click', function() {
  const urlInput = document.getElementById('urlInput').value;
  const limitUrls = document.getElementById('limitUrlsCheckbox').checked;
  const urlCount = parseInt(document.getElementById('urlCount').value) || 0;
  const urls = urlInput.split('\n').filter(url => url.trim() !== '');

  let urlsToOpen;
  if (limitUrls) {
    urlsToOpen = urls.slice(0, urlCount);
  } else {
    urlsToOpen = urls;
  }

  urlsToOpen.forEach(url => {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'http://' + url;
    chrome.tabs.create({ url: formattedUrl });
  });
});
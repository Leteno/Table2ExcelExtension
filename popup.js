document.getElementById('normalMode').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extract", mode: "normal" }, (response) => {
      console.log("Response from content script:", response);
    });
  });
});
document.getElementById('stockMode').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extract", mode: "stock" }, (response) => {
      console.log("Response from content script:", response);
    });
  });
});

document.getElementById('icon').src = chrome.runtime.getURL('images/icon.png');

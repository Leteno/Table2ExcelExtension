document.getElementById('clickMe').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Hello world!");
    chrome.tabs.sendMessage(tabs[0].id, { action: "startGame" }, (response) => {
      console.log("Response from content script:", response);
    });
  });
});

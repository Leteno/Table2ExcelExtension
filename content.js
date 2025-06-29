console.log("Content script loaded");

function stupidGame() {
  console.log("Stupic game started");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startGame") {
    console.log("Starting stupid game");
    stupidGame();
    sendResponse({ status: "Game started" });
  } else {
    sendResponse({ status: "Unknown action" });
  }
});
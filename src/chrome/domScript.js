var config = require('./config.js');

console.log('CONFIG', config);

var currentTabId;

//Chrome methods

//Show Extension button if on correct page
function checkForValidUrl(tabId, changeInfo, tab) {
  currentTabId = tabId;
  if (tab.url.indexOf('https://dashboard.appboy.com') !== -1) {
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
  //Not working currently
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Inject App onto page
chrome.pageAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript({
    file: "inject.bundle.js"
  });
  // chrome.pageAction.hide(currentTabId);
})











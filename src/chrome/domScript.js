var config = require('./config.js');
//For webpack compile
// require('./inject.js');

console.log('CONFIG', config);
var backgroundPage = chrome.extension.getBackgroundPage();
// window.open(backgroundPage);
// backgroundPage.console.log(config)



//Chrome methods

//Show Extension button if on correct page
function checkForValidUrl(tabId, changeInfo, tab) {
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











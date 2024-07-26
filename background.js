chrome.tabs.onCreated.addListener((tab) => {
    // Check if the newly created tab is a new tab page
    console.log("Digital Notice Board")
    var newURL = "index.html";
    console.log(tab.url)
    if (tab.url === '') {
      chrome.tabs.update(tab.id, { url: chrome.runtime.getURL(newURL) });
    }
});
const BASE_URL = "www.twitch.tv/";
const followedStreamers = [];

async function getActiveTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tab = chrome.tabs.query(queryOptions);
  return tab;
}

async function checkCurrentPage() {
  const activeTab = await getActiveTab();
  console.log("active tab:", activeTab[0].url);
}

// content script injection

// chrome.webNavigation.onCommitted.addListener((details) => {
//   if (details.transitionType === "reload") {
//     console.log("reloading:", details.transitionType);
//   }
// });

// chrome.webNavigation.onCompleted.addListener((details) => {
//   console.log("details:", details.url);
// });

// fire if The tab's URL has changed.
chrome.tabs.onUpdated.addListener((tabId, tab, changeInfo) => {
  if (
    tab.url &&
    tab.url.includes(BASE_URL)
    // Voir pour les autres langues
  ) {
    // console.log("changeInfo:", changeInfo);
    checkCurrentPage();
    chrome.tabs.sendMessage(tabId, {
      pageType: "twitch",
      url: tab.url,
    });
  }
});

const toPromise = (callback) => {
  const promise = new Promise((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

// MARK: sendset
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.streamersDataArray.length > 0) {
    console.log("message:", message.streamersDataArray);
    chrome.storage.sync
      .set({ streamersData: message.streamersDataArray })
      .then(() => {
        if (chrome.runtime.lastError) console.log("Error setting");
      });
  } else {
    console.log("empty");
  }
});

// Persister les changements (nouvel état de la liste "acces rapide")

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   console.log("bg4 storage.onChanged");
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });

// async function getTabsQuery() {
//   const tabs = await chrome.tabs.query({});
//   console.log(tabs);
// }
// getTabsQuery();

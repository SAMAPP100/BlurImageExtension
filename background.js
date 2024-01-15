chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "tMask",
    title: "Toggle mask",
    type: "normal",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(async (data, tab) => {
  if (data.menuItemId == "tMask") {
    const response = await chrome.tabs.sendMessage(tab.id, "toggleMask");
    console.log(response);
  }
});

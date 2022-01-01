chrome.runtime.onInstalled.addListener(() => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }

  chrome.createActionIcon(false);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.changeActionIcon != null) {
    chrome.createActionIcon(request.changeActionIcon);
    sendResponse();
  }
});

chrome.createActionIcon = function createActionIcon(isLocked) {
  const canvas = new OffscreenCanvas(30, 30);
  const context = canvas.getContext("2d");
  context.font = "30px Arial";
  context.fillText(isLocked ? "🔐" : "🔓", 0, 25);
  const imageData = context.getImageData(0, 0, 30, 30);
  chrome.action.setIcon({ imageData: imageData });
};

chrome.action.onClicked.addListener((tab) => {
  try {
    const { hostname } = new URL(tab.url);

    chrome.storage.sync.get(hostname, ({ [hostname]: isLocked }) => {
      if (!!!isLocked) {
        chrome.storage.sync.set({ [hostname]: true });

        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { lockAction: "lock" },
              function (response) {}
            );
          }
        );

        chrome.createActionIcon(true);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

chrome.tabs.onActivated.addListener(async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  try {
    const { hostname } = new URL(tab.url);

    chrome.storage.sync.get(hostname, ({ [hostname]: isLocked }) => {
      chrome.createActionIcon(!!isLocked);

      chrome.tabs.sendMessage(
        tab.id,
        { lockAction: !!isLocked ? "lock" : "unlock" },
        function (response) {}
      );
    });
  } catch (error) {
    console.log(error);
  }
});

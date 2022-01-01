function lockWebPage() {
  if (document.getElementById("webpage-locker-div") != null) {
    return;
  }

  const lockDiv = document.createElement("div");
  lockDiv.id = "webpage-locker-div";
  lockDiv.style.zIndex = "9999";
  lockDiv.innerHTML = `
  <div style="display:flex; flex-direction:column; align-items:center;" >
  <p>需要解锁以查看</p>
  <input id="password" autocomplete="off" />
  </div>
  `;
  lockDiv.style.zIndex = "9999";
  lockDiv.style.position = "fixed";
  lockDiv.style.width = "100%";
  lockDiv.style.height = "100%";
  lockDiv.style.background = "white";
  lockDiv.style.color = "black";
  lockDiv.style.display = "flex";
  lockDiv.style.alignItems = "center";
  lockDiv.style.justifyContent = "center";
  document.documentElement.insertBefore(
    lockDiv,
    document.documentElement.firstChild
  );

  const passwordInput = document.getElementById("password");

  passwordInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      chrome.storage.sync.get("password", ({ password }) => {
        if (passwordInput.value !== password) {
          return;
        }

        unlockWebPage();

        const { hostname } = new URL(document.URL);

        chrome.storage.sync.remove(hostname);

        chrome.runtime.sendMessage(
          { changeActionIcon: false },
          function (response) {}
        );
      });
    }
  });
}

function unlockWebPage() {
  const lockDiv = document.getElementById("webpage-locker-div");
  if (lockDiv != null) {
    lockDiv.parentNode.removeChild(lockDiv);
  }
}

try {
  const { hostname } = new URL(document.URL);

  chrome.storage.sync.get(hostname, ({ [hostname]: isLocked }) => {
    if (!!isLocked) {
      lockWebPage();

      chrome.runtime.sendMessage(
        { changeActionIcon: true },
        function (response) {}
      );
    }
  });
} catch (error) {
  console.log(error);
}

chrome.runtime.onMessage.addListener(function test11111(
  request,
  sender,
  sendResponse
) {
  if (request.lockAction != null) {
    if (request.lockAction == "lock") {
      lockWebPage();
    } else {
      unlockWebPage();
    }
    sendResponse();
  }
});

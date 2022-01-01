const title = document.getElementById("title");
const old = document.getElementById("old");
const new1 = document.getElementById("new");

function render() {
  document.removeEventListener("keyup", null);
  chrome.storage.sync.get("password", ({ password }) => {
    if (password != null) {
      title.innerHTML = "修改密码";
      old.style.display = "inline";

      document.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();

          if (old.value.length === 0 || new1.value.length === 0) {
            return;
          }

          if (password !== old.value) {
            return;
          }

          chrome.storage.sync.set({ password: new1.value });

          old.value = "";
          new1.value = "";

          render();
        }
      });
    } else {
      title.innerHTML = "创建密码";
      old.style.display = "none";

      document.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();

          if (new1.value.length === 0) {
            return;
          }

          chrome.storage.sync.set({ password: new1.value });

          old.value = "";

          render();
        }
      });
    }
  });
}

render();

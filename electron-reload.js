// electron-reload.js
const path = require("path");
const fs = require("fs");
const log = require("electron-log");

module.exports = function setupReloading(mainWindow) {
  const libPath = path.resolve(
    __dirname,
    "../visualization-component/dist/khiops-webcomponent/"
  );

  if (!fs.existsSync(libPath)) {
    console.error(`The library path does not exist: ${libPath}`);
    return;
  }
  log.info("-------------------electron-reload-------------------");

  fs.watch(libPath, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      console.log(`Change detected in: ${filename}`);

      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          console.log("Reloading the window...");
          mainWindow.webContents.reloadIgnoringCache();
        }
      }, 300);
    }
  });
};

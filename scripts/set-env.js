const fs = require("fs");

const envFilePath = "./src/environments/environment.prod.ts";
let envFileContent = fs.readFileSync(envFilePath, "utf8");
const trackerId = process.env.TRACKER_ID;

// insert trackerId to the env file
let index = envFileContent.indexOf("{");
let res =
  envFileContent.slice(0, index + 1) +
  `  TRACKER_ID: "${trackerId}",` +
  envFileContent.slice(index + 1);
fs.writeFileSync(envFilePath, res);

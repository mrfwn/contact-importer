const path = require("path");
require("dotenv").config();

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
  require("ts-node").register();
  require(path.resolve(__dirname, "upload-file-worker.ts"));
} else {
  require(path.resolve(__dirname, "upload-file-worker.js"));
}

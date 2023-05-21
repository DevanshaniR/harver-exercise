const dotenv = require("dotenv");
let log4js = require("log4js");
const express = require("express");
const mergeImage = require("./src/mergeImage.js");

const app = express();

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }));

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

log4js.configure({
  appenders: {
    console: { type: "console" },
    cat_card_service: {
      type: "file",
      filename: "logs/cat_card_service",
    },
  },
  categories: {
    default: {
      appenders: ["cat_card_service", "console"],
      level: "debug",
    },
  },
});

app.get("/health", function (req, res) {
  res.status(200).contentType("application/json").send({
    environment: process.env.NODE_ENV,
    currentTimestamp: Date.now(),
    message: "Application is up and running",
  });
});

app.post("/imageMerge", function (req, res) {
  mergeImage.mergeImages();
  res.status(200).contentType("application/json").send({
    message: "Image merge successfully",
  });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("cat card service is started ", host, port);
});

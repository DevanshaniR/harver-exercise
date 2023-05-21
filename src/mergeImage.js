const { writeFile } = require("fs");
const { join } = require("path");
const request = require("request");
const mergeImg = require("merge-img");
const argv = require("minimist")(process.argv.slice(2));
log4js = require("log4js");

let log = log4js.getLogger("cat_card_service");

const mergeImages = async () => {
  const {
    greeting = "Hello",
    who = "You",
    width = 400,
    height = 500,
    color = "Pink",
    size = 100,
  } = argv;

  let firstReq = {
    url:
      process.env.CAT_SERVICE_URL +
      greeting +
      "?width=" +
      width +
      "&height=" +
      height +
      "&color" +
      color +
      "&s=" +
      size,
    encoding: "binary",
  };

  let secondReq = {
    url:
      process.env.CAT_SERVICE_URL +
      who +
      "?width=" +
      width +
      "&height=" +
      height +
      "&color" +
      color +
      "&s=" +
      size,
    encoding: "binary",
  };

  request.get(firstReq, (err, res, firstBody) => {
    if (err) {
      log.error("[ERROR] error in the first request ::", err);
      return;
    }
    log.info("[INFO] Received response with status::", res.statusCode);

    request.get(secondReq, (err, res, secondBody) => {
      if (err) {
        log.error("[ERROR] error in the second request ::", err);
        return;
      }

      log.info("[INFO] Received response with status::", res.statusCode);

      mergeImg([
        { src: Buffer.from(firstBody, "binary"), x: 0, y: 0 },
        { src: Buffer.from(secondBody, "binary"), x: width, y: 0 },
      ]).then((img) => {
        img.getBuffer("image/jpeg", (err, buffer) => {
          if (err) {
            log.error("[ERROR] Error in image merge::", err);
          }

          const fileOut = join(process.cwd(), `/cat-card.jpg`);

          writeFile(fileOut, buffer, "binary", (err) => {
            if (err) {
              log.error("[ERROR] Error in file write::", err);
              return;
            }

            log.info("[INFO] file saved successfully");
          });
        });
      });
    });
  });
};

module.exports.mergeImages = mergeImages;

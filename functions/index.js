const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const apiRouter = express.Router();
const app = express();

apiRouter.post("/", function (req, res) {
  let responseBody;

  responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "안녕하세요 삐리빗",
          },
        },
      ],
    },
  };
  res.status(200).send(responseBody);
});

app.use(apiRouter);

exports.middleWare = functions.https.onRequest(app);

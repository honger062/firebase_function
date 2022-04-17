const functions = require("firebase-functions");

const express = require("express");
const admin = require("firebase-admin");
admin.initializeApp();
const apiRouter = express.Router();
const app = express();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest(function(request, response) {
//     response.send("Hello from Firebase!");
// });

// const express = require("express");
// const cors = require("cors")({ origin: true });
// const app = express();

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

// exports.apiRouter = apiRouter.apiRouter;

const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest(function(request, response) {
//     response.send("Hello from Firebase!");
// });

const express = require("express");
const cors = require("cors")({ origin: true });
const app = express();

app.use(cors);

app.post("/message", function (request, response) {
  responseMessage = {
    message: {
      simpleText: "안녕",
    },
  };
});

exports.test1 = functions.https.onRequest(app);

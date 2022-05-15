const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();
const cors = require('cors');

const serVice = require('./router/service');

app.use(cors());
app.use(express.json());

app.use('/', serVice);

exports.middleWare0509 = functions.https.onRequest(app);

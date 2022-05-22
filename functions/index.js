const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();
const cors = require("cors");

const serVice = require("./router/service");
const courseQuick = require("./router/course/course_quick");
const courseService = require("./router/course/course_service");
const classRoom = require("./router/class_room");

app.use(cors());
app.use(express.json());

app.use("/serVice", serVice);
app.use("/course", courseQuick);
app.use("/course/course_service", courseService);
app.use("/classRoom", classRoom);

exports.middleWare0509 = functions.https.onRequest(app);

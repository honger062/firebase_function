const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();
const cors = require("cors");

const serVice = require("./router/notice/notice_service");
const courseQuick = require("./router/course/course_quick");
const courseService = require("./router/course/course_service");
const classRoom = require("./router/class_room");
const professorService = require("./router/professor_service");
const mealQuick = require("./router/meal/meal_quick");
const mealService = require("./router/meal/meal_service");
const noticeQuick = require("./router/notice/notice_quick");
const noticeService = require("./router/notice/notice_service");

const professor = require("./crawling/professor");
const meal = require("./crawling/meal");
const job = require("./crawling/job");
const notice = require("./crawling/notice");

app.use(cors());
app.use(express.json());

app.use("/serVice", serVice);
app.use("/course", courseQuick);
app.use("/course/course_service", courseService);
app.use("/classRoom", classRoom);
app.use("/professor", professorService);
app.use("/mealQuick", mealQuick);
app.use("/mealService", mealService);
app.use("/noticeQuick", noticeQuick);
app.use("/noticeService", noticeService);

exports.middleWare0509 = functions.https.onRequest(app);

exports.professor = professor.professor;
exports.meal = meal.meal;
exports.job = job.job;
exports.notice = notice.notice;

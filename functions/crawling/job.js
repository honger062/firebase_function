const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

exports.job = functions.https.onRequest((req, res) => {
  axios
    .get("https://www.sungkyul.ac.kr/sungkyulice/4168/subview.do")
    .then((html) => {
      const tableCrawling = new Object();

      const $ = cheerio.load(html.data);
      /*게시물의 이름, 날짜, 주소를 각각 추출 및 오브젝트 변수에 저장*/
      for (let index = 1; index <= 5; index++) {
        tableCrawling[index] = {
          title: $(
            `#menu4168_obj77 > div._fnctWrap > form:nth-child(2) > div > table > tbody > tr:nth-child(${index}) > td.td-subject > a > strong`
          )
            .text()
            .trim(),
          date: $(
            "#menu4168_obj77 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t" +
              "r:nth-child(" +
              index +
              ") > td.td-date"
          )
            .text()
            .trim(),
          url: $(
            "#menu4168_obj77 > div._fnctWrap > form:nth-child(2) > div > table > tbody > t" +
              "r:nth-child(" +
              index +
              ") > td.td-subject > a"
          )
            .attr("href")
            .replace(/^/, "https://www.sungkyul.ac.kr"),
        };
      }
      //console.log(tableCrawling);
      return tableCrawling;
    })
    .then(async (result) => {
      //console.log(result);
      await admin
        .database()
        .ref("job/") //반환된 변수를 DB에 저장
        .set(result);
      console.log("job DB input Success");
      res.sendStatus(201); //성공 코드 전송
    })
    .catch((err) => {
      console.error("Error from job : ", err);
      res.sendStatus(err.response.status); //에러 코드 전송
    });
});

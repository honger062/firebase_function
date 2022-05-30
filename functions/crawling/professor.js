const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

exports.professor = functions.https // 크롤링 함수 이름
  .onRequest((req, res) => {
    axios
      .get("https://www.sungkyul.ac.kr/sungkyulice/4163/subview.do") // 교수진 소개 페이지 주소
      .then(async (html) => {
        const tableCrawling = new Object();
        // eslint-disable-next-line id-length
        const $ = cheerio.load(html.data);
        const tableLength = $(
          "#menu4163_obj69 > div.profile._fnctWrap > form > ul > li"
        ).length;
        for (let index = 1; index <= tableLength; index++) {
          tableCrawling[index] = {
            img: $(
              "#menu4163_obj69 > div.profile._fnctWrap > form > ul > li:nth-child(" +
                index +
                ") > div.thumb > div > img"
            )
              .attr("src")
              .replace(/^/, "https://www.sungkyul.ac.kr"),
            name: $(
              "#menu4163_obj69 > div.profile._fnctWrap > form > ul > li:nth-child(" +
                index +
                ") > div.info > dl:nth-child(1) > dd                            "
            )
              .text()
              .trim(),
            info:
              $(
                "#menu4163_obj69 > div.profile._fnctWrap > form > ul > li:nth-child(" +
                  index +
                  ") > div.info > dl:nth-child(4)"
              )
                .text()
                .replace(/\s/g, "")
                .split("호")
                .join("호: ") +
              $(
                "#menu4163_obj69 > div.profile._fnctWrap > form > ul > li:nth-child(" +
                  index +
                  ") > div.info > dl:nth-child(5)"
              )
                .text()
                .replace(/\s/g, "")
                .split("실")
                .join("실: ")
                .replace(/^/, "\n"),
          };
        }
        // console.log(tableCrawling);
        await admin.database().ref("professor/").set(tableCrawling); // 오브젝트 변수를 DB에 저장
        console.log("professor DB input Success");
        // res.status(201).send(tableCrawling);
        res.sendStatus(201); // 성공 코드 전송
      })
      .catch((err) => {
        console.error("Error from professor : ", err);
        res.sendStatus(err.response.status); // 에러 코드 전송
      });
  });

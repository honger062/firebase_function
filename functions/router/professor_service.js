const admin = require("firebase-admin");
// const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

router.post("/", async function (req, res) {
  const userRequest = req.body.userRequest.utterance;
  console.log(req.body.userRequest.user.id);
  const userFriend = req.body.userRequest.user.properties.isFriend; // 사용자 카카오 채널 정보

  let responseBody;

  let titleResult, dateResult, urlResult;
  let image; // 이미지 링크 저장
  let info, name; // 교수진 소개 정보와 이름 저장
  let items = []; //게시판 별 value 저장

  if (userFriend == true) {
    switch (userRequest) {
      case "교수진소개": {
        image = new Array();
        info = new Array();
        name = new Array();
        /* 교수진 소개 관련 DB 쿼리문 처리*/
        await admin
          .database()
          .ref("professor")
          .once("value")
          .then((snapshot) => {
            snapshot.forEach((value) => {
              image.push(value.val().img);
              info.push(value.val().info);
              name.push(value.val().name);
            });
          });
        // console.log(image, info, name);
        let data = [];
        image.forEach((value, index) => {
          data.push({
            title: name[index],
            description: info[index],
            thumbnail: {
              imageUrl: value,
              fixedRatio: true,
            },
            buttons: [
              {
                action: "webLink",
                label: "상세보기",
                webLinkUrl:
                  "https://www.sungkyul.ac.kr/sungkyulice/4163/subview.do",
              },
            ],
          });
          if (data.length === 10 || index === info.length - 1) {
            items.push({
              carousel: {
                type: "basicCard",
                items: data,
              },
            });
            data = [];
          }
        });
        // console.log(items);
        responseBody = {
          version: "2.0",
          template: {
            outputs: items,
          },
        };
        break;
      }

      default:
        break;

        res.status(200).send(responseBody);
    }
  } else {
    responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "🤖채널을 추가해야 이용이 가능합니다. 삐리빗", // 텍스트 뷰 블록으로 출력
            },
          },
        ],
      },
    };
  }

  async function getData(params) {
    //게시판 DB 검색 쿼리문 처리 함수
    let title = new Array();
    let date = new Array();
    let url = new Array();

    for (let index = 1; index <= 5; index++) {
      await admin
        .database()
        .ref(params)
        .child(index)
        .once("value")
        .then((snapshot) => {
          title.push(snapshot.val().title);
          date.push(snapshot.val().date);
          url.push(snapshot.val().url);
        })
        .catch((err) => {
          console.error("Error from public_service getData :", err);
        });
    }
    return [title, date, url];
  }

  async function getImg(params, index) {
    // 이미지 DB 검색 쿼리문 처리 함수
    let imageData;

    if (index === undefined) {
      imageData = await admin
        .database()
        .ref(params)
        .child("imgUrl")
        .once("value")
        .then((snapshot) => {
          return snapshot.val();
        })
        .catch((err) => {
          console.error("Error from public_service getImg :", err);
        });
    } else {
      imageData = await admin
        .database()
        .ref(params)
        .child(`imgUrl/${index}`)
        .once("value")
        .then((snapshot) => {
          return snapshot.val();
        })
        .catch((err) => {
          console.error("Error from public_service getImg :", err);
        });
    }
    return imageData;
  }
  res.status(201).send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;

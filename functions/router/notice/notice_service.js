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

  let items = []; //게시판 별 value 저장

  const quickReplies = [
    {
      // 바로가기 작성
      messageText: "뒤로",
      action: "block",
      blockId: "62a3541afa834474ed73ff08",
      label: "↩ 뒤로",
    },
  ];

  if (userFriend == true) {
    switch (userRequest) {
      case "학과공지사항":
        [titleResult, dateResult, urlResult] = await getData("notice"); //DB로부터 해당 게시물의 데이터 get

        titleResult.forEach((value, index) => {
          items.push({
            title: value,
            description: dateResult[index],
            link: {
              web: urlResult[index],
            },
          });
        });
        console.log(titleResult, dateResult, urlResult);
        responseBody = {
          version: "2.0",
          template: {
            outputs: [
              {
                listCard: {
                  //리스트 카드 뷰 블록으로 출력
                  header: {
                    title: "학과공지사항",
                  },
                  items: items,
                  buttons: [
                    {
                      label: "학과공지사항 페이지",
                      action: "webLink",
                      webLinkUrl:
                        "https://www.sungkyul.ac.kr/sungkyulice/4167/subview.do",
                    },
                  ],
                },
              },
            ],
            quickReplies: quickReplies,
          },
        };
        break;

      case "취업공지사항":
        [titleResult, dateResult, urlResult] = await getData("job"); //DB로부터 해당 게시물의 데이터 get

        titleResult.forEach((value, index) => {
          items.push({
            title: value,
            description: dateResult[index],
            link: {
              web: urlResult[index],
            },
          });
        });
        console.log(titleResult, dateResult, urlResult);
        responseBody = {
          version: "2.0",
          template: {
            outputs: [
              {
                listCard: {
                  //리스트 카드 뷰 블록으로 출력
                  header: {
                    title: "취업공지사항",
                  },
                  items: items,
                  buttons: [
                    {
                      label: "취업공지사항 페이지",
                      action: "webLink",
                      webLinkUrl:
                        "https://www.sungkyul.ac.kr/sungkyulice/4168/subview.do",
                    },
                  ],
                },
              },
            ],
            quickReplies: quickReplies,
          },
        };
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

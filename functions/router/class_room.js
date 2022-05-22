const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const userRequest = req.body.userRequest.utterance; // 사용자 요청문
  const userFriend = req.body.userRequest.user.properties.isFriend; // 사용자 카카오 채널 정보

  let responseBody;

  if (userFriend == true) {
    switch (userRequest) {
      case "강의실시간표":
        responseBody = {
          version: "2.0",
          template: {
            outputs: [
              {
                simpleImage: {
                  // 이미지 뷰 블록으로 출력
                  imageUrl:
                    "https://www.sungkyul.ac.kr/sites/sungkyulice/images/temp_1643003744801100.png",
                  altText: "강의실시간표",
                },
              },
            ],
          },
        };
        break;
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
  res.status(201).send(responseBody);
});

module.exports = router;

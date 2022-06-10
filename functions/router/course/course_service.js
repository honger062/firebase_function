const express = require("express");
const router = express.Router();
const functions = require("firebase-functions");

router.post("/", async (req, res) => {
  const userRequest = req.body.userRequest.utterance; // 사용자 요청문
  let responseBody;
  const quickReplies = [
    {
      // 바로가기 작성
      messageText: "뒤로",
      action: "block",
      blockId: "6280ba9b16b99e0c33818293",
      label: "↩ 뒤로",
    },
  ];

  switch (userRequest) {
    case "2019":
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleImage: {
                // 이미지 뷰 블록으로 출력
                imageUrl:
                  "https://www.sungkyul.ac.kr/sites/sungkyulice/images/temp_1643259050773100.png",
                altText: "2019",
              },
            },
          ],
          quickReplies: quickReplies,
        },
      };
      break;

    case "2020":
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleImage: {
                // 이미지 뷰 블록으로 출력
                imageUrl:
                  "https://www.sungkyul.ac.kr/sites/sungkyulice/images/temp_1643261837852100.png",
                altText: "2020",
              },
            },
          ],
          quickReplies: quickReplies,
        },
      };
      break;

    case "2021":
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleImage: {
                imageUrl:
                  "https://www.sungkyul.ac.kr/sites/sungkyulice/images/temp_1643263788279100.png",
                altText: "2021",
              },
            },
          ],
          quickReplies: quickReplies,
        },
      };
      break;

    case "2022":
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleImage: {
                imageUrl:
                  "https://www.sungkyul.ac.kr/sites/sungkyulice/images/temp_1643261864438100.png",
                altText: "2022",
              },
            },
          ],
          quickReplies: quickReplies,
        },
      };
      break;

    default:
      break;
  }
  res.status(201).send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;

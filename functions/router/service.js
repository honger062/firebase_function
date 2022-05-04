const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");

router.post("/", async function(req, res) {
  // console.log(req.body.userRequest.user.id);
  const userRequest = req.body.userRequest.utterance; //사용자 요청문
  let responseBody;

  switch (userRequest){
    
    case "테스트" :
    responseBody = {
      "version": "2.0",
      "template": {
        "outputs": [
          {
            "listCard": {
              "header": {
                "title": "챗봇 관리자센터를 소개합니다.",
              },
              "items": [
                {
                  "title": "챗봇 관리자센터",
                  "description": "새로운 AI의 내일과 일상의 변화",
                  "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                  "link": {
                    "web": "https://namu.wiki/w/%EB%9D%BC%EC%9D%B4%EC%96%B8(%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88)",
                  },
                },
                {
                  "title": "챗봇 관리자센터",
                  "description": "카카오톡 채널 챗봇 만들기",
                  "imageUrl": "http://k.kakaocdn.net/dn/N4Epz/btqqHCfF5II/a3kMRckYml1NLPEo7nqTmK/1x1.jpg",
                  "link": {
                    "web": "https://namu.wiki/w/%EB%AC%B4%EC%A7%80(%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88)",
                  },
                },
                {
                  "title": "Kakao i Voice Service",
                  "description": "보이스봇 / KVS 제휴 신청하기",
                  "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
                  "link": {
                    "web": "https://namu.wiki/w/%EC%96%B4%ED%94%BC%EC%B9%98",
                  },
                },
              ],
              "buttons": [
                {
                  "label": "구경가기",
                  "action": "webLink",
                  "webLinkUrl": "https://namu.wiki/w/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88",
                },
              ],
            },
          },
        ],
      },
    };
    res
    .status(201)
    .send(responseBody); //응답 상태 코드와 내용 전송
    }
  });

// eslint-disable-next-line linebreak-style
module.exports = router;

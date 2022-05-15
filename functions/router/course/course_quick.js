const express = require('express');
const router = express.Router();
const functions = require('firebase-functions');

router.post('/', async function (req, res) {
    let responseBody;
    /* 바로가기 관련 요청문과 버튼명 배열 생성*/
    const quickReplies = [];
    const messageText = ["2019", "2020", "2021", "2022"];
    const label = ["2019", "2020", "2021", "2022"];

        /* 바로가기 작성*/
        label.forEach((value, index) => {
            quickReplies.push({
                "messageText": messageText[index],
                "action": "block",
                "blockId": "6280cfa316b99e0c33818341",
                "label": value
            });
        });
        responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: { // 텍스트 뷰 블록으로 출력
                            text: ' 열람할 학번을 선택해주세요'
                        }
                    }
                ],
                quickReplies: quickReplies // 바로가기 출력
            }
        };
    
    res
        .status(201)
        .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;
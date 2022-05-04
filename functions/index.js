const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const router = express.Router();
const app = express();

router.post("/",async function (req, res) {
    
    const userRequest = req.body.userRequest.utterance;
    console.log(req.body.userRequest.user.id);
    let responseBody;

    let titleResult,
        dateResult,
        urlResult;

    let items = []; //게시판 별 value 저장

    switch (userRequest) {
        case "학과공지사항" :

            [titleResult, dateResult, urlResult] = await getData('notice'); //DB로부터 해당 게시물의 데이터 get

            titleResult.forEach((value, index) => {
                items.push({
                    "title": value,
                    "description": dateResult[index],
                    "link": {
                        "web": urlResult[index]
                    }
                });
            });

            responseBody = {
                "version": "2.0",
                "template": {
                    outputs: [
                        {
                            listCard: { //리스트 카드 뷰 블록으로 출력
                                "header": {
                                    "title": "학과공지사항"
                                },
                                "items": items,
                                "buttons": [
                                    { //해당 페이지 바로이동 관련 하단 버튼 생성
                                        "label": "학과공지사항 페이지",
                                        "action": "webLink",
                                        "webLinkUrl": "https://www.sungkyul.ac.kr/sungkyulice/4167/subview.do"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        res.status(200).send(responseBody);
        
    }

    async function getData(params) { //게시판 DB 검색 쿼리문 처리 함수
        let title = new Array();
        let date = new Array();
        let url = new Array();

        for (let index = 1; index <= 5; index++) {
            await admin
                .database()
                .ref(params)
                .child(index)
                .once('value')
                .then(snapshot => {
                    title.push(snapshot.val().title);
                    date.push(snapshot.val().date);
                    url.push(snapshot.val().url);
                })
                .catch(err => {
                    console.error('Error from public_service getData :', err);
                });
        }
        return [title, date, url];
    }

});

app.use(router);

exports.middleWare = functions.https.onRequest(app);
const admin = require('firebase-admin');
// const functions = require('firebase-functions');
const express = require('express');
const router = express.Router();

router.post("/",async function (req, res) {
    
  const userRequest = req.body.userRequest.utterance;
  console.log(req.body.userRequest.user.id);
  let responseBody;

  let titleResult,
      dateResult,
      urlResult;
  let image; // 이미지 링크 저장

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
          console.log(titleResult, dateResult, urlResult);
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
                                  { 
                                      "label": "학과공지사항 페이지",
                                      "action": "webLink",
                                      "webLinkUrl": "https://www.sungkyul.ac.kr/sungkyulice/4167/subview.do"
                                  }
                              ]
                          }
                      }
                  ]
              }
          };
          break;
          
          case "이수체계":
              {
                  image = await getImg('completionSystem');
                  // console.log(image);
                  const imgTitle = ['올해 이수체계도', '올해 설계-이수체계도'];
                  /* 응답 횟수만큼 이미지 블록 뷰를 생성*/
                  image.forEach((value, index) => {
                      items.push({
                          simpleImage: {
                              "imageUrl": value,
                              "altText": imgTitle[index]
                            }
                        });
                    });
                    // console.log(items);
                responseBody = {
                    version: "2.0",
                    template: {
                        /* 뷰 및 바로가기 출력*/
                        outputs: items,
                    }
                };
                break;
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

async function getImg(params, index) { // 이미지 DB 검색 쿼리문 처리 함수
    let imageData;
    
    if (index === undefined) {
        imageData = await admin
            .database()
            .ref(params)
            .child('imgUrl')
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch(err => {
                console.error('Error from public_service getImg :', err);
            });
    } else {
        imageData = await admin
            .database()
            .ref(params)
            .child(`imgUrl/${index}`)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch(err => {
                console.error('Error from public_service getImg :', err);
            });
    }
    return imageData;
}
  res
  .status(201)
  .send(responseBody); // 응답 상태 코드와 내용 전송
});

module.exports = router;
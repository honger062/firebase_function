const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');

const option = {
    timeoutSeconds: 60,
    memory: '512MB'
}; // puppteer를 쓰기 위한 HTTP functions 옵션 값 set

exports.completionSystem = functions // 크롤링 함수 이름
    .runWith(option)
    .https
    .onRequest(async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                // headless: false
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Firebase cli 환경에서 돌아가기 위한 조건 설정
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(
                'https://www.sungkyul.ac.kr/sungkyulice/4172/subview.do',
                {waitUntil: "domcontentloaded"}
            ); // 이수체계도 주소로 이동
            await page.waitForSelector('#_contentBuilder');
            const images = await page.evaluate(
                // eslint-disable-next-line id-length
                () => Array.from(document.images, e => e.src)
            ); // 해당 dom 구간의 이미지 태그 값 전체 추출
            console.log(images);

            const imgUrl = [images];
            
            
            console.log(imgUrl);
            await browser.close();

            await admin
                .database()
                .ref('courseGraph/')
                .set({imgUrl}); // 배열 처리된 이미지 주소를 DB에 저장
            console.log('Crawling and courseGraph DB input Success');
            res.status(202).send(imgUrl);
            res.sendStatus(201); // 성공 코드 전송
        } catch (err) {
            console.error('Error from courseGraph : ', err);
            res.sendStatus(err.response.status); // 에러 코드 전송
        }
    });
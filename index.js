import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';


async function fetchDeckName(deckCode) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        `https://decklog.bushiroad.com/view/${deckCode}`,
        {
            waitUntil: 'networkidle0',
        }
    );
    await page.waitForSelector('body');
    const body = await page.$eval("body", (e) => e.outerHTML);
    await browser.close();

    const dom = new JSDOM(body);
    const document = dom.window.document;
    const container = document.querySelector('#wrap > div > div');
    const deckName = container.querySelector('div > h2');
    const deckType = document.querySelector('#viewpage > div.preview-top-label > div.row.deck-preview-top-info > p.col-lg-6.col-12.preview-top-label-right > span');
    console.log(`デッキコード「${deckCode}」のタイトルは「${deckType}」です。`);
    const nameHtml = deckName.innerHTML;
    const TypeHtml = deckType.innerHTML;
    console.log(`デッキコード「${deckCode}」のタイトルは「${TypeHtml}」です。`);
    const deckrow = document.querySelector('#viewpage > div.deckview > div > div');

    //CXだけ取得したいときはワイドカードを選択
//    const card_items = deckrow.getElementsByClassName("card-container card-view wide-card");
    const card_items = deckrow.getElementsByClassName("card-container card-view");
    for (const card_item of card_items) {
       // console.log(card_item.innerHTML);
      const card_image = card_item.querySelector('img');
      const card_num = card_item.querySelector(' div > div > div > span.num')
      const card_numHtml =card_num.innerHTML;
        console.log(card_image.alt);
        console.log(card_numHtml);
    }
    // デッキ名「？？？」のデッキ -> ？？？
    const prefixLength = 5;
    const suffixLength = 5;
    return nameHtml
        .substring(prefixLength)
        .substring(0, nameHtml.length - (prefixLength + suffixLength));
};



const deckCode = '6YPH';
//const deckCode = '57P2';
const deckName = await fetchDeckName(deckCode);


console.log(`デッキコード「${deckCode}」のデッキ名は「${deckName}」です。`);

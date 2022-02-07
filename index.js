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
    console.log(`デッキコード「${deckCode}」のデッキ名は「${deckType}」です。`);
    const nameHtml = deckName.innerHTML;
    const TypeHtml = deckType.innerHTML;
    console.log(`デッキコード「${deckCode}」のデッキ名は「${TypeHtml}」です。`);
    // デッキ名「？？？」のデッキ -> ？？？
    const prefixLength = 5;
    const suffixLength = 5;
    return nameHtml
        .substring(prefixLength)
        .substring(0, nameHtml.length - (prefixLength + suffixLength));
};

const deckCode = '6YPH';
const deckName = await fetchDeckName(deckCode);


console.log(`デッキコード「${deckCode}」のデッキ名は「${deckName}」です。`);

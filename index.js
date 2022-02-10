import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as csv from 'csv';

//デックコードをcsvから取得
/*async function read_csv(){
    const fs = require('fs');
    const csv = require('csv');
}*/
async function main() {
    const deckCodes = [
        '6YPH',
        '57P2'
    ];
    let id = 1;

    write_header_csv();

    for (const deckCode of deckCodes) {
        const deck_info = await fetchDeckInfo(deckCode, id);
        write_csv(deck_info);
        id++;
    }
}
//デックコード＋カード名：枚数を出力
async function write_header_csv(){
    let data = [
        'id',
        'Code',
        'CX_card_name1', "num_of_CX_card1",
        'CX_card_name2', "num_of_CX_card2",
        'CX_card_name3', "num_of_CX_card3",
        'CX_card_name4', "num_of_CX_card4",
        'CX_card_name5', "num_of_CX_card5",
        'CX_card_name6', "num_of_CX_card6",
        'CX_card_name7', "num_of_CX_card7",
        'CX_card_name8', "num_of_CX_card8"
    ];
    data.join(",");
    //fs.writeFileSync('output.csv',JSON.stringify(data));
    
    //ufeffつけないとエクセルが文字化けするBOMとかの関係らしい
    fs.writeFileSync('output.csv', '\ufeff'+data.join(","),);
    fs.appendFileSync('output.csv','\r\n');
}
async function write_csv(deck_info) {
    let csv_data = [
        deck_info.id,
        deck_info.Code,
    ];

    for (let card_item of deck_info.cards) {
        csv_data.push(card_item.card_name);
        csv_data.push(card_item.card_num);
    }
    fs.appendFileSync('output.csv', '\ufeff'+csv_data.join(","));
    fs.appendFileSync('output.csv','\r\n');

}


//１枚のカードに対して解析
//入力１枚のカード　出力はカード情報の配列
function card_item_parse(card_item) {
    const card_image = card_item.querySelector('img');//画像取得
    const card_num = card_item.querySelector(' div > div > div > span.num')//カード枚数取得
    const card_numHtml = card_num.innerHTML;//カード枚数（文字）
    const card_info_array =
    {
        card_name: card_image.alt,
        card_num: card_numHtml
    }

    //配列にid,カード名,枚数を入力

    return card_info_array;
}
async function fetchDeckInfo(deckCode, id) {
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
    const nameHtml = deckName.innerHTML;
    const TypeHtml = deckType.innerHTML;
    console.log(`デッキコード「${deckCode}」のタイトルは「${TypeHtml}」です。`);
    const deckrow = document.querySelector('#viewpage > div.deckview > div > div');

    //CXだけ取得したいときはワイドカードを選択
    const card_items = deckrow.getElementsByClassName("card-container card-view wide-card");
    //デッキのCX＋枚数
    let cards_list_array = [];
    for (const card_item of card_items) {
        const card_info = card_item_parse(card_item);
        cards_list_array.push(card_info);
    }
    let deck_info = {
        id: id,
        Code: deckCode,
        cards: cards_list_array
    }
    console.log(deck_info);
    // デッキ名「？？？」のデッキ -> ？？？
    const prefixLength = 5;
    const suffixLength = 5;
    return deck_info;
}
/*
const deckCodes = [
    '6YPH',
    '57P2'
];
let id = 1;
for(const deckCode of deckCodes){

    //const deckCode = '6YPH';
    //const deckCode = '57P2';
    const deckName = await fetchDeckName(deckCode,id);
    id++;
}
*/

main();
//console.log(`デッキコード「${deckCode}」のデッキ名は「${deckName}」です。`);

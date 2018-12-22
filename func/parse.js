
let { Post } = require('../DB/Schema');
let request = require('request');
let asy = require('async');
let textrank = require('textrank-node');
let summarizer = new textrank();
let random_string = require('randomstring');

const puppeteer = require('puppeteer');


function parse(){
    let BASE_URL = 'https://news.naver.com/';
    let options = {
        url : BASE_URL
    }

    request(options , async function (err ,response , body){
        let data = body.split('<div class="newsnow_tx_inner">');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        for(let i = 1; i<data.length; i ++){
            let url = data[i].split('</div>')[0].split('href="')[1].split('"')[0].replace(/\amp;/g,'');

            if(url.indexOf('hotissue') == -1){
        
                await page.goto(url);
                
                const title = await page.evaluate(() => document.querySelector('#articleTitle').textContent)
                const content = await page.evaluate(() => document.querySelector('#articleBodyContents').textContent.replace('// flash 오류를 우회하기 위한 함수 추가','').replace('function _flash_removeCallback() {}','').replace('동영상 뉴스',''));
                const category = await page.evaluate(() => document.querySelector('.on').children[0].children[0].textContent)

                let rank_content;

                if(content.split('.')[0].indexOf(' = ') != -1){
                    rank_content = content.split('.')[0].substring(content.split('.')[0].indexOf(' = ')+3,content.split('.')[0].length)
                }
                else if(content.split('.')[0].indexOf('[앵커]') != -1){
                    rank_content = content.split('.')[0].replace('[앵커]','');
                }
                else if(content.split('.')[0].indexOf('[뉴스데스크]') != -1){
                    rank_content = content.split('.')[0].replace('[뉴스데스크]','');
                }
                else{
                    rank_content = content.split('.')[0]
                }
                rank_content = rank_content.replace(/\<앵커>/g,' ').replace(/\◀ 앵커 ▶/g,' ').replace(/\n/g,'').replace(/a\t/g,'').replace(/\\/g,'');
                let content_result = rank_content + content.split('.')[1] + content.split('.')[2]
          
                const img = await page.evaluate(() => document  .querySelector('meta[name="twitter:image"]').content);


                let getSaveBool = await save(title,category,content_result,img);
                console.log(getSaveBool)
                if(getSaveBool == true){
                    console.log(i + ' : Save Success');
                }
                else{
                    console.log(i + ' : Save Fail');
                }
            }
        }
        await browser.close();
    });
}

function save(title , category , content , img){
    Post.find({title:title , category:category , content:content , img:img},(err,model)=>{
        if(err) throw err;
        if(model.length == 0){
            let savePost = new Post({
                post_token:random_string.generate(),
                title:title,
                img:img,
                content:content,
                category:category
            });

            savePost.save((err,model)=>{
                if(err) throw err;
                return true;
            });
        }
        else{
            return false;
        }
    });
}

// async function getData(url){
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);
    
//     // Get the "viewport" of the page, as reported by the page.
//     const title = await page.evaluate(() => document.querySelector('#articleTitle').textContent)
//         console.log(title);
//     await browser.close();
// }

// function sibal(){
//     let BASE_URL = 'https://news.naver.com/';
//     let options = {
//         url : BASE_URL
//     }
//     request(options,(err,response,body)=>{
//         if(err) throw err;
   
//         let data = body.split('<div class="newsnow_tx_inner">');
//         let count = 1;
//         console.log(data.length)
//         asy.whilst(
//             function(){
//                 return count < data.length;
//             },
//             function(cb){
//                 let url = data[count].split('</div>')[0].split('href="')[1].split('"')[0].replace(/\amp;/g,'');
//                 console.log(url.indexOf('hotissue'));
                
//                 if(url.indexOf('hotissue') != -1){
//                     count++; 
//                     cb(null);  
//                 }
//                 else{
            
//                     const browser = await puppeteer.launch();
//                     const page = await browser.newPage();
//                     await page.goto(url);
                    
//                     // Get the "viewport" of the page, as reported by the page.
//                     const title = await page.evaluate(() => document.querySelector('#articleTitle').textContent)
//                         console.log(title);
//                     await browser.close();
//                 }
//             },
//             function (err){
//                 if(err) throw err;
//                 else console.log('done')
//             }
//         )
//     });
// }

parse();


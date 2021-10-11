// node CricinfoProject.js --excel=worldcup.csv --datafolder=data --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results
//npm install minimist 
//npm install axios 
//npm install jsdom 
//npm install excel4node
//npm install pdf-lib 

let minimist = require('minimist');
let excel = require('excel4node');
let jsdom = require('jsdom');
let axios = require('axios');
let pdf = require('pdf-lib');
let args = minimist(process.argv);
console.log(args.excel)
let responseKaPromise = axios.get(args.source);
responseKaPromise.then((response) => {
    let html = response.data;
    let match =[]
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;
    let arr= document.querySelectorAll("div.match-score-block");
    for (let i = 0; i < arr.length; i++) {
        let obj ={}
        let ps = arr[i].querySelectorAll("p.name");
        obj.t1=ps[0].textContent;
        obj.t2=ps[1].textContent;
        let sname = arr[i].querySelectorAll("span.score");
        obj.score1=""
        obj.score2=""
        if(sname.length==2){
            obj.score1=sname[0].textContent;
            obj.score2 =sname[1].textContent;
        }
        else if(sname.length==1)
        {
            obj.score1=sname[0].textContent;
        }
        else{

        }
        let res = arr[i].querySelectorAll("div.status-text");
        obj.result=res[0].textContent;
        match.push(obj)
    }
    //  console.log(match);
    let wb = new excel.Workbook();

    for(let i = 0; i < match.length; i++){
    let sheet = wb.addWorksheet(match[i].t1 +" vs "+ match[i].t2);
        sheet.cell(1,1).string("Score1")
        sheet.cell(1,2).string("Score2")
        sheet.cell(2,1).string(match[i].score1);
        sheet.cell(2,2).string(match[i].score2);
        sheet.cell(1,3).string("result");
        sheet.cell(2,3).string(match[i].result)

    }
    wb.write(args.excel);
}).catch((err) => {console.log(err)});
"use strict";
var request = require('request');
const baseUrl="http://www.mosigra.ru";
let linkQueue = [];
linkQueue.push(baseUrl);
const mailPattern = '[a-zA-Z0-9]+(?:[._+%-]+[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]?)+[.][a-zA-Z]{2,}';
let urlPattern = 'href="(?:<siteURL>)?(?:\\.\\.)*(?:\\/?[a-zA-Z0-9%-])+\\??(?:[a-zA-Z0-9]+\\=[a-zA-Z0-9_%-]+[;&]?)*(?:\\.html|\\.htm|\\/)?"';
// let urlPattern = 'href="(?:<siteURL>)?(?:\.\.)*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])"';
let tempUrl = baseUrl.replace("/", "\\/");
tempUrl = tempUrl.replace(".", "\\.");
tempUrl = tempUrl.replace("-", "\\-");
urlPattern = urlPattern.replace("<siteURL>", tempUrl);

const mailRegExp = new RegExp(mailPattern,'g');
const urlRegExp = new RegExp(urlPattern,'g');
let checkedLinks = [];
let mails = [];
function find(){
  if ((checkedLinks.length < 50) && (linkQueue.length>0)){
    let link = linkQueue.pop();
    if(checkedLinks.indexOf(link)>-1){
      find();
      return;
    }
    checkedLinks.push(link);
    request(link, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const result = body;
        let matchUrl = [];
        let matchMail = [];
        let url;
        while(url = urlRegExp.exec(result)){
          matchUrl.push(url['0']);
        }
        let mail;
        while(mail = mailRegExp.exec(result)){
          matchMail.push(mail['0']);
        }
        if(matchUrl!=null){
          matchUrl.forEach(function (url, i, arr){
            let processableUrl = url.substring(0, url.length - 1);
            processableUrl = processableUrl.replace('href=\"', "")
            let refinedUrl = processableUrl;
            if (processableUrl[0] == "."){
                processableUrl = processableUrl.replace('\.\.\/', "");
                refinedUrl = link + processableUrl;
            }
            else if (processableUrl[0] == "/"){
            refinedUrl = baseUrl + processableUrl;
            }
            else if (processableUrl.startsWith("http://") == false){
                refinedUrl = baseUrl + "/" + processableUrl;
            }
            if (linkQueue.indexOf(refinedUrl)==-1){
                linkQueue.push(refinedUrl);
            }
          });
        }
          if(matchMail!=null){
            matchMail.forEach(function (mail, i, arr){
              if(mails.indexOf(mail)==-1){
                mails.push(mail);
              }
            });
          }

        console.log(linkQueue.length);
        find();
    }
    else{
      console.log(error+" "+response.statusCode);
    }
  });
  }
  else {
    console.log("Checked " + checkedLinks.length + " links");
  	console.log("With " + mails.length + " mails:");
  	mails.forEach(function (mail, i, arr){
  		console.log(mail);
  	});
  	console.log("Done");;
  }
}
find();
// }
// });

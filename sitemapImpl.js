var Crawler = require("./lib/crawlingImpl");
var url = require('url');
var _=require('underscore')
var es=require("./estest");
var fs=require('fs')
var query;

 
var ee;
var qhasDrained=false
var c;
function processQuery($,query){
    console.log('processing')
    var tmpObj= {};
    tmpObj.url=query.url
    try{
   _(query.map).map(function(item,key){ 
       tmpObj[key]=arrExtractor($,item)
   })
    }
    catch(err){
        console.log(err)
    }
   return tmpObj
}
function arrExtractor($,obj){
var property=obj.extract,
    selector=obj.selector;
    opArrr=[];
    $(selector).each(function(i){
        opArrr.push(extractData($,this,obj))
    })
    if(opArrr.length>1)
        return opArrr
    else
        return opArrr[0]
}
function extractData($,ele,obj){
    var property=obj.extract,
        selector=obj.selector;
if (property === 'text') {
    return $(ele).text().replace(/(\r\n|\n|\r|\t)/gm, "").trim();
  }
  else if (property === 'html' || property === 'innerHTML') {
    return $(ele).html();
  }
  else {
    return $(ele).attr(property);
  }
}
exports.startCrawling=function(linksArr,objquery,objee){
    ee=objee;
    query=objquery
c = new Crawler({
    maxConnections : 10,
    userAgent:'request',
    onDrain:function(){
    qhasDrained=true
    },
    callback : function (error, result, $) {
        if(error){
            console.log(error)
          
        }
        else{
            query.url=result.uri;
             var processedData= processQuery($,query)
             es.client.create({index: 'fl-index-final-1',
                  type: 'test',
                body:processedData},function(){
                 console.log('inserted')
                 if(qhasDrained){
                 ee.emit('someEvent')
                 qhasDrained=false;
                 }
                })
        }
    }
});
c.queue(linksArr); 
   
}
exports.killInstance=function(){
delete c;
}
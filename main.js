var utili=require('./utility')
var esUtil=require('./esUtil')
var mongoutil=require("./mongoUtil");
var fs=require("fs");
var async=require("async");
var cawlConfig=require('./scripts/pepperfry.json')
//var mongoToMysql=require('./mongoToMysql');
//initialize mongo util for only 1 model
var objmongoutil = new mongoutil('localhost','sos',cawlConfig.sitemap.model);

//After inserting crawled data in to mongo db call this function.
//	mongoToMysql.startConvert(cawlConfig);

var preProcessor=function(callback){
    objmongoutil.getLastCrawlDate().then(function(date){
       var lastDate= new Date(date)
       var oldCollectionName=objmongoutil.objDataModel.collection.name;
        var newCollectionName=oldCollectionName+"_"+lastDate.getDate()+"_"+lastDate.getMonth()
    objmongoutil.renameCollection(oldCollectionName,newCollectionName)    
        console.log(newCollectionName)
        callback()
    },function(error){
        console.log(error)
        callback()
    })   
}

async.series(preProcessor,start(cawlConfig.sitemap),function(err){
    if(!err)
        console.log('completed successfuly')
    else
        console.log('something went wrong')
})


//start(cawlConfig.sitemap);
var i=0;
function start(sitemap){	
	utili.getLinks(sitemap.siteMapUrl,sitemap.level)	
	.then(function(linkArr){
		console.log(linkArr.length+" urls on first level.")
		objmongoutil.insertSiteMapUrls(linkArr)			
		if(sitemap.level < sitemap.levels){			
			async.eachSeries(linkArr,
				function(link,callback){										 					
					utili.getLinks(link.loc,2).
					then(function(links){
					console.log(links.length," records found");				
						objmongoutil.insertActualUrls(links)
						.then(function(){
						callback();
						}).fail(function(){
						callback();
						})		
					});				 
				},
				function(){				
					console.log("Level 2 completed");
				}
			);
		} 
	});
}


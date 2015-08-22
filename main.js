var utili=require('./utility')
var esUtil=require('./esUtil')
var mongoutil=require("./mongoUtil");
var fs=require("fs");
var async=require("async");
var cawlConfig=require('./scripts/caratlane.json')

//initialize mongo util for only 1 model
var objmongoutil = new mongoutil('localhost','sos',cawlConfig.sitemap.model);

start(cawlConfig.sitemap);
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
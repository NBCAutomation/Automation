var links = [];
var quotes = [];
var tempUrl = [];
var infos = [];

var maxLinks = 10;
var firstUrl = 'http://www.imdb.com/search/title?at=0&num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_infoss';

var newUrl;
var x = require('casper').selectXPath;
var fs = require('fs');
var utils = require('utils');
 
var casper = require('casper').create({
  verbose: true,
  logLevel: 'error',
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
  }
});
 
//Fonctions------------------------
 
function getLinks() {
    var links = document.querySelectorAll('.results td.image a');
    return Array.prototype.map.call(links, function(e) {
    	var href = e.getAttribute('href');
    	var url = 'http://www.imdb.com'+href+'quotes/';
        return url;
    });
}
 
function Quote(innerText) {
    this.innerText = innerText;
};

casper.renderJSON = function(what) {
    return this.echo(JSON.stringify(what, null, '  '));
};

casper.saveJSON = function(what) {
    fs.write('json/quotes.json', JSON.stringify(what, null, '  '), 'w');
};

//Crawl------------------------
 
casper.start(firstUrl);
 
	casper.then(function() {
	    links = this.evaluate(getLinks);
        var j = 0;
	    this.eachThen(links,function(response){
          j++;
          if(j >= maxLinks) return;

          this.thenOpen(response.data, function writeOnJson() {

            var objectsCount = this.evaluate(function(){
              return __utils__.findAll('.list .quote p').length;
            });

            var objects = this.evaluate(function(){
              return __utils__.findAll('.list .quote p');
            });

            quotes = new Array();
            if(objectsCount != undefined) {
              for(i = 0; i < objectsCount; i++) {
                if(objects[i] != null) {
                  var quote = new Quote(objects[i]['innerText']);
                  quotes.push(quote);
                }  
              }
            } 
          });
		});
        
  });
 
casper.run(function() {
    this.saveJSON(quotes);
    this.echo('links :' + links.length)
    this.renderJSON(links).exit();
});
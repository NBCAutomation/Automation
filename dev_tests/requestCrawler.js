// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: 
// Use: casperjs [file_name] --url="[site_url]"

var colorizer = require('colorizer').create('Colorizer');
var casper = require('casper').create({
  verbose: true,
  logLevel: 'error'
  // pageSettings: {
  //   loadImages: true,
  //   loadPlugins: true,
  //   userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:22.0) Gecko/20100101 Firefox/22.0'
  // },
  // viewportSize: {
  //   width: 1366,
  //   height: 768
  // }
});

var headers = {
  method: 'get',
  headers: {
    'Accept-Language': 'en-US,en;q=0.8',
    'HEADER-XYZ': 'HEADER-XYZ-DATA'
  }
};

var siteUrl = casper.cli.get("url");

var echoCurrentPage = function() {
  this.echo(colorizer.colorize("[Current Page]", "INFO") + this.getTitle() + " : " + this.getCurrentUrl());  
};

casper.on('resource.requested', function(request) {
  this.echo(colorizer.colorize("SENDING REQUEST #" + request.id + " TO " + request.siteUrl, "PARAMETER"));
  this.echo(JSON.stringify(request, null, 4));
});

/*
casper.on('resource.received', function(resource) {
  this.echo(JSON.stringify(resource, null, 4));
});
*/

casper.start();

casper.open(siteUrl, headers).then(function(response) {
  echoCurrentPage.call(this);
  this.debugPage();
});

casper.thenOpen(siteUrl).then(function(response) {
  echoCurrentPage.call(this);
  this.debugPage();
});

casper.run();


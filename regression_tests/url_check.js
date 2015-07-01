// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Spider the current requested url and check all links.
// Use: casperjs [file_name] --url="[site_url]"
// Optional; To export to file --xunit="[filename.xml]"


// Variables
var siteUrl = casper.cli.get("url");
var visitedUrls = [], pendingUrls = [];
var fs = require("fs");

// Create instances
// var casper = require('casper').create({ /*verbose: true, logLevel: 'debug'*/ });
var utils = require('utils')
var helpers = require('helper')
var didFirstPass = false;

// Spider from the given URL
function spider(url) {

	// Add the URL to the visited stack
	visitedUrls.push(url);

	// Open the URL
	// casper.open(url).then(function() {
	casper.open(url, { method: didFirstPass ? 'head' : 'get' }).then(function() {

		// Set the status style based on server status code
		var status = this.status().currentHTTPStatus;

		switch(status) {
			case 200: var statusStyle = { fg: 'green', bold: true }; break;
			case 400: var statusStyle = { fg: 'red', bold: true }; break;
			case 403: var statusStyle = { fg: 'red', bold: true }; break;
			case 404: var statusStyle = { fg: 'red', bold: true }; break;
			case 500: var statusStyle = { fg: 'red', bold: true }; break;
			case 503: var statusStyle = { fg: 'red', bold: true }; break;
			 default: var statusStyle = { fg: 'magenta', bold: true }; break;
		}

		// Display the spidered URL and status
		if ( !status || status != 200 ) {
			this.echo(this.colorizer.format(status, statusStyle) + ' ' + url);
		}

		// Find links present on this page
		var links = this.evaluate(function() {
			var links = [];
			Array.prototype.forEach.call(__utils__.findAll('a'), function(e) {
				if ( e.getAttribute('href') != 'javascript' ) {
					links.push(e.getAttribute('href'));
				};
			});
			return links;
		});

		// Add newly found URLs to the stack
		var baseUrl = this.getGlobal('location').origin;

		Array.prototype.forEach.call(links, function(link) {
			
			var newUrl = helpers.absoluteUri(baseUrl, link);

			if ( pendingUrls.indexOf(newUrl) == -1 && visitedUrls.indexOf(newUrl) == -1) {
				// casper.echo(casper.colorizer.format('-> Pushed ' + newUrl + ' onto the stack', { fg: 'magenta' }));
				pendingUrls.push(newUrl);
			}
		});

		!didFirstPass && (didFirstPass = true);

		// If there are URLs to be processed
		if ( pendingUrls.length > 0 ) {
			var nextUrl = pendingUrls.shift();
			// this.echo(this.colorizer.format('<- Popped ' + nextUrl + ' from the stack', { fg: 'blue' }));
			spider(nextUrl);
		}

	});

}

// Start spidering
casper.start(siteUrl, function() {
	spider(siteUrl);
});

// Start the run
casper.run();
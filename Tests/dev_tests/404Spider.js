// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 1.1
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

var siteURL = casper.cli.get('url');
var crawlMethod = casper.cli.get('method');
var siteManifest = [
	"http://www.nbcnewyork.com",
	"http://www.nbclosangeles.com",
	"http://www.nbcchicago.com",
	"http://www.nbcbayarea.com",
	"http://www.nbcdfw.com",
	"http://www.nbcmiami.com",
	"http://www.nbcphiladelphia.com",
	"http://www.nbcconnecticut.com",
	"http://www.nbcwashington.com",
	"http://www.nbcsandiego.com",
	"http://www.necn.com",
	"http://www.telemundo40.com",
	"http://www.telemundo47.com",
	"http://www.telemundo51.com",
	"http://www.telemundo52.com",
	"http://www.telemundo62.com",
	"http://www.telemundoareadelabahia.com",
	"http://www.telemundoarizona.com",
	"http://www.telemundoboston.com",
	"http://www.telemundochicago.com",
	"http://www.telemundodallas.com",
	"http://www.telemundodenver.com",
	"http://www.telemundohouston.com",
	"http://www.telemundolasvegas.com",
	"http://www.telemundosanantonio.com",
	"http://www.telemundopr.com"
];

if (crawlMethod == 'all') {
	console.log(crawlMethod);
	console.log(siteManifest.length);
	for (var i = siteManifest.length - 1; i >= 0; i--) {
		console.log(siteManifest[i]);
	};
};

var SpiderSuite = function(url) {
	if (!url) {
		throw new Error('A URL is required!');
	}

	this._baseUrl = url.replace(/\/$/, '');
	this._finished = [];
	this._collected = [];

	var suite = this;
	var destinations = [];
	var __utils__ = require('clientutils').create();

	var parser = document.createElement('a');
	parser.href = url;

	newUrl = parser.href;
	var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
	var urlUri = sourceString.replace('.','_');

	var fs = require('fs');
	var logName = urlUri + '_' + new Date().getTime() + '.csv';
	var save = fs.pathJoin(fs.workingDirectory, 'test_results', logName);

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	
	if (minutes < 10){
	    minutes = "0" + minutes;
	}

	if(hours > 11){
	    var toD = "PM";
	} else {
	    var toD = "AM";
	}


	casper.start(url).then(function() {

		if (this.currentHTTPStatus != 200) {
			throw new Error('Failed to open the provided url.');
			this.exit();
		}
	  	
		// Write file headers
		var testInfo = 'Site tested: ' + url;
		var testTime = month + '/' + day + '/' + year + ' - ' +hours + ':' + minutes + ' ' + toD;

		fs.write(save, ' ' + testInfo + ' - ' + testTime + ',\n');
		fs.write(save, 'Source page,HTTP Status,Link,URL', 'a+');

		// Skip erreanous site requests
		casper.echo( '[Step] Skipping erreanous requests...', 'PARAMETER' );
		casper.options.onResourceRequested = function(casper, requestData, request) {

			// If the outgoing request doesn't equal [site_url], end and skip the request
			if (requestData.url.indexOf( sourceString ) == -1 ) {
				request.abort();
				// Uncomment to see skipped outgoing requests
				// console.log( 'skipping --  ' + requestData.url );
			}
		}

		// Grab all links from the current navigation and add into an array of collected urls
		casper.echo( '[Step] Collecting the navigation links...', 'PARAMETER' );
		suite.evaluateAndPushUrls(this, '#nav a', destinations);
		destinations = destinations.slice(2);

	}).then(function() {

		// Grab collected urls and build links array
		casper.echo( '[Step] Collecting in page links based on navigation sections...', 'PARAMETER' );
		suite.collectFromDestinations(destinations);

	}).then(function() {

		// Attampt to load each colelcted url and test HTTP responses
		casper.echo( '[Step] Testing each collected url for testing...', 'PARAMETER' );
		var linkTally = false;
		suite.checkHealth();

	}).then(function() {

		// Dump results
		casper.echo( '[Testing Complete] Links with potential issues.', 'GREEN_BAR' );

		suite._finished.forEach(function(res) {
			if (res.status != 200) {

				if (res.linkName != null) {
					var currentLink = res.linkName;
				} else {
					var currentLink = "[Possible image link]";
				}

				console.log(res.from + ' - ' + res.status + ' // ' + currentLink + ' ~> ' + res.url);

				//Write text log
				fs.write(save, ',\n' + res.from + ',' + res.status + ',' + currentLink + ',' + res.url, 'a+');
			};
		});

	}).run();
};


SpiderSuite.prototype.collectFromDestinations = function(destinations) {
	if (!this._destinations) {
		// this._destinations = [].slice.call(destinations);
		this._destinations = destinations.slice();
	}

	var suite = this;
	var current = this._destinations.shift();

	if (current) {
		casper.open(current.url).then(function() {
			suite.evaluateAndPushUrls(this, 'a', suite._collected, current.url);
			suite.collectFromDestinations();
		});
	} else {
		delete this._destinations;
	}
};

SpiderSuite.prototype.evaluateAndPushUrls = function(page, selector, append, from) {
    var evaluatedUrls = page.evaluate(function(baseUrl, selector) {
        var socialRegex = /(twitter|facebook|instagram|javascript:|mailto:)/;
        var protocolRegex = /:\/\//;

        // Grab the current url data, href and link text
        return __utils__.findAll(selector).map(function(element) {
            return {
            	url: element.getAttribute('href'),
            	innerText: element.innerText
            };
        }).filter(function(elementObj) {
            return elementObj.url && !socialRegex.test(elementObj.url);
        }).map(function(elementObj) {
            if (!protocolRegex.test(elementObj.url)) {
                elementObj.url = baseUrl + ('/' + elementObj.url).replace(/\/{2,}/g, '/');
            }

            return elementObj;
        });
    }, this._baseUrl, selector);

    // Add the link information to our testing array
	evaluatedUrls.forEach(function(elementObj) {
		var url = elementObj.url;
		var innerText = elementObj.innerText;

		if (append.indexOf(url) === -1) {
			append.push({
				url: url,
				linkText: innerText,
				from: from
			});
		}
	});
};

SpiderSuite.prototype.checkHealth = function() {
	if (!this._tmp_collected) {
		
		// this._tmp_collected = [].slice.call(this._collected);
		this._tmp_collected = this._collected.slice();

		console.log('~~ ' + this._collected.length + ' links collected.....testing HTTP responses...');
		// console.log('.....testing HTTP responses...');
	}

	var suite = this;
	var current = this._tmp_collected.shift();

	if (current) {
		casper.open(current.url, {
			method: 'head'
		}).then(function(resp) {
			suite._finished.push({
				from: current.from,
				linkName: current.linkText,
				url: current.url,
				status: this.status().currentHTTPStatus
			});
			
			// Show current tested urls
			// console.log(current.url);

			suite.checkHealth();
		});
	} else {
		delete this._tmp_collected;
	}
};  

// new SpiderSuite(siteURL);
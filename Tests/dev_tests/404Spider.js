// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01 
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

var SpiderSuite = function(url) {
	if (!url) {
		throw new Error('A URL is required!');
	}

	this._baseUrl = url.replace(/\/$/, '');
	this._finished = [];
	this._collected = [];

	var suite = this;
	var destinations = [];

	var parser = document.createElement('a');
	parser.href = url;

	newUrl = parser.href;
	var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
	var urlUri = sourceString.replace('.','_');

	var fs = require('fs');
	var fname = urlUri + '_' + new Date().getTime() + '.csv';
	var save = fs.pathJoin(fs.workingDirectory, 'test_results', fname);


   // Write file headers
   fs.write(save, 'Source page,HTTP Status,Link');


	casper.start(url).then(function() {

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
		casper.echo( '[Step] Collecting in page links based on navigation links...', 'PARAMETER' );
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
				console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);

				//Testing file writing
				fs.write(save, ',\n' + res.from + ',' + res.status + ',' + res.url, 'a+');
			};
		});

	}).run();
};


SpiderSuite.prototype.collectFromDestinations = function(destinations) {
	if (!this._destinations) {
		this._destinations = [].slice.call(destinations);
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

		return __utils__.findAll(selector).map(function(element) {
			return element.getAttribute('href');
		}).filter(function(url) {
			return url && !socialRegex.test(url);
		}).map(function(url) {
			if (!protocolRegex.test(url)) {
				url = baseUrl + ('/' + url).replace(/\/{2,}/g, '/');
			}

			return url;
		});
	}, this._baseUrl, selector);

	evaluatedUrls.forEach(function(url) {
		if (append.indexOf(url) === -1) {
			append.push({
				url: url,
				from: from
			});
		}
	});
};

SpiderSuite.prototype.checkHealth = function() {
	if (!this._tmp_collected) {
		this._tmp_collected = [].slice.call(this._collected);
		console.log('~~ ' + this._collected.length + ' links collected.....testing HTTP responses...');
	}

	var suite = this;
	var current = this._tmp_collected.shift();

	if (current) {
		casper.open(current.url, {
			method: 'head'
		}).then(function(resp) {
			suite._finished.push({
				from: current.from,
				url: current.url,
				status: this.status().currentHTTPStatus
			});

			suite.checkHealth();
		});
	} else {
		delete this._tmp_collected;
	}
};


new SpiderSuite(casper.cli.get('url'));
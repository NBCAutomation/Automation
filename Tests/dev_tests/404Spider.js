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
	var __utils__ = require('clientutils').create();

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
		
		// this.evaluate(replaceXHR);

		// Dump results
		casper.echo( '[Testing Complete] Links with potential issues.', 'GREEN_BAR' );

		var gData, wsurl = "https://script.google.com/macros/s/AKfycbwqtmyzavd0CYttVUtnGBEDXDCSOMbnH-AF3RouVO8vyemnzI1d/exec";

		suite._finished.forEach(function(res) {
			if (res.status != 200) {
				console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);

				//Write text log
				fs.write(save, ',\n' + res.from + ',' + res.status + ',' + res.url, 'a+');

				//Write log to Google Sheets
				var	gData = 'Source page=' + res.from + '&HTTP Status=' + res.status + '&Link=' + res.url;

				// suite.logToGoogle(gData);
				// return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', gData, false));

				var dataUrl = wsurl + '/?' + gData;

				// suite.logToGoogle(dataUrl);
				casper.open('http://deltrieallen.com/gtesting-live.php', {
				    method: 'post',
				    data:   {
				        'Source page' : res.from,
				        'HTTP Status' : res.status,
				        'Link' : res.url
				    }
				});

				casper.then(function() {
				    // require('utils').dump(data);
				    console.log('here');
				    
				    casper.start('http://deltrieallen.com', function() {
				        data = this.evaluate(function(wsurl) {
				            return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', gData, false));
				        }, {wsurl: wsurl});
				    });
				});

				// casper.waitFor(getAwesomeResponse, function then(){
				//     var data = JSON.parse(getAwesomeResponse());
				//     // Do something with data
				//     console.log(data);
				// });
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
		// this._tmp_collected = [].slice.call(this._collected);
		this._tmp_collected = this._collected.slice();
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


SpiderSuite.prototype.logToGoogle = function(resultsData) {
	casper.start(resultsData).then(function(){
	    this.evaluate(function(){
	        var oldInsert = insert;
	        insert = function(json){
	            window.myAwesomeResponse = json;
	            oldInsert.apply(window, arguments);
	        };
	    });
	}).waitFor(getAwesomeResponse, function then(){
	    var data = JSON.parse(getAwesomeResponse());
	    // Do something with data
	}).run();
};

function replaceXHR(){
    (function(window, debug){
        function args(a){
            var s = "";
            for(var i = 0; i < a.length; i++) {
                s += "\t\n[" + i + "] => " + a[i];
            }
            return s;
        }
        var _XMLHttpRequest = window.XMLHttpRequest;

        window.XMLHttpRequest = function() {
            this.xhr = new _XMLHttpRequest();
        }

        // proxy ALL methods/properties
        var methods = [ 
            "open", 
            "abort", 
            "setRequestHeader", 
            "send", 
            "addEventListener", 
            "removeEventListener", 
            "getResponseHeader", 
            "getAllResponseHeaders", 
            "dispatchEvent", 
            "overrideMimeType"
        ];
        methods.forEach(function(method){
            window.XMLHttpRequest.prototype[method] = function() {
                if (debug) console.log("ARGUMENTS", method, args(arguments));
                if (method == "open") {
                    this._url = arguments[1];
                }
                return this.xhr[method].apply(this.xhr, arguments);
            }
        });

        // proxy change event handler
        Object.defineProperty(window.XMLHttpRequest.prototype, "onreadystatechange", {
            get: function(){
                // this will probably never called
                return this.xhr.onreadystatechange;
            },
            set: function(onreadystatechange){
                var that = this.xhr;
                var realThis = this;
                that.onreadystatechange = function(){
                    // request is fully loaded
                    if (that.readyState == 4) {
                        if (debug) console.log("RESPONSE RECEIVED:", typeof that.responseText == "string" ? that.responseText.length : "none");
                        // there is a response and filter execution based on url
                        if (that.responseText && realThis._url.indexOf("whatever") != -1) {
                            window.myAwesomeResponse = that.responseText;
                        }
                    }
                    onreadystatechange.call(that);
                };
            }
        });

        var otherscalars = [
            "onabort",
            "onerror",
            "onload",
            "onloadstart",
            "onloadend",
            "onprogress",
            "readyState",
            "responseText",
            "responseType",
            "responseXML",
            "status",
            "statusText",
            "upload",
            "withCredentials",
            "DONE",
            "UNSENT",
            "HEADERS_RECEIVED",
            "LOADING",
            "OPENED"
        ];
        otherscalars.forEach(function(scalar){
            Object.defineProperty(window.XMLHttpRequest.prototype, scalar, {
                get: function(){
                    return this.xhr[scalar];
                },
                set: function(obj){
                    this.xhr[scalar] = obj;
                }
            });
        });
    })(window, false);
}

function getAwesomeResponse(){
    return this.evaluate(function(){
        return window.innerText;
    });
}

new SpiderSuite(casper.cli.get('url'));
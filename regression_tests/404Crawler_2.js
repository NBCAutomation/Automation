// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Spider the current requested url and check all links.
// Use: casperjs [file_name] --url="[site_url]"

// Create instances
// var casper = require('casper').create({ /*verbose: true, logLevel: 'debug'*/ });
var siteUrl = casper.cli.get("url");
var crawlReq = casper.cli.get("element");
var printUrls = casper.cli.get("showlog");

var utils = require('utils')
var helpers = require('helper')
var didFirstPass = false;

var visitedUrls = [];
var pendingUrls = [];
var navLinks = [];
var links;

// Spider from the given URL
function spider(url, siteElement) {
	// require('utils').dump(url);
	
	// Show the current url
	if (printUrls) {
		casper.echo("- " + url);
	};

	// Add the URL to the visited stack
	visitedUrls.push(url);

	// Open the URL
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

		// Step note
		if ( !status || status != 200 ) {
			casper.echo( "Spidered URL and status" );
			casper.echo( this.colorizer.format(status, statusStyle) + ' ' + url );
		};

		// Find links present on this page
		if( siteElement == 'nav') {
			casper.echo( casper.colorizer.format('Grabbing main nav links for testing...', { fg: 'green' }) );
			var navLinks = this.evaluate(function() {
				var navLinks = [];
				Array.prototype.forEach.call(__utils__.findAll('#nav a'), function(e) {
					navLinks.push(e.getAttribute('href'));
				});
				return navLinks;
			});

			if ( navLinks ) {
				casper.echo( casper.colorizer.format('Removing social links and crawling pages...', { fg: 'green' }) );

				var socialLinks = new Array("twitter","facebook","instagram");
				require('utils').dump(navLinks);
				
				for ( var i = navLinks.length - 1; i >= 0; i-- ) {
					// casper.echo('[i: ' + i + '] navLinks[i] = ' + navLinks[i]);
					var failed = false;

					for( var i2 = 0; i2 < socialLinks.length; i2++ ) {
						if ( navLinks[i].indexOf(socialLinks[i2]) != -1 ) {
							failed = true;
							break;
						}
					}

					if (!failed) {
						if (!/^(f|ht)tps?:\/\//i.test(navLinks[i])) {
							navLinks[i] = url + navLinks[i];
							casper.echo("Crawling: " + i + " - " + navLinks[i]);
							// spider( siteUrl );
						}
					}
				};
			};
		} else if (typeof siteElement === 'undefined' || siteElement == 'default' || siteElement == 'all' ) {
			var links = this.evaluate(function() {
				var links = [];
				Array.prototype.forEach.call(__utils__.findAll('a'), function(e) {
					links.push(e.getAttribute('href'));
				});
				return links;
			});	
		}

		!didFirstPass && (didFirstPass = true);


		if (typeof siteElement === 'undefined' || siteElement == 'default' || siteElement == 'all' ) {

			// Add newly found URLs to the stack
			var baseUrl = this.getGlobal('location').origin;

			Array.prototype.forEach.call(links, function(link) {			
				
				var newUrl = helpers.absoluteUri(baseUrl, link);

				if ( pendingUrls.indexOf(newUrl) == -1 && visitedUrls.indexOf(newUrl) == -1 && pendingUrls.indexOf(newUrl) != "javascript" ) {
                    // casper.echo(casper.colorizer.format('-> Collected: ' + newUrl + ' onto the stack', { fg: 'magenta' }));
					pendingUrls.push(newUrl);
				}
			});

			// If there are URLs to be processed
			if ( pendingUrls.length > 0 ) {
				var nextUrl = pendingUrls.shift();
                // casper.echo(this.colorizer.format(pendingUrls.length + '. -- Testing: ' + nextUrl + ' from the stack', { fg: 'yellow' }));
				spider(nextUrl);
			}
		}

	});

}

// Start spidering
casper.test.begin('Link checker', function suite(test) {
    casper.start().then(function() {
    	casper.echo('Starting');
    	spider(siteUrl, crawlReq);

    }).run();
});
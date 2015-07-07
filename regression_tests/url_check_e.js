// --xunit="[filename.xml]"
// Set the start URL
// var siteUrl = 'http://www.nbcmiami.com';


// URL variables
var visitedUrls = [], pendingUrls = [];

// Create instances
// var casper = require('casper').create({ /*verbose: true, logLevel: 'debug'*/ });
var siteUrl = casper.cli.get("url");
var utils = require('utils')
var helpers = require('helper')

var checkMethod = casper.cli.get("method");
var didFirstPass = false;
var didSecondPass = false;

var fileName = "url_log.txt";


// Spider from the given URL
function spider(url, siteElement) {

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

		// Display the spidered URL and status
		this.echo(this.colorizer.format(status, statusStyle) + ' ' + url);

		if( siteElement == 'nav') {
			queryParam = '#nav a';
		} else if (typeof siteElement === 'undefined' || siteElement == 'default' || siteElement == 'all' ) {
			queryParam = 'a';
		}

		// require('utils').dump(queryParam);
		// Find links present on this page
		var links = this.evaluate(function() {
			var links = [];
			Array.prototype.forEach.call(__utils__.findAll('#nav a'), function(e) {
				links.push(e.getAttribute('href'));
			});
			return links;
		});

		// Add newly found URLs to the stack
		var baseUrl = this.getGlobal('location').origin;

		Array.prototype.forEach.call(links, function(link) {

			var newUrl = helpers.absoluteUri(baseUrl, link);

			if (pendingUrls.indexOf(newUrl) == -1 && visitedUrls.indexOf(newUrl) == -1) {
				casper.echo(casper.colorizer.format('-> Collected: ' + newUrl + ' onto the stack', { fg: 'magenta' }));
				pendingUrls.push(newUrl);
			}
		});

		!didFirstPass && (didFirstPass = true);

		// If there are URLs to be processed
		if (pendingUrls.length > 0) {
			var nextUrl = pendingUrls.shift();
			this.echo(this.colorizer.format(pendingUrls.length + '. -- Testing: ' + nextUrl + ' from the stack', { fg: 'yellow' }));
			spider(nextUrl);
		// }
		} else if (pendingUrls.length == 0) {
			didSecondPass = true;
			this.echo(this.colorizer.format(pendingUrls.length + '. Remaining: ' + nextUrl + ' from the stack', { fg: 'yellow' }));
		}


	});

}

casper.test.begin('URL error checks', function suite(test) {

    casper.start( siteUrl, function(response) {
        
        // require('utils').dump(response);

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        casper.then(function() {
            if ( no_error ) {
                spider(siteUrl, checkMethod);
            }
        });

        // casper.then(function() {
        //     if ( didSecondPass ) {
        //         this.echo('Step 2 - Nigga we made it!');
                
        //         // spider(siteUrl);

        //         // require('utils').dump(links);
        //     }
        // });

    }).run(function() {
        test.done();
    });
});

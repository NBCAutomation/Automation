// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Grab the tracking assets from the page, decode the url, and convert to a JSON object to be validated.
// Use: casperjs test [file_name] --url="[site_url]"

var siteUrl = casper.cli.get("url");

var colorizer = require('colorizer').create('Colorizer');
var headers = {
    method: 'get',
    headers: {
        'Accept-Language': 'en-US,en;q=0.8',
        'HEADER-XYZ': 'HEADER-XYZ-DATA'
    }
};

var resUrls = [];

var echoCurrentPage = function() {
  this.echo(colorizer.colorize("[Current Page]", "INFO") + this.getTitle() + " : " + this.getCurrentUrl());  
};

casper.test.begin('Tracking testing suite.', function suite(test) {

    casper.start( siteUrl, function(response) {
        
        // require('utils').dump(response);

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        if ( no_error ) {
            casper.on('resource.requested', function(request) {
                // Print out all of the current page requests
                // this.echo(colorizer.colorize("SENDING REQUEST #" + request.id + " TO " + request.url, "PARAMETER"));
                
                if ( request.url.indexOf('oimg.nbcuni.com') >= 1 ) {
                    // this.echo(colorizer.colorize("Pushing url into array: " + request.url));
                    resUrls.push( request.url );
                    this.echo("Omniture request url found...added to array");
                } else if ( request.url.indexOf('google-analytics.com') >= 1 ) {
                    resUrls.push( request.url );
                    this.echo("Google request url found...added to array");
                }
            });
            
            casper.thenOpen(siteUrl).then(function(response) {
                // echoCurrentPage.call(this);
                // this.debugPage();
                // require('utils').dump(response);
            });
        }

        casper.then(function() {
            //Grab the collect request urls, decode them, then convert to a JSON array
            if ( resUrls.length >= 1 ) {
                for (var i = resUrls.length - 1; i >= 0; i--) {
                    var decodedUrl = decodeURIComponent( resUrls[i] );
                    var urlObject = JSON.parse('{"' + resUrls[i].replace(/&/g, "\",\"").replace(/=/g,"\":\"") + '"}');
                    for(var key in urlObject) {
                        urlObject[key] = decodeURIComponent(urlObject[key]);
                    }
                    // this.echo( urlObject );
                    require('utils').dump(urlObject);
                };
            };
        });

    }).run(function() {
        test.done();
    });
});
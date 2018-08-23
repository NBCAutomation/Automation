// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Grab the tracking assets from the page, decode the url, and convert to a JSON object to be validated.
// Use: casperjs test [file_name] --url="[site_url]"

var siteUrl = casper.cli.get("url");
var printRequests = casper.cli.get("displayLog");

var colorizer = require('colorizer').create('Colorizer');
var resUrls = [];

var adobeKeys = new Array("c1","v1","c3","v3","c4","v4","v5","c6","v6","c8","v8","c9","v9","c10","v10","c11","c12","v12","c13","v13","c14","c15","v15","c16","v16","c17","v17","c23","v23","c49","v49","c52","c53","v53","c54","v54","c55","v55","c74","v74","c75","v75");
// var adobeKeys = new Array("batman","superman");
var missingKeys = false;

var echoCurrentPage = function() {
  this.echo(colorizer.colorize("[Current Page]", "INFO") + this.getTitle() + " : " + this.getCurrentUrl());  
};

casper.test.begin('Tracking testing suite.', function suite(test) {

    casper.start( siteUrl, function(response) {

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        if ( no_error ) {
            casper.on('resource.requested', function(request) {
                // Print out all of the current page requests
                if ( printRequests ) {
                    this.echo(colorizer.colorize("SENDING REQUEST #" + request.id + " TO " + request.url, "PARAMETER"));
                };
                // require('utils').dump(request);
                
                if ( request.url.indexOf('oimg.nbcuni.com') >= 1 ) {
                    // this.echo(colorizer.colorize("Pushing url into array: " + request.url));
                    resUrls.push( request.url );
                    this.echo("Omniture request url found...added to array");
                } else if ( request.url.indexOf('google-analytics.com') >= 1 ) {
                    resUrls.push( request.url );
                    this.echo("Google request url found...added to array");
                }
                // else {
                //     this.echo("No tracking url found. Exiting...");
                //     // casper.exit();
                // }
            });
            
            casper.thenOpen(siteUrl).then(function(response) {
                // echoCurrentPage.call(this);
                // this.debugPage();
                // require('utils').dump(response);
            });
        }

        casper.then(function() {
            // Grab the collect request urls, decode them, then convert to a JSON array
            if ( resUrls.length >= 1 ) {

                this.echo("Fetching request url..");

                for ( var i = resUrls.length - 1; i >= 0; i-- ) {
                    this.echo("Creating JSON object..");
                    var decodedUrl = decodeURIComponent( resUrls[i] );
                    var urlObject = JSON.parse('{"' + resUrls[i].replace(/&/g, "\",\"").replace(/=/g,"\":\"") + '"}');

                    this.echo("Verifying required keys..");
                    for ( var key in urlObject ) {
                        urlObject[key] = decodeURIComponent(urlObject[key]);
                        if ( !missingKeys ) {
                            
                            // var emptyKeys = [];

                            // for ( var itm = adobeKeys.length - 1; itm >= 0; itm-- ) {
                            //     if ( adobeKeys[itm] == key ){
                            //         this.echo(key);
                            //     } else {
                            //         if ( !emptyKeys.indexOf(adobeKeys[itm]) ) {
                            //             emptyKeys.push( adobeKeys[itm] );
                            //         }
                            //     }
                            // }

                            // if (emptyKeys.length > 0) {
                            //     require('utils').dump(emptyKeys);
                            // }
                            if ( adobeKeys.indexOf(key) > -1 ) {
                                this.echo( colorizer.colorize("Found: " + key + " value: " + decodeURIComponent(urlObject[key]), "INFO") );
                            } else if ( key in adobeKeys ) {
                                // this.echo( key );
                                // missingKeys = true;
                                // casper.test.fail('Missing required keys/segments in reguest.');
                                // urlObject[key] = decodeURIComponent(urlObject[key]);
                            }
                        }
                    }
                    
                    // require('utils').dump(urlObject);
                };
            };
        });

    }).run(function() {
        test.done();
    });
});
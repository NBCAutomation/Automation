/* globals casper, require, console */
// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

// Dev Notes:
// Add a schema check for the plist/sml files
//  -- parser returning false, appears that the XML object is mising
//  var contentType = utils.getPropertyPath(this, 'currentResponse.contentType'); -- get current doc content type

var xmlLib = require('./xml2json');
var x2js = new xmlLib();

// var sax = require('./sax');
// var PlistParser = require('./plist-parser');

var colorizer = require('colorizer').create('Colorizer');

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

    this.__passed = [];
    this.__collected = [];

    var suite = this;
    var no_error = false;

    var type = casper.cli.get('type');

    if (type === 'manifest') {
        url = url + '/apps/news-app/manifest/?apiVersion=2';
    }

    casper.start( url ).then(function(response) {
        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
        }
    }).then(function() {
        suite.getContent(url, type);
        // require('utils').dump(jsonText);
    }).then(function() {
        // suite.__finished.forEach(function(res) {
        //     if (res.status != 200) {
        //         console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);
        //     };
        // });
    }).run();
};

apiSuite.prototype.getContent = function(url, type) {
    
    var suite = this;

    if (type === 'manifest') {
        casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
            var rawContent = this.getPageContent();

            // var parser = new DOMParser();
            // xmlDoc = parser.parseFromString(rawContent,'text/xml');

            
            if ( rawContent ) {

                var __jsonObj = x2js.xml_str2json( rawContent );
                
                // var __baseKeys = __jsonObj.plist.dict.key;
                // var __baseVals = __jsonObj.plist.dict.string;
                var __moduleKeys = __jsonObj.plist.dict.dict[0].key;
                var __moduleVals = __jsonObj.plist.dict.dict[0].string;

                // initialize iterator
                var i;

                for (i = __moduleKeys.length - 1; i >= 0; i--) {
                    var key = __moduleKeys[i];
                    var url = __moduleVals[i].toString();

                    if ( ! url.indexOf('/apps') ) {
                        url = casper.cli.get('url') + url;
                  
                        suite.__collected.push({
                            key: key,
                            url: url
                        });
                    }
                }

                // require('utils').dump( suite.__collected );
                this.echo('endpoint health check...');

                for (i = suite.__collected.length - 1; i >= 0; i--) {
                    suite.checkHealth();
                    // break;
                }

            } else {
                throw new Error('Missing XML elements!');
            }
        });
    } else {
        console.log('other type of url');
    }
};

apiSuite.prototype.checkHealth = function() {

    var suite = this;
    var current = suite.__collected.shift();

    // require('utils').dump( current );

    if (current) {
        casper.open(current.url, {
            method: 'head'
        }).then(function(resp) {
            resp = resp;
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                this.echo('- ' + current.key + ' : ' + current.url + colorizer.colorize(' Status: ' + status, 'INFO') );

                suite.__passed.push({
                    from: current.key,
                    url: current.url,
                    status: status
                });
                // console.log( ' -- array length: ' + suite.__passed.length );

                for (var i = suite.__passed.length - 1; i >= 0; i--) {
                    suite.validateJson();
                }
            }

            // suite.checkHealth();
        });
    } else {
        // delete this.__collected;
    }
};

apiSuite.prototype.checkNavigation = function() {

    var suite = this;
    var current = suite.__collected.shift();

    if (current.url) {
        casper.open(current.url, {
            method: 'head'
        }).then(function(resp) {
            resp = resp;
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                this.echo('- ' + current.key + ' : ' + current.url + colorizer.colorize(' Status: ' + status, 'INFO') );

                suite.__passed.push({
                    from: current.key,
                    url: current.url,
                    status: status
                });

                // for (var i = suite.__passed.length - 1; i >= 0; i--) {
                //     if ( suite.validateJson() ) {
                //         console.log('JSON validated');
                //     } else {
                        // throw new Error('JSON error!');
                //     }
                // };
            }

            // suite.checkHealth();
        });
    } else {
        // delete this.__collected;
    }
};

apiSuite.prototype.validateJson = function() {
    var suite = this;
    var current = suite.__passed.shift();

    if (current.url) {
        casper.open(current.url+'?cachebust='+Math.random()).then(function(resp) {
            resp = resp;
            var validated = false;
            var output = this.getPageContent();

            try {
                output = JSON.parse(output);
                if( output instanceof Object ) {
                    validated = true;
                 }
            } catch (e) {
                // ...
            }

            if (validated) {
                console.log('\033[0;32mJSON VALIDATED\x1b[0m');
            } else {
                throw new Error('JSON error!');
            }

        });
    } else {
        delete this.__collected;
    }
};


new apiSuite(casper.cli.get('url'));
/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version:
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name]

// Dev Notes:
// Add a schema check for the plist/sml files
//  -- parser returning false, appears that the XML object is mising
//  var contentType = utils.getPropertyPath(this, 'currentResponse.contentType'); -- get current doc content type
//  
//  Manifest Testing Requirements:


var xmlLib = require('./xml2json');
var x2js = new xmlLib();

var type = casper.cli.get('type');
if (type === 'debug') {
    var showOutput = true;
} 

var currentTime = new Date();
var timeStamp = currentTime.toISOString();

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

var parser = document.createElement('a');
parser.href = casper.cli.get('url');

newUrl = parser.href;
var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
var urlUri = sourceString.replace('.','_');

var fs = require('fs');
var logName = urlUri + '_manifest-navigation_' + timeStamp + '.csv';

var save = fs.pathJoin(fs.workingDirectory, 'test_results', logName);

var colorizer = require('colorizer').create('Colorizer');

// ------------------------

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

    this.__collected = {};

    var suite = this;
    var no_error = false;

    // var type = casper.cli.get('type');

    var parser = document.createElement('a');
    parser.href = url;

    newUrl = parser.href;
    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
    var urlUri = sourceString.replace('.','_');

    
    url = url + '/apps/news-app/manifest/?apiVersion=2';

    casper.start( url ).then(function(response) {
        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
        }
    }).then(function() {
        suite.getContent(url, type);
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

    casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
        var rawContent = this.getPageContent();
        
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
                    url = casper.cli.get('url') + url + '?apiVersion=2';
              
                    suite.__collected[key] = url;
                }
            }

            var __urlSuite = suite.__collected;

            for (var __prog in __urlSuite) {
                if (__prog === 'navigation') {
                    if (showOutput) {console.log(__prog + ' :: ' + __urlSuite[__prog])};

                    // Write file headers
                    var testInfo = 'Navigation url tested: ' + __urlSuite[__prog];
                    var testTime = 'Test completed: ' + month + '/' + day + '/' + year + ' - ' +hours + ':' + minutes + ' ' + toD;
                    
                    
                    fs.write(save, ' ' + testInfo + ',\n' + ',\n');
                    fs.write(save, ' ' + testTime + ',\n' + ',\n', 'a+');
                    fs.write(save, 'Link,URL,HTTP Status Code, JSON Status', 'a+');

                    suite.checkNavigation(url, __urlSuite[__prog]);
                }
            }

        } else {
            throw new Error('Missing XML elements!');
        }
    });
};

apiSuite.prototype.checkNavigation = function(url, __url) {

    var suite = this;
    // var current = suite.__collected.shift();

    var reqKeys = new Array("appTitle","sectionMapping","location");

    var __baseUrl = casper.cli.get('url');

    // if (current.url) {
    if (__url) {
        casper.open(__url, {method: 'head'}).then(function(resp) {
            
            resp = resp;
            
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                this.echo(__url + colorizer.colorize(' Status: ' + status, 'INFO') );

                casper.open(__url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                    
                    var validated = false;
                    var output = this.getPageContent();

                    // console.log(output);

                    __output = JSON.parse(output);

                    var mainItem = __output.items;

                    var count = 0;
                    
                    for (var __item in mainItem) {
                        
                        if(mainItem.hasOwnProperty(__item)){
                            count++;
                        }

                        var __thisItem = __output.items[count];

                        for (var __i in __thisItem) {
                            if (showOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                            if (reqKeys.indexOf(__i) > -1) {

                                if (__thisItem.length <= 0) {
                                    throw new Error('key blank ' + __i);
                                } else {

                                    if (__i === 'appTitle') {
                                        var __keyName = __thisItem[__i];
                                    }

                                    if (__i === 'location') {
                                        
                                        if (showOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                                        if (__thisItem[__i].indexOf('/apps') > -1) {

                                            if (__thisItem[__i].indexOf('?') > -1) {
                                                var __keyUrl = __baseUrl + __thisItem[__i] + '&apiVersion=2'
                                            } else {
                                                var __keyUrl = __baseUrl + __thisItem[__i] + '?apiVersion=2'
                                            }
                                            
                                            if (showOutput) {console.log(__keyUrl)};
                                        }

                                        suite.checkHealth(__keyName, __keyUrl);
                                    }
                                }
                            }

                            // -------------------------------------

                            if (__i === 'items' && typeof __thisItem[__i] === 'object') {

                                var __parent = __output.items[count].title;

                                if (showOutput) {
                                    console.log('-----------------');
                                    console.log(__parent + ' sub links');
                                }
                                
                                var __subItem = __output.items[count].items;

                                var __count = 0;

                                for (var __item in __subItem) {
                                    
                                    if(__subItem.hasOwnProperty(__item)){
                                        __count++;

                                        __offset = (__count - 1);
                                        // console.log(__offset);
                                    }

                                    var __lastItem = __output.items[count].items[__offset];

                                    for (var __b in __lastItem) {
                                        if (showOutput) {console.log(' -  ' + __b + ' : ' + __lastItem[__b])};

                                        if (reqKeys.indexOf(__b) > -1) {
                                            // console.log(' -  ' + __b + ' : ' + __lastItem[__b]);
                                            
                                            if (__b === 'appTitle') {
                                                var __lastKeyName = __lastItem[__b];
                                            }

                                            if (__b === 'location') {
                                                
                                                if (showOutput) {console.log(__b + ' : ' + __lastItem[__b])};

                                                if (__lastItem[__b].indexOf('/apps') > -1) {

                                                    if (__lastItem[__b].indexOf('?') > -1) {
                                                        var __lastKeyUrl = __baseUrl + __lastItem[__b] + '&apiVersion=2'
                                                    } else {
                                                        var __lastKeyUrl = __baseUrl + __lastItem[__b] + '?apiVersion=2'
                                                    }
                                                    
                                                    // if (showOutput) {
                                                        // console.log('>> ' + __lastKeyUrl);
                                                    // };
                                                }

                                                suite.checkHealth(__lastKeyName, __lastKeyUrl);
                                            }
                                        }

                                    }
                                    if (showOutput) { console.log('    -----------------')};
                                }
                            }

                        }

                        if (showOutput) {console.log('-----------------')};
                    }

                });
            }

            suite.checkHealth();
        });
    } else {
        // delete this.__collected; 
    }
};


apiSuite.prototype.checkHealth = function(__urlName, __url) {

    var suite = this;
    // var current = suite.__collected.shift();

    // require('utils').dump( current );

    if (__url) {
        casper.open(__url, {
            method: 'head'
        }).then(function(resp) {
            resp = resp;
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                console.log(__urlName + ' : ' + __url + colorizer.colorize(' Status: ' + status, 'INFO') );

                if (__url.indexOf('submit-your-photos') > -1) {
                    console.log('Skipping UGC url....');
                } else {
                    suite.validateJson(__urlName, __url, status);
                }
            }
        });
    } else {
        // delete this.__collected;
    }
};

apiSuite.prototype.validateJson = function(__jurlName, __jUrl, __status) {
    var suite = this;

    if (__jUrl) {
        casper.open(__jUrl,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
            resp = resp;
            var validated = false;
            var output = this.getPageContent();

            if (showOutput) {console.log('### Content Type ' + resp.headers.get('Content-Type'))};

            try {
                // __output = JSON.parse(output);
                __output = JSON.parse(output);
                // console.log(__output);

                if( __output instanceof Object ) {
                    var validated = true;
                 }
            } catch (e) {
                // ...
                console.log(e);
            }

            if (validated) {
                console.log(colorizer.colorize('PASSED: JSON Validated', 'INFO') );
                fs.write(save, ',\n' + __jurlName + ',"' + __jUrl + '",' + __status + ',' + 'JSON Validated,', 'a+');
            } else {
                console.log('...re-testing JSON');
                // var a = "<html><head></head><body>{'a': 123}</body></html>";
                // __catchJson = output.replace(/(^.*?>)(?={)/, '').replace(/}.*?$/, '') + "}"
                
                var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                __catchJson = output.match(reg)[1];

                try {
                    __verifyOutput = JSON.parse(__catchJson);

                    if( __verifyOutput instanceof Object ) {
                        console.log(colorizer.colorize('PASSED: Re-Eval Testing', 'INFO') );
                        fs.write(save, ',\n' + __jurlName + ',"' + __jUrl + '",' + __status + ',' + 'JSON Validated,', 'a+');
                    } else {
                        console.log(__catchJson);
                    }
                } catch (e) {
                    // ...
                    console.log('Error, parse fail also with removing HTML tags');
                    fs.write(save, ',\n' + __jurlName + ',"' + __jUrl + '",' + __status + ',' + 'FAIL - Possible False/Positive,', 'a+');
                }
            }
            console.log('-----------------');
        });
    } else {
        console.log('here');
    }
};

new apiSuite(casper.cli.get('url'));
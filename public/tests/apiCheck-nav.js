/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Grab the main app navigation url from the manifest, then test each link for correct response, if response, then validate JSON.
// Use: casperjs test [file_name] --url=[url]
// optional string params --output=debug to show logged key/val strings
// optional string params --output=console will show test results
// Run form console.
// ./run.sh apiCheck-article --url=http://www.telemundolasvegas.com --output=console


casper.test.begin('OTS SPIRE | API Navigation Audit', function suite(test) {
    // Global Vars
    var xmlLib = require('./xml2json');
    var x2js = new xmlLib();
    var logResults = true;

    var type = casper.cli.get('output');
        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'console') {
            var showOutput = true;
        }

    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

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


    var timeStamp = month+'_'+day+'_'+year+'-'+hours+'_'+minutes+'-'+toD;

    var parser = document.createElement('a');
    parser.href = casper.cli.get('url');

    newUrl = parser.href;
    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
    var urlUri = sourceString.replace('.','_');
    
    var fs = require('fs');
    var logName = urlUri + '_navigation-audit_' + timeStamp + '.csv';

    var curFolder = month + '_' + day + '_' + year;

    var saveLocation = 'test_results/api_navigation_audits/' + curFolder;
    fs.makeDirectory(saveLocation, 775);
    var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);

    var colorizer = require('colorizer').create('Colorizer');

    // Testing Suite Functions
    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        this.__collected = {};

        var suite = this;

        // var type = casper.cli.get('type');

        var parser = document.createElement('a');
        parser.href = url;

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');
        
        url = url + '/apps/news-app/manifest/?apiVersion=3';

        // Start Test
        casper.start( url ).then(function(response) {
            
            if ( response.status == 200 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );

                suite.createTestID(url, type, urlUri);
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).run(function() {            
            //Process file to DB
            if (logResults) {
                suite.processTestResults(save);
            }

            console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {

        var suite = this;

        // require('utils').dump( current );
        var dbUrl = 'http://spire.app/utils/createspireid?task=generate&testscript=apiCheck-nav&property=' + stationProperty;

        if (dbUrl) {
            casper.open(dbUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                    var output = this.getHTML();
                    var __dbID = casper.getElementInfo('body').text;

                    suite.getContent(url, type, __dbID);
                } else {
                    throw new Error('Unable to get/store Test ID!');
                }
                
            });
        }
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(resultsFile) {
        var testResultFileLocation = encodeURIComponent(save);

        var suite = this;

        // require('utils').dump( current );
        var processUrl = 'http://spire.app/utils/createspireid?task=upload&testType=apiNav&fileLoc=' + testResultFileLocation;

        if (processUrl) {
            casper.open(processUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    console.log(colorizer.colorize('DB processURL Loaded: ', 'COMMENT') + processUrl );                    
                } else {
                    throw new Error('Unable to get/store Test ID!');
                    this.exit();
                }
                
            });
        }
    };

    apiSuite.prototype.getContent = function(url, type, testID) {
        
        var suite = this;

        casper.open(url,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function() {
            var rawContent = this.getHTML();
            
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
                        url = casper.cli.get('url') + url + '?apiVersion=3';
                  
                        suite.__collected[key] = url;
                    }
                }

                var __urlSuite = suite.__collected;

                for (var __prog in __urlSuite) {
                    if (__prog === 'navigation') {
                        if (debugOutput) {console.log(__prog + ' :: ' + __urlSuite[__prog])};

                        fs.write(save, 'Test ID,Link,URL,HTTP Status Code, Status,Info,' + '\n', 'a+');

                        suite.checkNavigation(url, __urlSuite[__prog], testID);
                    }
                }

            } else {
                throw new Error('Missing XML elements!');
            }
        });
    };

    apiSuite.prototype.checkNavigation = function(url, __url, testID) {

        var suite = this;
        // var current = suite.__collected.shift();

        var reqKeys = new Array("appTitle","sectionMapping","location");

        var __baseUrl = casper.cli.get('url');

        // if (current.url) {
        if (__url) {
            casper.open(__url,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                resp = resp;
                
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    if (showOutput) {console.log(__url + colorizer.colorize(' Status: ' + status, 'INFO') )};

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
                                if (debugOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                                if (reqKeys.indexOf(__i) > -1) {

                                    if (__thisItem.length <= 0) {
                                        throw new Error('key blank ' + __i);
                                    } else {

                                        if (__i === 'appTitle') {
                                            var __keyName = __thisItem[__i];
                                        }

                                        if (__i === 'location') {
                                            
                                            if (debugOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                                            if (__thisItem[__i].indexOf('/apps') > -1) {

                                                if (__thisItem[__i].indexOf('?') > -1) {
                                                    var __keyUrl = __baseUrl + __thisItem[__i] + '&apiVersion=3'
                                                } else {
                                                    var __keyUrl = __baseUrl + __thisItem[__i] + '?apiVersion=3'
                                                }
                                                
                                                if (debugOutput) {console.log(__keyUrl)};
                                            }

                                            suite.checkHealth(__keyName, __keyUrl, testID);
                                        }
                                    }
                                }

                                // -------------------------------------

                                if (__i === 'items' && typeof __thisItem[__i] === 'object') {

                                    var __parent = __output.items[count].title;

                                    if (debugOutput) {
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
                                            if (debugOutput) {console.log(' -  ' + __b + ' : ' + __lastItem[__b])};

                                            if (reqKeys.indexOf(__b) > -1) {
                                                // console.log(' -  ' + __b + ' : ' + __lastItem[__b]);
                                                
                                                if (__b === 'appTitle') {
                                                    var __lastKeyName = __lastItem[__b];
                                                }

                                                if (__b === 'location') {
                                                    
                                                    if (debugOutput) {console.log(__b + ' : ' + __lastItem[__b])};

                                                    if (__lastItem[__b].indexOf('/apps') > -1) {

                                                        if (__lastItem[__b].indexOf('?') > -1) {
                                                            var __lastKeyUrl = __baseUrl + __lastItem[__b] + '&apiVersion=3'
                                                        } else {
                                                            var __lastKeyUrl = __baseUrl + __lastItem[__b] + '?apiVersion=3'
                                                        }
                                                        
                                                        // if (debugOutput) {
                                                            // console.log('>> ' + __lastKeyUrl);
                                                        // };
                                                    }

                                                    suite.checkHealth(__lastKeyName, __lastKeyUrl, testID);
                                                }
                                            }

                                        }
                                        if (debugOutput) { console.log('    -----------------')};
                                    }
                                }

                            }

                            if (debugOutput) {console.log('-----------------')};
                        }

                    });
                }

                suite.checkHealth();
            });
        } else {
            // delete this.__collected; 
        }
    };


    apiSuite.prototype.checkHealth = function(urlName, url, testID) {

        var suite = this;
        // var current = suite.__collected.shift();

        // require('utils').dump( current );

        if (url) {
            casper.open(url, {
                method: 'head'
            }).then(function(resp) {
                resp = resp;
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    if (showOutput) {console.log('> ' + urlName + ' : ' + url + colorizer.colorize(' // Status: ' + status, 'INFO') )};

                    if (url.indexOf('submit-your-photos') > -1) {
                        if (showOutput) {console.log('Skipping UGC url....')};
                    } else {
                        suite.validateJson(urlName, url, status, testID);
                    }
                }
            });
        } else {
            // delete this.__collected;
        }
    };

    apiSuite.prototype.validateJson = function(urlName, url, status, testID) {
        var suite = this;

        if (url) {
            casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                resp = resp;
                var validated = false;
                var output = this.getPageContent();

                if (debugOutput) {console.log('### Content Type ' + resp.headers.get('Content-Type'))};

                try {
                    // __output = JSON.parse(output);
                    __output = JSON.parse(output);
                    // console.log(__output);

                    if( __output instanceof Object ) {
                        var validated = true;
                     }
                } catch (e) {
                    // ...
                    if (showOutput) {console.log(e)};
                }

                if (validated) {
                    if (showOutput) {console.log('> JSON Validation: ' + colorizer.colorize('PASSED', 'INFO') )};
                    fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Pass","JSON Validated",' + '\n', 'a+');
                } else {
                    if (showOutput) {console.log('...re-testing JSON')};
                    // var a = "<html><head></head><body>{'a': 123}</body></html>";
                    // __catchJson = output.replace(/(^.*?>)(?={)/, '').replace(/}.*?$/, '') + "}"
                    
                    var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                    // __catchJson = output.match(reg)[1];

                    try {
                        __catchJson = output.match(reg)[1];

                        if (__catchJson) {
                            try {
                                __verifyOutput = JSON.parse(__catchJson);

                                if( __verifyOutput instanceof Object ) {
                                    if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                                    fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Pass","PASS - JSON Validated",' + '\n', 'a+');
                                } else {
                                    if (showOutput) {console.log(__catchJson)};
                                }
                            } catch (e) {
                                // ...
                                if (showOutput) {console.log(colorizer.colorize('WARNING: ', 'COMMENT') + 'Parse fail unable to parse programmatically also with removing HTML tags, possible False/Positive..check url manually.')};
                                fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Warn","WARNING - Possible False/Positive",' + '\n', 'a+');
                            }
                        }

                    } catch (e) {
                        if (showOutput) {console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail possible content error...check endpoint manually!')};
                        fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Fail","FAIL - Possible content error",' + '\n', 'a+');
                    }
                }
                if (showOutput) {console.log('-----------------')};
            });
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    new apiSuite(casper.cli.get('url'));
});
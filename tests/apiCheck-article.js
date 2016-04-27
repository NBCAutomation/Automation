/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Grab the main app navigation url from the manifest, then test each link for correct response, if response, then validate JSON.
// Use: casperjs test [file_name] --url=[url]
// optional string params --output=debug to show logged key/val strings
// optional string params --output=console will show test results

casper.test.begin('OTS SPIRE | API Navigation Audit', function suite(test) {
    // Global Vars
    var xmlLib = require('./xml2json');
    var x2js = new xmlLib();

    var type = casper.cli.get('output');
        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'console') {
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
            //Start testing
            
            console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );

            suite.getContent(url, type);

        }).run(function() {
            console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
            this.exit();
        });
    };

    apiSuite.prototype.getContent = function(url, type) {
        
        var suite = this;    

        // casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
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
                        url = casper.cli.get('url') + url + '?apiVersion=2';
                  
                        suite.__collected[key] = url;
                    }
                }

                var __urlSuite = suite.__collected;

                for (var __prog in __urlSuite) {
                    if (__prog === 'navigation') {
                        if (debugOutput) {console.log(__prog + ' :: ' + __urlSuite[__prog])};

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

        if (__url) {
            casper.open(__url,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    if (showOutput) {console.log(__url + colorizer.colorize(' Status: ' + status, 'INFO') )};

                    suite.spiderObjects(url, __url, 'default', 'manifest');
                }

            });
        } 
            // delete this.__collected; 
            // var current = __contentSections.shift();

            // for(__sectionURL in __contentSections ){
            //     var val = __contentSections[__sectionURL];
            //     console.log('>> testing ' + val);
            //     suite.checkNavigation(__sectionURL, val)
            //     _count++;
            // }
            // suite.checkHealth(__lastKeyName, __lastKeyUrl);
            
            // Object.keys(__contentSections).length;
            // if (__contentSections) {
            //     var _count = 0;
                // var i;

                // for (i in __contentSections) {
                //     // if (__contentSections.hasOwnProperty(i)) {
                //         _count++;
                //         console.log('++ ');
                //         if (_count > 0) {
                //             for(__sectionURL in __contentSections ){
                //                 var val = __contentSections[__sectionURL];
                //                 console.log('>>'+val);
                //                 suite.checkNavigation(__sectionURL, val)
                //             }
                //         }
                        
                    // }
                // }
            // }
        // }
    };


    apiSuite.prototype.spiderObjects = function(url, __url, type, apitest) {
        
        var suite = this;
        var __baseUrl = casper.cli.get('url');
        var reqKeys = new Array("appTitle","sectionMapping","location");
        var articleKeys = new Array("contentID","title","byline","summary","displayDate","updatedMessage","shareURL","typeName","fullsizeImageURL","thumbnailImageURL","fullsizeLeadImageURL","leadImageURL","contentBody","extID");

        if (apitest === 'manifest' ) {
            var manifestTest = true;
        } else if (apitest === 'article' ) {
            var articleTest = true;
        }

        __contentSections = {};
        
        if (__url) {
            casper.open(__url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {

                var validated = false;
                var output = this.getPageContent();

                // if (type === 'default' ) {
                    __output = JSON.parse(output);
                // } else {
                //     __output = output;
                // }

                var mainItem = __output.items;

                // if (articleTest) {
                //     console.log('HERE************************');
                //     console.log(__output.items);
                // }

                var count = 0;
                var _count = 0;
                
                
                for (var __item in mainItem) {
                    
                    if(mainItem.hasOwnProperty(__item)){
                        count++;
                    }

                    var __thisItem = __output.items[count];

                    for (var __i in __thisItem) {
                        if (debugOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                        if (manifestTest) {
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
                                                var __keyUrl = __baseUrl + __thisItem[__i] + '&apiVersion=2'
                                            } else {
                                                var __keyUrl = __baseUrl + __thisItem[__i] + '?apiVersion=2'
                                            }
                                            
                                            if (debugOutput) {console.log(__keyUrl)};
                                        }

                                        // suite.checkHealth(__keyName, __keyUrl);
                                        // console.log(__keyName, __keyUrl);

                                        // Set collections array
                                        if (manifestTest) {
                                            if (!(__keyName in __contentSections)){
                                                console.log('- key '+__keyName);
                                                __contentSections[__keyName] = __keyUrl;
                                            }
                                        }
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
                                                        var __lastKeyUrl = __baseUrl + __lastItem[__b] + '&apiVersion=2'
                                                    } else {
                                                        var __lastKeyUrl = __baseUrl + __lastItem[__b] + '?apiVersion=2'
                                                    }
                                                    
                                                    if (debugOutput) {console.log('>> ' + __lastKeyUrl)};
                                                }

                                                // suite.checkHealth(__lastKeyName, __lastKeyUrl);
                                                // console.log('-- '+__lastKeyName, __lastKeyUrl);

                                                // Set collections array
                                                if (manifestTest) {
                                                    if (!(__lastKeyName in __contentSections)){
                                                        console.log(' - '+__lastKeyName);
                                                        __contentSections[__lastKeyName] = __lastKeyUrl;
                                                    }
                                                }
                                            }
                                        }

                                    }
                                    if (debugOutput) { console.log('    -----------------')};
                                }
                            }
                        }
                        // End Manifest test
                        
                        if(articleTest){

                        }
                    }

                    if (debugOutput) {console.log('-----------------')};
                }

                if (manifestTest) {
                    suite.grabArticles(__contentSections);
                }

            })
        }
    };

    apiSuite.prototype.grabArticles = function(destinations) {
        var suite = this;

        // this.destinations = __endpoints.slice();

        for(destination in destinations ){
            var val = destinations[destination];
            
            console.log('  > ' +destination + '   >>   ' + val);
            console.log('-----------------');

            suite.spiderObjects(destination, val, 'json', 'article');
            
        }
    }

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
                    if (showOutput) {console.log('> ' + __urlName + ' : ' + __url + colorizer.colorize(' // Status: ' + status, 'INFO') )};

                    if (__url.indexOf('submit-your-photos') > -1) {
                        if (showOutput) {console.log('Skipping UGC url....')};
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
                    fs.write(save, ',\n"' + __jurlName + '","' + __jUrl + '",' + __status + ',' + 'JSON Validated,', 'a+');
                } else {
                    if (showOutput) {console.log('...re-testing JSON')};
                    
                    var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                    __catchJson = output.match(reg)[1];

                    try {
                        __verifyOutput = JSON.parse(__catchJson);

                        if( __verifyOutput instanceof Object ) {
                            if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                            fs.write(save, ',\n"' + __jurlName + '","' + __jUrl + '",' + __status + ',' + 'JSON Validated,', 'a+');
                        } else {
                            if (showOutput) {console.log(__catchJson)};
                        }
                    } catch (e) {
                        // ...
                        if (showOutput) {console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail also with removing HTML tags, possible False/Positive..check url manually.')};
                        fs.write(save, ',\n"' + __jurlName + '","' + __jUrl + '",' + __status + ',' + 'FAIL - Possible False/Positive,', 'a+');
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
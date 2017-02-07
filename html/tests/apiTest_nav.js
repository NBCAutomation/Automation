/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 3.0
// Case: Grab the main app navigation url from the manifest, then test each link for correct response, if response, then validate JSON.
// Use: casperjs test [file_name] --url=[url]
//    optional string params:
//      --output=debug          > to show logged key/val strings
//      --output=console        > will show test results
//
// Run form console.
// ./run.sh apiCheck-article --url=http://www.telemundolasvegas.com --output=console


casper.test.begin('OTS SPIRE | API Navigation Audit', function suite(test) {
    // Global Vars
    var logResults = true;
    var colorizer = require('colorizer').create('Colorizer');

    var envConfig = casper.cli.get('env');

    if (envConfig === 'local') {
        var configURL = 'http://spire.app';
    } else if (envConfig === 'dev') {
        var configURL = 'http://45.55.209.68';
    } else {
        var configURL = 'http://54.243.53.242';
    }

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

        if (minutes < 10){ minutes = "0" + minutes; }

        if (hours > 11){
            var toD = "PM";
        } else {
            var toD = "AM";
        }

        if (hours === '0'){ var hours = "12"; }


    var timeStamp = month+'_'+day+'_'+year+'-'+hours+'_'+minutes+'-'+toD;

    var parser = document.createElement('a');
    parser.href = casper.cli.get('url');

    newUrl = parser.href;
    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
    var urlUri = sourceString.replace('.','_');

    var collectionObject = {};
    var testResultsObject = {};
    var manifestTestRefID;
    var manifestTestStatus;

    var reqKeys = new Array(
        "navigationid",
        "apptitle",
        "sectionmapping",
        "location"
    );

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
        
        url = url + '/apps/news-app/navigation?apiVersion=5';

        // Start Test
        casper.start( url ).then(function(response) {
            
            if ( response.status == 200 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );

                suite.createTestID(url, type, urlUri);
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function () {
            // Display collection object
            if (debugOutput) {
                console.log('---------------------');
                console.log(' Collection object   ');
                console.log('---------------------');
                casper.wait(700, function() {
                    // console.log(collectionObject);
                    for (var thisCollectionOtem in collectionObject) {
                        console.log('>>>>> ' + thisCollectionOtem + ' : ' + collectionObject[thisCollectionOtem]);
                    }
                })
            } else {

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
        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-nav&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx') };
            suite.collectionNavigationItems(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.open(dbUrl).then(function(resp) {

                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        var manifestTestRefID = casper.getElementInfo('body').text;

                        suite.collectionNavigationItems(url, type, manifestTestRefID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(resultsFile) {
        var testResultFileLocation = encodeURIComponent(save);

        var suite = this;

        // require('utils').dump( current );
        var processUrl = configURL + '/utils/tasks?task=upload&testType=apiNav&fileLoc=' + testResultFileLocation;

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
                suite.collectionNavigationItems(url, __urlSuite[__prog], testID);
            } else {
                throw new Error('Missing XML elements!');
            }
        });
    };

    apiSuite.prototype.collectionNavigationItems = function(url, testType, testID) {
        var suite = this;

        manifestTestRefID = testID;

        casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
            resp = resp;
            
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                if (showOutput) {console.log(url + colorizer.colorize(' Status: ' + status, 'INFO') )};
                
                var validated = false;
                var output = this.getPageContent();

                try{
                    jsonParsedOutput = JSON.parse(output);

                    mainItem = jsonParsedOutput;

                    for (var parentManifestItem in jsonParsedOutput) {

                        if (typeof jsonParsedOutput[parentManifestItem] != 'object') {
                            if (debugOutput) {
                                console.log(colorizer.colorize(parentManifestItem.toLowerCase(), 'INFO') + ' : ' + jsonParsedOutput[parentManifestItem]);
                            }

                            var manifestKeyName = parentManifestItem.toLowerCase();
                            var manifestKeyValue = jsonParsedOutput[parentManifestItem];

                            // Add key/val to collection object for testing;
                            // suite.buildmanifestCollectionObject(manifestKeyName, manifestKeyValue);
                        
                        } else {
                            suite.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                            // console.log(parentManifestItem, jsonParsedOutput[parentManifestItem]);
                        }
                    }
                } catch (e) {
                    console.log('here 2');
                    console.log(e)
                    // ...
                    if (showOutput) {console.log(e)};
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        })
    };

    apiSuite.prototype.spiderObject = function(parentObjectName, childManifestObject, initialPass) {
        var suite = this;
        var firstPass = true;
        // Manifest keys are built as key__ +
        // Ex: parentKeyName__childKeyName__grandChildKeyName__lineageItemKeyName : Value
        // Live Ex: TVE__OnDemand__featured_shows__0__show_img : http://media.nbcnewyork.com/designimages/featured_show_1_ondemand2x.png

        for (var childItem in childManifestObject) {
            if (typeof childManifestObject[childItem] != 'object') {

                if ( childItem == 'dateGenerated') {
                    // Print metadata object
                    console.log(childItem + ' : ' + childManifestObject[childItem]);
                    console.log('----------------');
                }

                var manifestMainObjectName = parentObjectName.toLowerCase() + '__' + childItem.toLowerCase();
                console.log(colorizer.colorize(manifestMainObjectName, 'INFO') + ' : ' + childManifestObject[childItem]);

            } else {
                var subObject = childManifestObject[childItem];
                
                if (initialPass) {
                    for (var subItem in subObject) {
                        if ( subItem.indexOf('appTitle') > -1 ) {
                            if (debugOutput) { console.log(subItem + ' : ' + subObject[subItem]) };
                            var subItemKeyName = subObject[subItem].replace('\/',"_").split(' ').join('_').toLowerCase();
                        } else {
                            if (typeof subObject[subItem] == 'object') {
                                console.log('subItemKeyName: ' + subItemKeyName);
                                var subItemObject = subObject[subItem];
                                suite.spiderObject(subItemKeyName, subItemObject, false);
                            } else {
                                if (debugOutput) {
                                    // console.log('  -- ' + subItemKeyName + '__' + subItem + ' : ' + subObject[subItem]);
                                }
                                // Set key name and add to collection
                                var subItemKeyNameRef = subItemKeyName + '__' + subItem;
                                console.log('  -- ' + subItemKeyNameRef + ' : ' + subObject[subItem]);
                                collectionObject[subItemKeyNameRef] = subObject[subItem];
                            }
                        }
                    }
                } else {
                    for (var subItem in subObject) {
                        if ( subItem.indexOf('appTitle') > -1 ) {
                            var subItemKeyName = subObject[subItem].replace('\/',"_").split(' ').join('_').toLowerCase();
                            if (debugOutput) { console.log('    -- ' + parentObjectName + '__' + subItemKeyName) };
                        } else {
                            if (debugOutput) {
                                console.log('    -- ' + parentObjectName + '__' + subItemKeyName + '__' + subItem.toLowerCase() + ' : ' + subObject[subItem]);
                            }
                            // Set key name and add to collection
                            var itemCollectionkeyName = parentObjectName + '__' + subItemKeyName + '__' + subItem.toLowerCase();
                            collectionObject[itemCollectionkeyName] = subObject[subItem];
                        }
                    }
                }
                
            }
        }
    };

    apiSuite.prototype.buildmanifestCollectionObject = function(manifestCollectionObjectName, manifestCollectionObjectValue) {
        var suite = this;
        reqKeys.reverse();

        // If manifestCollectionObjectName found in required manifest key array, add it to the collection object for testing
        for (var reqKeysItem in reqKeys){
            
            if (manifestCollectionObjectName.indexOf( reqKeys[reqKeysItem] ) > -1) {

                console.log('ff ' + manifestCollectionObjectName + ' : ' + manifestCollectionObjectValue);
            }
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
                    if (showOutput) {
                        console.log('> ' + urlName + ' : ' + url + colorizer.colorize(' // Status: ' + status, 'INFO') );
                    };

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
                    // cleanedJson = output.replace(/(^.*?>)(?={)/, '').replace(/}.*?$/, '') + "}"
                    
                    var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                    // cleanedJson = output.match(reg)[1];

                    try {
                        cleanedJson = output.match(reg)[1];

                        if (cleanedJson) {
                            try {
                                JSONTestOutput = JSON.parse(cleanedJson);

                                if( JSONTestOutput instanceof Object ) {
                                    if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                                    fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Pass","PASS - JSON Validated",' + '\n', 'a+');
                                } else {
                                    if (showOutput) {console.log(cleanedJson)};
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
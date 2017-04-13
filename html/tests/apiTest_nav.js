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

    var collectionObject = {};
    var testResultsObject = {};
    var currentTestObject = {};
    var manifestTestRefID;
    var manifestTestStatus = 'Pass';
    var setFail = 0;
    var testStartTime;
    var manifestLoadTime;
    
    var apiVersion = '6';

    if ( ! casper.cli.get('enablevalidation') ) {
        var enableJsonValidation = '&enableJsonValidation=false';
    }

    var reqKeys = new Array(
        "navigationID",
        "appTitle",
        "sectionMapping",
        "location"
    );

    // Testing Suite Functions
    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        this.__collected = {};

        var suite = this;

        var parser = document.createElement('a');
        parser.href = url;

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');
        
        url = url + '/apps/news-app/navigation/?apiVersion=' + apiVersion + enableJsonValidation;
        testStartTime = Date.now();

        /*******************
        *
        * Start Testing
        *
        *******************/
        casper.start( url ).then(function(response) {
            if ( response.status == 200 ) {
                manifestLoadTime = Date.now() - testStartTime;

                if (showOutput) {
                    console.log(' > Loadtime: ', manifestLoadTime, 'ms');
                };

                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                suite.createTestID(url, type, urlUri);
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function () {
            // Log the endpoint load time
            suite.logLoadTime(manifestTestRefID, 'apiNavTest', manifestLoadTime, url, null);
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
                // Test Collection data
                suite.testNavigationData(urlUri, collectionObject, manifestTestRefID)
            }

        }).then(function () {
            if (debugOutput) {
                console.log('---------------------');
                console.log(' Test Results object   ');
                console.log('---------------------');
                console.log('Test Status: ' + manifestTestStatus);
                for (var resultsCollectionItem in testResultsObject) {
                    console.log('- ' + resultsCollectionItem + ' : ' + testResultsObject[resultsCollectionItem]);
                    
                    if (typeof testResultsObject[resultsCollectionItem] == 'object') {
                        var resultsItemSubObject = testResultsObject[resultsCollectionItem];

                        for (var thisSubItem in resultsItemSubObject){
                            console.log('     -- ' + thisSubItem + ' : ' + resultsItemSubObject[thisSubItem]);

                            var thisChildObject = resultsItemSubObject[thisSubItem];
                            if (typeof thisChildObject == 'object') {
                                for (var thisChildItem in thisChildObject){
                                    console.log('      --- ' + thisChildItem + ' : ' + thisChildObject[thisChildItem]);
                                }
                            }
                        }
                    }
                }
            }

            //Process test results to DB
            if (logResults) {
                suite.processTestResults(urlUri, testResultsObject, manifestTestRefID, setFail, 'apiNavTest', manifestLoadTime, manifestTestStatus);
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {
        var suite = this;

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

    // Log endpoint time
    apiSuite.prototype.logLoadTime = function(testID, testType, manifestLoadTime, endPoint, testInfo) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log(processUrl);
            console.log(testID, testType, manifestLoadTime, endPoint, testInfo);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'logLoadTime',
                'testID': testID,
                'testType': testType,
                'manifestLoadTime': manifestLoadTime,
                'endPoint': endPoint,
                'testInfo': testInfo
            }
        });
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(urlUri, testResultsObject, testID, testFailureCount, testType, manifestLoadTime, manifestTestStatus) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            // console.log('>> process url: ' + processUrl);
            console.log('------------------------');
            console.log(' Process Results Data  ');
            console.log('------------------------');
            console.log('urlUri => ' + urlUri);
            console.log('testResultsObject => ' + testResultsObject);
            console.log('testID => ' + testID);
            console.log('testFailureCount => ' + testFailureCount);
            console.log('testType => ' + testType);
            console.log('manifestLoadTime => ' + manifestLoadTime);
            console.log('manifestTestStatus => ' + manifestTestStatus);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'processManifestTestResults',
                'testID': testID,
                'testType': testType,
                'testProperty': urlUri,
                'testStatus': manifestTestStatus,
                'testFailureCount':testFailureCount,
                'manifestLoadTime': manifestLoadTime,
                'testResults':  JSON.stringify(testResultsObject)
            }
        });
    };

    apiSuite.prototype.collectionNavigationItems = function(url, testType, testID) {
        var suite = this;

        manifestTestRefID = testID;
        
        var subTestLoadStartTime = Date.now();

        casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
            resp = resp;
            
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                var subTestLoadTime = Date.now() - subTestLoadStartTime;

                if (showOutput) {
                    console.log(url + colorizer.colorize(' Status: ' + status, 'INFO') );
                    console.log(' - load time: ' + subTestLoadTime);
                };
                
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
                        } else {
                            suite.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                        }
                    }
                } catch (e) {
                    console.log('here 2');
                    console.log(e)
                    
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
        reqKeys.reverse();
        var __baseUrl = casper.cli.get('url');

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
                for (var subItem in subObject) {
                    
                        if (subObject.length <= 0) {
                            throw new Error('key blank ' + subItem);
                        } else {

                            if (subItem === 'appTitle') {
                                if (initialPass) {
                                    var navItemAppTitleNiceName = subObject[subItem];
                                    var navItemAppTitle = subObject[subItem].replace('\/',"_").split(' ').join('_').toLowerCase();
                                } else {
                                    var navItemAppTitleNiceName = subObject[subItem];
                                    var mainNavItemTitle = parentObjectName.replace('\/',"_").split(' ').join('_').toLowerCase();
                                    var subNavItemTitle = subObject[subItem].replace('\/',"_").split(' ').join('_').toLowerCase();
                                    var navItemAppTitle = mainNavItemTitle + '__' + subNavItemTitle;
                                }
                            }

                            if (subItem === 'location') {
                                if (debugOutput) {
                                    console.log(subItem + ' : ' + subObject[subItem]);
                                };

                                // Find actual links and append the corrent version string to the end of the url
                                if (subObject[subItem].indexOf('/apps') > -1) {

                                    if (subObject[subItem].indexOf('?') > -1) {
                                        var navItemAppLocationURL = __baseUrl + subObject[subItem] + '&apiVersion=' + apiVersion + enableJsonValidation;
                                    } else {
                                        var navItemAppLocationURL = __baseUrl + subObject[subItem] + '?apiVersion=' + apiVersion + enableJsonValidation;
                                    }
                                    
                                    if (debugOutput) {
                                        console.log(navItemAppLocationURL);
                                    };
                                } else {
                                    navItemAppLocationURL = subObject[subItem]
                                }
                                
                                if (debugOutput) {
                                    console.log('navItemAppTitleNiceName > ' + navItemAppTitleNiceName);
                                    console.log('navItemAppTitle > ' + navItemAppTitle);
                                    console.log('navItemAppLocationURL > ' + navItemAppLocationURL);    
                                }
                                // Push data into collection
                                collectionObject[navItemAppTitle] = navItemAppLocationURL;
                            }

                            if (typeof subObject[subItem] == 'object') {
                                parentObjectName = false;
                                suite.spiderObject(navItemAppTitle, subObject[subItem], false);
                            }
                        }
                    }
                if (debugOutput) { console.log('------') }
            }
        }
    };


    apiSuite.prototype.testNavigationData = function(url, collectionObject, testID) {
        var suite = this;

        // Test collection object and add to results object
        for (var thisCollectionItem in collectionObject) {
            var endpointName = thisCollectionItem;
            var endpointUrl = collectionObject[thisCollectionItem];

            if (endpointUrl) {
                suite.validateJson(endpointName, endpointUrl, testID);
            } else {
                console.log(colorizer.colorize('ERROR: ', 'WARNING') + 'NavTestError: No url provided to test against: ' + endpointName);
                currentTestObject[endpointName] = 'NavDataTestError: No url provided to test against for the current endpoint.';
                testResultsObject['testResults'] = currentTestObject;
                manifestTestStatus = 'Fail';
                setFail++;
            }
        }
    };

    apiSuite.prototype.getLoadTime = function(url, callback) {
        var suite = this;

        if (url) {
            subTestStartTime = Date.now();

            casper.open(url).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    currentSubTestLoadTime = Date.now() - subTestStartTime;
                    output = currentSubTestLoadTime;
                }

                suite.logLoadTime(manifestTestRefID, 'apiSectionContent', currentSubTestLoadTime, url, null);

                if (typeof(callback) === "function") {
                    callback(output);
                }
            })
        } else {
            throw new Error('checkURLHealth: Unable to test url, missing url;');
        }
    };

    apiSuite.prototype.validateJson = function(urlName, url, status, testID) {
        var suite = this;
        var currentTestStatus = "Pass";

        if (url) {
            casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                resp = resp;
                var validated = false;
                var status = this.status().currentHTTPStatus;
                var output = this.getPageContent();
                var currentTestResults = {};

                if ( status == 200) {
                    if (showOutput) {
                        if (url.indexOf('submit-your-photos') > -1) {
                            if (showOutput) {console.log('Skipping UGC url....')};
                        } else {
                            console.log('> ' + urlName + ' : ' + url + colorizer.colorize(' // Status: ' + status, 'INFO') );

                            var urlCurrentLoadTime = suite.getLoadTime(url, function (data) {
                                if (data) {
                                    console.log('> LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO') );
                                } else {
                                    console.log('-- no timing returned.');
                                }
                            });
                            
                            // Test parsing JSON
                            if (debugOutput) {console.log('### Content Type ' + resp.headers.get('Content-Type'))};

                            try {
                                output = JSON.parse(output);

                                if( output instanceof Object ) {
                                    var validated = true;
                                 }
                            } catch (e) {
                                // ...
                                if (showOutput) {console.log(e)};
                            }

                            if (validated) {
                                if (showOutput) {console.log('> JSON Validation: ' + colorizer.colorize('PASSED', 'INFO') )};
                            } else {
                                if (showOutput) {console.log('...re-testing JSON')};
                                var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                                try {
                                    cleanedJson = output.match(reg)[1];

                                    if (cleanedJson) {
                                        try {
                                            JSONTestOutput = JSON.parse(cleanedJson);

                                            if( JSONTestOutput instanceof Object ) {
                                                if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                                                // fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Pass","PASS - JSON Validated",' + '\n', 'a+');
                                            } else {
                                                if (showOutput) {console.log(cleanedJson)};
                                            }
                                        } catch (e) {
                                            // ...
                                            if (showOutput) {
                                                console.log('-------------------');
                                                console.log(' JSON Parse Warning  ');
                                                console.log('-------------------');
                                                console.log(colorizer.colorize('WARNING: ', 'COMMENT') + 'Parse fail unable to parse programmatically also with removing HTML tags, possible False/Positive..check url manually.');
                                            }
                                            currentTestResults['jsonValidated'] = 'Warning';
                                        }
                                    }

                                } catch (e) {
                                    if (showOutput) {
                                        console.log('-------------------');
                                        console.log(' JSON Parse Error  ');
                                        console.log('-------------------');
                                        console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail possible content error...check endpoint manually!');
                                    };
                                    
                                    currentTestResults['jsonValidated'] = 'Fail';
                                    currentTestStatus = 'Fail';
                                    manifestTestStatus = 'Fail';
                                    setFail++;
                                }
                            }
                        }
                        if (showOutput) {console.log('-----------------')};
                    }
                } else {
                    currentTestResults['url'] = url;
                    currentTestResults['httpStatus'] = status;
                }

                // Set current test status & results
                if (Object.keys(currentTestResults).length > 0) {
                    currentTestObject[urlName] = currentTestResults;
                }

                if (Object.keys(currentTestResults).length > 0) {
                    testResultsObject['testResults'] = currentTestObject;
                }
                
            })
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    new apiSuite(casper.cli.get('url'));
});
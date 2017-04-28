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


casper.test.begin('OTS SPIRE | API Content Audit', function suite(test) {
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
    var galleryCollectionObject = {};
    var subTestResults = {};
    var manifestTestRefID;
    var manifestTestStatus = 'Pass';
    var setFail = 0;
    var sourceString;
    var testStartTime;
    var manifestLoadTime;

    var resourcesTime = [];

    var listener = function(resource, request) {
        var date_start = new Date();

        resourcesTime[resource.id] = {
            'id': resource.id,
            'start': date_start.getTime(),
            'end': -1,
            'time': -1,
            'status': resource.status
        }

        if (debugOutput) {
            this.echo('resourcesTime :: ' + resourcesTime[resource.id]['id']);
            this.echo('resourcesTime :: ' + resourcesTime[resource.id]['start']);
            this.echo('resourcesTime :: ' + resourcesTime[resource.id]['time']);
            this.echo('resourcesTime :: ' + resourcesTime[resource.id]['status']);
        }
    };

    var receivedListener = function(resource, request) {
        var date_end = new Date();

        resourcesTime[resource.id]['end']  = date_end.getTime();
        resourcesTime[resource.id]['time'] = resourcesTime[resource.id]['end'] - resourcesTime[resource.id]['start'];
        manifestLoadTime = resourcesTime[resource.id]['time'];

        if (debugOutput) {
            /* to debug and compare */
            this.echo('manifestLoadTime >> ' + manifestLoadTime);
            this.echo('resource time >> ' + resourcesTime[resource.id]['time']);
        }
    };

    var apiVersion = '6';

    if ( ! casper.cli.get('enablevalidation') ) {
        var enableJsonValidation = '&enableJsonValidation=false';
    }

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
        
        // Strip and clean url to avoid 301 redirects and endpoint load error.
        url = 'http://www.' + sourceString + '.com/apps/news-app/navigation?apiVersion=' + apiVersion + enableJsonValidation;

        /*******************
        *
        * Start Testing
        *
        *******************/
        casper.start( url ).then(function(response) {
            
            if ( response.status == 200 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                console.log('...creating testID, collecting manifest data, and content endpoints');
                suite.createTestID(url, type, urlUri);
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function () {
            console.log('------------------------------------------');
            console.log(colorizer.colorize('...testing collected manifest data', 'PARAMETER'));
            console.log('------------------------------------------');
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
                suite.testNavigationData(urlUri, collectionObject, manifestTestRefID);
            }
        }).then(function () {
            console.log('------------------------------------------');
            console.log(colorizer.colorize(' ...testing endpoint content items', 'PARAMETER'));
            console.log('------------------------------------------');
            if (debugOutput) {
                console.log('-----------------------------------------');
                console.log(' Start testing content collectionObject   ');
                console.log('-----------------------------------------');
            }
            // Test endpoint content
            suite.testEndpointContent(collectionObject, manifestTestRefID);

        }).then(function () {
            console.log('------------------------------------------');
            console.log(colorizer.colorize('...test results logged to object, saving to DB', 'PARAMETER'));
            console.log('------------------------------------------');
            if (debugOutput) {
                console.log('---------------------');
                console.log(' Test Results object   ');
                console.log('---------------------');
                for (var resultsCollectionItem in testResultsObject) {
                    console.log('- ' + resultsCollectionItem + ' : ' + testResultsObject[resultsCollectionItem]);
                    
                    if (typeof testResultsObject[resultsCollectionItem] == 'object') {
                        var resultsItemSubObject = testResultsObject[resultsCollectionItem];

                        for (var thisSubItem in resultsItemSubObject){
                            console.log('     -- ' + thisSubItem + ' : ' + resultsItemSubObject[thisSubItem]);

                            var thisChildObject = resultsItemSubObject[thisSubItem];
                            if (typeof thisChildObject == 'object') {
                                for (var thisChildItem in thisChildObject){
                                    var resultsChildItem = thisChildObject[thisChildItem];
                                    console.log('      --- ' + thisChildItem + ' : ' + thisChildObject[thisChildItem]);

                                    if (typeof resultsChildItem == 'object') {
                                        for (var thisInnerChildItem in resultsChildItem){
                                            var resultsChildItem = resultsChildItem[thisInnerChildItem];
                                            console.log('        --- ' + thisInnerChildItem + ' : ' + resultsChildItem[thisInnerChildItem]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //Process test results to DB
            if (logResults) {
                suite.processTestResults(urlUri, testResultsObject, setFail, manifestTestRefID, 'apiContentTest', manifestTestStatus);
                console.log('------------------------------------------');
                console.log(colorizer.colorize('...test results saved', 'PARAMETER'));
                console.log('------------------------------------------');
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete: ', 'COMMENT'));
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {
        var suite = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-content&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx') };
            suite.collectionNavigationItems(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.thenOpen(dbUrl).then(function(resp) {

                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        manifestTestRefID = casper.getElementInfo('body').text;

                        if (showOutput) {
                            console.log(colorizer.colorize('Test ID created: ', 'COMMENT') + manifestTestRefID);   
                        }
                        
                        suite.collectionNavigationItems(url, type, manifestTestRefID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    apiSuite.prototype.getLoadTime = function(url, callback) {
        var suite = this;

        if (url) {
            casper.on('resource.requested', listener);
            casper.on('resource.received', receivedListener);

            casper.thenOpen(url).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    currentSubTestLoadTime = manifestLoadTime;
                    output = currentSubTestLoadTime;
                }

                if (typeof(callback) === "function") {
                    callback(output);
                }
                this.removeListener("resource.requested", listener);
                this.removeListener("resource.received", receivedListener);
            });
        } else {
            throw new Error('checkURLHealth: Unable to test url, missing url;');
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

    // Log endpoint JSON Errors
    apiSuite.prototype.logPaylodError = function(testID, testType, error, endpoint, payload) {
        var processUrl = configURL + '/utils/processRequest';
        
        if (debugOutput) {
            console.log(processUrl);
            console.log(testID, testType, error, payload);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'logPaylodError',
                'testID': testID,
                'testType': testType,
                'error': error,
                'endpoint': endpoint,
                'payload': payload
            }
        });
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(urlUri, testResultsObject, testFailureCount, testID, testType, manifestTestStatus) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log(processUrl);
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
                'testResults':  JSON.stringify(testResultsObject)
            }
        });
    };

    apiSuite.prototype.collectionNavigationItems = function(url, testType, testID) {
        var suite = this;

        manifestTestRefID = testID;

        casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
            resp = resp;
            
            var status = this.status().currentHTTPStatus;

            if ( status == 200 || status == 301) {
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
                        } else {
                            suite.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                        }
                    }
                } catch (e) {
                    if (showOutput) {
                        console.log('-------------------');
                        console.log(' JSON Parse Error  ');
                        console.log('-------------------');
                        console.log('Unable to test parse JSON data via collectionNavigationItems(). url: ' + url);
                        console.log(e)
                    }

                    var JSONerror = "'" + e + "'";
                    var brokenJSONString = output.replace(/[\n\t\s]+/g, " ");
                    setFail++;

                    suite.logPaylodError(manifestTestRefID, 'apiManifestTest', JSONerror, url, brokenJSONString);
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        })
    };

    apiSuite.prototype.spiderObject = function(parentObjectName, childManifestObject, initialPass) {
        var suite = this;
        var baseUrl = casper.cli.get('url');

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
                                    console.log(subItem + ' ::: ' + subObject[subItem]);
                                };

                                // Find actual links and append the corrent version string to the end of the url
                                if (subObject[subItem].indexOf('/apps') > -1) {
                                    if (subObject[subItem].indexOf('?') > -1) {
                                        var navItemAppLocationURL = baseUrl + subObject[subItem] + '&apiVersion=' + apiVersion + enableJsonValidation;
                                    } else {
                                        var navItemAppLocationURL = baseUrl + subObject[subItem] + '?apiVersion=' + apiVersion + enableJsonValidation;
                                    }
                                    
                                    if (debugOutput) {
                                        console.log(navItemAppLocationURL);
                                    };
                                } else {
                                    if (subObject[subItem].indexOf('.html') > -1) {
                                        var location_url = subObject[subItem],
                                            cms_contentID = null;

                                        if (/^https?:\/\/www\.(nbc|telemundo)/.exec(location_url)) {
                                            cms_contentID = /(\d+)\.html$/.exec(location_url);
                                            if (cms_contentID) {
                                                location_url = '?contentId=' + cms_contentID[1];
                                            }
                                        }
                                        // http://www.nbclosangeles.com/apps/news-app/content/?contentId=389777331&apiVersion=6
                                        navItemAppLocationURL = baseUrl + '/apps/news-app/content/' + location_url + '&apiVersion=' + apiVersion + enableJsonValidation;
                                        
                                        if (debugOutput) { console.log('> parsedLocationURL: ' + location_url) };
                                    } else {
                                        navItemAppLocationURL = subObject[subItem];
                                    }
                                }

                                
                                if (
                                    subObject[subItem].indexOf('contests') > -1
                                    || subObject[subItem].indexOf('community') > -1
                                    || subObject[subItem].indexOf('tve') > -1
                                    || subObject[subItem].indexOf('weather-alerts') > -1
                                    || subObject[subItem].indexOf('tv-listings') > -1
                                    || subObject[subItem].indexOf('bit.ly') > -1
                                    || subObject[subItem].indexOf('traffic') > -1
                                    || subObject[subItem].indexOf('horoscopo') > -1
                                    || subObject[subItem].indexOf('lottery') > -1
                                    || subObject[subItem].indexOf('avisos-del-tiempo') > -1
                                    || subObject[subItem].indexOf('data.nbcstations.com') > -1
                                    || subObject[subItem].indexOf('FAQ') > -1
                                    || subObject[subItem].indexOf('faq') > -1
                                    || subObject[subItem].indexOf('investigations') > -1
                                    || subObject[subItem].indexOf('Tips') > -1
                                    || subObject[subItem].indexOf('CazaTormentas') > -1
                                    || navItemAppTitleNiceName.indexOf('Investigation') > -1)
                                {
                                    if (debugOutput) {
                                        console.log('  ---------SKIP---------');
                                        console.log('    navItemAppTitleNiceName > ' + navItemAppTitleNiceName);
                                        console.log('    navItemAppTitle > ' + navItemAppTitle);
                                        console.log('    default url > ' + subObject[subItem]);
                                        console.log('  ---------SKIP---------');
                                    }
                                    test.comment('> Skipping UGC/static content url, skipping JSON test.' );
                                } else {
                                    if (debugOutput) {
                                        console.log('navItemAppTitleNiceName > ' + navItemAppTitleNiceName);
                                        console.log('navItemAppTitle > ' + navItemAppTitle);
                                        console.log('navItemAppLocationURL > ' + navItemAppLocationURL);
                                        console.log('default url > ' + subObject[subItem]);
                                        console.log('------')
                                    }

                                    // Push data into collection object
                                    collectionObject[navItemAppTitle] = navItemAppLocationURL;
                                }
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
                currentTestObject[endpointName] = 'ContentDataTestError: No url provided to test against for the current endpoint. Check manifest location for item.';
                testResultsObject['testResults'] = currentTestObject;
                manifestTestStatus = 'Fail';
                setFail++;
            }
        }
    };

    apiSuite.prototype.validateJson = function(urlName, url, status, testID) {
        var suite = this;

        if (url) {
            casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                resp = resp;
                var validated = false;
                var status = this.status().currentHTTPStatus;
                var output = this.getPageContent();
                var currentTestResults = {};

                if ( status == 200 || status == 301) {
                    if (showOutput) {
                        if (url.indexOf('submit-your-photos') > -1) {
                            if (showOutput) {console.log('Skipping UGC url....')};
                        } else {
                            if (showOutput) {
                                console.log('> ' + urlName + ' : ' + url + colorizer.colorize(' // Status: ' + status, 'INFO') );
                            }
                            
                            // Test parsing JSON
                            if (debugOutput) {console.log('### Content Type ' + resp.headers.get('Content-Type'))};

                            try {
                                output = JSON.parse(output);

                                if( output instanceof Object ) {
                                    var validated = true;
                                 }
                            } catch (e) {
                                // ...
                                if (showOutput) {
                                    console.log('-------------------');
                                    console.log(' JSON Parse Error  ');
                                    console.log('-------------------');
                                    console.log('Unable to test parse JSON data via validateJson(). url: ' + url);
                                    console.log(e);
                                };
                                setFail++;
                                currentTestResults['jsonValidated'] = 'JSON Parse error (Unable to test parse JSON data via validateJson(). url: ' + url + ') <br /> JSON Error: ' + e;

                                var JSONerror = e;
                                var brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                                suite.logPaylodError(manifestTestRefID, 'apiContentTest', JSONerror, url, brokenJSONString);
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
                                                
                                            } else {
                                                if (showOutput) {console.log(cleanedJson)};
                                            }
                                        } catch (e) {
                                            // ...
                                            if (showOutput) {
                                                console.log('-------------------');
                                                console.log(' JSON Parse Error  ');
                                                console.log('-------------------');
                                                console.log(colorizer.colorize('WARNING: ', 'COMMENT') + 'Parse fail unable to parse programmatically also with removing HTML tags, possible False/Positive..check url manually.');
                                            };
                                            setFail++;
                                            currentTestResults['jsonValidated'] = 'Warning';

                                            var JSONerror = e;
                                            cleanedJson = output.match(reg)[1];
                                            var brokenJSONString = cleanedJson.replace(/[\n\t\s]+/g, " ");

                                            suite.logPaylodError(manifestTestRefID, 'apiContentTest', JSONerror, url, brokenJSONString);
                                        }
                                    }

                                } catch (e) {
                                    if (showOutput) {
                                        console.log('-------------------');
                                        console.log(' JSON Parse Error  ');
                                        console.log('-------------------');
                                        console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail possible content error...check endpoint manually!');
                                    };
                                    setFail++;
                                    currentTestResults['jsonValidated'] = 'Fail';
                                    manifestTestStatus = 'Fail';

                                    var JSONerror = e;
                                    cleanedJson = output.match(reg)[1];
                                    var brokenJSONString = cleanedJson.replace(/[\n\t\s]+/g, " ");

                                    suite.logPaylodError(manifestTestRefID, 'apiContentTest', JSONerror, url, brokenJSONString);
                                }
                            }
                            if (showOutput) {console.log('-----------------')};
                        }
                    }
                } else {
                    currentTestResults['url'] = url;
                    currentTestResults['httpStatus'] = status;
                }

                // Set current test status & results
                if (Object.keys(currentTestResults).length > 0){
                    currentTestObject[urlName] = currentTestResults;
                }

                if (Object.keys(currentTestObject).length > 0){
                    testResultsObject['endpointFailures'] = currentTestObject;
                }
            })
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    apiSuite.prototype.testEndpointContent = function(collectionObject, testID) {
        var suite = this;
        for (var thisCollectionItem in collectionObject) {
            var endpointName = thisCollectionItem;
            var endpointUrl = collectionObject[thisCollectionItem];

            if (endpointUrl) {
                var runValidateEndpoint = true;

                if (endpointUrl.indexOf('submit-your-photos') > -1 || endpointUrl.indexOf('submit-media') > -1) {
                    if (showOutput) {console.log('Skipping UGC url....')};
                    var runValidateEndpoint = false;
                }

                if (endpointUrl.indexOf('telemundo') > -1 ) {
                    if (endpointUrl.indexOf('el-tiempo/modules') > -1) {
                        if (showOutput) {console.log('Exception: Skipping TLM Weather moduels endpoint url....')};
                        var runValidateEndpoint = false;
                    } else if (endpointUrl.indexOf('news-app/investigations/modules') > -1) {
                        if (showOutput) {console.log('Exception: Skipping TLM Investigations moduels endpoint url....')};
                        var runValidateEndpoint = false;
                    }
                }

                if (debugOutput) {
                    console.log('> ------- endpoint URL ' + endpointUrl);
                    console.log('runValidateEndpoint ' + runValidateEndpoint);
                }

                if (runValidateEndpoint) {
                    suite.endpointContentValidation(endpointName, endpointUrl, testID);
                }
            }
        }
    };

    apiSuite.prototype.endpointContentValidation = function(endpointName, endpointUrl, testID) {
        var suite = this;
        var baseUrl = casper.cli.get('url');
        // var baseUrl = 'http://www.' + sourceString + '.com';

        if (endpointUrl) {
            casper.thenOpen(endpointUrl, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }, function(resp) {
                var status = this.status().currentHTTPStatus;
                var output = this.getPageContent();
                var endpointTestResults = {};

                // Log loadtime for basic content urls
                if (resp.url.indexOf('content/?contentId=') > -1) {
                    // console.log('    content item > ' + resp.url);
                    var urlCurrentLoadTime = suite.getLoadTime(resp.url, function (data) {
                        if (data) {
                            if (showOutput) {
                                console.log('> Content Item LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO') );
                            }

                            if (logResults) {
                                suite.logLoadTime(manifestTestRefID, 'apiContentTest', data, resp.url, 'content item');
                            }
                        } else {
                            console.log('-- no timing returned.');
                        }
                        
                    });
                }
                
                try{
                    rawOutput = JSON.parse(output);

                    // Main endpoint data module item
                    var mainItemArticles = rawOutput.modules;
                    if (showOutput) {
                        console.log('---------------------------------');
                        // console.log(' Test ID: ' + testID);
                        console.log(colorizer.colorize(' endpointName: ', 'PARAMETER')  + endpointName);
                        console.log(colorizer.colorize(' endpointUrl: ', 'PARAMETER') + endpointUrl);
                        console.log('---------------------------------');
                    }

                    if (rawOutput.typeName == 'Feature') {
                        if (rawOutput.feature === true) {
                            if (rawOutput.featureName.length <= 0) {
                                setFail++;

                                var __curError = 'Feature flag set to TRUE but featureName empty.';

                                console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + rawOutput.contentID + ', but featureName empty.', 'ERROR'));
                                subTestResults['featureFeature'] = 'FAIL: Feature flag set to TRUE for ' + rawOutput.contentID + ', but featureName empty.';
                                var __curError = '';

                            } else if (rawOutput.featureId.length <= 0) {
                                setFail++;

                                var __curError = 'Feature flag set to TRUE but featureId empty.';
                                
                                console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + rawOutput.contentID + ', but featureId empty.', 'ERROR'));
                                subTestResults['featureFeatureID'] = 'FAIL: Feature flag set to TRUE for ' + rawOutput.contentID + ', but featureId empty.';
                                var __curError = '';
                            }
                        }

                        if (rawOutput.fullsizeImageURL.indexOf('0*false') > -1 || rawOutput.fullsizeImageURL == null) {
                            console.log(colorizer.colorize('FAIL: Image url invalid for fullsizeImageURL: ' + rawOutput.fullsizeImageURL + '.', 'ERROR'));
                            subTestResults['fullsizeImageURL'] = 'FAIL: Image url invalid for fullsizeImageURL: ' + rawOutput.fullsizeImageURL;
                        }

                        if (rawOutput.thumbnailImageURL.indexOf('0*false') > -1 || rawOutput.thumbnailImageURL == null) {
                            console.log(colorizer.colorize('FAIL: Image url invalid for thumbnailImageURL: ' + rawOutput.thumbnailImageURL + '.', 'ERROR'));
                            subTestResults['thumbnailImageURL'] = 'FAIL: Image url invalid for thumbnailImageURL: ' + rawOutput.thumbnailImageURL;
                        }

                        // Check for the Sponsor flag
                        if (rawOutput.sponsored === true) {
                            if (rawOutput.sponsorName.length <= 0) {
                                setFail++;
                                
                                var __curError = 'Sponsored flag set to TRUE but sponsorName empty.';

                                console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + rawOutput.contentID + ', but sponsorName empty.', 'ERROR'));
                                subTestResults['featureSponsorName'] = 'FAIL: Sponsored flag set to TRUE for ' + rawOutput.contentID + ', but sponsorName empty.';
                                var __curError = '';
                            } else if (rawOutput.sponsorID.length <= 0) {
                                setFail++;
                                
                                var __curError = 'Sponsored flag set to TRUE but sponsorID empty.';

                                console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + rawOutput.contentID + ', but sponsorID empty.', 'ERROR'));
                                subTestResults['featureSponsorID'] = 'FAIL: Sponsored flag set to TRUE for ' + rawOutput.contentID + ', but sponsorID empty.';
                                var __curError = '';
                            }
                        }

                    } else {
                        for (var innerContentItem in mainItemArticles) {

                            // console.log('== '+innerContentItem.items);
                            var singleArticleItemObject = mainItemArticles[innerContentItem];

                            for (var singleArticleItem in singleArticleItemObject) {

                                if (singleArticleItem === 'items' && typeof singleArticleItemObject[singleArticleItem] === 'object') {
                                    
                                    var singleArticleInnerItems = singleArticleItemObject[singleArticleItem];

                                    var __subCount = 0;

                                    for (var __items in singleArticleInnerItems) {

                                        if (typeof singleArticleInnerItems[__items] === 'object') {

                                            var articleContentID = singleArticleInnerItems[__items].contentID;
                                            var articleTitle = singleArticleInnerItems[__items].title;
                                            var articleByline = singleArticleInnerItems[__items].byline;
                                            var articleSummary = singleArticleInnerItems[__items].summary;
                                            var articleDisplayDate = singleArticleInnerItems[__items].displayDate;
                                            var articleUpdatedMessage = singleArticleInnerItems[__items].updatedMessage;
                                            var articleShareURL = singleArticleInnerItems[__items].shareURL;
                                            var articleTypeName = singleArticleInnerItems[__items].typeName;
                                            var articleInnerLocation = singleArticleInnerItems[__items].location;
                                            var articleFullsizeImageURL = singleArticleInnerItems[__items].fullsizeImageURL;
                                            var articleThumbnailImageURL = singleArticleInnerItems[__items].thumbnailImageURL;
                                            var articleFullsizeLeadImageURL = singleArticleInnerItems[__items].fullsizeLeadImageURL;
                                            var articleLeadImageURL = singleArticleInnerItems[__items].leadImageURL;
                                            var articleFeature = singleArticleInnerItems[__items].feature;
                                            var articleFeatureName = singleArticleInnerItems[__items].featureName;
                                            var articleFeatureID = singleArticleInnerItems[__items].featureId;
                                            var articleSponsored = singleArticleInnerItems[__items].sponsored;
                                            var articleSponsorName = singleArticleInnerItems[__items].sponsorName;
                                            var articleSponsorID = singleArticleInnerItems[__items].sponsorID;
                                            var articleIsLiveStream = singleArticleInnerItems[__items].isLiveStream;
                                            var articleLiveVideoEmbed = singleArticleInnerItems[__items].liveVideoEmbed;
                                            var articleLiveAppVideoEmbed = singleArticleInnerItems[__items].liveAppVideoEmbed;
                                            var articleContentBody = singleArticleInnerItems[__items].contentBody;
                                            var articleLeadMedia = singleArticleInnerItems[__items].leadMedia;

                                            if (debugOutput) {
                                                console.log('-------------------------------');
                                                console.log(' Content item var declaration   ');
                                                console.log('-------------------------------');
                                                console.log('    > articleContentID : ' + articleContentID);
                                                console.log('    > articleTitle : ' + articleTitle);
                                                console.log('    > articleByline : ' + articleByline);
                                                // console.log('    > articleSummary : ' + articleSummary);
                                                console.log('    > articleDisplayDate : ' + articleDisplayDate);
                                                console.log('    > articleUpdatedMessage : ' + articleUpdatedMessage);
                                                console.log('    > articleShareURL : ' + articleShareURL);
                                                console.log('    > articleTypeName : ' + articleTypeName);
                                                console.log('    > articleInnerLocation : ' + articleInnerLocation);
                                                console.log('    > articleFullsizeImageURL : ' + articleFullsizeImageURL);
                                                console.log('    > articleThumbnailImageURL : ' + articleThumbnailImageURL);
                                                console.log('    > articleFullsizeLeadImageURL : ' + articleFullsizeLeadImageURL);
                                                console.log('    > articleLeadImageURL : ' + articleLeadImageURL);
                                                console.log('    > articleFeature : ' + articleFeature);
                                                console.log('    > articleFeatureName : ' + articleFeatureName);
                                                console.log('    > articleFeatureName : ' + articleFeatureID);
                                                console.log('    > articleSponsored : ' + articleSponsored);
                                                console.log('    > articleSponsorName : ' + articleSponsorName);
                                                console.log('    > articleSponsorID : ' + articleSponsorID);
                                                console.log('    > articleIsLiveStream : ' + articleIsLiveStream);
                                                console.log('    > articleLiveVideoEmbed : ' + articleLiveVideoEmbed);
                                                console.log('    > articleLiveAppVideoEmbed : ' + articleLiveAppVideoEmbed);
                                                // console.log('    > articleContentBody : ' + articleContentBody);
                                                console.log('    > articleLeadMedia : ' + articleLeadMedia);
                                            }

                                            if (articleTitle === 'false' && articleDisplayDate === 'false') {
                                                setFail++;
                                                subTestResults['innerEndpoint'] = 'FAIL: Endpoint returning False values for required data. EndpointName: ' + endpointName + ' <br /> EndpointURL: ' + endpointUrl;

                                            } else if (articleTypeName !== 'FeaturePageHeader') {
                                                // Check for the Feature flag
                                                if (articleFeature === true) {
                                                    if (articleFeatureName.length <= 0) {
                                                        setFail++;

                                                        var __curError = 'Feature flag set to TRUE but featureName empty.';

                                                        console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureName empty.', 'ERROR'));
                                                        subTestResults['articleFeature'] = 'FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureName empty.';
                                                        var __curError = '';

                                                    } else if (articleFeatureID.length <= 0) {
                                                        setFail++;

                                                        var __curError = 'Feature flag set to TRUE but featureId empty.';
                                                        
                                                        console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureId empty.', 'ERROR'));
                                                        subTestResults['articleFeatureID'] = 'FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureId empty.';
                                                        var __curError = '';
                                                    }
                                                }

                                                // If gallery collect into gallery object
                                                if (articleTypeName == 'Gallery') {
                                                    var galleryContentURL = baseUrl + '/apps/news-app/content/gallery/?contentId=' + articleContentID;

                                                    if (debugOutput) {
                                                        console.log('    ------------------ ');
                                                        console.log('     Gallery\n');
                                                        console.log('      >  Gallery items url = ' + galleryContentURL);
                                                    }
                                                    if (showOutput) {
                                                        console.log('------------------------------------------');
                                                        console.log(' Gallery seen, ID: ' + articleContentID + ', Testing gallery images.');
                                                        console.log('------------------------------------------');
                                                    }
                                                    // Test gallery content
                                                    suite.galleryObjectTest(articleContentID, galleryContentURL, testID);
                                                }

                                                if (articleFullsizeImageURL.indexOf('0*false') > -1 || articleFullsizeImageURL == null) {
                                                    console.log(colorizer.colorize('FAIL: Image url invalid for fullsizeImageURL: ' + articleFullsizeImageURL + '.', 'ERROR'));
                                                    subTestResults['fullsizeImageURL'] = 'FAIL: Image url invalid for fullsizeImageURL: ' + articleFullsizeImageURL;
                                                }

                                                if (articleThumbnailImageURL.indexOf('0*false') > -1 || articleThumbnailImageURL == null) {
                                                    console.log(colorizer.colorize('FAIL: Image url invalid for thumbnailImageURL: ' + articleThumbnailImageURL + '.', 'ERROR'));
                                                    subTestResults['thumbnailImageURL'] = 'FAIL: Image url invalid for thumbnailImageURL: ' + articleThumbnailImageURL;
                                                }

                                                // Check for the Sponsor flag
                                                if (articleSponsored === true) {
                                                    if (articleSponsorName.length <= 0) {
                                                        setFail++;
                                                        
                                                        var __curError = 'Sponsored flag set to TRUE but sponsorName empty.';

                                                        console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorName empty.', 'ERROR'));
                                                        subTestResults['articleSponsorName'] = 'FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorName empty.';
                                                        var __curError = '';
                                                    } else if (articleSponsorID.length <= 0) {
                                                        setFail++;
                                                        
                                                        var __curError = 'Sponsored flag set to TRUE but sponsorID empty.';

                                                        console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorID empty.', 'ERROR'));
                                                        subTestResults['articleSponsorID'] = 'FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorID empty.';
                                                        var __curError = '';
                                                    }
                                                }

                                                // Check for the LiveStream flag
                                                if (articleIsLiveStream === true) {
                                                    if (articleLiveVideoEmbed.length <= 0) {
                                                        setFail++;

                                                        var __curError = 'Livestream flag set to TRUE but liveVideoEmbed empty.';

                                                        console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveVideoEmbed empty.', 'ERROR'));
                                                        subTestResults['articleIsLiveStream'] = 'FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveVideoEmbed empty.';

                                                        var __curError = '';
                                                    } else if (articleLiveAppVideoEmbed.length <= 0) {
                                                        setFail++;
                                                        
                                                        var __curError = 'Livestream flag set to TRUE but liveAppVideoEmbed empty.';

                                                        console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveAppVideoEmbed empty.', 'ERROR'));
                                                        subTestResults['articleLiveAppVideoEmbed'] = 'FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveAppVideoEmbed empty.';
                                                        var __curError = '';
                                                    }
                                                }

                                                if (typeof articleLeadMedia === 'object') {
                                                    if (debugOutput) {
                                                        console.log('    ------------------ ');
                                                    }

                                                    if (articleLeadMedia['typeName'] == 'Gallery') {
                                                        var galleryContentID = articleLeadMedia['contentID'];
                                                        var galleryContentURL = baseUrl + '/apps/news-app/content/gallery/?contentId=' + galleryContentID;

                                                        if (debugOutput) {
                                                            console.log('    ------------------ ');
                                                            console.log('     Lead Media Gallery\n');
                                                            console.log('      >  Gallery items = ' + baseUrl + '/apps/news-app/content/gallery/?contentId=');
                                                            console.log('       gallery url to test: ' + galleryContentURL);
                                                        }

                                                        suite.galleryObjectTest(articleContentID, galleryContentURL, testID);

                                                        var urlHealthStatus = suite.checkURLHealth(galleryContentURL, function (data) {
                                                            if (! data) {
                                                                
                                                                if (showOutput) {
                                                                   console.log(' > Lead media: Gallery loaded failed to load correctly: ' + colorizer.colorize(data, 'FAIL'));
                                                                }
                                                                setFail++;
                                                                subTestResults['leadMedia_gallery_urlHealthStatus'] = 'Lead media: Gallery loaded failed to load correctly';
                                                            }
                                                        });
                                                    }

                                                    if (articleLeadMedia['typeName'] == 'Video Release') {
                                                        var videoURL = 'https://link.theplatform.com/s/Yh1nAC/'+ articleLeadMedia['extID'] +'?manifest=m3u&formats=m3u,mpeg4,webm,ogg&format=SMIL&embedded=true&tracking=true';

                                                        if (debugOutput) {
                                                            console.log('    ------------------ ');
                                                            console.log('     Lead Media Video Release\n');
                                                            console.log('       articleLeadMedia[__indItems]' + articleLeadMedia['typeName']);
                                                            console.log('       articleLeadMedia[__indItems]' + articleLeadMedia['extID']);
                                                            console.log('       video url to test ' + videoURL);
                                                        }

                                                        var urlHealthStatus = suite.checkURLHealth(videoURL, function (data) {
                                                            if (! data) {
                                                                
                                                                if (showOutput) {
                                                                    console.log(' > Lead media: Video release file url Failed to load: ' + colorizer.colorize(data, 'FAIL'));
                                                                }
                                                                setFail++;
                                                                subTestResults['leadMedia_video_urlHealthStatus'] = 'Lead media: Video release file url Failed to load';
                                                            }
                                                        });
                                                    }
                                                    if (debugOutput) {console.log('  >---------------')};
                                                }
                                                
                                                if (Object.keys(subTestResults).length > 0){
                                                    // Add article ID to the results object
                                                    // endpointTestResults['articleContentID'] = articleContentID;
                                                    endpointTestResults['article_' + articleContentID + '_results'] = subTestResults;
                                                }

                                                if (Object.keys(endpointTestResults).length > 0){
                                                    testResultsObject['testResults'] = endpointTestResults;
                                                }
                                            }
                                            if (debugOutput) {console.log('  -----------------')};
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (showOutput) {
                        casper.wait(200, function() {
                            console.log(' > Endpoint testing completed with ' + setFail + ' FAILs.');
                        });
                    }                    
                } catch (e) {
                    if (showOutput) {
                        console.log('-------------------');
                        console.log(' JSON Parse Error  ');
                        console.log('-------------------');
                        console.log(' endpointName: '  + endpointName);
                        console.log(' endpointUrl: ' + endpointUrl);
                        console.log(' ' + colorizer.colorize('JSON Parse Fail:', 'FAIL') + e);

                        // console.log('   JSON Object ');
                        // console.log('  ------------------------------');
                        // console.log( JSON.stringify(output));
                        // console.log('  ------------------------------');
                    };
                    setFail++;
                    subTestResults['endpointContentValidationError_' + endpointName] = 'endpoint: ' + endpointUrl + ' // \n JSON Error: ' + e;
                    manifestTestStatus = 'Fail';
                }
            });
        }
    };

    apiSuite.prototype.galleryObjectTest = function(articleContentID, galleryURL, testID) {
        var suite = this;
            
        casper.thenOpen(galleryURL,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
            var status = this.status().currentHTTPStatus;

            if ( status == 200 || status == 301) {
                var output = this.getPageContent();
                if (debugOutput) {
                    console.log(' > Gallery url: ' + resp.url);
                }

                var galleryTestingResults = {};

                var urlCurrentLoadTime = suite.getLoadTime(resp.url, function (data) {
                    if (data) {
                        if (showOutput) {
                            console.log('> Gallery LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO') );
                        }

                        if (logResults) {
                            suite.logLoadTime(manifestTestRefID, 'apiContentTest', data, resp.url, 'gallery item');
                        }
                    } else {
                        console.log('-- no timing returned.');
                    }
                    
                });

                try{
                    jsonParsedOutput = JSON.parse(output);

                    for (var parentManifestItem in jsonParsedOutput) {    
                        if (parentManifestItem === 'items') {
                            var innerGalleryObjects = jsonParsedOutput[parentManifestItem];
                            for (var thisGalleryObject in innerGalleryObjects){
                                gallerySingleImageID = innerGalleryObjects[thisGalleryObject].imageID;
                                gallerySingleImageURL = innerGalleryObjects[thisGalleryObject].url;
                                
                                if (debugOutput) {
                                    console.log('gallerySingleImageID > ' + gallerySingleImageID);
                                    console.log('gallerySingleImageURL > ' + gallerySingleImageURL);
                                }

                                if (gallerySingleImageURL) {
                                    casper.thenOpen(gallerySingleImageURL).then(function(resp) {
                                        if (showOutput) {
                                            console.log(' > Gallery url: ' + resp.url);
                                        }

                                        httpStatus = this.status().currentHTTPStatus;

                                        if ( httpStatus != 200) {
                                            if (showOutput) {
                                                console.log('   - Fail: Gallery image failed to load.');
                                                console.log('   - gallerySingleImageID > ' + gallerySingleImageID);
                                                console.log('   - gallerySingleImageURL > ' + gallerySingleImageURL);
                                            }
                                            galleryTestingResults['galleryImage_' + gallerySingleImageID] = 'Fail: Unable to load gallery image: ' + gallerySingleImageURL;
                                            setFail++;
                                        } else {
                                            if (showOutput) {
                                                console.log(colorizer.colorize('   - Gallery image ', 'COMMENT') + gallerySingleImageID + colorizer.colorize(' // Status: ' + httpStatus, 'INFO'));
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    if (showOutput) {
                        console.log('-------------------');
                        console.log(' JSON Parse Error / Gal Obj Test  ');
                        console.log('-------------------');
                        console.log(' > mainContentID: ' + articleContentID);
                        console.log(' > Gallery url: ' + resp.url);
                        console.log(e);
                        console.log('------- output object output ---------');
                        console.log(output);
                        console.log('------- output ---------');
                    };
                    setFail++;
                    subTestResults['jsonParseError_' + articleContentID] = 'galleryURL: ' + resp.url + ' // \n JSON Error: ' + e;
                    manifestTestStatus = 'Fail';
                }
                if (Object.keys(galleryTestingResults).length > 0){
                    subTestResults[articleContentID + '_galleryResults'] = galleryTestingResults;
                }
            }
        });
    };
    
    apiSuite.prototype.checkURLHealth = function(url, callback) {
        var suite = this;

        if (url) {
            casper.thenOpen(url).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    output = 'Pass';
                } else {
                    output = false;
                }

                if (typeof(callback) === "function") {
                    callback(output);
                }
            })
        } else {
            throw new Error('checkURLHealth: Unable to test url, missing url;');
        }
    };

    new apiSuite(casper.cli.get('url'));
});
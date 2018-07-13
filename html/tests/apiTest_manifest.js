// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 1.0 of JSON Testing; V.3 of Manifest testing.
// Casper 1.1.0-beta3 and Phantom 1.9.8
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
//    optional string params:
//      --output=debug          > to show logged key/val strings
//      --output=console        > will show test results
//      --task=createDictionary > to create dictionary for current property/station
//      --testing               > disables DB logging of test results
//
// JSON Manifest
// templates/nbc_news_app_json_manifest?apiVersion=6
//
// Testing starts @ Line 250

casper.test.begin('OTS SPIRE | API Manifest Audit', function suite(test) {

    var colorizer = require('colorizer').create('Colorizer');
    var logResults = true;
    var envConfig = casper.cli.get('env');

    if (envConfig === 'local') {
        var configURL = 'http://spire.local';
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

    var type = casper.cli.get('task');
        if (type === 'createDictionary') {
            var createDictionary = true;
            var logResults = false;
        }

    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

    if ( ! casper.cli.get('enablevalidation') ) {
        var enableJsonValidation = '&enableJsonValidation=false';
    }

    // Global Vars
    var collectionObject = {},
        dictionaryObject = {},
        testResultsObject = {},
        manifestTestRefID,
        manifestTestStatus,
        setFail = 0,
        testStartTime,
        manifestLoadTime,
        clickXServerName,
        testManifestData = true,
        apiSuiteInstance,
        resourcesTime = [],
        apiVersion,
        listener = function(resource, request) {
            var date_start = new Date();

            resourcesTime[resource.id] = {
                'id': resource.id,
                'start': date_start.getTime(),
                'end': -1,
                'time': -1,
                'status': resource.status
            }

            if (debugOutput) {
                this.echo('resourcesTime :: ' + resourcesTime[resource.id]['time']);
            }
        },
        receivedListener = function(resource, request) {
            var date_end = new Date();

            resourcesTime[resource.id]['end']  = date_end.getTime();
            resourcesTime[resource.id]['time'] = resourcesTime[resource.id]['end'] - resourcesTime[resource.id]['start'];
            manifestLoadTime = resourcesTime[resource.id]['time'];
            
            if (debugOutput) {
                /* to debug and compare */
                this.echo('manifestLoadTime >> ' + manifestLoadTime);
                this.echo('resource time >> ' + resourcesTime[resource.id]['time']);
            }

            // Get Click server name
            var headerObject = resource.headers;

            for (var keys in headerObject) {
                if (headerObject[keys].name == 'X-Server-Name') {
                    if (debugOutput) {
                        console.log(headerObject[keys].name);
                        console.log(headerObject[keys].value);
                    }
                    resourcesTime[resource.id].clickXServerName  = headerObject[keys].value;
                    clickXServerName = headerObject[keys].value;
                }

            }

            // Get Click server name
            var headerObject = resource.headers;

            for (var keys in headerObject) {
                if (headerObject[keys].name == 'X-Server-Name') {
                    if (debugOutput) {
                        console.log(headerObject[keys].name);
                        console.log(headerObject[keys].value);
                    }
                    resourcesTime[resource.id].clickXServerName  = headerObject[keys].value;
                }

            }
        },
        // Required API keys for app to function correctly. Commented out some items due to not being 100% needed.
        reqKeys = new Array(
            "domain",
            "market-site-key",
            "launch-image-name",
            "ugc-partition-id",
            "video-autoplay",
            "push-notification-url-key",
            "push-notification-flag-key",
            // "comscore-app-name",
            /*
            "web-links__facebook__url",
            "web-links__google-plus__url",
            "web-links__instagram__url",
            */
            "web-links__search__title",
            "web-links__search__url",
            "web-links__send-feedback__url",
            "web-links__settings-privacy-policy__title",
            "web-links__settings-privacy-policy__url",
            "web-links__traffic__url",
            "web-links__tv-listings__title",
            "web-links__tv-listings__url",
            "web-links__tve__url",
            /*
            "web-links__twitter__url",
            */
            "web-links__weather-alerts__url",
            "web-links__weather-school-closings__url",
            "advertising__display__network-id",
            "advertising__display__echo-transition-delay",
            "echo-transition-delay",
            "advertising__splash__enabled",
            "advertising__splash__ad-unit-level2",
            "advertising__splash__request-timeout",
            "advertising__splash__display-duration",
            "advertising__splash__target-width",
            "advertising__splash__target-height",
            "advertising__splash__scaling-x",
            "advertising__splash__scaling-y",
            "advertising__video__network-id",
            "advertising__video__direct-sold-target-width",
            "advertising__video__direct-sold-target-height",
            "advertising__video__backfill-target-width",
            "advertising__video__backfill-target-height",
            "advertising__video__backfill-app-id",
            "backfill-app-id",
            "wsi-map-id",
            // "wsi-market-default-layer",
            // "app-urls__weather-branding",
            // "app-urls__iteam-branding",
            "app-urls__alerts",
            "app-urls__ugctemplets",
            "app-urls__breaking",
            "app-urls__home",
            "app-urls__home-investigation",
            "app-urls__facebook-comments-script",
            "app-urls__navigation",
            "app-urls__settings-terms-of-use",
            "app-urls__settings-terms-of-service",
            "app-urls__settings-closed-captioning-faq",
            "app-urls__submit-media",
            "app-urls__trending",
            "app-urls__weather-forcast-video",
            "app-urls__weather-forcast-story",
            "app-urls__weather-maps",
            "app-base-urls__advertising-display",
            "app-base-urls__advertising-video",
            "app-base-urls__home-top-stories",
            "app-base-urls__content",
            "app-base-urls__gallery",
            "app-base-urls__recommended",
            "app-base-urls__related",
            // "app-base-urls__weather-conditions-icon",
            "app-base-urls__weather-forcast",
            "app-base-urls__weather-wsi-forcast",
            "app-base-urls__weather-location-lookup",
            "omniture__report-suite-ids",
            "omniture__tracking-server",
            "omniture__app-section-server-name",
            "omniture__page-view-event",
            "omniture__link-type",
            "omniture__station-division",
            "omniture__station-business-unit",
            "omniture__station-call-sign",
            "omniture__station-market",
            /*
            "force-update",
            "update-screen-title",
            "update-screen-desc",
            "update-screen-appUrl",
            "update-screen-appversion",
            */
            "advertising__ad-unit-level1",
            "advertising__fw_ssid",
            /*
            "adtest",
            */
            "advertising__stage",
            "advertising__article-interstitial",
            "advertising__gallery-interstitial",
            "advertising__default-iab-category-tier1",
            "advertising__default-iab-category-tier2",
            "advertising__splash__display-duration",
            "contact__name",
            "contact__address-line1",
            "contact__address-line2",
            "contact__phone",
            /*
            "contact-Info__phone1__contactInfoLabel",
            "contact-Info__phone1__contactInfoNumber",
            "contactInfoNumber",
            "contact-Info__phone2__contactInfoLabel",
            "contact-Info__phone2__contactInfoNumber",
            "contact-Info__phone3__contactInfoLabel",
            "contact-Info__phone3__contactInfoNumber",
            */
            "contact__investigation-phone",
            "contact__investigation-email",
            "weather__meteorologist-summary-disabled",
            "weather__market-default-postal-code",
            "weather__market-default-location-name",
            // "weather__market-default-dma",
            "weather__market-default-lat",
            "weather__market-default-long",
            "weather__scroll-down-animation-hour",
            "weather__scroll-down-animation-display-sec",
            "weather__geo-location-prompt-visit-interval",
            /*
            "app-id",
            */
            "live-promotion__is-live-promotion",
            "live-promotion__promotion-type",
            "live-promotion__url-schema-ios",
            "live-promotion__app-link-ios",
            "live-promotion__url-schema-android",
            "live-promotion__app-link-android"
        ),
        apiSuite = function(url) {

            if (!url) {
                throw new Error('A URL is required!');
            } else {

                var parser = document.createElement('a');
                parser.href = url;

                newUrl = parser.href;
                var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
                var urlUri = sourceString.replace('.','_');

                /*******************
                *
                * Start Testing
                *
                *******************/
                casper.start().then(function (resp) {
                    if (casper.cli.get('apiVersion')) {
                        apiSuiteInstance.apiVersion = casper.cli.get('apiVersion');
                    } else {
                        apiSuiteInstance.getGlobalAPIVer();
                    }
                }).then(function () {
                    apiSuiteInstance.apiURL = url + '/apps/news-app/manifest/json/?apiVersion=' + apiSuiteInstance.apiVersion + enableJsonValidation;
                    apiSuiteInstance.stationProperty = /www\.(\S+)\.com/.exec(apiSuiteInstance.apiURL)[1];

                }).then(function () {
                    casper.thenOpen(apiSuiteInstance.apiURL, { method: 'get'}, function (resp) {
                        var headerObject = resp.headers;

                        for (var keys in headerObject) {
                            if (headerObject[keys].name == 'X-Server-Name') {
                                if (debugOutput) {
                                    console.log(headerObject[keys].name);
                                    console.log(headerObject[keys].value);
                                }
                                testResultsObject['clickXServer'] = headerObject[keys].value;
                            }

                        }
                        
                        if ( resp.status == 200 ) {
                            var urlCurrentLoadTime = apiSuiteInstance.getLoadTime(apiSuiteInstance.apiURL, function (data) {
                                if (data) {
                                    if (showOutput) {
                                        console.log('> LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO') );
                                    }
                                } else {
                                    console.log('-- no timing returned.');
                                }
                                
                            });

                            if(createDictionary){
                                console.log(urlUri + ' Dictionary creation/update started.');
                            } else {
                                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + apiSuiteInstance.apiURL );
                            }
                        } else {
                            casper.test.fail('Page did not load correctly. Response: ' + resp.status);
                        }
                    });
                }).then(function () {
                    if (createDictionary) {
                        apiSuiteInstance.collectManifestData(apiSuiteInstance.apiURL, type, 'xx');
                    } else {
                        // Create ref test ID and start manifest data collection for testing
                        apiSuiteInstance.createTestID(apiSuiteInstance.apiURL, type, urlUri);
                    }

                    // Log test load time. Moved to allow for waiting of testID to get set
                }).then(function () {
                    apiSuiteInstance.logLoadTime(manifestTestRefID, 'apiManifestTest', manifestLoadTime, apiSuiteInstance.apiURL, clickXServerName);
                }).then(function () {
                    if(createDictionary){
                        apiSuiteInstance.updateInsertManifestDictionary(urlUri, collectionObject);

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
                    } else {
                        if (testManifestData) {
                            apiSuiteInstance.testManifestData(urlUri, collectionObject, manifestTestRefID);
                        }
                    }

                }).then(function () {
                    if (debugOutput) {
                        console.log('---------------------');
                        console.log(' Test Results object   ');
                        console.log('---------------------');
                        for (var testResultsItem in testResultsObject) {
                            console.log('>>>>> ' + testResultsItem + ' : ' + testResultsObject[testResultsItem]);
                        }
                    }

                    //Process test results to DB
                    if (logResults) {
                        apiSuiteInstance.processTestResults(urlUri, testResultsObject, manifestTestRefID, setFail, 'apiManifestTest', manifestLoadTime, manifestTestStatus);
                    }

                }).run(function() {
                    if(createDictionary){
                        console.log(urlUri + ' Dictionary creation/update ended.');
                    } else {
                        console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
                    }

                    this.exit();
                    test.done();
                });
            }
        };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {

        // require('utils').dump( current );
        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-manifest&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            apiSuiteInstance.collectManifestData(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.thenOpen(dbUrl).then(function(resp) {

                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        manifestTestRefID = casper.getElementInfo('body').text;

                        apiSuiteInstance.collectManifestData(url, type, manifestTestRefID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    // Create test id in DB
    apiSuite.prototype.getGlobalAPIVer = function (randomVar) {
        // var apiSuiteInstance = this;

        var dbUrl = configURL + '/utils/tasks?task=getStationsGlobalAPIVer';

        if (dbUrl) {
            if (debugOutput) {console.log(dbUrl); }

            casper.thenOpen(dbUrl).then(function (resp) {
                var pageOutput = null;

                if (resp.status === 200) {
                    if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl); }

                    pageOutput = this.getHTML();                    

                    apiSuiteInstance.apiVersion = casper.getElementInfo('body').text;

                    if (debugOutput) {
                        console.log('>>>>> API Version: ' + apiSuiteInstance.apiVersion);
                    }
                } else {
                    throw new Error('Unable to get/store Test ID!');
                }
            });
        }
    };

    apiSuite.prototype.getLoadTime = function(url, callback) {

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
    apiSuite.prototype.logLoadTime = function(testID, testType, manifestLoadTime, endPoint, clickXServerName, testInfo) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log(processUrl);
            console.log(testID, testType, manifestLoadTime, endPoint, clickXServerName, testInfo);
        }

        if (clickXServerName === null) {
            clickXServerName = '----';
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'logLoadTime',
                'testID': testID,
                'testType': testType,
                'manifestLoadTime': manifestLoadTime,
                'endPoint': endPoint,
                'clickXServerName': clickXServerName,
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

    apiSuite.prototype.updateInsertManifestDictionary = function(urlUri, collectionObject) {
        var processUrl = configURL + '/utils/processRequest';
        // &dictionaryStation=' + urlUri + '&dictionaryData=' + JSON.stringify(collectionObject);

        if (debugOutput) {
            console.log('dictionaryStation > ' + urlUri);
            console.log('dictionaryData    > ' + JSON.stringify(collectionObject));
            console.log('---------------------');
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'createDictionary',
                'dictionaryStation': urlUri,
                'dictionaryData':  JSON.stringify(collectionObject)
            }
        });
    };

    apiSuite.prototype.processTestResults = function(urlUri, testResultsObject, testID, testFailureCount, testType, manifestLoadTime, manifestTestStatus) {
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
                'testFailureCount': testFailureCount,
                'manifestLoadTime': manifestLoadTime,
                'testResults':  JSON.stringify(testResultsObject)
            }
        });
    };

    apiSuite.prototype.collectManifestData = function(url, type, testID) {

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
                            apiSuiteInstance.buildmanifestCollectionObject(manifestKeyName, manifestKeyValue);
                        
                        } else {
                            apiSuiteInstance.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem]);
                        }
                    }
                } catch (e) {
                    // ...
                    if (showOutput) {
                        console.log('-------------------');
                        console.log(' JSON Parse Error  ');
                        console.log('-------------------');
                        console.log(e)
                        console.log('-------------------');
                        console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'collectManifestData failure: Parse fail!');
                    };

                    var JSONerror = "'" + e + "'";
                    var brokenJSONString = output.replace(/[\n\t\s]+/g, " ");
                    setFail++;

                    apiSuiteInstance.logPaylodError(manifestTestRefID, 'apiManifestTest', JSONerror, url, brokenJSONString);

                    manifestTestStatus = 'Fail';
                    testResultsObject['testStatus'] = 'FullFail';
                    testResultsObject['testResults'] = 'JSON Parse Error: Unable to collect manifest data, manifest failed to load properly.';
                    
                    testManifestData = false;
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        })

    };

    apiSuite.prototype.spiderObject = function(parentObjectName, childManifestObject) {

        // Manifest keys are built as key__ +
        // Ex: parentKeyName__childKeyName__grandChildKeyName__lineageItemKeyName : Value
        // Live Ex: TVE__OnDemand__featured_shows__0__show_img : http://media.nbcnewyork.com/designimages/featured_show_1_ondemand2x.png

        for (var childItem in childManifestObject) {
            if (typeof childManifestObject[childItem] != 'object') {
                var manifestMainObjectName = parentObjectName.toLowerCase() + '__' + childItem.toLowerCase();

                if (debugOutput) {
                    console.log(colorizer.colorize(manifestMainObjectName, 'INFO') + ' : ' + childManifestObject[childItem]);
                }

                // Add key/val to collection object for testing if required;
                apiSuiteInstance.buildmanifestCollectionObject(manifestMainObjectName, childManifestObject[childItem]);

            } else {
                var manifestObjectName = parentObjectName.toLowerCase() + '__' + childItem.toLowerCase();
                apiSuiteInstance.spiderObject(manifestObjectName, childManifestObject[childItem]);
            }
        }
    };

    apiSuite.prototype.buildmanifestCollectionObject = function(manifestCollectionObjectName, manifestCollectionObjectValue) {
        reqKeys.reverse();

        // If manifestCollectionObjectName found in required manifest key array, add it to the collection object for testing
        for (var reqKeysItem in reqKeys){
            
            if (manifestCollectionObjectName == reqKeys[reqKeysItem]) {

                collectionObject[manifestCollectionObjectName] = manifestCollectionObjectValue;
            }
        }

    };

    apiSuite.prototype.pullManifestDictionaryData = function(station, callback) {
        var dbUrl = configURL + '/utils/tasks?task=getDictionaryData&property=' + station;

        if (dbUrl) {
            casper.open(dbUrl).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    if (debugOutput) { console.log(colorizer.colorize('Manifest dictionary data: ', 'COMMENT') + dbUrl ) };
                    
                    output = casper.getElementInfo('body').text;
                } else {
                    throw new Error('Unable to pull manifest data, util url missing: ' + status);
                }

                if (typeof(callback) === "function") {
                    callback(output);
                }
            })
        } else {
            throw new Error('Unable to pull manifest data, util url missing.');
        }
    };


    apiSuite.prototype.testManifestData = function(url, manifestCollectionObject, testID) {
        var errorCount = 0,
            testErrors = [],
            currentTestObject = {},
            currentTestObjectFailures = {},
            dictionaryManifestObject = apiSuiteInstance.pullManifestDictionaryData(url, function (data) {

                var obj1 = JSON.parse(data);
                var obj2 = manifestCollectionObject;

                Object.keys(obj1).forEach( function (key) {
                    console.log(colorizer.colorize('key: ', 'COMMENT') + key );
                    if (showOutput) {
                        console.log(' -  dict val:  ' + obj1[key]);
                        console.log(' -  live val:  ' + obj2[key]);
                    }

                    try{
                        test.assertEquals(obj1[key], obj2[key]);
                    } catch (e) {        
                        // casper.test.error(e);
                        if (showOutput) {
                            console.log(colorizer.colorize('FAIL:', 'ERROR') + ' [' + [key] + '] Value mismatch // ' + obj1[key] + ' !== ' + obj2[key]);
                        }
                        testErrors.push('[' + [key] + '] Value mismatch // ' + obj1[key] + ' !== ' + obj2[key]);
                        
                        currentTestObjectFailures['expectedValue'] = obj1[key];
                        currentTestObjectFailures['liveValue'] = obj2[key];

                        currentTestObject[key] = currentTestObjectFailures;

                        errorCount++
                    }
                    console.log('---------------------------');
                });

                if (errorCount > 0) {

                    // Add test results to results object; debug below
                    manifestTestStatus = 'Fail';
                    testResultsObject['testResults'] = currentTestObject;

                    if (debugOutput) {
                        console.log('---------------------------');
                        console.log(' Test Results Collection');
                        console.log('---------------------------');
                        for (var thisTestItem in currentTestObject) {
                            if (typeof currentTestObject[thisTestItem] != 'object') {
                                console.log('-' + thisTestItem + ' : ' + currentTestObject[thisTestItem]);
                            } else {
                                console.log('  -' + thisTestItem + ' :');
                                var subValueKeySet = currentTestObject[thisTestItem];

                                for ( var testValues in subValueKeySet) {
                                    console.log('    -' + testValues + ' : ' + subValueKeySet[testValues]);
                                }
                            }
                        }
                    }

                    // Display error report for current test
                    testErrors.reverse();
                    // console.log(currentTestObject);

                    console.log('\n');
                    console.log('---------------------------');
                    console.log(' ! ' + errorCount + ' Failures Found !');
                    console.log('---------------------------');

                    setFail = errorCount;

                    for (var i = testErrors.length - 1; i >= 0; i--) {
                        console.log(colorizer.colorize('- FAIL: ' + testErrors[i], 'ERROR'));
                    }
                    console.log('\n');
                    casper.test.fail( errorCount + ' errors found.' );
                } else {
                    manifestTestStatus = 'Pass';
                    testResultsObject['testStatus'] = 'Pass';
                    testResultsObject['testResults'] = 'No data collected, all keys with Pass status.';
                }

            });  
    };
    apiSuiteInstance = new apiSuite(casper.cli.get('url'));
});
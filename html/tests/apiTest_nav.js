/*globals
    casper, console, document, require
*/
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
// curl -I "http://www.nbcnewyork.com/templates/nbc_news_app_json_manifest?apiVersion=5&c=n" -H "bowl: arch" -H "Pragma: akamai-x-cache-on,akamai-x-get-cache-key,akamai-x-check-cacheable"

casper.test.begin('OTS SPIRE | API Navigation Audit', function (test) {
    'use strict';
    // Global Vars
    var logResults = true,
        apiSuiteInstance = null,
        colorizer = require('colorizer').create('Colorizer'),
        envConfig = casper.cli.get('env'),
        configURL = 'http://54.243.53.242',
        testType = casper.cli.get('output'),
        debugOutput = false,
        showOutput = false,
        currentTestObject = {},
        loadTimesCollectionObject = {},
        manifestTestStatus = 'Pass',
        setFail = 0,
        testStartTime,
        resourcesTime = {},
        apiVersion = '6',
        enableJsonValidation = '',
        linkParser = document.createElement('a'),
        listener = function (resource) {
            linkParser.href = resource.url;
            if (/^\/apps\/news-app/.exec(linkParser.pathname) === null) {
                // not an api call, skip it.
                return;
            }
            var date_start = new Date();

            resourcesTime[resource.id] = {
                'id': resource.id,
                'url': resource.url,
                'start': date_start.getTime(),
                'end': -1,
                'time': -1,
                'status': resource.status
            };

            if (debugOutput) {
                this.echo('resourcesTime :: ' + resourcesTime[resource.id].time);
            }
        },
        receivedListener = function (resource) {
            if (resourcesTime.hasOwnProperty(resource.id) === false) {
                // we don't have any data for this request.
                return;
            }

            var date_end = new Date();
            resourcesTime[resource.id].end  = date_end.getTime();
            resourcesTime[resource.id].time = resourcesTime[resource.id].end - resourcesTime[resource.id].start;

            if (debugOutput) {
                /* to debug and compare */
                this.echo('manifestLoadTime >> ' + resourcesTime[resource.id].time);
                this.echo('resource time >> ' + resourcesTime[resource.id].time);
            }
        },
        apiSuite = function (url) {
            if (!url) {
                throw new Error('A URL is required!');
            }

            this.nav_url = url + '/apps/news-app/navigation/?apiVersion=' + apiVersion + enableJsonValidation;
            this.stationProperty = /www\.(\S+)\.com/.exec(this.nav_url)[1];
            this.manifestTestRefID = null;
            this.collectionObject = {};
            this.testResultsObject = {};

            /*******************
            *
            * Start Testing
            *
            *******************/
            casper.start(this.nav_url).then(function (response) {
                if (response.status === 200) {
                    console.log(colorizer.colorize('Testing started: ', 'COMMENT') + response.url);
                    apiSuiteInstance.createTestID(response.url, apiSuiteInstance.stationProperty);
                } else {
                    throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
                }
            }).then(function () {
                // Display collection object
                if (debugOutput) {
                    console.log('---------------------');
                    console.log(' Collection object   ');
                    console.log('---------------------');
                    var keys = Object.keys(apiSuiteInstance.collectionObject),
                        thisItem = null,
                        i = 0;

                    for (i = 0; i < keys.length; i += 1) {
                        thisItem = apiSuiteInstance.collectionObject[keys[i]];
                        console.log('>>>>> ' + thisItem + ' : ' + thisItem);
                    }
                } else {
                    // Test Collection data
                    apiSuiteInstance.testNavigationData();
                }

            }).then(function () {
                // Porcess All Test Results Data
                console.log(colorizer.colorize('Processing test results...', 'COMMENT'));

                // Process test results
                if (debugOutput) {
                    console.log('---------------------');
                    console.log(' Test Results object   ');
                    console.log('---------------------');
                    console.log('Test Status: ' + manifestTestStatus);
                    console.log('starting for loop..');

                    var i = 0,
                        i2 = 0,
                        i3 = 0,
                        keys = Object.keys(apiSuiteInstance.testResultsObject),
                        keys2 = null,
                        keys3 = null,
                        resultsCollectionItem = null,
                        resultsItemSubObject = null,
                        thisSubItem = null,
                        thisChildObject = null,
                        thisChildItem = null;

                    for (i = 0; i < keys.length; i += 1) {
                        resultsCollectionItem = keys[i];
                        resultsItemSubObject = apiSuiteInstance.testResultsObject[keys[i]];
                        console.log('- ' + resultsCollectionItem + ' : ' + resultsItemSubObject);

                        if (resultsItemSubObject instanceof Object) {
                            keys2 = Object.keys(resultsItemSubObject);
                            for (i2 = 0; i2 < keys2.length; i += 1) {
                                thisSubItem = keys2[i2];
                                thisChildObject = resultsItemSubObject[thisSubItem];
                                if (thisChildObject instanceof Object) {
                                    keys3 = Object.keys(thisChildObject);
                                    for (i3 = 0; i < keys3.length; i += 1) {
                                        thisChildItem = keys3[i3];
                                        console.log('      --- ' + thisChildItem + ' : ' + thisChildObject[thisChildItem]);
                                    }
                                }
                            }
                        }
                    }
                    console.log('done');
                }

                //Process test results to the DB
                if (logResults) {
                    apiSuiteInstance.processTestResults(setFail, 'apiNavTest', manifestTestStatus);
                    apiSuiteInstance.processLoadTimes();
                }
            }).run(function () {
                console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
                this.exit();
            });
        };

    casper.on('resource.requested', listener);
    casper.on('resource.received', receivedListener);

    if (envConfig === 'local') {
        configURL = 'http://spire.app';
    } else if (envConfig === 'dev') {
        configURL = 'http://45.55.209.68';
    }

    if (testType === 'debug') {
        debugOutput = true;
    } else if (testType === 'console') {
        showOutput = true;
    }

    if (casper.cli.get('testing')) {
        logResults = false;
    }

    if (!casper.cli.get('enablevalidation')) {
        enableJsonValidation = '&enableJsonValidation=false';
    }

    apiSuite.prototype.processLoadTimes = function () {
        var i = 0,
            keys = Object.keys(resourcesTime),
            thisResource = null,
            typeName = null;

        for (i = 0; i < keys.length; i += 1) {
            thisResource = resourcesTime[keys[i]];

            typeName = 'apiSectionContent';

            if (thisResource.url.indexOf('/apps/news-app/navigation') > -1) {
                typeName = 'apiNavTest';
            }

            this.logLoadTime(typeName, thisResource.time, thisResource.url, null);
        }
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function (url, stationProperty) {
        // var apiSuiteInstance = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-nav&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults) {
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx'); }
            apiSuiteInstance.collectionNavigationItems(url, 'xx');
        } else {
            if (dbUrl) {
                casper.thenOpen(dbUrl).then(function (resp) {
                    if (resp.status === 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl); }

                        var output = this.getHTML();
                        apiSuiteInstance.manifestTestRefID = casper.getElementInfo('body').text;

                        apiSuiteInstance.collectionNavigationItems(url);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    // Log endpoint time
    apiSuite.prototype.logLoadTime = function (typeName, manifestLoadTime, endPoint, testInfo) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log(processUrl);
            console.log(this.manifestTestRefID, typeName, manifestLoadTime, endPoint, testInfo);
        }

        if (testInfo === null) {
            testInfo = '';
        }

        casper.thenOpen(processUrl, {
            method: 'post',
            data:   {
                'task': 'logLoadTime',
                'testID': this.manifestTestRefID,
                'testType': typeName,
                'manifestLoadTime': manifestLoadTime,
                'endPoint': endPoint,
                'testInfo': testInfo
            }
        });
    };

    // Log endpoint JSON Errors
    apiSuite.prototype.logPayloadError = function (typeName, error, endpoint, payload) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log(processUrl);
            console.log(this.manifestTestRefID, typeName, error, endpoint, payload);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'logPayloadError',
                'testID': this.manifestTestRefID,
                'testType': typeName,
                'error': error,
                'endpoint': endpoint,
                'payload': payload
            }
        });
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function (testFailureCount, typeName, manifestTestStatus) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            // console.log('>> process url: ' + processUrl);
            console.log('------------------------');
            console.log(' Process Results Data  ');
            console.log('------------------------');
            console.log('urlUri => ' + this.stationProperty);
            console.log('testResultsObject => ' + apiSuiteInstance.testResultsObject);
            console.log('testID => ' + this.manifestTestRefID);
            console.log('testFailureCount => ' + testFailureCount);
            console.log('testType => ' + typeName);
            // console.log('manifestLoadTime => ' + manifestLoadTime);
            console.log('manifestTestStatus => ' + manifestTestStatus);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'processManifestTestResults',
                'testID': this.manifestTestRefID,
                'testType': typeName,
                'testProperty': this.stationProperty,
                'testStatus': manifestTestStatus,
                'testFailureCount': testFailureCount,
                'manifestLoadTime': 123,
                'testResults':  JSON.stringify(apiSuiteInstance.testResultsObject)
            }
        });
    };

    apiSuite.prototype.collectionNavigationItems = function (url) {
        casper.open(url, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function (resp) {
            if (resp.status === 200) {
                var validated = false,
                    output = this.getPageContent(),
                    jsonParsedOutput = null;

                try {
                    jsonParsedOutput = JSON.parse(output);

                    for (var parentManifestItem in jsonParsedOutput) {

                        if (typeof jsonParsedOutput[parentManifestItem] != 'object') {
                            if (debugOutput) {
                                console.log(colorizer.colorize(parentManifestItem.toLowerCase(), 'INFO') + ' : ' + jsonParsedOutput[parentManifestItem]);
                            }

                            var manifestKeyName = parentManifestItem.toLowerCase();
                            var manifestKeyValue = jsonParsedOutput[parentManifestItem];
                        } else {
                            apiSuiteInstance.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                        }
                    }
                } catch (e) {
                    console.log('here 2');
                    console.log(e);

                    var JSONerror = 'Parse Failure: ' + e,
                        brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                    apiSuiteInstance.logPayloadError('apiContentTest', JSONerror, url, brokenJSONString);

                    if (showOutput) {console.log(e); }
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        });
    };

    apiSuite.prototype.spiderObject = function (parentObjectName, childManifestObject, initialPass) {
        // var apiSuiteInstance = this;
        var firstPass = true;
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
                    var navItemAppTitleNiceName = subObject[subItem],
                        navItemAppTitle,
                        navItemAppLocationURL;

                        if (subObject.length <= 0) {
                            throw new Error('key blank ' + subItem);
                        } else {

                            if (subItem === 'appTitle') {
                                if (initialPass) {
                                    navItemAppTitle = navItemAppTitleNiceName.replace('\/',"_").split(' ').join('_').toLowerCase();
                                } else {
                                    navItemAppTitle = parentObjectName.replace('\/',"_").split(' ').join('_').toLowerCase() +
                                                      '__' +
                                                      navItemAppTitleNiceName.replace('\/',"_").split(' ').join('_').toLowerCase();
                                }
                            }

                            if (subItem === 'location') {
                                if (debugOutput) {
                                    console.log(subItem + ' : ' + navItemAppTitleNiceName);
                                }

                                // Find actual links and append the corrent version string to the end of the url
                                if (navItemAppTitleNiceName.indexOf('/apps') > -1) {

                                    if (navItemAppTitleNiceName.indexOf('?') > -1) {
                                        navItemAppLocationURL = __baseUrl + navItemAppTitleNiceName + '&apiVersion=' + apiVersion + enableJsonValidation;
                                    } else {
                                        navItemAppLocationURL = __baseUrl + navItemAppTitleNiceName + '?apiVersion=' + apiVersion + enableJsonValidation;
                                    }

                                    if (debugOutput) {
                                        console.log(navItemAppLocationURL);
                                    }
                                } else {
                                    navItemAppLocationURL = navItemAppTitleNiceName;
                                }

                                if (debugOutput) {
                                    console.log('navItemAppTitleNiceName > ' + navItemAppTitleNiceName);
                                    console.log('navItemAppTitle > ' + navItemAppTitle);
                                    console.log('navItemAppLocationURL > ' + navItemAppLocationURL);
                                }
                                // Push data into collection
                                this.collectionObject[navItemAppTitle] = navItemAppLocationURL;
                            }

                            if (typeof __thisItem == 'object') {
                                parentObjectName = false;
                                apiSuiteInstance.spiderObject(navItemAppTitle, subObject[subItem], false);
                            }
                        }
                    }
                if (debugOutput) { console.log('------'); }
            }
        }
    };


    apiSuite.prototype.testNavigationData = function () {
        // var apiSuiteInstance = this;
        var baseUrl = casper.cli.get('url'),
            endpointUrl = null,
            keys = Object.keys(this.collectionObject),
            i = 0,
            thisURL = null,
            endpointName = null;

        // Test collection object and add to results object
        for (var i = 0; i < keys.length; i += 1) {
            endpointName = keys[i];
            thisURL = this.collectionObject[endpointName];

            if (thisURL.indexOf('tve') > -1 || thisURL.indexOf('.html') > -1) {
                if (
                    thisURL.indexOf('contests') > -1 ||
                    thisURL.indexOf('community') > -1 ||
                    thisURL.indexOf('tve') > -1 ||
                    thisURL.indexOf('weather-alerts') > -1 ||
                    thisURL.indexOf('tv-listings') > -1 ||
                    thisURL.indexOf('bit.ly') > -1 ||
                    thisURL.indexOf('traffic') > -1 ||
                    thisURL.indexOf('horoscopo') > -1 ||
                    thisURL.indexOf('lottery') > -1 ||
                    thisURL.indexOf('avisos-del-tiempo') > -1 ||
                    thisURL.indexOf('data.nbcstations.com') > -1 ||
                    thisURL.indexOf('FAQ') > -1 ||
                    thisURL.indexOf('Frequently-Asked-Questions') > -1 ||
                    thisURL.indexOf('faq') > -1 ||
                    thisURL.indexOf('investigations') > -1 ||
                    thisURL.indexOf('Tips') > -1 ||
                    thisURL.indexOf('submit-your-photos') > -1 ||
                    thisURL.indexOf('submit-media') > -1 ||
                    thisURL.indexOf('CazaTormentas') > -1)
                {
                    if (showOutput) {
                        test.comment('> Skipping UGC/static content url, skipping JSON test.' );
                        test.comment('  > ' + endpointName );
                        test.comment('  > ' + thisURL );
                    }
                } else {
                    var location_url = thisURL,
                        cms_contentID = null;

                    if (/^https?:\/\/www\.(nbc|telemundo)/.exec(location_url)) {
                        cms_contentID = /(\d+)\.html$/.exec(location_url);
                        if (cms_contentID) {
                            location_url = '?contentId=' + cms_contentID[1];
                        }
                    }
                    // http://www.nbclosangeles.com/apps/news-app/content/?contentId=389777331&apiVersion=6
                    endpointUrl = baseUrl + '/apps/news-app/content/' + location_url + '&apiVersion=' + apiVersion + enableJsonValidation;

                    if (debugOutput) { console.log('> parsedLocationURL: ' + location_url); }
                }
            } else {
                endpointUrl = thisURL;
            }

            if (!!endpointUrl) {
                this.validateJson(endpointName, endpointUrl);
            } else {
                console.log(colorizer.colorize('ERROR: ', 'WARNING') + 'NavTestError: No url provided to test against: ' + endpointName);
                currentTestObject[endpointName] = 'NavDataTestError: No url provided to test against for the current endpoint.';
                testResultsObject.testResults = currentTestObject;
                manifestTestStatus = 'Fail';
                setFail++;
            }
        }
    };

    apiSuite.prototype.validateJson = function (urlName, url, status) {
        // var apiSuiteInstance = this;
        var currentTestStatus = "Pass";

        if (url) {
            casper.thenOpen(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function (resp) {

                if (debugOutput) { require('utils').dump(resp); }

                var currentPageContentType = resp.contentType;
                var validated = false;
                var status = this.status().currentHTTPStatus;
                var output = this.getPageContent();
                var currentTestResults = {};

                if ( status == 200) {
                    if (debugOutput) {
                        console.log(currentPageContentType);
                    }

                    if (
                        currentPageContentType.indexOf('.html') > -1 ||
                        urlName.indexOf('submit_photos_videos') > -1 ||
                        resp.url.indexOf('contests') > -1 ||
                        resp.url.indexOf('community') > -1 ||
                        resp.url.indexOf('tve') > -1 ||
                        resp.url.indexOf('weather-alerts') > -1 ||
                        resp.url.indexOf('tv-listings') > -1 ||
                        resp.url.indexOf('bit.ly') > -1 ||
                        resp.url.indexOf('traffic') > -1 ||
                        resp.url.indexOf('horoscopo') > -1 ||
                        resp.url.indexOf('lottery') > -1 ||
                        resp.url.indexOf('avisos-del-tiempo') > -1 ||
                        resp.url.indexOf('data.nbcstations.com') > -1 ||
                        resp.url.indexOf('FAQ') > -1 ||
                        resp.url.indexOf('Frequently-Asked-Questions') > -1 ||
                        resp.url.indexOf('faq') > -1 ||
                        resp.url.indexOf('Tips') > -1 ||
                        resp.url.indexOf('submit-your-photos') > -1 ||
                        resp.url.indexOf('submit-your-photos-videos') > -1 ||
                        resp.url.indexOf('submit-media') > -1 ||
                        resp.url.indexOf('CazaTormentas') > -1
                    ) {
                        if (showOutput) {
                            console.log('> ' + urlName + ' : ' + url + colorizer.colorize(' // Status: ' + status, 'INFO') );
                        }

                        if (showOutput) {console.log('-----------------')};
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
                            if (showOutput) {console.log(e)};

                            var JSONerror = 'Parse Failure: ' + e,
                                brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                            apiSuiteInstance.logPayloadError('apiSectionContent', JSONerror, url, brokenJSONString);
                        }

                        if (validated) {
                            if (showOutput) {console.log('> JSON Validation: ' + colorizer.colorize('PASSED', 'INFO') )};
                        } else {
                            if (showOutput) {console.log('...re-testing JSON')};
                            var reg = /\<body[^>]*\>([^]*)\<\/body/m;
                            var cleanedJson = output.match(reg)[1];

                            if (cleanedJson) {
                                try {
                                    JSONTestOutput = JSON.parse(cleanedJson);

                                    if( JSONTestOutput instanceof Object ) {
                                        if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                                    } else {
                                        if (showOutput) {
                                            console.log('-------------------');
                                            console.log(' JSON Parse Error  ');
                                            console.log('-------------------');
                                            console.log(cleanedJson)
                                        };
                                    }
                                } catch (e) {
                                    // ...
                                    if (showOutput) {
                                        console.log('-------------------');
                                        console.log(' JSON Parse Error  ');
                                        console.log('-------------------');
                                        console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail possible content error...check endpoint manually!');
                                    }

                                    var JSONerror = 'Parse Failure: ' + e,
                                        brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                                    apiSuiteInstance.logPayloadError('apiSectionContent', JSONerror, url, brokenJSONString);

                                    currentTestResults['jsonValidation'] = 'Fail';
                                    currentTestStatus = 'Fail';
                                    manifestTestStatus = 'Fail';
                                    setFail++;
                                }
                            } else {
                                console.log('non cleaned');
                            }
                        }
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
                    apiSuiteInstance.testResultsObject.testResults = currentTestObject;
                }

            })
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    apiSuiteInstance = new apiSuite(casper.cli.get('url'));
});
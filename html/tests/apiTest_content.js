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

casper.test.begin('OTS SPIRE | API Content Audit', function (test) {
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
        subTestResults = {},
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
                    // Manually created collection of test items
                    apiSuiteInstance.collectionObject['breaking__modules'] = url + '/apps/news-app/breaking/modules/?apiVersion=' + apiVersion + enableJsonValidation;
                    apiSuiteInstance.collectionObject['just-in__live'] = url + '/apps/news-app/just-in/live/?apiVersion=' + apiVersion + enableJsonValidation;
                    apiSuiteInstance.collectionObject['tve__featured'] = url + '/apps/news-app/?location=/feature/tve-featured-clips&apiVersion=' + apiVersion + enableJsonValidation;

                    // Test Collection data
                    apiSuiteInstance.testNavigationData();
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
                apiSuiteInstance.testEndpointContent(apiSuiteInstance.collectionObject);


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
                    apiSuiteInstance.processTestResults(setFail, 'apiContentTest', manifestTestStatus);
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

            typeName = 'apiContentTest';

            if (thisResource.url.indexOf('/apps/news-app/navigation') > -1) {
                typeName = 'apiNavTest';
            } else if (thisResource.url.indexOf('/apps/news-app/?location') > -1) {
                typeName = 'apiSectionContent';
            }

            this.logLoadTime(typeName, thisResource.time, thisResource.url, null);
        }
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function (url, stationProperty) {
        // var apiSuiteInstance = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-content&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults) {
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx'); }
            apiSuiteInstance.collectionNavigationItems(url, 'xx');
        } else {
            if (dbUrl) {
                console.log(dbUrl);
                casper.thenOpen(dbUrl).then(function (resp) {
                    var pageOutput = null;

                    if (resp.status === 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl); }

                        pageOutput = this.getHTML();
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
            console.log('------------------------');
            console.log(' Payload Error Data  ');
            console.log('------------------------');
            console.log(processUrl);
            console.log(this.manifestTestRefID, typeName, error, endpoint, payload);
        }

        casper.thenOpen(processUrl, {
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

                            var manifestKeyName = parentManifestItem.toLowerCase(),
                                manifestKeyValue = jsonParsedOutput[parentManifestItem];
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
        var firstPass = true,
            __baseUrl = casper.cli.get('url');

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
                    thisURL.indexOf('faq') > -1 ||
                    thisURL.indexOf('investigations') > -1 ||
                    thisURL.indexOf('Tips') > -1 ||
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

                    if (currentPageContentType.indexOf('html') > -1) {
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
                            var reg = /\<body[^>]*\>([^]*)\<\/body/m,
                                cleanedJson = output.match(reg)[1];

                            if (cleanedJson) {
                                try {
                                    JSONTestOutput = JSON.parse(cleanedJson);

                                    if( JSONTestOutput instanceof Object ) {
                                        if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                                    } else {
                                        if (showOutput) {
                                            console.log('-------------------');
                                            console.log(' JSON Parse Error: Re-Eval  ');
                                            console.log('-------------------');
                                            console.log(cleanedJson)
                                        };
                                        
                                        var JSONerror = 'Parse Failure: ' + e,
                                            brokenJSONString = JSONTestOutput.replace(/[\n\t\s]+/g, " ");

                                        apiSuiteInstance.logPayloadError('apiSectionContent', JSONerror, url, brokenJSONString);

                                        currentTestResults['jsonValidation'] = 'Fail: Re-Eval JSON Parse Fail';
                                        currentTestStatus = 'Fail';
                                        manifestTestStatus = 'Fail';
                                        setFail++;
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
                                        cleanedJson = output.match(reg)[1],
                                        brokenJSONString = cleanedJson.replace(/[\n\t\s]+/g, " ");

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

    apiSuite.prototype.testEndpointContent = function (collectionObject, testID) {
        
        for (var thisCollectionItem in collectionObject) {
            var endpointName = thisCollectionItem,
                endpointUrl = collectionObject[thisCollectionItem];

            if (endpointUrl) {
                var runValidateEndpoint = true;

                if (
                    endpointUrl.indexOf('submit-your-photos') > -1 ||
                    endpointUrl.indexOf('submit-media') > -1 ||
                    endpointUrl.indexOf('contests') > -1 ||
                    endpointUrl.indexOf('community') > -1 ||
                    endpointUrl.indexOf('tve') > -1 ||
                    endpointUrl.indexOf('weather-alerts') > -1 ||
                    endpointUrl.indexOf('tv-listings') > -1 ||
                    endpointUrl.indexOf('bit.ly') > -1 ||
                    endpointUrl.indexOf('traffic') > -1 ||
                    endpointUrl.indexOf('horoscopo') > -1 ||
                    endpointUrl.indexOf('lottery') > -1 ||
                    endpointUrl.indexOf('avisos-del-tiempo') > -1 ||
                    endpointUrl.indexOf('data.nbcstations.com') > -1 ||
                    endpointUrl.indexOf('FAQ') > -1 ||
                    endpointUrl.indexOf('faq') > -1 ||
                    endpointUrl.indexOf('investigations') > -1 ||
                    endpointUrl.indexOf('Tips') > -1 ||
                    endpointUrl.indexOf('CazaTormentas') > -1
                ) {
                    if (showOutput) {
                        test.comment('> Skipping UGC/static content url, skipping JSON test.' );
                        test.comment('  > ' + endpointName );
                        test.comment('  > ' + endpointUrl );
                    }
                    runValidateEndpoint = false;
                }

                if (endpointUrl.indexOf('telemundo') > -1 ) {
                    if (endpointUrl.indexOf('el-tiempo/modules') > -1) {
                        if (showOutput) {console.log('> Exception: Skipping TLM Weather moduels endpoint url....')};
                        runValidateEndpoint = false;
                    } else if (endpointUrl.indexOf('news-app/investigations/modules') > -1) {
                        if (showOutput) {console.log('> Exception: Skipping TLM Investigations moduels endpoint url....')};
                        runValidateEndpoint = false;
                    }
                }

                if (debugOutput) {
                    console.log('> ------- endpoint URL ' + endpointUrl);
                    console.log('runValidateEndpoint ' + runValidateEndpoint);
                }

                if (runValidateEndpoint) {
                    apiSuiteInstance.endpointContentValidation(endpointName, endpointUrl, testID);
                }
            }
        }
    };

    apiSuite.prototype.endpointContentValidation = function (endpointName, endpointUrl, testID) {
        var suite = this;
        var baseUrl = casper.cli.get('url');
        // var baseUrl = 'http://www.' + sourceString + '.com';

        if (endpointUrl) {
            casper.thenOpen(endpointUrl, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }, function (resp) {
                var status = resp.status,
                    output = this.getPageContent(),
                    endpointTestResults = {},
                    jsonParsedOutput = null,
                    currentPageContentType = resp.contentType;
                
                if (
                    currentPageContentType.indexOf('html') > -1 ||
                    endpointName.indexOf('submit_photos_videos') > -1 ||
                    endpointName.indexOf('el_tiempo') > -1 ||
                    endpointName.indexOf('responde') > -1 ||
                    endpointName.indexOf('mbta_report_card') > -1 ||
                    endpointName.indexOf('meet_the_team') > -1 ||
                    endpointName.indexOf('live_faq') > -1 ||
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
                        console.log('> ' + endpointUrl + ' : ' + resp.url + colorizer.colorize(' // Status: ' + status, 'INFO') );
                        console.log('-----------------');
                    }
                } else {
                    try{
                        jsonParsedOutput = JSON.parse(output);

                        // Main endpoint data module item
                        var mainItemArticles = jsonParsedOutput.modules;
                        if (showOutput) {
                            console.log('---------------------------------');
                            // console.log(' Test ID: ' + testID);
                            console.log(colorizer.colorize(' endpointName: ', 'PARAMETER')  + endpointName);
                            console.log(colorizer.colorize(' endpointUrl: ', 'PARAMETER') + endpointUrl);
                            console.log('---------------------------------');
                        }

                        if (jsonParsedOutput.typeName == 'Feature') {
                            if (jsonParsedOutput.feature === true) {
                                if (jsonParsedOutput.featureName.length <= 0) {
                                    setFail++;

                                    var __curError = 'Feature flag set to TRUE but featureName empty.';

                                    console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + jsonParsedOutput.contentID + ', but featureName empty.', 'ERROR'));
                                    subTestResults['featureFeature'] = 'FAIL: Feature flag set to TRUE for ' + jsonParsedOutput.contentID + ', but featureName empty.';
                                    var __curError = '';

                                } else if (jsonParsedOutput.featureId.length <= 0) {
                                    setFail++;

                                    var __curError = 'Feature flag set to TRUE but featureId empty.';
                                    
                                    console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + jsonParsedOutput.contentID + ', but featureId empty.', 'ERROR'));
                                    subTestResults['featureFeatureID'] = 'FAIL: Feature flag set to TRUE for ' + jsonParsedOutput.contentID + ', but featureId empty.';
                                    var __curError = '';
                                }
                            }

                            if (jsonParsedOutput.fullsizeImageURL.indexOf('0*false') > -1 || jsonParsedOutput.fullsizeImageURL == null) {
                                console.log(colorizer.colorize('FAIL: Image url invalid for fullsizeImageURL: ' + jsonParsedOutput.fullsizeImageURL + '.', 'ERROR'));
                                subTestResults['fullsizeImageURL'] = 'FAIL: Image url invalid for fullsizeImageURL: ' + jsonParsedOutput.fullsizeImageURL;
                            }

                            if (jsonParsedOutput.thumbnailImageURL.indexOf('0*false') > -1 || jsonParsedOutput.thumbnailImageURL == null) {
                                console.log(colorizer.colorize('FAIL: Image url invalid for thumbnailImageURL: ' + jsonParsedOutput.thumbnailImageURL + '.', 'ERROR'));
                                subTestResults['thumbnailImageURL'] = 'FAIL: Image url invalid for thumbnailImageURL: ' + jsonParsedOutput.thumbnailImageURL;
                            }

                            // Check for the Sponsor flag
                            if (jsonParsedOutput.sponsored === true) {
                                if (jsonParsedOutput.sponsorName.length <= 0) {
                                    setFail++;
                                    
                                    var __curError = 'Sponsored flag set to TRUE but sponsorName empty.';

                                    console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + jsonParsedOutput.contentID + ', but sponsorName empty.', 'ERROR'));
                                    subTestResults['featureSponsorName'] = 'FAIL: Sponsored flag set to TRUE for ' + jsonParsedOutput.contentID + ', but sponsorName empty.';
                                    var __curError = '';
                                } else if (jsonParsedOutput.sponsorID.length <= 0) {
                                    setFail++;
                                    
                                    var __curError = 'Sponsored flag set to TRUE but sponsorID empty.';

                                    console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + jsonParsedOutput.contentID + ', but sponsorID empty.', 'ERROR'));
                                    subTestResults['featureSponsorID'] = 'FAIL: Sponsored flag set to TRUE for ' + jsonParsedOutput.contentID + ', but sponsorID empty.';
                                    var __curError = '';
                                }
                            }

                        } else {
                            for (var innerContentItem in mainItemArticles) {

                                // console.log('== '+innerContentItem.items);
                                var singleArticleItemObject = mainItemArticles[innerContentItem];

                                for (var singleArticleItem in singleArticleItemObject) {

                                    if (singleArticleItem === 'items' && typeof singleArticleItemObject[singleArticleItem] === 'object') {
                                        
                                        var singleArticleInnerItems = singleArticleItemObject[singleArticleItem],
                                            __subCount = 0;

                                        for (var __items in singleArticleInnerItems) {

                                            if (typeof singleArticleInnerItems[__items] === 'object') {

                                                var articleContentID = singleArticleInnerItems[__items].contentID,
                                                    articleTitle = singleArticleInnerItems[__items].title,
                                                    articleByline = singleArticleInnerItems[__items].byline,
                                                    articleSummary = singleArticleInnerItems[__items].summary,
                                                    articleDisplayDate = singleArticleInnerItems[__items].displayDate,
                                                    articleUpdatedMessage = singleArticleInnerItems[__items].updatedMessage,
                                                    articleShareURL = singleArticleInnerItems[__items].shareURL,
                                                    articleTypeName = singleArticleInnerItems[__items].typeName,
                                                    articleInnerLocation = singleArticleInnerItems[__items].location,
                                                    articleFullsizeImageURL = singleArticleInnerItems[__items].fullsizeImageURL,
                                                    articleThumbnailImageURL = singleArticleInnerItems[__items].thumbnailImageURL,
                                                    articleFullsizeLeadImageURL = singleArticleInnerItems[__items].fullsizeLeadImageURL,
                                                    articleLeadImageURL = singleArticleInnerItems[__items].leadImageURL,
                                                    articleFeature = singleArticleInnerItems[__items].feature,
                                                    articleFeatureName = singleArticleInnerItems[__items].featureName,
                                                    articleFeatureID = singleArticleInnerItems[__items].featureId,
                                                    articleSponsored = singleArticleInnerItems[__items].sponsored,
                                                    articleSponsorName = singleArticleInnerItems[__items].sponsorName,
                                                    articleSponsorID = singleArticleInnerItems[__items].sponsorID,
                                                    articleIsLiveStream = singleArticleInnerItems[__items].isLiveStream,
                                                    articleLiveVideoEmbed = singleArticleInnerItems[__items].liveVideoEmbed,
                                                    articleLiveAppVideoEmbed = singleArticleInnerItems[__items].liveAppVideoEmbed,
                                                    articleContentBody = singleArticleInnerItems[__items].contentBody,
                                                    articleLeadMedia = singleArticleInnerItems[__items].leadMedia;

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
                                                       apiSuiteInstance.galleryObjectTest(articleContentID, galleryContentURL, testID);
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

                                                           apiSuiteInstance.galleryObjectTest(articleContentID, galleryContentURL, testID);

                                                            var urlHealthStatus =apiSuiteInstance.checkURLHealth(galleryContentURL, function (data) {
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

                                                            var urlHealthStatus =apiSuiteInstance.checkURLHealth(videoURL, function (data) {
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
                                                       apiSuiteInstance.testResultsObject.testResults = endpointTestResults;
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
                            casper.wait(200, function () {
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
                            console.log(' ' + colorizer.colorize('JSON Parse Fail: ', 'WARN') + e);

                            // console.log('   JSON Object ');
                            // console.log('  ------------------------------');
                            // console.log( JSON.stringify(output));
                            // console.log('  ------------------------------');
                        };
                        setFail++;

                        var JSONerror = 'Parse Failure: ' + e,
                            brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                        subTestResults['endpointContentValidationError_' + endpointName] = 'endpoint: ' + endpointUrl + ' // \n JSON Parsing Error.';

                        apiSuiteInstance.testResultsObject.testResults = subTestResults;
                        manifestTestStatus = 'Fail';

                        apiSuiteInstance.logPayloadError('apiContentTest', JSONerror, endpointUrl, brokenJSONString);
                    }
                }
            });
        }
    };

    apiSuite.prototype.galleryObjectTest = function (articleContentID, galleryURL, testID) {
        var suite = this;
            
        casper.thenOpen(galleryURL,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function (resp) {
            var status = this.status().currentHTTPStatus;

            if ( status == 200 || status == 301) {
                var output = this.getPageContent(),
                    jsonParsedOutput = null,
                    gallerySingleImageID = null,
                    gallerySingleImageURL = null;

                if (debugOutput) {
                    console.log(' > Gallery url: ' + resp.url);
                }

                var galleryTestingResults = {};

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
                                    casper.thenOpen(gallerySingleImageURL).then(function (galResp) {
                                        var httpStatus = null;

                                        if (showOutput) {
                                            console.log(' > Gallery url: ' + galResp.url);
                                        }

                                        httpStatus = galResp.status;

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
    
    apiSuite.prototype.checkURLHealth = function (url, callback) {
        var suite = this;

        if (url) {
            casper.thenOpen(url).then(function (resp) {
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

    apiSuiteInstance = new apiSuite(casper.cli.get('url'));
});
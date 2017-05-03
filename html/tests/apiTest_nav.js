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


casper.test.begin('OTS SPIRE | API Navigation Audit', function suite(test) {
    'use strict';
    // Global Vars
    var logResults = true,
        _self = this,
        colorizer = require('colorizer').create('Colorizer'),
        envConfig = casper.cli.get('env'),
        configURL = 'http://54.243.53.242',
        type = casper.cli.get('output'),
        debugOutput = false,
        showOutput = false,
        collectionObject = {},
        testResultsObject = {},
        currentTestObject = {},
        loadTimesCollectionObject = {},
        manifestTestRefID,
        manifestTestStatus = 'Pass',
        setFail = 0,
        testStartTime,
        manifestLoadTime,
        resourcesTime = [],
        apiVersion = '6',
        enableJsonValidation = '',
        listener = function (resource, request) {
            if (/apiVersion/.exec(resource.url) === null) {
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
        receivedListener = function (resource, request) {
            if (resourcesTime.hasOwnProperty(resource.id) === false) {
                // we don't have any data for this request.
                return;
            }

            var date_end = new Date();
            resourcesTime[resource.id].end  = date_end.getTime();
            resourcesTime[resource.id].time = resourcesTime[resource.id].end - resourcesTime[resource.id].start;
            manifestLoadTime = resourcesTime[resource.id].time;

            if (debugOutput) {
                /* to debug and compare */
                this.echo('manifestLoadTime >> ' + manifestLoadTime);
                this.echo('resource time >> ' + resourcesTime[resource.id].time);
            }

            if (resource.url.indexOf('apiVersion=') > -1) {
                _self.logLoadTime(manifestTestRefID, 'apiSectionContent', resource.url, resourcesTime[resource.id].time, null);
            }
        },
        apiSuite = function (url) {
            if (!url) {
                throw new Error('A URL is required!');
            }

            this.__collected = {};

            var parser = document.createElement('a'),
                newUrl,
                sourceString,
                urlUri;

            parser.href = url;
            newUrl = parser.href;
            sourceString = newUrl.replace('http://', '')
                                 .replace('https://', '')
                                 .replace('www.', '')
                                 .replace('.com', '')
                                 .split(/[/?#]/)[0];

            urlUri = sourceString.replace('.', '_');

            url = url + '/apps/news-app/navigation/?apiVersion=' + apiVersion + enableJsonValidation;

            /*******************
            *
            * Start Testing
            *
            *******************/
            casper.start(url).then(function (response) {
                if (response.status === 200) {
                    /*_self.getLoadTime(url, function (data) {
                        if (data) {
                            if (showOutput) {
                                console.log('> LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO'));
                            }
                        } else {
                            console.log('-- no timing returned.');
                        }
                    });*/

                    console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url);
                    _self.createTestID(url, type, urlUri);
                } else {
                    throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
                }
            }).then(function () {
                // Log the endpoint load time
                _self.logLoadTime(manifestTestRefID, 'apiNavTest', manifestLoadTime, url, null);
            }).then(function () {
                // Display collection object
                if (debugOutput) {
                    console.log('---------------------');
                    console.log(' Collection object   ');
                    console.log('---------------------');
                    casper.wait(700, function () {
                        var thisCollectionOtem;
                        for (thisCollectionOtem in collectionObject) {
                            console.log('>>>>> ' + thisCollectionOtem + ' : ' + collectionObject[thisCollectionOtem]);
                        }
                    });
                } else {
                    // Test Collection data
                    _self.testNavigationData(urlUri, collectionObject, manifestTestRefID);
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

                //Process test results to the DB
                if (logResults) {
                    _self.processTestResults(urlUri, testResultsObject, manifestTestRefID, setFail, 'apiNavTest', manifestLoadTime, manifestTestStatus);
                }
            }).run(function() {
                console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
                this.exit();
                test.done();
            });
        };

    casper.on('resource.requested', listener);
    casper.on('resource.received', receivedListener);

    if (envConfig === 'local') {
        configURL = 'http://spire.app';
    } else if (envConfig === 'dev') {
        configURL = 'http://45.55.209.68';
    }

    if (type === 'debug') {
        debugOutput = true;
    } else if (type === 'console') {
        showOutput = true;
    }

    if (casper.cli.get('testing')) {
        logResults = false;
    }

    if (!casper.cli.get('enablevalidation')) {
        var enableJsonValidation = '&enableJsonValidation=false';
    }

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {
        var _self = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-nav&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx') };
            _self.collectionNavigationItems(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.thenOpen(dbUrl).then(function(resp) {

                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        manifestTestRefID = casper.getElementInfo('body').text;

                        _self.collectionNavigationItems(url, type, manifestTestRefID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    apiSuite.prototype.getLoadTime = function(url, callback) {
        var _self = this;

        if (url) {
            casper.thenOpen(url).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    output = manifestLoadTime;
                }

                if (typeof(callback) === "function") {
                    callback(output);
                }
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
        var _self = this;

        manifestTestRefID = testID;

        casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {

            resp = resp;

            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                var validated = false;
                var output = this.getPageContent();

                try{
                    var jsonParsedOutput = JSON.parse(output);

                    for (var parentManifestItem in jsonParsedOutput) {

                        if (typeof jsonParsedOutput[parentManifestItem] != 'object') {
                            if (debugOutput) {
                                console.log(colorizer.colorize(parentManifestItem.toLowerCase(), 'INFO') + ' : ' + jsonParsedOutput[parentManifestItem]);
                            }

                            var manifestKeyName = parentManifestItem.toLowerCase();
                            var manifestKeyValue = jsonParsedOutput[parentManifestItem];
                        } else {
                            _self.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                        }
                    }
                } catch (e) {
                    console.log('here 2');
                    console.log(e)

                    var JSONerror = e;
                    var brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                    _self.logPaylodError(manifestTestRefID, 'apiContentTest', JSONerror, url, brokenJSONString);

                    if (showOutput) {console.log(e)};
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        })
    };

    apiSuite.prototype.spiderObject = function(parentObjectName, childManifestObject, initialPass) {
        var _self = this;
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
                                    navItemAppLocationURL = subObject[subItem];
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
                                _self.spiderObject(navItemAppTitle, subObject[subItem], false);
                            }
                        }
                    }
                if (debugOutput) { console.log('------') }
            }
        }
    };


    apiSuite.prototype.testNavigationData = function(url, collectionObject, testID) {
        var _self = this;
        var baseUrl = casper.cli.get('url');

        // Test collection object and add to results object
        for (var thisCollectionItem in collectionObject) {
            var endpointName = thisCollectionItem;

            if (collectionObject[thisCollectionItem].indexOf('.html') > -1) {
                if (
                    collectionObject[thisCollectionItem].indexOf('contests') > -1
                    || collectionObject[thisCollectionItem].indexOf('community') > -1
                    || collectionObject[thisCollectionItem].indexOf('tve') > -1
                    || collectionObject[thisCollectionItem].indexOf('weather-alerts') > -1
                    || collectionObject[thisCollectionItem].indexOf('tv-listings') > -1
                    || collectionObject[thisCollectionItem].indexOf('bit.ly') > -1
                    || collectionObject[thisCollectionItem].indexOf('traffic') > -1
                    || collectionObject[thisCollectionItem].indexOf('horoscopo') > -1
                    || collectionObject[thisCollectionItem].indexOf('lottery') > -1
                    || collectionObject[thisCollectionItem].indexOf('avisos-del-tiempo') > -1
                    || collectionObject[thisCollectionItem].indexOf('data.nbcstations.com') > -1
                    || collectionObject[thisCollectionItem].indexOf('FAQ') > -1
                    || collectionObject[thisCollectionItem].indexOf('faq') > -1
                    || collectionObject[thisCollectionItem].indexOf('investigations') > -1
                    || collectionObject[thisCollectionItem].indexOf('Tips') > -1
                    || collectionObject[thisCollectionItem].indexOf('CazaTormentas') > -1)
                {
                    if (showOutput) {
                        test.comment('> Skipping UGC/static content url, skipping JSON test.' );
                        test.comment('  > ' + endpointName );
                        test.comment('  > ' + collectionObject[thisCollectionItem] );
                    }
                } else {
                    var location_url = collectionObject[thisCollectionItem],
                        cms_contentID = null;

                    if (/^https?:\/\/www\.(nbc|telemundo)/.exec(location_url)) {
                        cms_contentID = /(\d+)\.html$/.exec(location_url);
                        if (cms_contentID) {
                            location_url = '?contentId=' + cms_contentID[1];
                        }
                    }
                    // http://www.nbclosangeles.com/apps/news-app/content/?contentId=389777331&apiVersion=6
                    endpointUrl = baseUrl + '/apps/news-app/content/' + location_url + '&apiVersion=' + apiVersion + enableJsonValidation;

                    if (debugOutput) { console.log('> parsedLocationURL: ' + location_url) };
                }
            } else {
                var endpointUrl = collectionObject[thisCollectionItem];
            }

            if (endpointUrl) {
                _self.validateJson(endpointName, endpointUrl, testID);
            } else {
                console.log(colorizer.colorize('ERROR: ', 'WARNING') + 'NavTestError: No url provided to test against: ' + endpointName);
                currentTestObject[endpointName] = 'NavDataTestError: No url provided to test against for the current endpoint.';
                testResultsObject['testResults'] = currentTestObject;
                manifestTestStatus = 'Fail';
                setFail++;
            }
        }
    };

    apiSuite.prototype.validateJson = function(urlName, url, status, testID) {
        var _self = this;
        var currentTestStatus = "Pass";

        if (url) {
            casper.thenOpen(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {

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
                        // var urlCurrentLoadTime = _self.getLoadTime(url, function (data) {
                        //     if (data) {
                        //         if (showOutput) {
                        //             console.log('> LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO') );
                        //         }

                        //         if (logResults) {
                        //             _self.logLoadTime(manifestTestRefID, 'apiSectionContent', data, url, null);
                        //         }
                        //     } else {
                        //         console.log('-- no timing returned.');
                        //     }
                        //     if (showOutput) {console.log('-----------------')};
                        // });

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

                            var JSONerror = e;
                            var brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                            _self.logPaylodError(manifestTestRefID, 'apiSectionContent', JSONerror, url, brokenJSONString);
                        }

                        if (validated) {
                            if (showOutput) {console.log('> JSON Validation: ' + colorizer.colorize('PASSED', 'INFO') )};
                        } else {
                            if (showOutput) {console.log('...re-testing JSON')};
                            var reg = /\<body[^>]*\>([^]*)\<\/body/m;
                            cleanedJson = output.match(reg)[1];

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

                                    var JSONerror = e;
                                    cleanedJson = output.match(reg)[1];
                                    var brokenJSONString = cleanedJson.replace(/[\n\t\s]+/g, " ");

                                    _self.logPaylodError(manifestTestRefID, 'apiSectionContent', JSONerror, url, brokenJSONString);

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
                    testResultsObject['testResults'] = currentTestObject;
                }

            })
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    new apiSuite(casper.cli.get('url'));
});
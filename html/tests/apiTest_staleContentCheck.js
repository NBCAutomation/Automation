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

casper.options.stepTimeout = 1800000;
casper.options.timeout = 3600000;

casper.test.begin('OTS SPIRE | API Content Audit', function (test) {
    'use strict';
    
    // Global Vars
    var logResults = true,
        apiSuiteInstance,
        colorizer = require('colorizer').create('Colorizer'),
        envConfig = casper.cli.get('env'),
        configURL = 'http://54.243.53.242',
        testType = casper.cli.get('output'),
        apiVersion,
        contentID = casper.cli.get('contentID'),
        sectionPath = casper.cli.get('sectionPath'),
        debugOutput = false,
        showOutput = false,
        currentTestObject = {},
        loadTimesCollectionObject = {},
        subTestResults = {},
        manifestTestStatus = 'Pass',
        setFail = 0,
        galleryCount = 0,
        testStartTime,
        apiURL,
        resourcesTime = {},
        endpointTestObject = {},
        sectionContent,
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

            this.collectionObject = {};
            this.testResultsObject = {};

            /*******************
            *
            * Start Testing
            *
            *******************/
            casper.start().then(function (resp) {
                console.log('----------------');
                console.log(' Starting Test  ');
                console.log('----------------');

                // Get API Version
                if (casper.cli.get('apiVersion')) {
                    apiSuiteInstance.apiVersion = casper.cli.get('apiVersion');
                } else {
                    apiSuiteInstance.getGlobalAPIVer();
                }
            }).then(function () {

                // Set main endpoint url(s)
                apiSuiteInstance.baseUrl = casper.cli.get('url');
                apiSuiteInstance.apiURL = url + '/apps/news-app/navigation/?apiVersion=' + apiSuiteInstance.apiVersion + enableJsonValidation;
                apiSuiteInstance.stationProperty = /www\.(\S+)\.com/.exec(apiSuiteInstance.apiURL)[1];
            }).then(function () {

                // Create test ref ID 
                apiSuiteInstance.createTestID(apiSuiteInstance.apiURL, apiSuiteInstance.stationProperty);
            }).then(function () {
                
                // Set tests to run
                var contentTestURL = url + '/apps/news-app/home/modules/?apiVersion=' + apiSuiteInstance.apiVersion + enableJsonValidation;

                apiSuiteInstance.scrapeSectionContent('sectionContentTest', contentTestURL, apiSuiteInstance.manifestTestRefID);
            }).then(function () {
                // Porcess All Test Results Data
                console.log(colorizer.colorize('Processing test results...', 'COMMENT'));
                console.log('----------------');
                console.log(' Test Results   ');
                console.log('----------------');
                console.log(' [] Test Status: ' + colorizer.colorize(manifestTestStatus, 'INFO'));
                console.log('  - ' + setFail + ' Failures!');

                // Process test results
                if (debugOutput) {
                    console.log('---------------------');
                    console.log(' Results debug object   ');
                    console.log('---------------------');
                    console.log(JSON.stringify(apiSuiteInstance.testResultsObject));
                    console.log('---------------------');
                    console.log('  starting for loop..');

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
                    apiSuiteInstance.processTestResults(setFail, 'apiStaleContentTest', manifestTestStatus);
                    apiSuiteInstance.processLoadTimes();
                }
            }).run(function () {
                if (showOutput) {
                    console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'Scrape complete.');
                }

                this.exit();
            });
        };

    function setDebugEvents() {
        var triggerEvent = function (event, args) {
                // test.comment(arguments);
                var array_args = Array.prototype.slice.call(args);
                console.log("EVENT: " + event);
                console.log("\t" + JSON.stringify(array_args));
                console.log("\t" + array_args);
            },
            setTriggerEvent = function (evtName) {
                casper.on(evtName, function () {
                    triggerEvent(evtName, arguments);
                });
            },
            eventsArray = [
                "back", "capture.saved", "click", "complete.error", "die", "downloaded.file",
                "downloaded.error", "error", "exit", "fill", "forward", "frame.changed", "http.auth",
                "http.status.[code]", "load.started", "load.failed", "load.finished", "log",
                "mouse.click", "mouse.down", "mouse.move", "mouse.up", "navigation.requested", "open",
                "page.created", "page.error", "page.initialized", "page.resource.received",
                "page.resource.requested", "popup.created", "popup.loaded", "popup.closed",
                "remote.alert", "remote.callback", "remote.longRunningScript", "remote.message",
                "resource.error", "resource.received", "resource.requested", "resource.timeout",
                "run.complete", "run.start", "starting", "started", "step.added", "step.bypassed",
                "step.complete", "step.created", "step.error", "step.start", "step.timeout", "timeout",
                "url.changed", "viewport.changed", "wait.done", "wait.start", "waitFor.timeout",
                "capture.target_filename", "echo.message", "log.message", "open.location", "page.confirm",
                "page.filePicker", "page.prompt"
            ],
            i,
            event;

        for (i = eventsArray.length - 1; i >= 0; i -= 1) {
            event = eventsArray[i];
            setTriggerEvent(event);
        }
    }

    casper.on('resource.requested', listener);
    casper.on('resource.received', receivedListener);

    if (envConfig === 'local') {
        configURL = 'http://spire.local';
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

    // Output debug logging
    if (debugOutput) {
        setDebugEvents();
    }

    apiSuite.prototype.processLoadTimes = function () {
        var i = 0,
            keys = Object.keys(resourcesTime),
            thisResource = null,
            typeName = null;

        for (i = 0; i < keys.length; i += 1) {
            thisResource = resourcesTime[keys[i]];

            typeName = 'apiStaleContentTest';

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

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-staleContentCheck&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults) {
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx'); }
            apiSuiteInstance.manifestTestRefID = 'xx';
        } else {
            if (dbUrl) {
                console.log(dbUrl);
                casper.thenOpen(dbUrl).then(function (resp) {
                    var pageOutput = null;

                    if (resp.status === 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl); }

                        pageOutput = this.getHTML();
                        apiSuiteInstance.manifestTestRefID = casper.getElementInfo('body').text;
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
                'testID': apiSuiteInstance.manifestTestRefID,
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
            console.log('---------------------');
            console.log(' Payload Error Data  ');
            console.log('---------------------');
            console.log(processUrl);
            console.log(apiSuiteInstance.manifestTestRefID, typeName, error, endpoint, payload);
        }

        casper.thenOpen(processUrl, {
            method: 'post',
            data:   {
                'task': 'logPayloadError',
                'testID': apiSuiteInstance.manifestTestRefID,
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
            console.log('contentObject => ' + endpointTestObject);
            console.log('testID => ' + apiSuiteInstance.manifestTestRefID);
            console.log('testFailureCount => ' + testFailureCount);
            console.log('testType => ' + typeName);
            // console.log('manifestLoadTime => ' + manifestLoadTime);
            console.log('manifestTestStatus => ' + manifestTestStatus);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task' : 'processScrapedContentStaleCheck',
                'testID' : apiSuiteInstance.manifestTestRefID,
                'testType' : typeName,
                'testProperty' : this.stationProperty,
                'contentObject' : JSON.stringify(endpointTestObject),
                'testStatus' : manifestTestStatus,
                'testFailureCount' : testFailureCount,
                // 'manifestLoadTime' : 123,
                'testResults' :  JSON.stringify(apiSuiteInstance.testResultsObject)
            }
        });
    };

    apiSuite.prototype.scrapeSectionContent = function (endpointName, endpointUrl, testID) {
        if (endpointUrl) {
            casper.thenOpen(endpointUrl, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }, function (resp) {
                var status = resp.status,
                    output = this.getPageContent(),
                    jsonParsedOutput = null,
                    currentPageContentType = resp.contentType;

                if (status == 200 || status == 301) {
                    // Page check
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
                            sectionContent = JSON.parse(output);
                            // Main endpoint data module item

                            if (showOutput) {
                                console.log('---------------------------------');
                                // console.log(' Test ID: ' + testID);
                                console.log(colorizer.colorize(' endpointName: ', 'PARAMETER')  + endpointName);
                                console.log(colorizer.colorize(' endpointUrl: ', 'PARAMETER') + endpointUrl);
                                console.log('---------------------------------');
                            }

                            if (sectionContent.modules) {
                                var sectionContentModules = sectionContent.modules;

                                for (var innerContentItem in sectionContentModules) {
                                    var singleArticleItemObject = sectionContentModules[innerContentItem],
                                        c = 1;

                                    if (debugOutput) {
                                        console.log('moduleID ' + singleArticleItemObject.moduleID);
                                        console.log('moduleID ' + singleArticleItemObject.title);
                                    }

                                    for (var singleArticleItem in singleArticleItemObject) {

                                        if (singleArticleItem === 'items' && typeof singleArticleItemObject[singleArticleItem] === 'object') {
                                            var singleArticleInnerItems = singleArticleItemObject[singleArticleItem],
                                                articlesObject = {};

                                            for (var thisContentItem in singleArticleInnerItems) {
                                                var endpointTestSubObject = {};

                                                if (debugOutput) {
                                                    console.log('    c ' + c)
                                                    console.log('    contentID ' + singleArticleInnerItems[thisContentItem].contentID);
                                                    console.log('    title ' + singleArticleInnerItems[thisContentItem].title);
                                                    console.log('    updatedMessage ' + singleArticleInnerItems[thisContentItem].updatedMessage);
                                                    console.log('   -------------------------------');
                                                }

                                                endpointTestSubObject['contentID'] = singleArticleInnerItems[thisContentItem].contentID;
                                                endpointTestSubObject['title'] = singleArticleInnerItems[thisContentItem].title;
                                                endpointTestSubObject['updatedMessage'] = singleArticleInnerItems[thisContentItem].updatedMessage;

                                                articlesObject['article_' + c] = endpointTestSubObject;
                                                c++;
                                            }

                                            endpointTestObject[singleArticleItemObject.moduleID] = articlesObject;
                                        }
                                    }
                                }
                                if (showOutput) {
                                    console.log('....collection object created.');
                                    if (debugOutput) {
                                        console.log('-------------------------');
                                        console.log(' scraped section content ');
                                        console.log('-------------------------');
                                        console.log(JSON.stringify(endpointTestObject));
                                    }
                                }
                            }
                        } catch (e) {
                            if (showOutput) {
                                console.log('------------------------------------------------');
                                console.log(' JSON Parse Error | scrapeSectionContent() ');
                                console.log('------------------------------------------------');
                                console.log(' failed endpointName: '  + endpointName);
                                console.log(' failed endpointUrl: ' + endpointUrl);
                                console.log(' ' + colorizer.colorize('JSON Parse Fail: ', 'WARNING') + e);

                                // console.log('   JSON Object ');
                                // console.log('  ------------------------------');
                                // console.log( JSON.stringify(output));
                                // console.log('  ------------------------------');
                            };
                            setFail++;

                            subTestResults['scrapeSectionContentError_' + endpointName] = 'endpoint: ' + endpointUrl + ' // \n JSON Parsing Error.';
                            var headerObject = resp.headers;

                            for (var keys in headerObject) {
                                if (headerObject[keys].name == 'X-Server-Name') {
                                    if (debugOutput) {
                                        console.log(headerObject[keys].name);
                                        console.log(headerObject[keys].value);
                                    }
                                    subTestResults['clickXServer'] = headerObject[keys].value;
                                }

                            }

                            var JSONerror = 'Parse Failure: ' + e,
                                brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                            apiSuiteInstance.testResultsObject.testResults = subTestResults;
                            manifestTestStatus = 'Fail';

                            apiSuiteInstance.logPayloadError('apiStaleContentTest', JSONerror, endpointUrl, brokenJSONString);
                        }
                    }
                } else {

                }
            });
        }
    };

    apiSuiteInstance = new apiSuite(casper.cli.get('url'));
});
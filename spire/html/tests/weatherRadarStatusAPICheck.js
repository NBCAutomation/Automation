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

casper.test.begin('OTS SPIRE | WSI Weather Radar Status Check', function (test) {
    'use strict';
    
    // Global Vars
    var logResults = true,
        apiSuiteInstance,
        testResultsObject = {},
        colorizer = require('colorizer').create('Colorizer'),
        envConfig = casper.cli.get('env'),
        configURL = 'http://54.243.53.242',
        testType = casper.cli.get('output'),
        contentID = casper.cli.get('contentID'),
        sectionPath = casper.cli.get('sectionPath'),
        debugOutput = false,
        showOutput = false,
        wsiRadarStatusURL = 'https://wsidata.weather.com/201303/1117/0019/radarinfo/status?fields=markets',
        currentTestObject = {},
        manifestTestStatus = 'Pass',
        noticeColor = 'INFO',
        setFail = 0,
        resourcesTime = {},
        endpointTestResults = {},
        sectionContent,
        radarIDKeys = {
            "0845": "First Alert Live Doppler - Los Angeles",
            "0846": "First Alert Live Doppler - Orange County",
            "0847": "First Alert Live Doppler - San Diego",
            "0848": "StormRanger - Los Angeles",
            "0849": "NBC 5 S-Band Radar - DFW",
            "0850": "StormRanger - DFW",
            "0851": "StormRanger - Philadelphia",
            "0854": "NBC Boston Fixed",
            "0855": "StormTracker 4 - New York",
            "0856": "Live Doppler 5 - Chicago",
            "0837": "TeleDoppler - Puerto Rico",
            "0853": "First Alert Doppler 6000",
            "0870": "StormRanger 2 - New York/Boston",
            "0871": "StormRanger 2 - Philadelphia",
            "0872": "StormRanger 2 - DFW"
        },
        linkParser = document.createElement('a'),
        listener = function (resource) {
            linkParser.href = resource.url;
            if (/^\/api\/1\/ott/.exec(linkParser.pathname) === null) {
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
        apiSuite = function () {
            this.collectionObject = {};
            this.testResultsObject = {};

            /*******************
            *
            * Start Testing
            *
            *******************/
            casper.start(wsiRadarStatusURL).then(function (resp) {
                console.log('----------------');
                console.log(' Starting Test  ');
                console.log('----------------');

                if (resp.status === 200) {
                    var weatherRadarStatuseOutput = this.getPageContent();
                    apiSuiteInstance.collectStationRadarStatusData(weatherRadarStatuseOutput);
                }
            }).then(function () {

                // Create test ref ID 
                apiSuiteInstance.createTestID(apiSuiteInstance.apiURL, apiSuiteInstance.stationProperty);
            }).then(function () {
                
                // Set tests to run
                // apiSuiteInstance.testRadarData(apiSuiteInstance.collectionObject);
            }).then(function () {

                // Test Collection data
                // apiSuiteInstance.validateJson('mainOTTManifestURL', apiSuiteInstance.apiURL);
            }).then(function () {
                console.log('------------------------------------------');
                console.log(colorizer.colorize(' ...testing endpoint content items', 'PARAMETER'));
                console.log('------------------------------------------');

                if (debugOutput) {
                    console.log('-----------------------------------------');
                    console.log(' Start testing content collectionObject   ');
                    console.log('-----------------------------------------');
                    console.log('---------------------');
                    console.log(' Collection object   ');
                    console.log('---------------------');
                    var keys = Object.keys(apiSuiteInstance.collectionObject),
                        thisItem = null,
                        i = 0;

                    for (i = 0; i < keys.length; i += 1) {
                        thisItem = apiSuiteInstance.collectionObject[keys[i]];
                        console.log('>>>>> ' + keys[i] + ' : ' + thisItem);
                    }
                }
                // Test endpoint content
                // apiSuiteInstance.testEndpointContent(apiSuiteInstance.collectionObject, apiSuiteInstance.manifestTestRefID);
            }).then(function () {
                // Porcess All Test Results Data
                if (setFail > 0) {
                	manifestTestStatus = 'Fail';
                	noticeColor = 'WARNING';
				}
                console.log(colorizer.colorize('Processing test results...', 'COMMENT'));
                console.log('------------------------');
                console.log(' Test Results   ');
                console.log('------------------------');
                console.log(' [] Test Status: ' + colorizer.colorize(manifestTestStatus, noticeColor));
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
                    // apiSuiteInstance.processTestResults(setFail, 'apiOTTTest', manifestTestStatus);
                    // apiSuiteInstance.processLoadTimes();
                }
            }).run(function () {
                console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
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

    // Output debug logging
    if (debugOutput) {
        // setDebugEvents();
    }

    // Create test id in DB
    apiSuite.prototype.createTestID = function (url, stationProperty) {
        // var apiSuiteInstance = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-OTT&property=' + stationProperty + '&fileLoc=json_null';

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

    // Log endpoint JSON Errors
    apiSuite.prototype.logWeatherRadarStatus = function (typeName, weatherRadarSite, weatherRadarPrettyRef, weatherRadarID, weatherRadarStatus) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log('------------------------');
            console.log(' Payload Error Data  ');
            console.log('------------------------');
            console.log(processUrl);
            console.log(apiSuiteInstance.manifestTestRefID, typeName, weatherRadarSite, weatherRadarPrettyRef, weatherRadarID, weatherRadarStatus);
        }

        casper.thenOpen(processUrl, {
            method: 'post',
            data:   {
                'task': 'logRadarStatus',
                'testID': apiSuiteInstance.manifestTestRefID,
                'testType': typeName,
                'weatherRadarSite': weatherRadarSite,
                'weatherRadarPrettyRef': weatherRadarPrettyRef,
                'weatherRadarID': weatherRadarID,
                'weatherRadarStatus': weatherRadarStatus
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
            console.log('testID => ' + apiSuiteInstance.manifestTestRefID);
            console.log('testFailureCount => ' + testFailureCount);
            console.log('testType => ' + typeName);
            // console.log('manifestLoadTime => ' + manifestLoadTime);
            console.log('manifestTestStatus => ' + manifestTestStatus);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'processManifestTestResults',
                'testID': apiSuiteInstance.manifestTestRefID,
                'testType': typeName,
                'testProperty': this.stationProperty,
                'testStatus': manifestTestStatus,
                'testFailureCount': testFailureCount,
                'manifestLoadTime': 123,
                'testResults':  JSON.stringify(apiSuiteInstance.testResultsObject)
            }
        });
    };

    apiSuite.prototype.collectStationRadarStatusData = function (dataObject) {
        var jsonParsedOutput = null;

        try {
            jsonParsedOutput = JSON.parse(dataObject);

            for (var parentManifestItem in jsonParsedOutput) {

                if (typeof jsonParsedOutput[parentManifestItem] != 'object') {
                    if (debugOutput) {
                        console.log(colorizer.colorize(parentManifestItem.toLowerCase(), 'INFO') + ' : ' + jsonParsedOutput[parentManifestItem]);
                    }

                    var manifestKeyName = parentManifestItem.toLowerCase(),
                        manifestKeyValue = jsonParsedOutput[parentManifestItem];
                } else {
                    if (debugOutput) {
                        console.log('@ ' + parentManifestItem);
                    }

                    // Spider objects
                    apiSuiteInstance.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                }
            }
        } catch (e) {
            // console.log(JSON.stringify(resp));
            console.log('-----------------');
            console.log('here 2');
            console.log(e);

            var JSONerror = 'Parse Failure: ' + e,
                brokenJSONString = dataObject.replace(/[\n\t\s]+/g, " ");

            // apiSuiteInstance.logWeatherRadarStatus('apiOTTTest', JSONerror, url, brokenJSONString);

            if (showOutput) {console.log(e); }
        }
    };

    apiSuite.prototype.spiderObject = function (parentObjectName, childManifestObject) {
        for (var childItem in childManifestObject) {
            if (typeof childManifestObject[childItem] == 'object') {
            	if (debugOutput) {
            		console.log('  # ' + childItem);
            	}

                var subObject = childManifestObject[childItem];
                var subObjectParentName = parentObjectName + '__' + childItem;
                
                for (var subItem in subObject) {

                    var navItemAppTitleNiceName = subObject[subItem],
                        navItemAppTitle,
                        navItemAppLocationURL,
                        subItemRefName = subObjectParentName + '__' + subItem;

                    if (subObject.length <= 0) {
                        throw new Error('key blank ' + subItem);
                    } else {						
                        if (typeof subObject[subItem] == 'object' && subItem == 'properties') {
                        	if (debugOutput) {
                        		console.log('subObjectParentName ' + subObjectParentName);
                        		console.log('     > ' + subItem + ' sub object');
                        	}

                            if (subObject[subItem].hasOwnProperty('layerId')) {
                                var feedRadarID = subObject[subItem]['layerId'];
                            }

                            if (feedRadarID in radarIDKeys) {
                                // if (debugOutput) {
                                    console.log(radarIDKeys[feedRadarID]);
                                    console.log(' - ' + subObject[subItem]['site']);
                                    console.log(' - ' + subObject[subItem]['status']);
                                    console.log(' - ' + subObject[subItem]['layerId']);
                                    console.log('-------------------');
                                // }

                                // Check radar status
                                if (subObject[subItem]['status'] != 'online') {
                                    if (showOutput) {
                                        console.log(radarIDKeys[feedRadarID]);
                                        console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'radar currently offline');
                                        console.log('----------------------------');
                                    }
                                }

                                // Log radar status
                                apiSuiteInstance.logWeatherRadarStatus('wsiRadarCheck', subObject[subItem]['site'], radarIDKeys[feedRadarID], subObject[subItem]['layerId'], subObject[subItem]['status']);
                            }
                        }
                    }
                }
                if (debugOutput) { console.log('----- // ' + childItem); }
            } else if (typeof childManifestObject[childItem] != 'object') {
        		
            }
        }
    };


    apiSuiteInstance = new apiSuite(casper.cli.get('url'));
});
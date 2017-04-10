/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
//    optional string params --output=debug to show logged key/val strings
//    optional string params --output=console will show test results

// Dictionary files:
// - OTS Created 9/7/16

// - TSG Pending..
// -http://collaborative-tools-project.blogspot.com/2012/05/getting-csv-data-into-google.html
//
// Casper 1.1.0-beta3 and Phantom 1.9.8
//


casper.test.begin('OTS SPIRE | Regression Testing', function suite(test) {

    // Config vars
    var utils = require('utils');
    var url = casper.cli.get("url");
    var mouse = require("mouse").create(casper);
    casper.options.viewportSize = { width: 1280, height: 5000 };
    var logResults = true;
    var colorizer = require('colorizer').create('Colorizer');
    
    var otsTestSuite = false;
    var tlmTestSuite = false;
    var testProperty;
    var manifestTestRefID;
    var testDesinations = {};
    var testResultsObject = {};
    var regressionResults = {};
    var testingObject = {};
    var testStatus = 'Pass';
    var setFail = 0;
    var testInfo = 'Engine: Chrome/WebKit';
    var browser;

    manifestTestRefID = casper.cli.get('refID');

    // Util vars
    var currentTime = new Date();

    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();

        if (minutes < 10){
            minutes = "0" + minutes;
        }

        if (hours > 11){
            var toD = "PM";
        } else {
            var toD = "AM";
        }

        if (hours === '0'){
            var hours = "12";
        }

    var timeStamp = month+'_'+day+'_'+year+'-'+hours+'_'+minutes+'-'+toD;

    var envConfig = casper.cli.get('env');

    if (envConfig === 'local') {
        var configURL = 'http://spire.app';
        var saveLocation = '../test_results/screenshots/';

    } else if (envConfig === 'dev') {
        var configURL = 'http://45.55.209.68';
        var saveLocation = '../test_results/screenshots/';

    } else if (envConfig === 'prod') {
        var configURL = 'http://54.243.53.242';
        var saveLocation = 'test_results/screenshots/';

    } else {
        var configURL = 'http://54.243.53.242';
        var saveLocation = 'test_results/screenshots/';
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

    runEngine = casper.cli.get('ff');
    if ( runEngine ) {
        var testInfo = 'Engine: FF/Gecko';
        var browser = 'ff'
    }


    if (['local', 'dev', 'prod'].indexOf(envConfig) < 0) {
        var process = require("child_process"),
            spawn = process.spawn,
            child = spawn("chown", ["-hR", "ec2-user:apache", saveLocation]);
    }

    var regressionSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        var suite = this;

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
        // casper.start().then(function(response) {
        casper.start( url ).then(function(response) {

            // merge captured PDFs with default system shell (bash on Linux) calling /usr/bin/gs, and runs a small script to remove files
            casper.waitForExec('/bin/bash -c', ['cd',{ /Documents/Repositories/Applications/OTS-Spire/html/tests casperjs test apiTest_nav.js --url=http://www.nbcnewyork.com --output=console --env=local; }'],
                function(response) {
                    this.echo("Program finished by itself: completed");
                }, function(timeout, response) {
                    this.echo("Program finished by casper: timeout");
            });

            this.exit();
            if ( response.status == 200 || response.status == 302 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                
                if (manifestTestRefID) {
                    testResultsObject['testID'] = manifestTestRefID;
                } else {
                    // suite.createTestID(url, 'regressionTest', urlUri);
                }

            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function() {
            casper.thenOpen(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                if ( response.status == 200 || response.status == 304 || response.status == 302 ) {
                    var pageItem = casper.getElementInfo('body');

                    for (var prop in pageItem) {
                        // console.log("obj." + prop + " = " + pageItem[prop]);
                        if (prop == 'tag') {
                            // console.log(pageItem[prop].substring(0,100));
                            var initBodyTag = pageItem[prop].substring(0,100);
                        }
                    }

                    if ( initBodyTag.indexOf('nbc') > -1 || initBodyTag.indexOf('necn') > -1 ) {
                        console.log('OTS property...');
                        testProperty = 'otsTestSuite';
                    } else if ( initBodyTag.indexOf('tlmd') > -1 ) {
                        console.log('TLM property...');
                        testProperty = 'tlmTestSuite';
                    } else {
                        console.log( 'Unable to get body class, possble header block.' );
                        console.log( '------- body class -------' );
                        console.log( initBodyTag );
                        this.exit();
                    }

                    // suite.visualTests(testProperty, urlUri, url);
                } else {
                    casper.test.fail('Page did not load correctly. Response: ' + response.status);
                }
            })
        }).then(function() {
            // Test navigation items and pages
            // suite.collectNavigation(testProperty, url, false);
        }).then(function() {
            console.log('were here 2');
            console.log('-----------------------------------');
            console.log(' Test completed with ' + setFail + ' failures.');
            console.log('-----------------------------------');

            //Log test results
            if (setFail > 0) {
                // suite.processTestResults(urlUri, testResultsObject, setFail, testResultsObject['testID'], 'regressionTest', testStatus);

                if (debugOutput) {
                    console.log('---------------------');
                    console.log('  ' + setFail + ' Failures!');
                    console.log('---------------------');

                    for (var failureItem in testResultsObject) {
                        if (typeof testResultsObject[failureItem] != 'object') {
                            console.log('> ' + failureItem + ' : ' + testResultsObject[failureItem]);
                        } else {
                            console.log('> ' + failureItem);
                            var subFailureItem = testResultsObject[failureItem];
                            for (var subFailureItems in subFailureItem) {
                                console.log('   > ' + subFailureItems + ' : ' + subFailureItem[subFailureItems]);

                                if (typeof subFailureItem[subFailureItems] != 'object') {
                                    console.log('   > ' + subFailureItems);
                                } else {
                                    var grandChildFailures = subFailureItem[subFailureItems];
                                    
                                    for (var innerSubFailureItems in grandChildFailures) {
                                        console.log('     > ' + innerSubFailureItems + ' : ' + grandChildFailures[innerSubFailureItems]);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                // suite.processTestResults(urlUri, testResultsObject, setFail, testResultsObject['testID'], 'regressionTest', testStatus, testInfo);
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    regressionSuite.prototype.createTestID = function(url, type, stationProperty) {
        var suite = this;
        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=regressionTest&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx') };
            manifestTestRefID = 'xx';
        } else {
            if (dbUrl) {
                casper.thenOpen(dbUrl).then(function(resp) {
                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        manifestTestRefID = casper.getElementInfo('body').text;
                        
                        testResultsObject['testID'] = manifestTestRefID;

                        if (showOutput) {
                            console.log(colorizer.colorize('Test ID created: ', 'COMMENT') + manifestTestRefID);   
                        }
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    // Log results in DB
    regressionSuite.prototype.processTestResults = function(urlUri, testResultsObject, testFailureCount, testID, testType, testStatus, testInfo) {

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
                'testStatus': testStatus,
                'testFailureCount':testFailureCount,
                'testResults':  JSON.stringify(testResultsObject),
                'testInfo': testInfo
            }
        });
    };

    // Regression visual tests
    regressionSuite.prototype.visualTests = function(testProperty, urlUri, url) {
        var suite = this;

        // Set testing item
        if (testProperty == 'otsTestSuite') {
            var otsTestSuite = true;
        } else {
            var tlmTestSuite = true;
        }

        // NBC OTS Testing
        if (otsTestSuite) {
            casper.wait(700, function() {
            // casper.wait(47000, function() {
                this.waitForSelector("#sfcontentFill",
                    function pass () {
                        test.comment('loading done.....');

                        test.comment('[ -- clicking logo -- ]');
                            this.mouse.click('.brand a');
                        console.log('clicked ok, new location is ' + this.getCurrentUrl());
                        console.log('...testing pages');

                        test.assertSelectorHasText('body', 'home', "Homepage loaded");

                        this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

                        // Setup testing object. testingObject[referenceName] = testingHTMLElement
                        
                        testingObject['siteHeader'] = '.site-header';
                        testingObject['headerLogo'] = '.brand a img';
                        testingObject['mainNav'] = '.navbar';
                        testingObject['tveMenu'] = '.nav-small-section.nav-live-tv';
                        testingObject['tveSubMenu'] = '.nav-small-section.nav-live-tv a';
                        testingObject['weatherRadar'] = '.weather-module-radar iframe';
                        testingObject['spredfastModules'] = '.sfbox';
                        testingObject['mainFooter'] = '.footer';

                        if(casper.exists('.weather-module')){
                            testingObject['weatherModule'] = '.weather-module';
                        // If severe weather module is displayed
                        } else if(casper.exists('.weather-module-severe')){
                            testingObject['weatherModuleSevere'] = '.weather-module-severe';
                            testingObject['weatherAlert'] = '.weather-alert-info';
                        }

                        for (var testingItem in testingObject) {
                            if (debugOutput) {
                                console.log('---------------------------');
                                console.log(' testingObject Properties');
                                console.log('---------------------------');
                                console.log('testingItem > ' + testingItem);
                                console.log('testingObject[testingItem] > ' + testingObject[testingItem]);
                            }

                            var refName = testingItem;
                            var testingEntity = testingObject[testingItem];

                            // Test the item/classes within the testObject
                            suite.testAssertion(testingEntity, urlUri, refName);
                        }
                    },
                    function fail () {
                        this.captureSelector(saveLocation + urlUri + '_failure-screenshot' + timeStamp + '_' + browser + '.jpg', 'body');
                        test.fail("Unable to test page elements. Did not load element .sfbox");
                    },
                    null // timeout limit in milliseconds
                );
            });

        } else if (tlmTestSuite) {
        // TLM Testing
            casper.wait(700, function() {
                this.waitForSelector(".section.mid",
                    function pass () {
                        test.comment('loading done.....');

                        test.comment('[ -- clicking logo -- ]');
                            this.mouse.click('.brand a');
                        console.log('clicked ok, new location is ' + this.getCurrentUrl());
                        console.log('...testing pages');

                        test.assertSelectorHasText('body', 'home', "Homepage loaded");

                        this.test.assertNotEquals('body', 'tlmd', 'TLM Body class set');

                        testingObject['siteHeader'] = '.masthead';
                        testingObject['headerLogo'] = '#logo img';
                        testingObject['manNav'] = '.nav';
                        testingObject['lowerModules'] = '.lower.left';
                        testingObject['mainFooter'] = '.page_footer';

                        if(casper.exists('.weather-module')){
                            testingObject['weatherModule'] = '.weather-module';
                        // If severe weather module is displayed
                        } else if(casper.exists('.weather-module-severe')){
                            testingObject['weatherModuleSevere'] = '.weather-module-severe';
                            testingObject['weatherAlert'] = '.weather-alert-info';
                        }

                        for (var testingItem in testingObject) {
                            if (debugOutput) {
                                console.log('---------------------------');
                                console.log(' testingObject Properties');
                                console.log('---------------------------');
                                console.log('testingItem > ' + testingItem);
                                console.log('testingObject[testingItem] > ' + testingObject[testingItem]);
                            }

                            var refName = testingItem;
                            var testingEntity = testingObject[testingItem];

                            // Test the item/classes within the testObject
                            suite.testAssertion(testingEntity, urlUri, refName);
                        }
                    },
                    function fail () {
                        this.captureSelector(saveLocation + urlUri + '_failure-screenshot' + timeStamp + '_' + browser + '.jpg', 'body');
                        test.fail("Unable to test page elements. Did not load properly.");
                    },
                    null // timeout limit in milliseconds
                );
            });
        }
    };

    // Regressiong test actions
    regressionSuite.prototype.testAssertion = function(testingEntity, urlUri, refName) {
        var suite = this;

        if (casper.exists(testingEntity)) {
            console.log('----------------------------------')
            console.log(colorizer.colorize(' > ' + refName + ' loaded correctly.', 'PARAMETER'));
            try {
                test.assertVisible(testingEntity, refName + ' is visibile');
            } catch (e) {
                console.log(' > Failure: ' + refName + ' loaded, but not visible and/or correctly seen in the viewport.');
                console.log('   -- failure')
                console.log('   -- ' +  e);
                suite.logRegressionError(testingEntity, urlUri, refName);
            }
        } else {
            console.log('----------------------------------')
            console.log(colorizer.colorize(refName + ' didnt load correctly, and/or wasn\'t located on the site.', 'ERROR'));
            suite.logRegressionError(testingEntity, urlUri, refName);
        }
    };

    regressionSuite.prototype.logRegressionError = function(testingEntity, urlUri, refName) {
        var refErrors = {};

        var suite = this;
        var entityName = testingEntity.replace('.','_').replace('\/',"_").split(' ').join('_').toLowerCase();
        
        casper.captureSelector(saveLocation + urlUri + '_' + entityName + '_failure-screenshot_' + timeStamp + '_' + browser + '.jpg', 'body');
        
        var failureScreenshot = configURL + '/test_results/screenshots/' + urlUri + '_' + entityName + '_failure-screenshot_' + timeStamp + '_' + browser + '.jpg';

        refErrors['failure'] = 'unable to locate "' + refName + '" entitiy: "' + testingEntity + '". Unable to test item visibility correctly.';
        refErrors['screenshot'] = failureScreenshot;

        regressionResults[refName] = refErrors;
        testResultsObject['testResults'] = regressionResults;
        testStatus = 'Fail';
        setFail++;
    };


    // Regressiong test actions
    regressionSuite.prototype.collectNavigation = function(testProperty, url, runOnce) {

        var suite = this;

        casper.thenOpen(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
            var mainURL = this.getCurrentUrl().slice(0,-1);
            var pageItem = casper.getElementInfo('body');

            if (debugOutput) {console.log('main url ' + mainURL)};

            // Collect initial navigation items, then re-loop and collect more navigation items.
            if (! runOnce) {
                // Set collection selector
                if (testProperty == 'otsTestSuite') {
                    var selector = '.nav-section a.nav-section-title';
                } else {
                    var selector = '.nav.black a';
                }
            } else {
                var selector = '.nav-more .nav-section-subnav a';
            }
            
            /*casper.on('remote.message', function(msg) {
                this.echo('remote message caught: ' + msg);
            })*/

            // collect nav URLS
            var evaluatedUrls = this.evaluate(function(mainURL, selector) {
                var output = [];
                // Grab the current url data, href and link text
                var elementObjects = __utils__.findAll(selector).map(function(element) {
                    console.log('map1: ', $(element).text());
                    if (!! element.getAttribute('href')) {
                        var title = element.getAttribute('title'),
                            alt = element.getAttribute('alt');

                        return {
                            url: element.getAttribute('href'),
                            // innerText: element.innerText
                            innerText: title ? title : alt
                        }
                    } 
                    return null;
                });

                for (var i = elementObjects.length - 1; i >= 0; i--) {
                    var el = elementObjects[i];
                    if (el !== null) {
                        output.push(el);
                    }
                }
                return output;
            }, mainURL, selector);

            // loop and append to testDestinations
            evaluatedUrls.forEach(function(elementObj) {
                if (elementObj === null) {
                    return;
                }

                var url = elementObj.url;
                var innerText = elementObj.innerText;
                
                if (debugOutput) {
                    console.log(url, elementObj);
                };

                if (url.length > 0) {
                    testDesinations[innerText] = url;
                }
            });
            
            if (debugOutput) {
                console.log('testDesinations', JSON.stringify(testDesinations));
            }

            if (! runOnce) {
                suite.collectNavigation(testProperty, url, true);
            };

            if (runOnce) {
                // Send items to be tested
                suite.testNavigationItems(mainURL, testDesinations, testProperty);
            };
            
        });
    };



    regressionSuite.prototype.testNavigationItems = function(mainURL, destinations, testProperty) {

        var suite = this;

        for (var navLocation in destinations) {
            if ( destinations[navLocation].indexOf(mainURL) > -1 ) {
                // console.log('          url found');
                var currentNavUrl = destinations[navLocation].replace(/ /g,"");
            } else {
                // console.log('         no');
                var currentNavUrl = mainURL + destinations[navLocation].replace(/ /g,"");
            }
            var currentNavTitle = navLocation;

            if (debugOutput) {
                console.log('mainURL ~ ' + mainURL);
                console.log('navLocation ~ ' + navLocation);
                console.log('destinations[navLocation] ~ ' + destinations[navLocation]);
                console.log('testUrl ~ ' + currentNavUrl);
            }
            
            if ( currentNavUrl == mainURL+'/' || currentNavUrl.indexOf('on-air') > -1) {
                test.comment('skipping subnav check, unnecessary for current page: ' + currentNavUrl);
            } else {
                casper.thenOpen(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {

                    // Grab url info
                    var parser = document.createElement('a');
                    parser.href = response.url;
                    newUrl = parser.href;
                    urlPath = parser.pathname;

                    var pagePathName = urlPath.replace('/','').split(/[/?#]/)[0];
                    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
                    var urlUri = sourceString.replace('.','_');

                    // Check for property type
                    if (response.url.indexOf('telemundo') > -1) {
                        console.log('-------------');
                        test.comment('Current url > ' +  response.url);
                        console.log('HTTP Response - ' + response.status);
                        console.log('...skipping, no on-page section/page subnav for TLM');
                    } else {
                        // if forced to login screen, login
                        if (response.url.indexOf('clickability') > -1) {
                            console.log('Clickability login page, attempting to login...');

                            casper.waitForSelector("form input[name='j_username']", function() {
                                this.fillSelectors('form#login', {
                                    'input[name = j_username ]' : 'beta@staging.com',
                                    'input[name = j_password ]' : 'ots!!Staging1'
                                }, true);
                            });

                            casper.waitWhileSelector('form',
                                // Adding pass/fail wait to wait for page to redirect to new page.
                                function pass () {
                                    // console.log('PASS ]');
                                },
                                function fail () {
                                    // console.log('FAIL ]');  
                                }, 1000);

                            casper.then(function(){
                                test.comment('...login successful, continuing.');
                                // test.comment('-- new page title ' + this.getTitle() );
                                console.log('\n');

                                if (casper.exists('.subnav-large-container')) {
                                    casper.wait(700, function() {
                                        this.waitForSelector('.subnav-large-container',
                                            function pass () {
                                                console.log('-------------');
                                                test.comment('Current test url > ' +  response.url);
                                                console.log('HTTP Response - ' + response.status);

                                                suite.testAssertion('.subnav-section-landing', urlUri, pagePathName + '_subNav');
                                            },
                                            function fail () {
                                                // test.fail("Unable to test page elements.");
                                                testResultsObject[pagePathName + '_subNav'] = 'Unable to test page elements.';
                                                testStatus = 'Fail';
                                                setFail++;
                                            },
                                            null // timeout limit in milliseconds
                                        )
                                    })
                                } else {
                                    console.log('Unable to find the subnav container.');
                                }
                            });

                        } else if (response.url.indexOf('nbc') > -1) {
                            casper.wait(700, function() {
                                if (casper.exists('.subnav-section-landing')) {
                                    this.waitForSelector('.subnav-large-container',
                                        function pass () {
                                            console.log('-------------');
                                            test.comment('Current test url > ' +  response.url);
                                            console.log('HTTP Response - ' + response.status);

                                            suite.testAssertion('.subnav-section-landing', urlUri, pagePathName + '_subNav');
                                        },
                                        function fail () {
                                            testResultsObject[pagePathName + '_subNav'] = 'Unable to locate page subnav.';
                                            testStatus = 'Fail';
                                            setFail++;
                                        },
                                        null // timeout limit in milliseconds
                                    )
                                } else {
                                    if (casper.exists('form#login')) {
                                        console.log('Clickability login page, attempting to login...');

                                        casper.waitForSelector("form input[name='j_username']", function() {
                                            this.fillSelectors('form#login', {
                                                'input[name = j_username ]' : 'beta@staging.com',
                                                'input[name = j_password ]' : 'ots!!Staging1'
                                            }, true);
                                        });

                                        casper.waitWhileSelector('form',
                                            // Adding pass/fail wait to wait for page to redirect to new page.
                                            function pass () {
                                                // console.log('PASS ]');
                                            },
                                            function fail () {
                                                // console.log('FAIL ]');  
                                            }, 1000);

                                        casper.then(function(){
                                            test.comment('...login successful, continuing.');
                                            if (casper.exists('.subnav-section-landing')) {
                                                this.waitForSelector('.subnav-large-container',
                                                    function pass () {
                                                        console.log('-------------');
                                                        test.comment('Current test url > ' +  response.url);
                                                        console.log('HTTP Response - ' + response.status);

                                                        suite.testAssertion('.subnav-section-landing', urlUri, pagePathName + '_subNav');
                                                    },
                                                    function fail () {
                                                        testResultsObject[pagePathName + '_subNav'] = 'Unable to locate page subnav.';
                                                        testStatus = 'Fail';
                                                        setFail++;
                                                    },
                                                    null // timeout limit in milliseconds
                                                )
                                            }
                                        });
                                    } else {
                                        console.log(response.url);
                                        console.log('-- Unable to find the "' + pagePathName + '" subnav container, page load/redirect error. Test manually if Stage. [Full Fail]');
                                        // this.captureSelector(saveLocation + urlUri + '--' + pagePathName + '_subnav_failure-screenshot' + timeStamp + '.jpg', 'body');
                                    }
                                }
                            })
                        }
                    }

                })
            }
        }

        casper.wait(100, function() {
            suite.pageTests(testProperty, mainURL);
        });
    };

    regressionSuite.prototype.pageTests = function(testProperty, url) {
        var suite = this;
        var addtnlDestinations = [];

        console.log('//////////////////////');

        // Set testing item
        if (testProperty == 'otsTestSuite') {
            var otsTestSuite = true;

            var addtnlDestinations = [
                'http://www.telexitos.com',
                'http://www.cozitv.com'
            ];

        } else {
            var tlmTestSuite = true;

            var addtnlDestinations = [
                '/envia-tus-comentarios',
                '/trafico',
                'http://www.telexitos.com',
                'http://www.cozitv.com'
            ];
        }

        addtnlDestinations.reverse();

        for (var i = addtnlDestinations.length - 1; i >= 0; i--) {
            if ( addtnlDestinations[i].indexOf('cozi') > -1 || addtnlDestinations[i].indexOf('telexitos') > -1 ) {
                var currentNavUrl = addtnlDestinations[i];
            } else {
                var currentNavUrl = url + addtnlDestinations[i];
            }

            casper.thenOpen(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {

                // console.log(testProperty);
                console.log('-------------');
                test.comment('Current url > ' +  response.url);
                console.log('HTTP Response - ' + response.status);

                var parser = document.createElement('a');
                parser.href = response.url;
                newUrl = parser.href;
                var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
                var urlUri = sourceString.replace('.','_');

                // OTS Checks
                if ( response.url.indexOf('traffic') > -1 || response.url.indexOf('trafico') > -1 ) {
                    suite.testAssertion('#navteqTrafficOneContainer', urlUri, 'trafficMap');
                }

                if ( response.url.indexOf('contact-us') > -1 || response.url.indexOf('conectate') > -1 ) {
                    suite.testAssertion('.contact-landing-module', urlUri, 'contactPageModule');
                }

                if ( response.url.indexOf('weather') > -1 ) {
                    suite.testAssertion('.contact-landing-module', urlUri, 'contactPageModule');
                }

                if ( response.url.indexOf('investigations') > -1 ) {
                    suite.testAssertion('#leadMedia img', urlUri, 'investigationsLeadThumb');
                }

                // Telexitos testing
                if ( response.url.indexOf('telexitos') > -1 ) {
                    test.assertVisible('.primary', "main page loaded and displayed.");
                    suite.testAssertion('.primary', urlUri, 'telexitosMainDiv');
                }

                // Cozi testing
                if ( response.url.indexOf('cozi') > -1 ) {
                    suite.testAssertion('.headerLogo', urlUri, 'coziLogo');
                    suite.testAssertion('.page .feature-full', urlUri, 'coziMainContent');

                    // console.log('...clicking play icon');
                    // this.mouse.move('.playButtonLarge');
                    // this.mouse.click('.playButtonLarge');
                    // test.assertVisible('#_VODPlayer108PdkSwfObject', "video player laoded, test manually to ensure video plays.");
                }

            })
        };
        
    };

    new regressionSuite(casper.cli.get('url'));
});
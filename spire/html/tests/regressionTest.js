/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
//    optional string params --output=debug to show logged key/val strings
//    optional string params --output=console will show test results
//
// Casper 1.1.0-beta3 and Phantom 1.9.8
//
casper.test.begin('OTS SPIRE | Regression Testing', function suite(test) {
    // casper.options.timeout = 300000;
    casper.options.timeout = 1100000;

    // Config vars
    var utils = require('utils'),
        envConfig = casper.cli.get('env'),
        url = casper.cli.get("url"),
        mouse = require("mouse").create(casper),
        logResults = true,
        colorizer = require('colorizer').create('Colorizer'),
        otsTestSuite = false,
        tlmTestSuite = false,
        testProperty,
        manifestTestRefID,
        testPropertyPageTitle,
        testDesinations = {},
        prevtestDesinations = {},
        testResultsObject = {},
        timeoutDetails = {},
        regressionResults = {},
        testingObject = {},
        testData = {},
        failedTestItems = {},
        testStatus = 'Pass',
        setFail = 0,
        setPass = 0,
        setTotal = 0,
        thirdPartyChecks = false,
        testInfo = 'Engine: Chrome/WebKit',
        browser = 'chrome',
        currentTime = new Date(),
        month = currentTime.getMonth() + 1,
        day = currentTime.getDate(),
        year = currentTime.getFullYear(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes(),
        urlUri;

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

    manifestTestRefID = casper.cli.get('refID');

    if (envConfig === 'local') {
        var configURL = 'http://spire.local',
            saveLocation = '../test_results/screenshots/';

    } else if (envConfig === 'dev') {
        var configURL = 'http://45.55.209.68',
            saveLocation = '../test_results/screenshots/';

    } else if (envConfig === 'prod') {
        var configURL = 'http://54.243.53.242',
            saveLocation = 'test_results/screenshots/';

    } else {
        var configURL = 'http://54.243.53.242',
            saveLocation = 'test_results/screenshots/';
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
        var testInfo = 'Engine: FF/Gecko',
            browser = 'ff';
    }

    if (casper.cli.get('mobile')) {
        var mobileTest = true;
        casper.options.viewportSize = { width: 350, height: 900 };
    } else {
        casper.options.viewportSize = { width: 1280, height: 500 };
    }


    if (['local', 'dev', 'prod'].indexOf(envConfig) < 0) {
        var process = require("child_process"),
            spawn = process.spawn,
            child = spawn("chown", ["-hR", "ec2-user:apache", saveLocation]);
    }

    // only have to call this once..
    if (debugOutput) {
        casper.on("page.error", function (msg, trace) {
             casper.echo("A page error was thrown: " + msg, "INFO");
        });
    }

    /*************************
    *
    * Begin test suite setup
    *
    *************************/        
        //   pass/(total/100) pass score
        //   (100/170)164
        

    var regressionSuite = function(url) {
        var suite = this;

        if (!url) {
            throw new Error('A URL is required!');
        }

        var parser = document.createElement('a');
        parser.href = url;

        var newUrl = parser.href,
            sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0],
            urlUri = sourceString.replace('.','_');


        casper.options.onTimeout = function () {
            timeoutDetails['failure'] = 'Script Stopped! Timeout occured, max execution time reached: 300000ms';
            testResultsObject['testResults'] = timeoutDetails;

            suite.processTestResults(urlUri, testResultsObject, '1', testResultsObject['testID'], 'regressionTest', 'Fail', 'Script timeout');

            casper.wait(100, function() {
                console.log(colorizer.colorize(' > Script Stopped! Timeout occured (max execution time reached: 300000ms) ', 'RED_BAR'));
                this.exit();
                test.done();
            });
        };

        /*******************
        *
        * Start Testing
        *
        *******************/
        if (mobileTest) {
            console.log('....switched to mobile url');
            // var url = url + '?akmobile=o';
            casper.userAgent('Mozilla/5.0 (Linux; Android 7.0; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19');
        }

        // casper.start().then(function(response) {
        casper.start( url ).then(function(response) {
            if (debugOutput) {
                console.log('-------------------------');
                console.log('  Response Output');
                console.log('-------------------------');
                console.log(JSON.stringify(response));
                console.log('-------------------------');    
            }

            var headerObject = response.headers;

            for (var keys in headerObject) {
                if (headerObject[keys].name == 'X-Server-Name') {
                    if (debugOutput) {
                        console.log(headerObject[keys].name);
                        console.log(headerObject[keys].value);
                    }
                    testResultsObject['clickXServer'] = headerObject[keys].value;
                }

            }

            if (response.url.indexOf('clickability') > -1 || this.getCurrentUrl().indexOf('clickability') > -1) {
                console.log('Clickability redirect. Current URL: ' + this.getCurrentUrl());
                
                var bypassLoginScreen = suite.bypassLogin(true, function (data) {
                    if (! data) {
                        if (showOutput) {
                           console.log('-- Unable to bypass login screen: ' + colorizer.colorize(data, 'FAIL'));
                           casper.captureSelector(saveLocation + urlUri + '_' + 'bypassLogin-testing_failure-screenshot_' + timeStamp + '_' + browser + '.jpg', 'body');
                        }
                    }
                })
            }

        }).then(function() {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );

                if (manifestTestRefID) {
                    testResultsObject['testID'] = manifestTestRefID;
                } else {
                    suite.createTestID(url, 'regressionTest', urlUri);
                }
            
        }).then(function() {
            if (mobileTest) {
                console.log('-------------------------');
                console.log(' >> Mobile Testing <<');
                console.log('-------------------------');
            }

            console.log('-----------------------------------------------');
            console.log(' Run initial page tests');
            console.log('-----------------------------------------------');
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

                    /************************
                    *
                    * Check site property
                    *
                    ************************/
                    if ( initBodyTag.indexOf('nbc') > -1 || initBodyTag.indexOf('necn') > -1 ) {
                        console.log('OTS property...');
                        testProperty = 'otsTestSuite';
                    } else if ( initBodyTag.indexOf('tlmd') > -1 ) {
                        console.log('TLM property...');
                        testProperty = 'tlmTestSuite';
                    } else if ( initBodyTag.indexOf('cozi') > -1 ) {
                        testPropertyPageTitle = this.getTitle();

                        if (debugOutput) {
                            console.log(testPropertyPageTitle);
                        }

                        if (testPropertyPageTitle.indexOf('COZI') > -1) {
                            console.log('CoziTV...');
                            testProperty = 'coziTestSuite';
                            thirdPartyChecks = true;
                        } else if (testPropertyPageTitle.indexOf('Telexitos') > -1) {
                            console.log('Telexitos...');
                            testProperty = 'telexitosTestSuite';
                            thirdPartyChecks = true;
                        }
                    }

                    if (! thirdPartyChecks) {
                        // Run default NBC/TLM tests
                        suite.visualTests(testProperty, urlUri, url);
                    } else {
                        // Skip to Cozi/Telexitos tests ( see thirdPartyPageTests() )
                        suite.thirdPartyPageTests(testProperty, url);
                    }
                } else {
                    casper.test.fail('Page did not load correctly. Response: ' + response.status);
                }
            })
        }).then(function() {
            if (! thirdPartyChecks) {
                // Test navigation items and pages
                console.log('-------------');
                console.log(' Page tests');
                console.log('-------------');
                suite.testHoverAndCollectNavigation(testProperty, url, urlUri);
            }
        }).then(function() {
            // If OTS/TLM site run static page tests
            if (testProperty == 'otsTestSuite' || testProperty == 'tlmTestSuite') {
                suite.thirdPartyPageTests(testProperty, url);
            }
        }).then(function() {
            // console.log('were here 2');
            var scoreVal = parseInt(100) / parseInt(setTotal);

            if (scoreVal < 1) {
                var paddedScore = scoreVal * parseInt(10);
                var weightedScore = paddedScore * setPass;
                var passScore = parseInt(weightedScore) / parseInt(10);
            } else {
                var passScore = parseInt(scoreVal) * parseInt(setPass);
            }

            console.log('-----------------------------------');
            console.log(' Test completed with ' + setFail + ' failures.');
            console.log('-----------------------------------');
            console.log('| Total: ' + setTotal);
            console.log('| Failures:  ' + setFail + ' | Passes: ' + setPass + ' |');            
            console.log('| Score: ' + passScore + '%');
            console.log('-----------------------------------');
            var scriptEndTime = new Date();
            var scriptRunTime = scriptEndTime - currentTime;
            
            if (debugOutput) {
                console.log('scriptRunTime in ms: ' + scriptRunTime);
            }

            console.log('| Script runtime: ' + suite.millisToMinutesAndSeconds(scriptRunTime));
            console.log('-----------------------------------');

            testData['totalTests'] = setTotal;
            testData['totalFailures'] = setFail;
            testData['totalPasses'] = setPass;
            testData['testScore'] = passScore;
            testData['scriptRunTime'] = suite.millisToMinutesAndSeconds(scriptRunTime);

            testResultsObject['testData'] = testData;

            //Log test results
            if (setFail > 0) {
                suite.processTestResults(urlUri, testResultsObject, setFail, testResultsObject['testData']['testScore'], testResultsObject['testID'], 'regressionTest', testStatus);

                if (debugOutput) {
                    console.log('-----------------------------------------------');
                    console.log('  ' + setFail + ' Failures!');
                    console.log('-----------------------------------------------');
                    console.log(JSON.stringify(testResultsObject));

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
                suite.processTestResults(urlUri, testResultsObject, setFail, testResultsObject['testData']['testScore'], testResultsObject['testID'], 'regressionTest', testStatus, testInfo);
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            this.exit();
        });
    };

    // Return test time in min/sec
    regressionSuite.prototype.millisToMinutesAndSeconds = function(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

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
    regressionSuite.prototype.processTestResults = function(urlUri, testResultsObject, testFailureCount, testScore, testID, testType, testStatus, testInfo) {

        var processUrl = configURL + '/utils/processRequest';

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'processManifestTestResults',
                'testID': testID,
                'testType': testType,
                'testProperty': urlUri,
                'testStatus': testStatus,
                'testFailureCount': testFailureCount,
                'testScore': testScore,
                'testResults':  JSON.stringify(testResultsObject),
                'testInfo': testInfo
            }
        });
    };

    // Regression visual tests
    regressionSuite.prototype.visualTests = function(testProperty, urlUri, url) {
        var suite = this;

        // NBC OTS Testing
        if (testProperty == 'otsTestSuite') {
            if (mobileTest) {
                testWaitElement = '.body-contents';
            } else {
                testWaitElement = '#sfcontentFill';
            }

            casper.wait(700, function() {
            // casper.wait(47000, function() {
                this.waitForSelector(testWaitElement,
                    function pass () {
                        test.comment('loading done.....');

                        if (test.assertSelectorHasText('body', 'home', "Homepage loaded")){
                            setPass++;
                            setTotal++;
                        };

                        if (this.test.assertNotEquals('body', 'nbc', 'OTS Body class set')){
                            setPass++;
                            setTotal++;
                        }

                        /**************************************
                        * Define initial page testing objects
                        **************************************/
                        if (mobileTest) {
                            testingObject['siteHeader'] = '.header';
                            testingObject['headerLogo'] = '.market-logo img';
                            testingObject['mobileMenuButton'] = '.menu-icon-touch';
                            testingObject['quickNav'] = '.quick-nav';
                            testingObject['tveMenuButton'] = '.watch-live-icon';
                            testingObject['mainFooter'] = '#footer';

                            if (casper.exists('.weather-module')){
                                testingObject['weatherModule'] = '.weather-module';
                            }

                            if (casper.exists('.weather.severe')){
                                testingObject['weatherSevere'] = '.weather.severe';
                            }
                        } else {
                            test.comment('[ -- clicking logo -- ]');
                            if (this.mouse.click('.brand a')) {
                                console.log('clicked ok, new location is ' + this.getCurrentUrl());
                                setPass++;
                                setTotal++;
                            }

                            test.assertVisible('.weather-module-radar iframe', 'weather-iframe' + ' is visibile');
                            test.assertExists('.weather-module-radar iframe');
                            testingObject['siteHeader'] = '.site-header';
                            testingObject['headerLogo'] = '.brand a img';
                            testingObject['mainNav'] = '.navbar';
                            testingObject['tveMenu'] = '.nav-small-section.nav-live-tv';
                            testingObject['tveSubMenu'] = '.nav-small-section.nav-live-tv a';
                            testingObject['weatherRadar'] = '.weather-module-radar iframe';
                            testingObject['spredfastModules'] = '.sfbox';
                            testingObject['mainFooter'] = '.footer';

                            if (casper.exists('.weather-module')){
                                testingObject['weatherModule'] = '.weather-module';
                            // If severe weather module is displayed
                            } else if (casper.exists('.weather-module-severe')){
                                testingObject['weatherModuleSevere'] = '.weather-module-severe';
                                testingObject['weatherAlert'] = '.weather-alert-info';
                            }
                        }

                        casper.wait(200, function() {
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
                        });
                    },
                    function fail () {
                        this.captureSelector(saveLocation + urlUri + '_failure-screenshot' + timeStamp + '_' + browser + '.jpg', 'body');
                        if (mobileTest) {
                            test.fail("Unable to test mobile page elements. Did not load element .body-contents");
                        } else {
                            test.fail("Unable to test page elements. Did not load element .sfbox");
                        }
                    },
                    null // timeout limit in milliseconds
                );
            });
        }

        if (testProperty == 'tlmTestSuite') {
        // TLM Testing
            casper.wait(700, function() {
                this.waitForSelector(".section.mid",
                    function pass () {
                        test.comment('loading done.....');

                        if (mobileTest) {
                            testingObject['siteHeader'] = '.header';
                            testingObject['headerLogo'] = '.market-logo img';
                            testingObject['mobileMenuButton'] = '.menu-icon-touch';
                            testingObject['quickNav'] = '.quick-nav';
                            testingObject['tveMenuButton'] = '.watch-live-icon';
                            testingObject['mainFooter'] = '#footer';

                            if (casper.exists('.weather-module')){
                                testingObject['weatherModule'] = '.weather-module';
                            }

                            if (casper.exists('.weather.severe')){
                                testingObject['weatherSevere'] = '.weather.severe';
                            }
                        } else {
                            test.comment('[ -- clicking logo -- ]');
                                this.mouse.click('.brand a');
                            console.log('clicked ok, new location is ' + this.getCurrentUrl());
                            console.log('...testing pages');

                            test.assertSelectorHasText('body', 'home', "Homepage loaded");

                            this.test.assertNotEquals('body', 'tlmd', 'TLM Body class set');

                            testingObject['siteHeader'] = '.site-header';
                            testingObject['headerLogo'] = '.brand a img';
                            testingObject['mainNav'] = '.navbar';
                            testingObject['lowerModules'] = '.lower.left';
                            testingObject['mainFooter'] = '.page_footer';

                            if (casper.exists('.weather-module')){
                                testingObject['weatherModule'] = '.weather-module';
                            // If severe weather module is displayed
                            } else if (casper.exists('.weather-module-severe')){
                                testingObject['weatherModuleSevere'] = '.weather-module-severe';
                                testingObject['weatherAlert'] = '.weather-alert-info';
                            }
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
                        test.fail("Full Fail: Unable to test page elements. Did not load properly.");
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
            casper.wait(200, function() {
                // console.log(colorizer.colorize(' > ' + refName + ' loaded correctly.', 'PARAMETER'));
                try {
                    test.assertVisible(testingEntity, refName + ' is visibile');
                    setPass++;
                    setTotal++;
                } catch (e) {
                    console.log(colorizer.colorize(' > Failure: ' + refName + ' loaded, but not visible and/or correctly seen in the viewport. ', 'ERROR'));
                    // console.log(' > Failure: ' + refName + ' loaded, but not visible and/or correctly seen in the viewport.');
                    console.log('   -- failure')
                    console.log('   -- ' +  e);
                    suite.logRegressionError(testingEntity, urlUri, refName);
                }
            })
        } else {
            console.log(colorizer.colorize(refName + ' didnt load correctly, and/or wasn\'t located on the site.', 'ERROR'));
            suite.logRegressionError(testingEntity, urlUri, refName);
        }
    };

    regressionSuite.prototype.logRegressionError = function(testingEntity, urlUri, refName) {
        var refErrors = {};

        var suite = this;
        var entityName = testingEntity.replace('.','_').replace('\/',"_").replace('#','_').split(' ').join('_').toLowerCase();

        casper.captureSelector(saveLocation + urlUri + '_' + entityName + '_failure-screenshot_' + timeStamp + '_' + browser + '.jpg', 'body');

        var failureScreenshot = configURL + '/test_results/screenshots/' + urlUri + '_' + entityName + '_failure-screenshot_' + timeStamp + '_' + browser + '.jpg';

        refErrors['testingElement'] = refName;
        refErrors['failure'] = 'unable to locate "' + refName + '" entitiy: "' + testingEntity + '". Unable to test item visibility correctly.';
        refErrors['screenshot'] = failureScreenshot;

        regressionResults['Failure ' + setFail] = refErrors;
        testResultsObject['testResults'] = regressionResults;
        testStatus = 'Fail';
        setFail++;
        setTotal++;
    };


    // Regressiong test actions
    regressionSuite.prototype.testHover = function(refIndex, refIndexName, testProperty) {
        var suite = this;

        if (testProperty == 'otsTestSuite') {
            var testSubNavContainerClass = ".nav-section-subnav";
        } else {
            var testSubNavContainerClass = ".subnav-large-container";
        }

        casper.wait(20, function() {
            casper.mouse.move('.nav-section:nth-child(' + refIndex + ')');
            casper.wait(200, function() {
                if (refIndex == 1) {
                    test.comment('Home/Inicio link, skipping no subnav for current nav item.');
                } else if (refIndex > 1) {
                    suite.testAssertion('.nav-section:nth-child(' + refIndex + ') ' + testSubNavContainerClass, urlUri, refIndexName + '_sub-navigation');
                }
            });
        });
        casper.wait(300, function() {});

    };


    regressionSuite.prototype.testHoverAndCollectNavigation = function(testProperty, url, urlUri) {
        var suite = this;

        casper.thenOpen(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
            var mainURL = this.getCurrentUrl().slice(0,-1),
                pageItem = casper.getElementInfo('body');

            if (debugOutput) {console.log('main url ' + mainURL)};

            // console.log( casper.evaluate(function(){ return document.querySelector('.nav-section:nth-child(' + i + ')').innerText;}) );
            // Test navigation hover states
            if (! mobileTest) {
                casper.then(function(){
                    console.log('-------------------------------');
                    console.log(' Testing navigation hovers');
                    console.log('-------------------------------');
                    var numNavItems = parseInt(casper.evaluate(function(){ return document.querySelectorAll('.nav-section').length;}));

                    for (var i = numNavItems; i >= 0; i--) {
                        var thisRefIndex = i;

                        if (testProperty == 'otsTestSuite' && thisRefIndex == 6) {
                            var thisRefIndexLinkName = 'More';
                        } else {
                            var thisRefIndexLinkName = casper.evaluate(function(thisRefIndex){ return document.querySelector('.nav-section:nth-child(' + thisRefIndex + ')').innerText;}, thisRefIndex);
                        }

                        if (debugOutput) {console.log(i, thisRefIndexLinkName);}

                        if (thisRefIndexLinkName) {
                            suite.testHover(thisRefIndex, thisRefIndexLinkName, testProperty);
                        }
                    }
                })
            }

            // Collect all navigation items/links
            casper.then(function(){
                console.log('------------------------------------------------');
                console.log(' Navigation link collection and page tests');
                console.log('-------------------------------------------------');
                // Set collection selector
                if (mobileTest) {
                    var selector = '.nav-container a';
                    // console.log('this selector: ' + selector);
                } else {
                    var selector = '.navbar-container a';
                }

                // collect nav URLS
                var evaluatedUrls = this.evaluate(function(mainURL, selector) {
                    var output = [];
                    // Grab the current url data, href and link text
                    var elementObjects = __utils__.findAll(selector).map(function(element) {
                        if (!! element.getAttribute('href')) {
                            var title = element.getAttribute('title'),
                                alt = element.getAttribute('alt');

                            return {
                                url: element.getAttribute('href'),
                                innerText: element.innerText
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

                    var url = elementObj.url,
                        innerText = elementObj.innerText;

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
            });

            // Send collected nav items to be tested
            casper.then(function(){
                suite.collectedLinkCheckSort(mainURL, testDesinations, testProperty);
            });
        });
    };

    regressionSuite.prototype.bypassLogin = function (bypassLogin, callback) {
        var suite = this,
        output = false;

        if (bypassLogin) {
            console.log('-------------------------------------------------');
            console.log('/////////////////////////////////////////////////');
            console.log(colorizer.colorize(' Clickability login page, attempting to login...', 'PARAMETER'));

            casper.waitForSelector("form input[name='j_username']", function() {
                this.fillSelectors('form#login', {
                    'input[name = j_username ]' : 'beta@staging.com',
                    'input[name = j_password ]' : 'ots!!Staging1'
                }, true);
            });

            casper.waitWhileSelector('form',
                // Adding pass/fail wait to wait for page to redirect to new page.
                function pass () {
                    // console.log('PASS - selector gone');
                    output = true;
                },
                function fail () {
                    // console.log('FAIL - selector still');
                    // casper.captureSelector(saveLocation + '_' + 'bypassLogin-FAIL-testing_failure-screenshot_' + timeStamp + '_' + browser + '.jpg', 'body');
                }, 3000);

            casper.then(function(){
                if (typeof(callback) === "function") {
                    callback(output);
                }
                if (output == true) {
                    console.log(colorizer.colorize(' ...login successful, continuing.', 'PARAMETER'));
                } else {
                    console.log(colorizer.colorize(' Unable to attempt login.', 'ERROR'));
                }
                console.log('/////////////////////////////////////////////////');
                console.log('-------------------------------------------------');
            })
        } else {
            throw new Error('bypassLogin: Unable to attempt login;');
        }
    };


    regressionSuite.prototype.selectOptionByValue = function(selector, valueToMatch){
        var suite = this;
        if (debugOutput) {
            console.log('####### inside select function');
            console.log('selector ' + selector);
            console.log('valueToMatch ' + valueToMatch);
        }

        casper.evaluate(function(selector, valueToMatch){
            var select = document.querySelector(selector),
                found = false;
            Array.prototype.forEach.call(select.children, function(opt, i){
                if (!found && opt.value.indexOf(valueToMatch) !== -1) {
                    select.selectedIndex = i;
                    found = true;
                }
            });
            // dispatch change event in case there is some kind of validation
            var evt = document.createEvent("UIEvents"); // or "HTMLEvents"
            evt.initUIEvent("change", true, true);
            select.dispatchEvent(evt);
        }, selector, valueToMatch);
    };


    regressionSuite.prototype.testPageSelectOptions = function(selectIDorName, urlUri) {
        /*
            Use Case:
            - If timezone select exists, choose an option from the select timezone
            - Verify that the listings appear
            - Test changing the day of the week
            - Verify that the listings still appear
        */

        var suite = this;

        test.comment('... testing dropdowns.');

        casper.wait(200, function() {
            var selectCurrentTZVal = parseInt(this.evaluate(function(){ return document.getElementById("timezoneSelect").value;})),
                selectCurrentDayVal = this.evaluate(function(){ return document.getElementById("daySelect").value;}),
                baseTimeZoneSelectValue = -240,
                incrementSelectVal = -100,
                baseDaySelectValue = '#0';

            if (casper.exists('#timezoneSelect')) {
                if (debugOutput) {
                    console.log('selectCurrentTZVal: ' + selectCurrentTZVal);
                    console.log('baseTimeZoneSelectValue: ' + baseTimeZoneSelectValue);
                }


                casper.then(function(){
                    if (selectCurrentTZVal === baseTimeZoneSelectValue ) {
                        if (debugOutput) {console.log('values equal');}
                        var tzTestSelectValue = 300;
                    } else {
                        console.log('tz not equal');
                    }

                    suite.selectOptionByValue('#timezoneSelect', tzTestSelectValue);
                });

                casper.then(function(){
                    casper.wait(500, function() {
                        getSelectCurrentTZVal = parseInt(this.evaluate(function(){ return document.getElementById("timezoneSelect").value;}));
                        if (debugOutput) {console.log('selectCurrentTZVal ' + getSelectCurrentTZVal);}

                        if (getSelectCurrentTZVal != selectCurrentTZVal) {
                            test.comment('.....timezone dropdown changed/working correctly.');
                            if (debugOutput) {casper.captureSelector(saveLocation + urlUri + '_' + '_TVListingsContainerTZ_' + timeStamp + '_' + browser + '.jpg', 'body');}
                            suite.testAssertion('#listings #tvListingContainer', urlUri, urlUri + '_TVListingsContainer[TZ_changed]');
                        } else {
                            test.comment(' - [SelectTest] Timezone may not have chnaged properly.');
                        }
                    })
                });
            }

            // -------

            if (casper.exists('#daySelect')) {
                casper.then(function(){
                    if (selectCurrentDayVal === baseDaySelectValue ) {
                        var dayTestSelectValue = '#1';
                    } else {
                        console.log('day not equal');
                    }

                    if (debugOutput) {
                        console.log('baseDaySelectValue: ' + baseDaySelectValue);
                        console.log('dayTestSelectValue: ' + dayTestSelectValue);
                    }

                    suite.selectOptionByValue('#daySelect', dayTestSelectValue);
                });

                casper.then(function(){
                    casper.wait(500, function() {
                        getSelectCurrentDayVal = this.evaluate(function(){ return document.getElementById("timezoneSelect").value;});
                        if (debugOutput) {console.log('getSelectCurrentDayVal ' + getSelectCurrentDayVal);}

                        if (getSelectCurrentDayVal != baseDaySelectValue) {
                            test.comment('.....date dropdown changed/working correctly.');
                            if (debugOutput) {casper.captureSelector(saveLocation + urlUri + '_' + '_TVListingsContainerDAY_' + timeStamp + '_' + browser + '.jpg', 'body');}
                            suite.testAssertion('#listings #tvListingContainer', urlUri, urlUri + '_TVListingsContainer[Day_changed]');
                        } else {
                            test.comment(' - [SelectTest] Date may not have chnaged properly.');
                        }
                    })
                });
            }
        })
    };


    regressionSuite.prototype.collectedLinkCheckSort = function(mainURL, destinations, testProperty) {
        var suite = this;

        for (var navLocation in destinations) {
            
            if (prevtestDesinations.hasOwnProperty(navLocation)) {
                console.log(colorizer.colorize('-- URL prev tested, skipping // ['+ navLocation +']', 'COMMENT'));
            } else {
                prevtestDesinations[navLocation] = destinations[navLocation];

                if ( destinations[navLocation].indexOf(mainURL) > -1 || destinations[navLocation].indexOf('http://') > -1 || destinations[navLocation].indexOf('https://') > -1 ) {
                    // console.log('          url found');
                    var currentNavUrl = destinations[navLocation].replace(/ /g,"");
                } else {
                    var baseURL = mainURL.replace('http:','').replace('https:','');

                    if ( destinations[navLocation].indexOf(baseURL) > -1) {
                        var currentNavUrl = destinations[navLocation].replace(/ /g,"").replace(baseURL, mainURL);
                    } else {
                        var currentNavUrl = mainURL + destinations[navLocation].replace(/ /g,"");
                    }
                }

                var currentNavTitle = navLocation;

                if (debugOutput) {
                    console.log(currentNavTitle);
                    console.log(' mainURL ~ ' + mainURL);
                    console.log(' navLocation ~ ' + navLocation);
                    console.log(' destinations[navLocation] ~ ' + destinations[navLocation]);
                    console.log(' testUrl ~ ' + currentNavUrl);
                    console.log('--------------');
                }

                // Skip section
                if (currentNavUrl.indexOf('cozitv') > -1 || currentNavUrl.indexOf('telexitos') > -1) {
                    test.comment('CoziTV or Telexitos link, skipping page check, run regression directly on that property: ' + currentNavUrl);

                } else if (
                    currentNavUrl.indexOf('apple.com') > -1 ||
                    currentNavUrl.indexOf('facebook.com') > -1 ||
                    currentNavUrl.indexOf('twitter.com') > -1 ||
                    currentNavUrl.indexOf('google.com') > -1 ||
                    currentNavUrl.indexOf('instagram.com') > -1 ||
                    currentNavUrl.indexOf('twitter.com') > -1 ||
                    currentNavUrl.indexOf('brassring.com') > -1 ||
                    currentNavUrl.indexOf('telemundo.com') > -1 ||
                    currentNavUrl.indexOf('nbc.com') > -1 ||
                    currentNavUrl.indexOf('data.nbcstations.com') > -1
                ) {
                    test.comment('Social link, skipping page check. url: ' + currentNavUrl);

                } else if (currentNavUrl.indexOf('/privacy') > -1){
                    test.comment('External privacy link, skipping page check. url: ' + currentNavUrl);

                } else if (currentNavUrl.indexOf('mailto:') > -1 || currentNavUrl.indexOf('nbc_app') > -1 || currentNavUrl.indexOf('brassring') > -1 || currentNavUrl.indexOf('nbcstations') > -1){
                    test.comment('Misc link, skipping page check. url: ' + currentNavUrl);

                } else {
                    // Test the individual page item
                    suite.itemLinkPageTesting(mainURL, currentNavTitle, currentNavUrl);
                    casper.clear();
                }
            }
        }
        // after for
        casper.clear();
    };


    regressionSuite.prototype.itemLinkPageTesting = function(mainURL, linkName, linkURL) {
        var suite = this;

        casper.wait(100, function() {
            if (linkURL) {
                casper.thenOpen(linkURL, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                    // Grab url info
                    var parser = document.createElement('a');

                    parser.href = response.url;

                    var newUrl = parser.href,
                        urlPath = parser.pathname,
                        pagePathName = urlPath.replace('/','').split(/[/?#]/)[0],
                        sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0],
                        urlUri = sourceString.replace('.','_');

                    // if forced to login screen, login
                    if (response.url.indexOf('clickability') > -1 || this.getCurrentUrl().indexOf('clickability') > -1) {
                        test.comment('Clickability redirect. Current URL: ' + this.getCurrentUrl());
                        var bypassLoginScreen = suite.bypassLogin(true, function (data) {
                            if (! data) {
                                if (showOutput) {
                                   console.log('-- Unable to bypass login screen: ' + colorizer.colorize(data, 'FAIL'));
                                   casper.captureSelector(saveLocation + urlUri + '_' + 'bypassLogin-testing_failure-screenshot_' + timeStamp + '_' + browser + '.jpg', 'body');
                                }
                            }
                        })
                    } else {
                        casper.wait(100, function() {
                            console.log('-----------------------------');
                            console.log(colorizer.colorize('# Link Name/Text > ', 'PARAMETER') +  linkName);
                            console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                            // Check for the header/footer
                            if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                                checkHeader = (mobileTest) ? suite.testAssertion('.header  ', urlUri, 'header') : suite.testAssertion('.site-header', urlUri, 'header');
                                checkFooter = (mobileTest) ? suite.testAssertion('#footer', urlUri, 'footer') : suite.testAssertion('.footer', urlUri, 'footer');
                            } else {
                                checkHeader = (mobileTest) ? suite.testAssertion('.header  ', urlUri, 'header') : suite.testAssertion('.site-header', urlUri, 'header');
                                checkFooter = (mobileTest) ? suite.testAssertion('#footer', urlUri, 'footer') : suite.testAssertion('.page_footer', urlUri, 'footer');
                            }

                            // Check if subnav exists on the page
                            if (! mobileTest) {
                                if (casper.exists('.subnav-section-landing')) {
                                    suite.testAssertion('.subnav-section-landing', urlUri, pagePathName + '_subNav');
                                } else {
                                    if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                                        console.log(colorizer.colorize('-- [NBC] No on-page subnav on the current url.', 'COMMENT'));
                                    } else {
                                        console.log(colorizer.colorize('-- [TLM] No default style subnav on the current url.', 'COMMENT'));
                                    }
                                }
                            } else {
                                suite.testAssertion('.quick-nav', urlUri, 'QuickNav');
                            }

                            // Homepage tests
                            if ( response.url === mainURL + '/') {
                                if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {

                                    //Check if mobile and test accordingly
                                    if (mobileTest) {
                                        if (casper.exists('#appIntercept')) {
                                            this.mouse.move('#appIntercept .interceptContainer .noThanks');
                                            this.mouse.click('#appIntercept .interceptContainer .noThanks');
                                        }
                                        // Check for weather module as well as weather slide in quicknav
                                        suite.testAssertion('.weather-module', urlUri, 'Homepage Weather Module');
                                        suite.testAssertion('.nav-slide.weather', urlUri, 'QuickNav Weather Reading');
                                        suite.testAssertion('.nav-slide.weather img', urlUri, 'QuickNav Weather Icon');

                                        // Open main nav and ensure its visibile
                                        this.mouse.move('.logo-container');
                                        this.mouse.click('.logo-container');
                                        casper.wait(200, function() {
                                            // casper.wait(200, function() {
                                                suite.testAssertion('.nav-container', urlUri, 'Mobile Nav');
                                            // });
                                        });

                                        // Close main nav
                                        this.mouse.move('.logo-container');
                                        this.mouse.click('.logo-container');

                                        // Open TVE menu and ensure its visibile
                                        casper.wait(300, function() {
                                            this.mouse.move('.watch-live-container');
                                            this.mouse.click('.watch-live-container');

                                            casper.wait(200, function() {
                                                suite.testAssertion('.watch-live-menu', urlUri, 'TVE-NavVisible');
                                            });
                                        });

                                        // Close TVE Menu
                                        this.mouse.move('.watch-live-container');
                                        this.mouse.click('.watch-live-container');

                                    } else {
                                        suite.testAssertion('.weather-module-map iframe', urlUri, 'homepage weather module');
                                        suite.testAssertion('iframe.wx-standalone-map', urlUri, 'homepage weather module - map iframe');

                                        var verifyMapOpen = this.evaluate(function() {
                                            var mapOpen = false,
                                            weatherMapHeight = document.getElementsByClassName('wx-standalone-map')[0].clientHeight;

                                            if (weatherMapHeight > 259) {
                                                mapOpen = true;
                                            }
                                            return mapOpen;
                                        });

                                        if (verifyMapOpen) {
                                            console.log(colorizer.colorize('PASS', 'INFO') + ' the weather map is visible and open.');
                                        } else {
                                            console.log(colorizer.colorize('FAIL homepageWeatherMap didnt loaded correctly, but isn\'t open.', 'ERROR'));
                                            suite.logRegressionError('wx-standalone-map', urlUri, 'homepageWeatherMap');
                                        }
                                    }
                                }
                            }

                            // Traffic Page tests
                            if ( response.url.indexOf('traffic') > -1 || response.url.indexOf('trafico') > -1 ) {
                                if (mobileTest) {
                                    this.mouse.move('#trafficTab .map');
                                    this.mouse.click('#trafficTab .map');
                                    suite.testAssertion('.map', urlUri, 'Traffic map');

                                    // Check traffic routes tab
                                    this.mouse.move('#trafficTab .routes');
                                    this.mouse.click('#trafficTab .routes');
                                    suite.testAssertion('#trafficIncidents', urlUri, 'Traffic Route Alerts');
                                } else {
                                    if (casper.exists('#trafficContainer')) {
                                        var trafficContainerID = '#trafficContainer';
                                        var trafficMapContainer = '.wx-standalone-map';
                                    } else {
                                        var trafficContainerID = '#navteqTrafficOneContainer';
                                        var trafficMapContainer = '#map_canvas';
                                    }

                                    casper.then(function(){
                                        suite.testAssertion(trafficContainerID, urlUri, 'trafficMap container');
                                        suite.testAssertion(trafficMapContainer, urlUri, 'trafficMap');
                                    });
                                }
                            }

                            // Contact & TV Listings page tests
                            if ( response.url.indexOf('contact-us/') > -1 || response.url.indexOf('conectate/') > -1 ) {
                                if ( response.url.indexOf('tv-listings') > -1 ){
                                    if ( response.url.indexOf('tv-listings/?disableHeader=true') > -1  || /.com\/contact-us\/tv-listings\/?$/.test(response.url) || /.com\/conectate\/tv-listings\/?$/.test(response.url)) {

                                        if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                                            var tvListingsContainerName = 'CoziTVListingsContainer';
                                            var tvListingsTabName = 'CoziTVListingsTab';
                                        } else {
                                            var tvListingsContainerName = 'TelexitosTVListingsContainer';
                                            var tvListingsTabName = 'TelexitosTVListingsTab';
                                        }

                                        casper.then(function(){
                                            suite.testAssertion('#listings #tvListingContainer', urlUri, 'tvListingsContainer');
                                        });

                                        casper.then(function(){
                                            test.comment('.... testing tab switching')
                                            casper.wait(200, function() {
                                                this.mouse.move('#listings #tabSelect');
                                                this.mouse.click('#listings #tabSelect li:last-child');

                                                casper.test.assertExists('#listings #tabSelect li:last-child' + "." + 'selected');
                                            })
                                        });

                                        casper.then(function(){
                                            suite.testAssertion('#listings #tabSelect li:last-child', urlUri, tvListingsTabName);
                                            suite.testAssertion('#listings #tvListingContainer', urlUri, tvListingsContainerName);
                                        });
                                    }
                                }

                                if (/.com\/contact-us\/?$/.test(response.url)) {
                                    if (mobileTest) {
                                        suite.testAssertion('.contact_social', urlUri, 'contactPageModule-Social');
                                        suite.testAssertion('.contact_mobile', urlUri, 'contactPageModule-Mobile');
                                        suite.testAssertion('.contact_about', urlUri, 'contactPageModule-Contact');
                                    } else {
                                        suite.testAssertion('#contact-landing-all', urlUri, 'contactPageModule');
                                    }
                                }
                            }

                            // Weather page tests
                            if (response.url.indexOf('/weather') > -1) {
                                if (/.com\/weather\/?$/.test(response.url) || response.url.indexOf('/weather/?zipCode=') > -1) {
                                    if (mobileTest) {
                                        casper.wait(200, function() {
                                            suite.testAssertion('#interactiveRadarMap', urlUri, 'weatherMap');
                                            suite.testAssertion('#currentConditions', urlUri, 'currentConditionsModule');
                                            suite.testAssertion('#currentConditions .currentTemp', urlUri, 'currentConditionsModule-Temp');
                                            suite.testAssertion('img#currentConIcon', urlUri, 'currentConditionsModule-WX_Icon');
                                            suite.testAssertion('#hourly', urlUri, 'weatherHourlyModule');
                                            suite.testAssertion('#hourly .hrBrdwn', urlUri, 'weatherHourlyModule-forecast');
                                            suite.testAssertion('.seven-day', urlUri, 'weather7DayForecast');
                                            suite.testAssertion('#todaysForecast', urlUri, 'weatherTodayForecastModule');
                                            suite.testAssertion('.radar_mapsLink', urlUri, 'radarMapsLink');
                                            suite.testAssertion('.ugcLink', urlUri, 'ugcLink');
                                        });
                                    } else {
                                        suite.testAssertion('#wuContainer', urlUri, 'weatherPageModule');
                                    }

                                    if (casper.exists('#wunderPane')) {
                                        this.mouse.move('#wunderSwitch .PWSV.tab');
                                        this.mouse.click('#wunderSwitch .PWSV.tab')

                                        casper.wait(100, function() {
                                            suite.testAssertion('#pwsFieldMap', urlUri, 'PWSWeatherMap');
                                        });
                                    }
                                }
                            }

                            // Investigatesions page tests
                            if (/.com\/investigations\/?$/.test(response.url)) {
                                if (! mobileTest) {
                                    suite.testAssertion('#teamHeader', urlUri, 'investigations Header');
                                    suite.testAssertion('#leadBox', urlUri, 'investigations Lead Area');
                                }
                            }
                        })
                    }
                });
            } else {
                console.log('No URL passed into itemLinkPageTesting!');
            }
        })
    };

    // regressionSuite.prototype.testVerticalGallery = function(galleryURL) {
    regressionSuite.prototype.testVerticalGallery = function(maxVertSlideCountRef, refLoop) {
        var suite = this;

            var maxVertSlideCount = maxVertSlideCountRef;

            for (var i = 1; i <= Math.floor(maxVertSlideCount); i++) {
                casper.mouse.move('#galleryTrigger');
                console.log('#slide' + i);
                
                if (refLoop) {
                    casper.evaluate(function(){ verticalGallery.number;});
                }

                casper.evaluate(function(){ verticalGallery.writeImage();});
                casper.mouse.move('#galleryTrigger');

                suite.testAssertion('#slide' + i, urlUri, 'fullPageGallerySlide_' + i);
            }

            if (! refLoop) {
                suite.testVerticalGallery(maxVertSlideCount, true)
            }
    }

    regressionSuite.prototype.thirdPartyPageTests = function(testProperty, url) {

        var suite = this;
        var addtnlDestinations = [];

        // Set testing item
        if (testProperty == 'telexitosTestSuite') {
            var otsTestSuite = true,
                addtnlDestinations = [
                    'http://www.telexitos.com'
                ];
        } else if (testProperty == 'coziTestSuite') {
            var otsTestSuite = true,
                addtnlDestinations = [
                    'http://www.cozitv.com'
                ];
        } else if (testProperty == 'otsTestSuite') {
            addtnlDestinations = [
                'https://www.nbcnewyork.com/qa-test-section-only/NATL-NYAutomated-Testing---FullPageGallery-456150923.html',
                'https://www.nbcnewyork.com/qa-test-section-only/SPONSOREDOTS-Testing-SponsoredContentArticle-456152803.html',
                'https://www.nbcnewyork.com/qa-test-section-only/NATLOTS-Testing-LeadGalleryArticle-456154113.html'
            ]
        } else if (testProperty == 'tlmTestSuite') {
            addtnlDestinations = [
                'https://www.telemundo47.com/qa-test-section-only/TLM-Automated-Testing---FullPageGallery-456151643.html',
                'https://www.telemundo47.com/qa-test-section-only/Sponsored-TLM-Testing-SponsoredContentArticle-456168783.html',
                'https://www.telemundo47.com/qa-test-section-only/TLM-Testing-LeadGalleryArticle-456171583.html'
            ]
        }

        addtnlDestinations.reverse();

        for (var i = addtnlDestinations.length - 1; i >= 0; i--) {
            if ( addtnlDestinations[i].indexOf('cozi') > -1 || addtnlDestinations[i].indexOf('telexitos') > -1 ) {
                var currentNavUrl = addtnlDestinations[i];
            } else {
                // var currentNavUrl = url + addtnlDestinations[i];
                var currentNavUrl = addtnlDestinations[i];
            }

            casper.thenOpen(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {

                // console.log(testProperty);
                console.log('-----------------------------------------------');
                console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);
                // console.log('> HTTP Response - ' + response.status);
                if (response.status == '200') {
                    console.log(colorizer.colorize('PASS','INFO') + ' page loaded > HTTP Response: ' + response.status);
                } else {
                    console.log(colorizer.colorize('FAIL/WARN','WARN_BAR') + ' HTTP Response: ' + response.status + ' - page didn\'t load correctly and/or was redirected. Test Manually');
                }

                var parser = document.createElement('a');
                parser.href = response.url;

                var newUrl = parser.href,
                    sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0],
                    urlUri = sourceString.replace('.','_');

                // Telexitos testing
                if ( response.url.indexOf('telexitos') > -1 ) {
                    // test.testAssertion('.primary', urlUri, "main page loaded and displayed.");
                    suite.testAssertion('.primary', urlUri, 'telexitosMainDiv');
                    suite.testAssertion('.full.top_nav', urlUri, 'header');
                    suite.testAssertion('#footer', urlUri, 'footer');

                    casper.thenOpen('http://www.telexitos.com/guia-tv', { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                        console.log('-----------------------------------------------');
                        console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);
                        if (response.status == '200') {
                            console.log(colorizer.colorize('PASS','INFO') + ' page loaded > HTTP Response: ' + response.status);
                        } else {
                            console.log(colorizer.colorize('FAIL/WARN','WARN_BAR') + ' HTTP Response: ' + response.status + ' - page didn\'t load correctly and/or was redirected. Test Manually');
                        }

                        suite.testAssertion('.schedule a', urlUri, 'telexitosTVListingsPDFButton');
                        suite.testAssertion('#timezoneSelect', urlUri, 'telexitosTV Timezone Selection');
                        suite.testAssertion('#listings #tvListingContainer', urlUri, 'telexitosTVListingsContainer');
                        suite.testAssertion('#footer', urlUri, 'footer');

                        // Wait a few additional moments, change dropdown, then wait/confirm load
                        casper.then(function(){
                            casper.wait(200, function() {
                                test.comment('... testing timezone dropdown.');

                                suite.testPageSelectOptions('#timezoneSelect',urlUri);
                            });
                        });
                    });
                }

                // Cozi testing
                if ( response.url.indexOf('cozi') > -1 ) {
                    suite.testAssertion('.headerLogo', urlUri, 'coziLogo');
                    suite.testAssertion('.page .feature-full', urlUri, 'coziMainContent');
                    suite.testAssertion('#footer .wrap', urlUri, 'footer');

                    casper.thenOpen('http://www.cozitv.com/tv-listings/', { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                        console.log('-----------------------------------------------');
                        console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);
                        if (response.status == '200') {
                            console.log(colorizer.colorize('PASS','INFO') + ' page loaded > HTTP Response: ' + response.status);
                        } else {
                            console.log(colorizer.colorize('FAIL/WARN','WARN_BAR') + ' HTTP Response: ' + response.status + ' - page didn\'t load correctly and/or was redirected. Test Manually');
                        }

                        suite.testAssertion('.schedule a', urlUri, 'coziTVListingsPDFButton');
                        suite.testAssertion('#timezoneSelect', urlUri, 'coziTV Timezone Selection');
                        suite.testAssertion('#listings #tvListingContainer', urlUri, 'coziTVListingsContainer');
                        suite.testAssertion('#footer .wrap', urlUri, 'footer');
                    });

                    casper.thenOpen('http://www.cozitv.com/get-cozi-tv/', { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                        suite.testAssertion('#bodyContainer', urlUri, 'coziTVAffiliateMap');
                    });
                }

                /*******************************************
                *
                * OTS / TLM Additional static page testing
                *
                *******************************************/

                if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                    checkHeader = (mobileTest) ? suite.testAssertion('.header  ', urlUri, 'header') : suite.testAssertion('.site-header', urlUri, 'header');
                    checkFooter = (mobileTest) ? suite.testAssertion('#footer', urlUri, 'footer') : suite.testAssertion('.footer', urlUri, 'footer');

                    if (casper.exists('.socialNetworks-top') || casper.exists('.socialNetworks')) {
                        checkSocialBar = (mobileTest) ? suite.testAssertion('.socialNetworks', urlUri, 'Content Sharebar') : suite.testAssertion('.socialNetworks-top', urlUri, 'Content Sharebar');
                    }
                }

                // Check for Taboola module
                if (casper.exists('#taboola-mobile-below-article-thumbnails') || casper.exists('#taboola-below-article-thumbnails')) {
                    checkTaboolaMobule_Thumb = (mobileTest) ? suite.testAssertion('#taboola-mobile-below-article-thumbnails', urlUri, 'Taboola Thumb Module') : suite.testAssertion('#taboola-below-article-thumbnails', urlUri, 'Taboola Thumb Module');
                }

                if (casper.exists('#taboola-below-article-organic-text-links') || casper.exists('#taboola-below-article-text-links')) {
                    checkTaboolaMobule_Links = (mobileTest) ? suite.testAssertion('#taboola-below-article-organic-text-links', urlUri, 'Taboola Link Module') : suite.testAssertion('#taboola-below-article-text-links', urlUri, 'Taboola Link Module');
                }

                if (casper.exists('.module-civicScience')) {
                    suite.testAssertion('.module-civicScience', urlUri, 'Civic Science module');
                }

                if (casper.exists('#article-comments')){
                    suite.testAssertion('#article-comments', urlUri, 'articleCommentArea');
                }

                // Full page gallery test
                if (response.url.indexOf('FullPageGallery') > -1) {
                    console.log('-----------------------------');
                    console.log(colorizer.colorize('# Vertical Gallery Display Test', 'PARAMETER'));
                    console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                    suite.testAssertion('#taboola-below-gallery-thumbnails-2nd', urlUri, 'Taboola Thumb Module Row 2');

                    // casper.evaluate(function(){window.scrollTo(0,document.querySelector(".scrollingContainer").scrollHeight)});
                    if (mobileTest) {
                        maxVertSlideCount = casper.evaluate(function(){ return document.querySelector('#slide1 > div.slide_count > span.total_number').innerText;});
                    } else {
                        maxVertSlideCountText = casper.evaluate(function(){ return document.querySelector('.slide_count').innerText;});
                        maxVertSlideCount = maxVertSlideCountText.substring(5);
                    }

                    casper.wait(200, function() {
                        // maxVertSlideCount = casper.evaluate(function(){ return document.getElementsByClassName('slide_count').length;});
                        // suite.testVerticalGallery(response.url);
                        // suite.testVerticalGallery(maxVertSlideCount);
                        // maxSlideID = '#slide' + maxVertSlideCount;
                        // maxSlideID = '#slide2';

                        // // this.mouse.move(maxSlideID);

                        // // this.mouse.move('#galleryTrigger');
                        // // this.mouse.click('#galleryTrigger');

                        // casper.wait(200, function() {
                        //     console.log('WAIT COMPELTE CONTINUE');
                        //     page.evaluate(function() {
                        //       // Scrolls to the bottom of page
                        //       window.document.body.scrollTop = document.body.scrollHeight;
                        //     });
                        //     // maxVertSlideCount = casper.evaluate(function(){ return document.querySelector('#slide1 > div.slide_count > span.total_number').innerText;});
                        // });


                        // // casper.waitForSelector(maxSlideID, function() {
                        // casper.waitForSelector('#galleryTrigger', function() {

                        //     for (var i = maxVertSlideCount; i > 0; i--) {

                        //         // casper.wait(200, function() {
                                    // suite.testAssertion('#slide' + i, urlUri, 'fullPageGallerySlide_' + i);
                        //             suite.testAssertion('#slide' + i + ' img', urlUri, 'fullPageGallerySlide_' + i + '--Image');
                        //         // })
                        //     }
                        // })
                    });
                }

                // Sponsored page test
                if (response.url.indexOf('SponsoredContentArticle') > -1) {
                    console.log('-----------------------------');
                    console.log(colorizer.colorize('# Sponsored Content Test', 'PARAMETER'));
                    console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                    casper.wait(200, function() {
                        // suite.testAssertion('.socialNetworks-top', urlUri, 'contentShareBar');
                        // suite.testAssertion('div.article_elements.sponsored', urlUri, 'SponsoredContentArticleBackground');

                        // maxVertSlideCount = casper.evaluate(function(){ return document.querySelector('#slide1 > div.slide_count > span.total_number').innerText;});

                        // for (var i = maxVertSlideCount; i > 0; i--) {

                        // }
                    });
                }

                // Lead Gallery Article page test
                if (response.url.indexOf('LeadGalleryArticle') > -1) {
                    console.log('-----------------------------');
                    console.log(colorizer.colorize('# Lead Gallery Content Test', 'PARAMETER'));
                    console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                    casper.wait(200, function() {
                        suite.testAssertion('div.leadMediaRegion.gallery', urlUri, 'Lead media in gallery');
                        // div.leadMediaThumbnail
                        suite.testAssertion('.embedded.gallery', urlUri, 'Lead media gallery object');
                    });
                }
            })
        };

    };

    new regressionSuite(casper.cli.get('url'));
});
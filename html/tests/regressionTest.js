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
    // casper.options.timeout = 300000;
    casper.options.timeout = 900000;

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
        testResultsObject = {},
        timeoutDetails = {},
        regressionResults = {},
        testingObject = {},
        testStatus = 'Pass',
        setFail = 0,
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
        var configURL = 'http://spire.app',
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

    // if (true) {

    // } else {
        casper.options.viewportSize = { width: 1280, height: 5000 };
    // }


    if (['local', 'dev', 'prod'].indexOf(envConfig) < 0) {
        var process = require("child_process"),
            spawn = process.spawn,
            child = spawn("chown", ["-hR", "ec2-user:apache", saveLocation]);
    }

    /*************************
    *
    * Begin test suite setup
    *
    *************************/
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

        // casper.start().then(function(response) {
        casper.start( url ).then(function(response) {
            // casper.on('remote.message', function(message) {
            //     this.echo(message);
            // });

            if ( response.status == 200 || response.status == 302 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                
                if (manifestTestRefID) {
                    testResultsObject['testID'] = manifestTestRefID;
                } else {
                    suite.createTestID(url, 'regressionTest', urlUri);
                }

            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function() {
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

                    // if (! thirdPartyChecks) {
                        // Run default NBC/TLM tests
                        // suite.visualTests(testProperty, urlUri, url);
                    // } else {
                        // Skip to Cozi/Telexitos tests ( see thirdPartyPageTests() )
                        suite.thirdPartyPageTests(testProperty, url);
                    // }

                    

                } else {
                    casper.test.fail('Page did not load correctly. Response: ' + response.status);
                }
            })
        }).then(function() {
            if (! thirdPartyChecks) {
                // Test navigation items and pages
                // console.log('-------------');
                // console.log(' Page tests');
                // console.log('-------------');
                suite.testHoverAndCollectNavigation(testProperty, url, urlUri);
            }
        }).then(function() {
            // console.log('were here 2');
            console.log('-----------------------------------');
            console.log(' Test completed with ' + setFail + ' failures.');
            console.log('-----------------------------------');

            //Log test results
            if (setFail > 0) {
                suite.processTestResults(urlUri, testResultsObject, setFail, testResultsObject['testID'], 'regressionTest', testStatus);

                if (debugOutput) {
                    console.log('-----------------------------------------------');
                    console.log('  ' + setFail + ' Failures!');
                    console.log('-----------------------------------------------');

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
                suite.processTestResults(urlUri, testResultsObject, setFail, testResultsObject['testID'], 'regressionTest', testStatus, testInfo);
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            
            this.exit();
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

        // NBC OTS Testing
        if (testProperty == 'otsTestSuite') {
            casper.wait(700, function() {
            // casper.wait(47000, function() {
                this.waitForSelector("#sfcontentFill",
                    function pass () {
                        test.comment('loading done.....');

                        test.comment('[ -- clicking logo -- ]');
                            this.mouse.click('.brand a');
                        console.log('clicked ok, new location is ' + this.getCurrentUrl());

                        test.assertSelectorHasText('body', 'home', "Homepage loaded");

                        this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

                        // Setup testing object. testingObject[referenceName] = testingHTMLElement
                        
                        test.assertVisible('.weather-module-radar iframe', 'weather-iframe' + ' is visibile');
                        test.assertExists('.weather-module-radar iframe');


                        // this.mouse.move('.weather-module-radar iframe');

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
        }

        if (testProperty == 'tlmTestSuite') {
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

                        testingObject['siteHeader'] = '.site-header';
                        testingObject['headerLogo'] = '.brand a img';
                        testingObject['mainNav'] = '.navbar';
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

        casper.wait(100, function() {
            if (casper.exists(testingEntity)) {
                // console.log(colorizer.colorize(' > ' + refName + ' loaded correctly.', 'PARAMETER'));
                try {
                    test.assertVisible(testingEntity, refName + ' is visibile');
                } catch (e) {
                    console.log(colorizer.colorize(' > Failure: ' + refName + ' loaded, but not visible and/or correctly seen in the viewport. ', 'ERROR'));
                    // console.log(' > Failure: ' + refName + ' loaded, but not visible and/or correctly seen in the viewport.');
                    console.log('   -- failure')
                    console.log('   -- ' +  e);
                    suite.logRegressionError(testingEntity, urlUri, refName);
                }
            } else {
                console.log(colorizer.colorize(refName + ' didnt load correctly, and/or wasn\'t located on the site.', 'ERROR'));
                suite.logRegressionError(testingEntity, urlUri, refName);
            }
        });
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

                    // console.log('screenshots');
                    // casper.captureSelector(saveLocation + '_' + '_menu-hover-screenshot_' + refIndex + '__' + timeStamp + '_' + browser + '.jpg', 'body');
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
            });

            // Collect all navigation items/links
            casper.then(function(){
                console.log('------------------------------------------------');
                console.log(' Navigation link collection and page tests');
                console.log('-------------------------------------------------');
                // Set collection selector
                var selector = '.navbar-container a';

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
        output;

        if (bypassLogin) {
            console.log('-----------------------------');
            console.log('/////////////////////////////');
            console.log(colorizer.colorize('Clickability login page, attempting to login...', 'PARAMETER'));

            casper.waitForSelector("form input[name='j_username']", function() {
                this.fillSelectors('form#login', {
                    'input[name = j_username ]' : 'beta@staging.com',
                    'input[name = j_password ]' : 'ots!!Staging1'
                }, true);
            });

            // casper.waitWhileSelector('form', function() {
            casper.waitWhileSelector('form',
                // Adding pass/fail wait to wait for page to redirect to new page.
                function pass () {
                    // console.log('PASS - selector gone');
                    output = true;
                },
                function fail () {
                    // console.log('FAIL - selector still');
                    output = false;
                    casper.captureSelector(saveLocation + '_' + 'bypassLogin-FAIL-testing_failure-screenshot_' + timeStamp + '_' + browser + '.jpg', 'body');
                }, 3000);
            // });

            casper.then(function(){
                if (typeof(callback) === "function") {
                    callback(output);
                }

                console.log(colorizer.colorize('...login successful, continuing.', 'PARAMETER'));
                console.log('/////////////////////////////');
                console.log('-----------------------------');
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
            if ( destinations[navLocation].indexOf(mainURL) > -1 || destinations[navLocation].indexOf('http://') > -1 || destinations[navLocation].indexOf('https://') > -1 ) {
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

            if (debugOutput) {
                console.log(currentNavTitle + ' : ' + currentNavUrl)
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
                currentNavUrl.indexOf('twitter.com') > -1
            ) {
                test.comment('Social link, skipping page check. url: ' + currentNavUrl);

            } else if (currentNavUrl.indexOf('/privacy') > -1){
                test.comment('External privacy link, skipping page check. url: ' + currentNavUrl);

            } else if (currentNavUrl.indexOf('mailto:') > -1){
                test.comment('Misc link, skipping page check. url: ' + currentNavUrl);

            } else {
                // Test the individual page item
                suite.itemLinkPageTesting(mainURL, currentNavTitle, currentNavUrl);
            }
        }
    };


    regressionSuite.prototype.itemLinkPageTesting = function(mainURL, linkName, linkURL) {
        var suite = this;

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
                            
                            suite.logRegressionError('bypassLogin', urlUri, '_pageTests');
                        }
                    })
                } else {
                    casper.wait(100, function() {
                        console.log('-----------------------------');
                        console.log(colorizer.colorize('# Link Name/Text > ', 'PARAMETER') +  linkName);
                        console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                        // Check if subnav exists on the page
                        if (casper.exists('.subnav-section-landing')) {
                            suite.testAssertion('.subnav-section-landing', urlUri, pagePathName + '_subNav');
                        } else {
                            if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                                console.log(colorizer.colorize('-- [NBC] No on-page subnav on the current url.', 'COMMENT'));
                            } else {
                                console.log(colorizer.colorize('-- [TLM] No default style subnav on the current url.', 'COMMENT'));
                            }
                        }

                        // Homepage tests
                        if ( response.url === mainURL + '/') {
                            if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                                suite.testAssertion('.weather-module-map iframe', urlUri, 'homepageWeatherIframe');
                                suite.testAssertion('iframe.wx-standalone-map', urlUri, 'homepageWeatherIframe');

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

                        // Traffic Page tests
                        if ( response.url.indexOf('traffic') > -1 || response.url.indexOf('trafico') > -1 ) {
                            suite.testAssertion('#navteqTrafficOneContainer', urlUri, 'trafficMap container');
                            suite.testAssertion('.trafficNewLanding', urlUri, 'trafficMap');
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
                                suite.testAssertion('#contact-landing-all', urlUri, 'contactPageModule');
                            }
                        }

                        // Weather page tests
                        if (response.url.indexOf('/weather') > -1) {
                            if (/.com\/weather\/?$/.test(response.url) || response.url.indexOf('/weather/?zipCode=') > -1) {
                                suite.testAssertion('#wuContainer', urlUri, 'weatherPageModule');

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
                            suite.testAssertion('#teamHeader', urlUri, 'investigations Header');
                            suite.testAssertion('#leadBox', urlUri, 'investigations Lead Area');
                        }
                        
                        if (response.url.indexOf('nbc') > -1 || response.url.indexOf('necn') > -1) {
                            suite.testAssertion('.footer', urlUri, 'footer');
                        } else {
                            suite.testAssertion('.page_footer', urlUri, 'footer');
                        }
                    })
                }
            })
        } else {
            console.log('No URL passed into itemLinkPageTesting!');
        }
    };

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

                // Full page gallery test
                if (response.url.indexOf('FullPageGallery') > -1) {
                    console.log('-----------------------------');
                    console.log(colorizer.colorize('# Vertical Gallery Display Test', 'PARAMETER'));
                    console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                    casper.wait(200, function() {
                        suite.testAssertion('.socialNetworks-top', urlUri, 'contentShareBar');

                        maxVertSlideCount = casper.evaluate(function(){ return document.querySelector('#slide1 > div.slide_count > span.total_number').innerText;});

                        for (var i = maxVertSlideCount; i > 0; i--) {
                            suite.testAssertion('#slide' + i, urlUri, 'fullPageGallerySlide_' + i);
                            suite.testAssertion('#slide' + i + ' img', urlUri, 'fullPageGallerySlide_' + i + '--Image');
                        }
                    });
                }

                // Sponsored page test
                if (response.url.indexOf('SponsoredContentArticle') > -1) {
                    console.log('-----------------------------');
                    console.log(colorizer.colorize('# Sponsored Content Test', 'PARAMETER'));
                    console.log(colorizer.colorize('# Current test url > ', 'PARAMETER') +  response.url);

                    casper.wait(200, function() {
                        suite.testAssertion('.socialNetworks-top', urlUri, 'contentShareBar');
                        suite.testAssertion('div.article_elements.sponsored', urlUri, 'SponsoredContentArticleBackground');
                        suite.testAssertion('.module-civicScience', urlUri, 'civicScienceModule');
                        suite.testAssertion('#taboola-below-article-thumbnails', urlUri, 'taboolaThumbModule');
                        suite.testAssertion('#taboola-below-article-text-links', urlUri, 'taboolaLinkModule');
                        suite.testAssertion('#article-comments', urlUri, 'articleCommentArea');
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
                        suite.testAssertion('.socialNetworks-top', urlUri, 'contentShareBar');
                        suite.testAssertion('.module-civicScience', urlUri, 'civicScienceModule');
                        suite.testAssertion('div.leadMediaRegion.gallery', urlUri, 'leadMediaGallery');
                        suite.testAssertion('.embedded.gallery', urlUri, 'leadMediaGalleryObject');
                        suite.testAssertion('#taboola-below-article-thumbnails', urlUri, 'taboolaThumbModule');
                        suite.testAssertion('#taboola-below-article-text-links', urlUri, 'taboolaLinkModule');
                        suite.testAssertion('#article-comments', urlUri, 'articleCommentArea');
                    });
                }

            })
        };
        
    };

    new regressionSuite(casper.cli.get('url'));
});
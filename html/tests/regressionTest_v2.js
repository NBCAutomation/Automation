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
    var siteUrl = casper.cli.get("url");
    var mouse = require("mouse").create(casper);
    var saveLoc = ('screenshots/');
    var otsTestSuite = false;
    var tlmTestSuite = false;
    casper.options.viewportSize = { width: 1280, height: 5000 };
    var testResultsObject = {};
    var testingObject = {};
    var setFail = 0;
    var testProperty;


    // Util vars
    var currentTime = new Date();
    var colorizer = require('colorizer').create('Colorizer');

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

    var type = casper.cli.get('output');
        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'console') {
            var showOutput = true;
        }

    // var baseUrl = siteUrl.replace(/\/$/, '');

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
        // Start Test
        *******************/
        casper.start().then(function() {
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

                    console.log(url);
                    suite.visualTests(testProperty, urlUri, url);

                } else {
                    casper.test.fail('Page did not load correctly. Response: ' + response.status);
                }
            })
            

        }).then(function() {
            // Test navigation items and pages
            suite.collectNavigation(testProperty, url);
        }).then(function() {
            if (debugOutput) {
                if (setFail > 0) {
                    console.log('---------------------');
                    console.log('  ' + setFail + ' Failures!');
                    console.log('---------------------');

                    for (var failureItem in testResultsObject) {
                        console.log('> ' + failureItem);
                        if (typeof testResultsObject[failureItem] != 'object') {
                            console.log('> ' + failureItem + ' : ' + testResultsObject[failureItem]);
                        } else {
                            var subFailureItem = testResultsObject[failureItem];
                            for (var subFailureItems in subFailureItem) {
                                console.log('   > ' + subFailureItems + ' : ' + subFailureItem[subFailureItems]);
                            }
                        }
                    }
                } else {
                    console.log('setFail: ' + setFail);
                }
            }

        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            
            this.exit();
            test.done();
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
                            // suite.testAssertion(testingEntity, urlUri, refName);
                        }
                    },
                    function fail () {
                        this.captureSelector('screenshots/' + urlUri + '_failure-screenshot' + timeStamp + '.png', 'body');
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
                        this.captureSelector('screenshots/' + urlUri + '_failure-screenshot' + timeStamp + '.png', 'body');
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
            test.assertVisible(testingEntity, refName + ' is visibile');
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
        casper.captureSelector('test_results/screenshots/' + urlUri + '_' + entityName + '_failure-screenshot' + timeStamp + '.png', 'body');
        var failureScreenshot = 'test_results/screenshots/' + urlUri + '_' + entityName + '_failure-screenshot' + timeStamp + '.png';
        // console.log(failureScreenshot);

        refErrors['failure'] = 'unable to locate "' + refName + '" entitiy: "' + testingEntity + '"';
        refErrors['screenshot'] = failureScreenshot;

        testResultsObject[refName] = refErrors;
        setFail++;
    };


    // Regressiong test actions
    regressionSuite.prototype.collectNavigation = function(testProperty, url) {

        var suite = this;
        console.log('//////////////////////');

        casper.thenOpen(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
            var mainURL = this.getCurrentUrl().slice(0,-1);
            
            if (debugOutput) {console.log('main url ' + mainURL)};


            test.comment('[ -- clicking logo -- ]');
                this.mouse.click('.brand a');
            console.log('clicked ok, new location is ' + this.getCurrentUrl());
            console.log('...testing pages');

            // Set collection selector
            if (testProperty == 'otsTestSuite') {
                var selector = '.nav-section a.nav-section-title';
            } else {
                var selector = '.nav.black a';
            }

            // Collect nav items
            var evaluatedUrls = this.evaluate(function(mainURL, selector) {

                // Grab the current url data, href and link text
                return __utils__.findAll(selector).map(function(element) {
                    return {
                        url: element.getAttribute('href'),
                        innerText: element.innerText

                    };
                }).map(function(elementObj) {
                    return elementObj;
                });
            }, mainURL, selector);

            // Add the link information to our testing array
            var destinations = [];

            evaluatedUrls.forEach(function(elementObj) {
                var url = elementObj.url;
                var innerText = elementObj.innerText;

                // console.log(url, elementObj);

                if (url.length > 0 && destinations.indexOf(url) === -1) {
                    destinations.push({
                        url: url,
                        linkText: innerText
                    });
                }
            });

            // Send items to be tested
            suite.testNavigationItems(mainURL, destinations, testProperty);
        });
    };



    regressionSuite.prototype.testNavigationItems = function(mainURL, destinations, testProperty) {

        var suite = this;

        for (var i = destinations.length - 1; i >= 0; i--) {

            if ( destinations[i].url.indexOf(mainURL) > -1 ) {
                // console.log('          url found');
                var currentNavUrl = destinations[i].url;
            } else {
                // console.log('         no');
                var currentNavUrl = mainURL + destinations[i].url;
            }
            var currentNavTitle = destinations[i].linkText;

            if (debugOutput) {
                console.log('mainURL ~ ' + mainURL);
                console.log('destinations[i].linkText ~ ' + destinations[i].linkText);
                console.log('destinations[i].url ~ ' + destinations[i].url);
                console.log('testUrl ~ ' + currentNavUrl);
            }
            
            if ( currentNavUrl != mainURL+'/' ) {
                casper.thenOpen(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {

                    // test.comment('passed url => ' +  response.url);
                    var parser = document.createElement('a');
                    parser.href = response.url;
                    newUrl = parser.href;
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
                                test.comment( 'new page title' + this.getTitle() );
                                console.log('\n');

                                if (casper.exists('.subnav-large-container')) {
                                    casper.wait(700, function() {
                                        this.waitForSelector('.subnav-large-container',
                                            function pass () {
                                                console.log('-------------');
                                                test.comment('Current test url > ' +  response.url);
                                                console.log('HTTP Response - ' + response.status);

                                                // this.captureSelector('screenshots/sub-nav_' + destiations[i].linkText.toLowerCase() + '-screenshot' + timeStamp + '.png', 'body');
                                                test.assertVisible('.subnav-section-landing', "subsection navbar visible.");
                                            },
                                            function fail () {
                                                this.captureSelector('/screenshots/sub-nav_-screenshot' + timeStamp + '.png', 'body');
                                                test.fail("Unable to test page elements.");
                                            },
                                            null // timeout limit in milliseconds
                                        )
                                    })
                                } else {
                                    console.log('Unable to find the subnav container');
                                    console.log(response.body);
                                }
                            });

                        } else if (response.url.indexOf('nbc') > -1) {
                            if (casper.exists('.subnav-large-container')) {
                                casper.wait(700, function() {
                                    this.waitForSelector('.subnav-large-container',
                                        function pass () {
                                            console.log('-------------');
                                            test.comment('Current test url > ' +  response.url);
                                            console.log('HTTP Response - ' + response.status);

                                            // this.captureSelector('screenshots/sub-nav_' + destiations[i].linkText.toLowerCase() + '-screenshot' + timeStamp + '.png', 'body');
                                            console.log(this.getTitle());
                                            test.assertVisible('.subnav-section-landing', "subsection navbar visible.");
                                            // suite.testAssertion('.subnav-section-landing', urlUri, 'pageSubNavContainer');
                                        },
                                        // function fail () {
                                        //     this.captureSelector('/screenshots/sub-nav_-screenshot' + timeStamp + '.png', 'body');
                                        //     test.fail("Unable to test page elements.");
                                        // },
                                        null // timeout limit in milliseconds
                                    )
                                })
                            } else {
                                console.log('Unable to find the subnav container');
                                console.log(response.body);
                            }
                        }
                    }

                })
            } else {
                test.comment('homepage skipping subnav check...');
            }
        }

        casper.wait(100, function() {
            // console.log(destinations.length,i,testProperty, mainURL);
            if (i == -1) {
                suite.pageTests(testProperty, mainURL);
            };
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
                '/contact-us',
                '/traffic',
                '/weather',
                '/investigations',
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
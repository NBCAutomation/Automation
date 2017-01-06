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

                    if ( initBodyTag.indexOf('nbc') > -1 ) {
                        console.log('OTS property...');
                        var testProperty = 'otsTestSuite';
                    } else if ( initBodyTag.indexOf('tlmd') > -1 ) {
                        console.log('TLM property...');
                        var testProperty = 'tlmTestSuite';
                    } else {
                        console.log( 'Unable to get body class, possble header block.' );
                        console.log( '------- body class -------' );
                        console.log( initBodyTag );
                        this.exit();
                    }

                    console.log(url);
                    suite.visualTests(testProperty, url);

                } else {
                    casper.test.fail('Page did not load correctly. Response: ' + response.status);
                }
            })
            

        }).then(function() {
            // console.log('step');

        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            
            this.exit();
            test.done();
        });
    };

    // Regression visual tests
    regressionSuite.prototype.visualTests = function(testProperty, url) {
        var suite = this;

        // Set testing item
        if (testProperty == 'otsTestSuite') {
            var otsTestSuite = true;
        } else {
            var tlmTestSuite = true;
        }

        // NBC OTS Testing
        if (otsTestSuite) {
            // casper.wait(700, function() {
            casper.wait(47000, function() {
                this.waitForSelector("#sfcontentFill",
                    function pass () {
                        test.comment('loading done.....');
                        // test.assertSelectorHasText('body', 'home', "Homepage loaded");

                        // this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

                        // test.assertExists('.site-header', "The site header loaded correctly.");
                        // test.assertVisible('.site-header', "...is also visible.");

                        // test.assertExists('.brand a img', "The logo loaded correctly.");
                        // test.assertVisible('.brand a', "...is also visible.");

                        // test.assertExists('.navbar', "The nav loaded correctly.");
                        // test.assertVisible('.navbar', "...is visible.");

                        // // Move the mouse to the top TVE nav
                        // test.assertExists('.nav-small-section.nav-live-tv', "live tv icon loaded correctly.");
                        // test.assertVisible('.nav-small-section.nav-live-tv', "...is visible.");

                        // this.mouse.move('.nav-small-section.nav-live-tv a');
                        // test.assertVisible('.nav-small-section.nav-live-tv .nav-small-sub', "tv subnav...is visible.");

                        // if(casper.exists('.weather-module')){
                        //     test.assertExists('.weather-module', "The weather module loaded correctly.");
                        //     test.assertVisible('.weather-module', "...is visible.");
                        //     var weatherNorm = true;
                        // // If severe weather module is displayed
                        // } else if(casper.exists('.weather-module-severe')){
                        //     test.comment('.weather-module-severe is set....');
                        //     test.assertExists('.weather-module-severe', "The severe weather module loaded correctly.");
                        //     test.assertExists('.weather-alert-info', "The severe weather module alerts loaded correctly.");
                        //     test.assertVisible('.weather-module-severe', "...is visible.");
                        // }

                        // test.assertExists('.weather-module-radar iframe', "The weather radar loaded correctly.");
                        // test.assertVisible('.weather-module-radar iframe', "...is visible.");
                        
                        // Capture screenshot if not loaded.
                        // if(casper.exists('.weather-module')){

                        // }

                        // Spredfast modules
                        // if (casper.exists('.sfbox')) {
                        //     test.assertExists('.sfbox', "The spredfast modules loaded correctly.");
                        //     test.assertVisible('.sfbox', "...is visible.");
                        // } else {
                        //     console.log(' [] Unable to test Spredfast modules, .sfbox not seen or loading. Test manually. ');
                        // }

                        // test.assertExists('.footer', "The footer area loaded correctly.");
                        // test.assertVisible('.footer', "...is visible.");

                        suite.collectNavigation(testProperty, url);
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

                        test.assertExists('.masthead', "The site header loaded correctly.");
                        test.assertVisible('.masthead', "...is also visible.");

                        test.assertExists('#logo img', "The logo loaded correctly.");
                        test.assertVisible('#logo img', "...is also visible.");

                        test.assertExists('.nav', "The nav loaded correctly.");
                        test.assertVisible('.nav', "...is visible.");

                        if(casper.exists('.weather-module')){
                            test.assertExists('.weather-module', "The weather module loaded correctly.");
                            test.assertVisible('.weather-module', "...is visible.");
                            var weatherNorm = true;
                        // If severe weather module is displayed
                        } else if(casper.exists('.weather-module-severe')){
                            test.comment('.weather-module-severe is set....');
                            test.assertExists('.weather-module-severe', "The severe weather module loaded correctly.");
                            test.assertExists('.weather-alert-info', "The severe weather module alerts loaded correctly.");
                            test.assertVisible('.weather-module-severe', "...is visible.");
                        }

                        // Spredfast modules
                        test.assertExists('.lower.left', "The lower modules loaded correctly.");
                        test.assertVisible('.lower.left', "...is visible.");

                        test.assertExists('.page_footer', "The footer area loaded correctly.");
                        test.assertVisible('.page_footer', "...is visible.");

                        suite.collectNavigation(testProperty, url);
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

                    // Check for property type
                    if (response.url.indexOf('telemundo') > -1) {
                        console.log('-------------');
                        test.comment('Current url > ' +  response.url);
                        console.log('HTTP Response - ' + response.status);
                        console.log('...skipping, no section/page subnav on TLM');
                    } else {
                        if (response.url.indexOf('nbc') > -1) {
                            if (casper.exists('.subnav-large-container2')) {
                                casper.wait(700, function() {
                                    this.waitForSelector('.subnav-large-container',
                                        function pass () {
                                            console.log('-------------');
                                            test.comment('Current url > ' +  response.url);
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
                        }
                    }

                })
            } else {
                test.comment('homepage skipping subnav check...');
            }
        }

        if (i == -1) {
            suite.pageTests(testProperty, mainURL);
        };
    };

    regressionSuite.prototype.pageTests = function(testProperty, url) {
        var suite = this;
        var addtnlDestinations = [];

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

            casper.open(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {

                // console.log(testProperty);
                console.log('-------------');
                test.comment('Current url > ' +  response.url);
                console.log('HTTP Response - ' + response.status);

                // OTS Checks
                if ( response.url.indexOf('traffic') > -1 || response.url.indexOf('trafico') > -1 ) {
                    test.assertVisible('#navteqTrafficOneContainer', "traffic map container loaded...");
                }

                if ( response.url.indexOf('contact-us') > -1 || response.url.indexOf('conectate') > -1 ) {
                    test.assertVisible('.contact-landing-module', "contact page loaded, about module seen/loaded....");
                }

                if ( response.url.indexOf('weather') > -1 ) {
                    test.assertVisible('.wx-standalone-map', "weather page interactive radar seen/loaded....");
                }

                if ( response.url.indexOf('investigations') > -1 ) {
                    test.assertVisible('.leadMediaThumbnail', "lead video thumb displayed.");
                }

                // Telexitos testing
                if ( response.url.indexOf('telexitos') > -1 ) {
                    test.assertVisible('.primary', "main page loaded and displayed.");
                }

                // Cozi testing
                if ( response.url.indexOf('cozi') > -1 ) {
                    test.assertVisible('.headerLogo', "logo loaded and is visible.");
                    test.assertVisible('#bodyContainer', "main page loaded and displayed.");

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
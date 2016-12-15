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


casper.test.begin('OTS SPIRE | API Manifest Audit', function suite(test) {

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

    var baseUrl = siteUrl.replace(/\/$/, '');

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
        casper.start( url ).then(function(response) {
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
                    console.log( JSON.stringify() );
                }

                suite.visualTests(testProperty, url);

            } else {
                casper.test.fail('Page did not load correctly. Response: ' + response.status);
            }

        }).then(function () {
            test.comment('step 2');

        }).run(function() {
            test.comment('step 3');
            //Process file to DB
            // if (logResults) {
            //     suite.processTestResults(save);
            // }
            // if(createDictionary){
            //     console.log('Dictionary creation ended.');
            // } else {
            //     console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            // }
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
            casper.wait(7000, function() {
            // casper.wait(47000, function() {
                this.waitForSelector("#sfcontentFill",
                    function pass () {
                        // test.comment('Visual assertions/tests');

                        // test.comment('loading done.....');
                        // test.assertSelectorHasText('body', 'home', "Homepage loaded");

                        // this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

                        // test.assertExists('.site-header', "The site header loaded correctly.");
                        // test.assertVisible('.site-header', "...is also visible.");

                        // test.assertExists('.brand a img', "The logo loaded correctly.");
                        // test.assertVisible('.brand a', "...is also visible.");

                        // // ######################
                        // // # Nav tests
                        // // ######################

                        // // // Screenshot capture
                        // // Capture screenshot of current state
                        // // this.captureSelector('screenshots/' + urlUri + '_mouse-hover-screenshot' + timeStamp + '.png', 'body');
                        // // test.comment('tv subnav screenshot captured.');

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
                        
                        // // Capture screenshot if not loaded.
                        // if(casper.exists('.weather-module')){

                        // }

                        // // Spredfast modules
                        // test.assertExists('.sfbox', "The spredfast modules loaded correctly.");
                        // test.assertVisible('.sfbox', "...is visible.");

                        // test.assertExists('.footer', "The footer area loaded correctly.");
                        // test.assertVisible('.footer', "...is visible.");

                        var testLinks = suite.collectNavigation(testProperty, url);
                        // console.log(testLinks);
                    },
                    function fail () {
                        this.captureSelector('screenshots/' + urlUri + '_failure-screenshot' + timeStamp + '.png', 'body');
                        test.fail("Unable to test page elements. Did not load element .sfbox");
                    },
                    null // timeout limit in milliseconds
                );
            });

            // this.waitForSelector("#sfcontentFill",
            

            // casper.waitUntilVisible('.sfbox', function(){
            //    
            // });

        } else if (tlmTestSuite) {
        // TLM Testing
            this.test.assertNotEquals('body', 'tlm', 'TLM Body class set');
            test.assertExists('#logocont a img', "The logo loaded correctly.");
            test.assertVisible('#logocont a', "...is also visible.");

            test.assertExists('#nav', "The nav loaded correctly.");
                test.assertVisible('#nav', "...is visible.");

            // Weather module
            // .weather-module-wrapper
            // .icon-temp-wrapper
            // .temperature

            test.assertExists('.page_footer', "The footer area loaded correctly.");
                test.assertVisible('.page_footer', "...is visible.");
        }
    };


    // Regressiong test actions
    regressionSuite.prototype.collectNavigation = function(url) {

        var suite = this;

        // casper.start( url ).then(function(response) {

        // );

        casper.thenOpen(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
            var mainURL = this.getCurrentUrl().slice(0,-1);
            console.log('main url ' + mainURL);

            // test.comment('[ -- clicking logo -- ]');
            //     this.mouse.click('.brand a');
            // test.comment('clicked ok, new location is ' + this.getCurrentUrl());

            // casper.wait(2700, function() {
            // });

            // console.log(document.querySelectorAll('.nav-section a').length);
            var selector = '.nav-section a.nav-section-title';

            var evaluatedUrls = this.evaluate(function(mainURL, selector) {

                // Grab the current url data, href and link text
                return __utils__.findAll(selector).map(function(element) {
                    return {
                        url: element.getAttribute('href'),
                        innerText: element.innerText

                    };
                }).map(function(elementObj) {
                    // if (!protocolRegex.test(elementObj.url)) {
                        // elementObj.url = mainURL + ('/' + elementObj.url).replace(/\/{2,}/g, '/');
                    // }

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
            suite.testNavigationItems(mainURL, destinations);
        });
    };



    regressionSuite.prototype.testNavigationItems = function(mainURL, destinations) {

        for (var i = destinations.length - 1; i >= 0; i--) {

            if ( destinations[i].url.indexOf(mainURL) > -1 ) {
                // console.log('          url found');
                var currentNavUrl = destinations[i].url;
            } else {
                // console.log('         no');
                var currentNavUrl = mainURL + destinations[i].url;
            }
            var currentNavTitle = destinations[i].linkText;

            // console.log('mainURL ~ ' + mainURL);
            // console.log('destinations[i].linkText ~ ' + destinations[i].linkText);
            // console.log('destinations[i].url ~ ' + destinations[i].url);
            // console.log('testUrl ~ ' + currentNavUrl);
            
            // var suite = this;

            casper.thenOpen(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                // casper.options.onResourceRequested = function(casper, requestData, request) {
                // if ( destinations[i].linkText.indexOf('Home') ==! -1 ) {

                    this.waitForSelector(".subnav-large-container",
                        function pass () {
                            // test.comment('Current url > ' + currentNavUrl + '\n');
                            test.comment('Current url > ' +  response.url + '\n');
                            console.log('HTTP Response - ' + response.status);

                            // this.captureSelector('screenshots/sub-nav_' + destiations[i].linkText.toLowerCase() + '-screenshot' + timeStamp + '.png', 'body');
                            test.assertVisible('.subnav-section-landing', "subsection navbar visible.");
                        },
                        function fail () {
                            this.captureSelector('screenshots/sub-nav_-screenshot' + timeStamp + '.png', 'body');
                            test.fail("Unable to test page elements. Did not load element .sfbox");
                        },
                        null // timeout limit in milliseconds
                    )
                // }

            });

        };
    };

    regressionSuite.prototype.checkForSubnav = function(mainURL, urlName) {
        var suite = this;
        
    };

    new regressionSuite(casper.cli.get('url'));
});
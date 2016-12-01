// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"

// like interactive radar map - layers
// the connect dropdown- and linkouts in that
// thats all visual
// ./run.sh loadCheck --url=http://www.nbcmiami.com --output=console --env=local

// Tests are set explicitly against ids/classes of page objects
// NBC_PageReload.interruptReload() in console to disable refresh


casper.test.begin('Page laod/wrapper tests', function suite(test) {

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
    var baseUrl = siteUrl.replace(/\/$/, '');

        if (minutes < 10){
            minutes = "0" + minutes;
        }

        if(hours > 11){
            var toD = "PM";
        } else {
            var toD = "AM";
        }

        if (hours === '0'){
            var hours = "12";
        }



    var timeStamp = month+'_'+day+'_'+year+'-'+hours+'_'+minutes+'-'+toD;

    var parser = document.createElement('a');
    parser.href = casper.cli.get('url');

    newUrl = parser.href;
    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
    var urlUri = sourceString.replace('.','_');

    if (urlUri.indexOf('stage')) {
        var stageTest = true;
    };


    // Output variables
    var type = casper.cli.get('output');
        
    if (type === 'debug') {
        var debugOutput = true;
    } else if (type === 'dictionary') {
        var createDictionary = true;
        var logResults = false;
    } else if (type === 'console') {
        var showOutput = true;
    }


    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

    // Start testing
    casper.start( siteUrl, function() {
        casper.open(siteUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
            if ( response.status == 200 || response.status == 304 ) {
                no_error = true;
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status);
                this.exit();
            }
        });

        // Load and visible tests
        casper.then(function(no_error) {
            if ( no_error ) {
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
                        var otsTestSuite = true;
                    } else {
                        console.log('TLM property...');
                        var tlmTestSuite = true;
                    }

                    test.comment('Page title: >> ' + this.getTitle());

                    // Set testing item
                    // NBC OTS Testing
                    if (otsTestSuite) {
                        casper.wait(47000, function() {
                            this.waitForSelector("#sfcontentFill",
                                function pass () {
                                    test.comment('Visual assertions/tests');

                                    test.comment('loading done.....');
                                    test.assertSelectorHasText('body', 'home', "Homepage loaded");

                                    this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

                                    test.assertExists('.site-header', "The site header loaded correctly.");
                                    test.assertVisible('.site-header', "...is also visible.");

                                    test.assertExists('.brand a img', "The logo loaded correctly.");
                                    test.assertVisible('.brand a', "...is also visible.");

                                    // ## Nav tests
                                    //
                                    // ######################
                                    
                                    // Move the mouse to the top TVE nav
                                    test.comment('...testing nav and capturing screenshots');
                                    this.mouse.move('.nav-small-section.nav-live-tv a');
                                    test.assertVisible('.nav-small-section.nav-live-tv .nav-small-sub', "tv subnav...is visible.");

                                        // // Screenshot capture
                                        // Capture screenshot of current state
                                        // this.captureSelector('screenshots/' + urlUri + '_mouse-hover-screenshot' + timeStamp + '.png', 'body');
                                        // test.comment('tv subnav screenshot captured.');

                                    test.assertExists('.navbar', "The nav loaded correctly.");
                                    test.assertVisible('.navbar', "...is visible.");

                                    test.assertExists('.nav-small-section.nav-live-tv', ".nav-small-section.nav-live-tv loaded correctly.");
                                    test.assertVisible('.nav-small-section.nav-live-tv', "...is visible.");

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

                                    test.assertExists('.weather-module-radar iframe', "The weather radar loaded correctly.");
                                    test.assertVisible('.weather-module-radar iframe', "...is visible.");


                                    // Spredfast modules loaded.
                                    
                                    // Capture screenshot if not loaded.
                                    if(casper.exists('.weather-module')){

                                    }

                                    test.assertExists('.sfbox', "The spredfast modules loaded correctly.");
                                    test.assertVisible('.sfbox', "...is visible.");

                                    test.assertExists('.footer', "The footer area loaded correctly.");
                                    test.assertVisible('.footer', "...is visible.");
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

                    } else {
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

                
            }
        });

        // Action tests
        casper.then(function(siteUrl, otsTestSuite, weatherNorm) {

            // if (otsTestSuite) {
                test.comment('[ -- clicking logo -- ]');
                    this.mouse.click('.brand a');
                test.comment('clicked ok, new location is ' + this.getCurrentUrl());

                var mainURL = this.getCurrentUrl().slice(0,-1);
                console.log('main url ' + mainURL);
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

                test.comment('Navigation links testing; Links collected > ' + destinations.length);
                test.comment('...links collected for testing.');

                // destinations.reverse();

                for (i = destinations.length - 1; i >= 0; i--) {
                    // console.log(' --  linkText > ' + destinations[i].linkText);
                    // console.log(' --  url      > ' + destinations[i].url);

                    var linkText = destinations[i].linkText;

                    if ( destinations[i].url.indexOf(mainURL) > -1 ) {
                        var currentNavUrl = destinations[i].url;
                    } else {
                        var currentNavUrl = mainURL + destinations[i].url;
                    }

                    casper.open(currentNavUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
                        test.comment('Current url > ' + currentNavUrl);
                        
                        console.log('HTTP Response - ' + response.status);

                        if ( response.status == 200 || response.status == 304 ) {
                            // casper.wait(10000, function() {
                                if ( !linkText.indexOf('Home') ) {
                                    test.assertVisible('.subnav-section-landing', "...is also visible.");
                                } else {
                                    test.comment('Home link...skipping subnav test');
                                }

                                this.captureSelector('screenshots/' + linkText.toLowerCase() + '-screenshot' + timeStamp + '.png', 'body');
                            // });    
                        } else {
                            throw new Error('Page not loaded correctly. Response: ' + response.status);
                            this.exit();
                        }
                    });
                }

            // } else {
            //     test.comment('[ -- clicking logo 2 -- ]');
                // this.click('#logocont a');
            // } 
        });
    }).run(function() {
        test.done();
    });
});
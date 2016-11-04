// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"


casper.test.begin('Page laod/wrapper tests', function suite(test) {

    var utils = require('utils');
    var siteUrl = casper.cli.get("url");
    var mouse = require("mouse").create(casper);
    var saveLoc = ('screenshots/');
    var otsTestSuite = false;
    var tlmTestSuite = false;
    // viewportSize : { width: 1280, height: 5000 }

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
    casper.start( siteUrl, function(response) {

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status);
            this.exit();
        }

        // Load and visible tests
        casper.then(function() {
            if ( no_error ) {

                casper.open(siteUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {

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

                console.log('Page title: >> ' + this.getTitle());
                test.assertSelectorHasText('body', 'home', "Homepage loaded");

                // Set testing item
                if (otsTestSuite) {
                    casper.waitUntilVisible('.sfbox', function(){
                            this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');
                            
                            test.assertExists('.site-header', "The site header loaded correctly.");
                                test.assertVisible('.site-header', "...is also visible.");
                            
                            test.assertExists('.brand a img', "The logo loaded correctly.");
                                test.assertVisible('.brand a', "...is also visible.");

                            test.assertExists('.navbar', "The nav loaded correctly.");
                                test.assertVisible('.navbar', "...is visible.");

                            test.assertExists('.nav-small-section.nav-live-tv', ".nav-small-section.nav-live-tv loaded correctly.");
                                test.assertVisible('.nav-small-section.nav-live-tv', "...is visible.");

                                
                        
                            console.log('sfbox visible');
                            casper.mouse.move('.nav-small-section.nav-live-tv');
                            
                        // casper.waitUntilVisible('.nav-small-section.nav-live-tv .nav-small-sub', function(){
                            // this.click(expectedElementSelector);
                            // test.assertVisible('.nav-small-section.nav-live-tv .nav-small-sub', "tv subnav...is visible.");
                            // casper.capture('screenshots/mouse-hover-screenshot.png');
                        

                        this.on('mouse.move', function() {
                            console.log('mouse moved');
                            // phantomcss.screenshot('.selector', 'screenshotname-hover');
                            casper.capture('screenshots/mouse-hover-screenshot.png');
                        });


                        test.assertExists('.weather-module', "The weather module loaded correctly.");
                            test.assertVisible('.weather-module', "...is visible.");
                        
                        test.assertExists('.weather-module-radar iframe', "The weather radar loaded correctly.");
                            test.assertVisible('.weather-module-radar iframe', "...is visible.");
                        

                        test.assertExists('.footer', "The footer area loaded correctly.");
                            test.assertVisible('.footer', "...is visible.");
                        
                        // casper.capture('screenshots/this-screenshot.png');

                        console.log('[ -- clicking logo -- ]');
                        this.click('.nav-small-section.nav-live-tv a');
                    });

                } else {
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

                    console.log('[ -- clicking logo -- ]');
                    this.click('#logocont a');
                }

                });
            }
        });

        // Action tests
        casper.then(function() {
            // if (otsTestSuite) {
                console.log('clicked ok, new location is ' + this.getCurrentUrl());
            // } else {
 
            // } 
        });
    }).run(function() {
        test.done();
    });
});
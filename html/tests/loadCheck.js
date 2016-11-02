// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"


var utils = require('utils');
var siteUrl = casper.cli.get("url");
var saveLoc = ('screenshots/');
var otsTestSuite = false;
var tlmTestSuite = false;

casper.test.begin('Page laod/wrapper tests', function suite(test) {

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
                    this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');
                    
                    test.assertExists('.site-header', "The site header loaded correctly.");
                    test.assertVisible('.site-header', "...is also visible.");
                    test.assertExists('.brand a img', "The logo loaded correctly.");
                    test.assertVisible('.brand a', "...is also visible.");

                    test.assertExists('.navbar', "The nav loaded correctly.");
                        test.assertVisible('.navbar', "...is visible.");

                    // Weather module
                    .weather-module
                    

                    test.assertExists('.footer', "The footer area loaded correctly.");
                        test.assertVisible('.footer', "...is visible.");
                    
                    // casper.capture('screenshots/this-screenshot.png');

                    console.log('[ -- clicking logo -- ]');
                    this.click('.brand a');

                } else {
                    this.test.assertNotEquals('body', 'tlm', 'TLM Body class set');
                    test.assertExists('#logocont a img', "The logo loaded correctly.");
                    test.assertVisible('#logocont a', "...is also visible.");

                    test.assertExists('#nav', "The nav loaded correctly.");
                        test.assertVisible('#nav', "...is visible.");

                    // Weather module
                    .weather-module-wrapper
                    .icon-temp-wrapper
                    .temperature


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
            if (otsTestSuite) {
                console.log('clicked ok, new location is ' + this.getCurrentUrl());
            } else {

            }
            

            

            
        });

        // // Page body tests
        // casper.then(function() {
        //     test.assertExists('#spotlight', "The spotlight area loaded correctly.");
        //     test.assertExists('#top-stories', "The top stories area loaded correctly.");
        //     test.assertExists('#primary', "The top stories area loaded correctly.");
        //     test.assertExists('#footer', "The footer area loaded correctly.");
        // });

    }).run(function() {
        test.done();
    });
});
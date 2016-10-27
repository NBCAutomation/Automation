// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"


var utils = require('utils');
var siteUrl = casper.cli.get("url");
var saveLoc = ('screenshots/');

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

        casper.then(function() {
            if ( no_error ) {

                casper.open(siteUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {

                
                var propertyType = document.getElementsByTagName("body");
                console.log(propertyType);
                console.log(propertyType.classList.item("nbc"));
                
                for(var i = 0; i < propertyType.length; i++) {
                    console.log( propertyType[i].nodeName );
                    
                }

                if ( propertyType.className.indexOf === 'nbc' ) {
                    console.log('ots property...');
                } else {
                    console.log('tlm property...');
                }

                // console.log('Page title: >> ' + this.getTitle());
                ;
        // this.test.assertNotEquals('body', 'nbc', 'PASS');

                // test.assertSelectorHasText('body', 'home', "Homepage loaded");

                // test.assertExists('.site-header', "The site header loaded correctly.");
                // test.assertVisible('.site-header', "...is also visible.");
                // test.assertExists('.brand a img', "The logo loaded correctly.");
                // test.assertVisible('.brand a', "...is also visible.");
                // console.log('[ -- clicking logo -- ]');
                // this.click('.brand a');

                });
            }
        });

        // Hader tests
        casper.then(function() {
            // console.log('clicked ok, new location is ' + this.getCurrentUrl());

            // test.assertExists('#body', "The body area loaded correctly.");
            //     test.assertVisible('#body', "...is visible.");

            // test.assertExists('#nav', "The nav loaded correctly.");
            //     test.assertVisible('#nav', "...is visible.");

            // test.assertExists('#footer', "The footer area loaded correctly.");
            //     test.assertVisible('#footer', "...is visible.");
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
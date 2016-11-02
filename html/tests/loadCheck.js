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

                // document.getElementsByTagName("body")[0].id;


                // var pageItem = document.getElementById('home');
                var pageItem = casper.getElementInfo('body');
                // console.log('page item > ' + pageItem);
                // console.log('obj keys > ' + Object.entries(pageItem));
                // console.log('obj vals > ' + Object.values(pageItem));

                for (var prop in pageItem) {
                    // console.log("obj." + prop + " = " + pageItem[prop]);
                    if (prop == 'tag') {
                        // console.log(pageItem[prop].substring(0,100));
                        var initBodyTag = pageItem[prop].substring(0,100);
                    }
                }

                
                // for(var i = 0; i < pageItem.length; i++) {
                //     console.log('i count >> ' + i);
                //     console.log( 'textContent >> ' + pageItem[i].textContent );
                //     console.log( 'nodeName >> ' + pageItem[i].nodeName );
                //     console.log( 'nodeType >> ' + pageItem[i].nodeType );
                //     console.log( 'nodeValue >> ' + pageItem[i].nodeValue );

                //     // hasClass('body', 'nbc');

                //     // console.log(propertyType.classList.contains("nbc"));
                    
                // }

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

                    test.assertExists('.footer', "The footer area loaded correctly.");
                        test.assertVisible('.footer', "...is visible.");
                    
                    console.log('[ -- clicking logo -- ]');
                    this.click('.brand a');

                } else {
                    this.test.assertNotEquals('body', 'tlm', 'TLM Body class set');
                    test.assertExists('#logocont a img', "The logo loaded correctly.");
                    test.assertVisible('#logocont a', "...is also visible.");

                    test.assertExists('#nav', "The nav loaded correctly.");
                        test.assertVisible('#nav', "...is visible.");

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
            console.log('clicked ok, new location is ' + this.getCurrentUrl());

            

            
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
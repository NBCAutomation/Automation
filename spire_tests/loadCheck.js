// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"


var utils = require('utils');
var siteUrl = casper.cli.get("url");
var saveLoc = ('screenshots/');

casper.test.begin('Page laod/wrapper tests', function suite(test) {

    casper.start( siteUrl, function(response) {
        
        // require('utils').dump(response);

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        casper.then(function() {
            if ( no_error ) {
                test.assertSelectorHasText('body', 'nbc', "NBC Property");

                test.assertSelectorHasText('body', 'home', "Homepage loaded");

                test.assertExists('#masthead', "The masthead area loaded correctly.");
                    test.assertVisible('#logocont img', "...is visible.");

                test.assertExists('#body', "The body area loaded correctly.");
                    test.assertVisible('#body', "...is visible.");

                test.assertExists('#nav', "The nav loaded correctly.");
                    test.assertVisible('#nav', "...is visible.");

                test.assertExists('#footer', "The footer area loaded correctly.");
                    test.assertVisible('#footer', "...is visible.");
            }
        });

    }).run(function() {
        test.done();
    });
});
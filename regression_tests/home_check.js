// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"

var utils = require('utils');
var siteUrl = casper.cli.get("url");


casper.test.begin('Testing page load with container elements', function suite(test) {

    //Load the site and check the status code.
    
    casper.start( siteUrl, function() {
        test.assertHttpStatus(200);

        test.assertSelectorHasText('body', 'nbc', "NBC Property");
        test.assertSelectorHasText('body', 'home', "Homepage loaded");

        if () {
            
        };
    });

    casper.then(function() {

        
    });

    casper.run(function() {
        test.done();
    });
});

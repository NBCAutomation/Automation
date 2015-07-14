// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Case: Check if Omniture is loaded and that the actual pixel request made to the Adobe server.
// Use: casperjs [file_name] --url="[site_url]"
// 
// NBC Test Sheet
// https://docs.google.com/spreadsheets/d/1HUmXaLPKM5pqVBSJOdjP6jDdJXY78xW5DMyhQE3iNwc/edit#gid=631094814


// var casper = require('casper').create({ verbose: true, logLevel: 'debug' });
// http://stackoverflow.com/questions/22205323/is-there-a-method-within-omnitures-s-code-to-see-whether-a-pageview-has-fired
// https://github.com/n1k0/casperjs/issues/968
var utils = require('utils');
var siteUrl = casper.cli.get("url");
var omnitureLoaded = false;

casper.test.begin('Testing Omniture', function suite(test) {

    casper.start( siteUrl,'page.resource.requested', function( response, requestData, request ) {
        
        // require('utils').dump(page);

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        if ( no_error ) {
            require('utils').dump(this.page);
            // if (requestData.url.indexOf('http://adserver.com') === 0) {
            //     request.abort();
            // }
        }

    }).run(function() {
        test.done();
    });
});
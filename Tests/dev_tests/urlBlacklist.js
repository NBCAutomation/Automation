/**
* Add a listener for the phantomjs resource request.
*
* This allows us to abort requests for external resources that we don't need
* like Google adwords tracking.
* https://drupalize.me/blog/201509/speed-casperjs-tests-skipping-unnecessary-http-resources
* casperjs test 404Spider.js --includes=urlBlacklist.js --url=http://www.nbcmiami.com/
*/

var helpers = require('helper')

casper.options.onResourceRequested = function(casper, requestData, request) {
    // If any of these strings are found in the requested resource's URL, skip
    // this request. These are not required for running tests.
    
    var parser = document.createElement('a');
    parser.href = casper.cli.get('url');

    newUrl = parser.href;
    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];

    if (requestData.url.indexOf( sourceString ) == -1 ) {
        request.abort();
        // console.log( 'skipping --  ' + requestData.url )
    }
};
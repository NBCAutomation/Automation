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

    var skip = [
        //Google exclusions
        'google.com',
        'googleads.g.doubleclick.net',
        'cm.g.doubleclick.net',
        'www.googleadservices.com',
        'googleapis.com',
        'partner.googleadservices.com',

        'data:image/png',
        'intellicast.com',
        'chartbeat.com',
        'static.chartbeat.com',
        'ping.chartbeat.com',
        'quantserve.com',
        'sigalalert.com',
        'krxd.com',
        
        //Othe rexclusions
        'nbc.com',
        'nbc.com/app_link/nbctve',
        'nbcudigitaladops.com',
        'tidaltv.com',
        'tremormedia.com',
        'services.intellicast.com',
        'facebook.com',
        'platform.twitter.com',
        'taboola.com',
        'betrad.com',
        'adreadytractions.com',
        'everesttech.net',
        'scorecardresearch.com'
    ];

    if (requestData.url.indexOf( sourceString ) == -1 ) {
        request.abort();
        // console.log( 'skipping --  ' + requestData.url )
    }
};
/**
* Add a listener for the phantomjs resource request.
*
* This allows us to abort requests for external resources that we don't need
* like Google adwords tracking.
* https://drupalize.me/blog/201509/speed-casperjs-tests-skipping-unnecessary-http-resources
* casperjs test 404Spider.js --includes=urlBlacklist.js --url=http://www.nbcmiami.com/
*/

casper.options.onResourceRequested = function(casper, requestData, request) {
    // If any of these strings are found in the requested resource's URL, skip
    // this request. These are not required for running tests.
    var skip = [
        'googleads.g.doubleclick.net',
        'cm.g.doubleclick.net',
        'www.googleadservices.com',
        'static.chartbeat.com',
        'ping.chartbeat.com',
        'fonts.googleapis.com',
        'partner.googleadservices.com',
        'services.intellicast.com',
        'www.facebook.com',
        'platform.twitter.com'
    ];

    skip.forEach(function(needle) {
        if (requestData.url.indexOf(needle) > 0) {
            request.abort();
        }
    })
};
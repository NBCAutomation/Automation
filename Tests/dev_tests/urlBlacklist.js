// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Add a listener for the phantomjs resource request, and skip any request that is not of the domain and/or submitte site.

casper.options.onResourceRequested = function(casper, requestData, request) {

    var parser = document.createElement('a');
    parser.href = casper.cli.get('url');

    newUrl = parser.href;
    var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];

    if (requestData.url.indexOf( sourceString ) == -1 ) {
        request.abort();
        console.log( 'skipping --  ' + requestData.url );
    }
};
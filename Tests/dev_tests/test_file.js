// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"

console.log('pre-start...');

casper.start('http://google.com/', function() {
    var data, wsurl = 'http://script.google.com/macros/s/AKfycbwqtmyzavd0CYttVUtnGBEDXDCSOMbnH-AF3RouVO8vyemnzI1d/exec';
    console.log('start...');
    data = this.evaluate(function(wsurl) {
        return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', 'Source page=casperjs derp&HTTP Status=casperjs derp&Link=casperjs derp', false));
        console.log('parse attempt...');
    }, {wsurl: wsurl});
});

casper.then(function() {
    require('utils').dump(data);
});
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"

console.log('pre-start...');

// casper.start('http://google.com/', function() {
//     // var data, wsurl = 'http://script.google.com/macros/s/AKfycbwqtmyzavd0CYttVUtnGBEDXDCSOMbnH-AF3RouVO8vyemnzI1d/exec?Source page=casperjs derp&HTTP Status=casperjs derp&Link=casperjs derp';
//     // console.log('start...');
//     // data = this.evaluate(function(wsurl) {
//     //     return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', 'Source page=casperjs derp&HTTP Status=casperjs derp&Link=casperjs derp', false));
//     //     console.log('parse attempt...');
//     // }, {wsurl: wsurl});
//     casper.open('http://testing.app/gtesting/gtesting2.html').then(function() {
//         casper.waitForSelector("#foo", function() {
//             this.fillSelectors('form#foo', {
//                 'input[name = Source page ]' : res.from,
//                 'input[name = HTTP Status ]' : res.status,
//                 'input[name = Link ]' : res.url
//             });
//         }, true);
//     });
// });

var data, wsurl = 'http://script.google.com/macros/s/AKfycbwqtmyzavd0CYttVUtnGBEDXDCSOMbnH-AF3RouVO8vyemnzI1d/exec?Source page=casperjs derp&HTTP Status=casperjs derp&Link=casperjs derp';
// var data, wsurl = 'http://deltrieallen.com/gtesting-live.php';

// casper.start('http://deltrieallen.com', function() {
//     console.log('start...');
//     data = this.evaluate(function(wsurl) {
//         // return JSON.parse(
//             __utils__.sendAJAX(wsurl, 'POST', 'Source page=casper test file&HTTP Status=basic casperjs derp&Link=casperjs derp', false);
//             // );
//     }, {wsurl: wsurl});
// });
casper.start();

// casper.open('http://deltrieallen.com/gtesting-live.php', {
casper.open(wsurl, {
    method: 'post',
    data:   {
        'Source page' : 'Plop',
        'HTTP Status' : 'Wow.',
        'Link' : 'this is a link'
    }
});

casper.then(function() {
    // require('utils').dump(data);
    console.log('here');
});

casper.run();
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Case: DFP check
// Use: casperjs [file_name] --url="[site_url]"

// var casper = require('casper').create({ verbose: true, logLevel: 'debug' });
var utils = require('utils');
var siteUrl = casper.cli.get("url");
var no_error = false;


// function dfpCheck(url) {
//     // require('utils').dump(response);

//     casper.open(url).then(function() {
//         if ( status == 200 ) {
//             no_error = true;
//         } else {
//             this.echo('Page not loaded correctly. ' + response.status).exit();
//         }

//         casper.then(function() {
//             if ( no_error ) {
//                 casper.evaluate(function() {
//                     googletag.getVersion();
//                     // if (  ) {
//                     //     this.echo('DFP pub service ready.').exit();
//                     // }
                        
//                 });
//             }
//         });
//     });

// }

casper.start( siteUrl, function(response) {
    casper.open(siteUrl).then(function() {
        if ( status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. ' + response.status).exit();
        }

        casper.then(function() {
            if ( no_error ) {
                casper.evaluate(function() {
                    googletag.getVersion();
                    // if (  ) {
                    //     this.echo('DFP pub service ready.').exit();
                    // }
                        
                });
            }
        });
    });
}).run(function() {
    test.done();
});
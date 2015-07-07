// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Case: DFP check
// Use: casperjs [file_name] --url="[site_url]"

// var casper = require('casper').create({ verbose: true, logLevel: 'debug' });
// //http://stackoverflow.com/questions/22205323/is-there-a-method-within-omnitures-s-code-to-see-whether-a-pageview-has-fired
var utils = require('utils');
var siteUrl = casper.cli.get("url");


function OmniturePageViewHasFired() {
    var i = document.images;

    for (var c=0,l=i.length;c<l;c++) {
        if ( (i[c].src.indexOf('/b/ss/')>=0)
            && (!i[c].src.match(/[&?]pe=/))
        ) return true;
    }

    for (var o in window) {
        if ( (o.substring(0,4)=='s_i_')
            && (window[o].src)
            && (window[o].src.indexOf('/b/ss/')>=0)
            && (!window[o].src.match(/[&?]pe=/))
        ) return true;
    }
    return false;
}

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

                if (OmniturePageViewHasFired() == false){
                    this.echo('not loaded');
                } else {
                    this.echo('loaded');
                }
            }
        });

    }).run(function() {
        test.done();
    });
});
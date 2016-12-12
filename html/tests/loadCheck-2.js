/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
//    optional string params --output=debug to show logged key/val strings
//    optional string params --output=console will show test results

// Dictionary files:
// - OTS Created 9/7/16

// - TSG Pending..
// -http://collaborative-tools-project.blogspot.com/2012/05/getting-csv-data-into-google.html
//
// Casper 1.1.0-beta3 and Phantom 1.9.8
//


casper.test.begin('OTS SPIRE | API Manifest Audit', function suite(test) {

    var regressionSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        var suite = this;

        var parser = document.createElement('a');
        parser.href = url;

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');

        var pageItem = casper.getElementInfo('body');

        for (var prop in pageItem) {
            // console.log("obj." + prop + " = " + pageItem[prop]);
            if (prop == 'tag') {
                // console.log(pageItem[prop].substring(0,100));
                var initBodyTag = pageItem[prop].substring(0,100);
            }
        }

        if ( initBodyTag.indexOf('nbc') > -1 ) {
            console.log('OTS property...');
            var testProperty = 'otsTestSuite';
        } else {
            console.log('TLM property...');
            var testProperty = 'tlmTestSuite';
        }

        /*******************
        // Start Test
        *******************/
        casper.start( url ).then(function(response) {
            if ( response.status == 200 ) {
                suite.visualTests(testProperty);
            } else {
                casper.test.fail('Page did not load correctly. Response: ' + response.status);
            }
        }).then(function () {
            test.comment('step 2');
            // suite.createTestID(url, type, urlUri);
        }).run(function() {
            test.comment('step 3');
            //Process file to DB
            // if (logResults) {
            //     suite.processTestResults(save);
            // }
            // if(createDictionary){
            //     console.log('Dictionary creation ended.');
            // } else {
            //     console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            // }
            this.exit();
            test.done();
        });
    };

    new regressionSuite(casper.cli.get('url'));
});
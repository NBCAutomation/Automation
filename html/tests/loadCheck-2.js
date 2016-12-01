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

    // var colorizer = require('colorizer').create('Colorizer');
    var logResults = true;
    var envConfig = casper.cli.get('env');
    var siteUrl = casper.cli.get("url");

    // if (envConfig === 'local') {
    //     var configURL = 'http://spire.app';
    // } else if (envConfig === 'dev') {
    //     var configURL = 'http://45.55.209.68';
    // } else {
    //     var configURL = 'http://54.243.53.242';
    // }

    // var outputType = casper.cli.get('output');
    //     if (outputType === 'debug') {
            var debugOutput = false;
    //     // } else if (outputType === 'dictionary') {
    //         var createDictionary = false;
    //         var logResults = false;
    //     // } else if (outputType === 'console') {
    //         var showOutput = true;
    //     // }

    // // if ( casper.cli.get('testing') ) {
    //     var logResults = false;
    // }

    if (!debugOutput) {
        var currentTime = new Date();

        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();

            if (minutes < 10){
                minutes = "0" + minutes;
            }

            if(hours > 11){
                var toD = "PM";
            } else {
                var toD = "AM";
            }

            if (hours === '0'){
                var hours = "12";
            }



        var timeStamp = month+'_'+day+'_'+year+'-'+hours+'_'+minutes+'-'+toD;

        var parser = document.createElement('a');
        parser.href = casper.cli.get('url');

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');

        var fs = require('fs');
        
        var logName = urlUri + '_manifest-audit_' + timeStamp + '.csv';

        var curFolder = month + '_' + day + '_' + year;
        
        
            var saveLocation = 'test_results/api_manifest_audits/' + curFolder;
            fs.makeDirectory(saveLocation, 775);

            if (['local', 'dev'].indexOf(envConfig) < 0) {
                var process = require("child_process"),
                    spawn = process.spawn,
                    child = spawn("chown", ["-hR", "ec2-user:apache", saveLocation]);
            }

            var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);
        
    }

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

    // regressionSuite.prototype.visualTests = function(testProperty) {
    //     // Set testing item
    //     if (testProperty == 'otsTestSuite') {
    //         var otsTestSuite = true;
    //     } else {
    //         var tlmTestSuite = true;
    //     }

    //     // NBC OTS Testing
    //     if (otsTestSuite) {
    //         casper.wait(47000, function() {
    //             this.waitForSelector("#sfcontentFill",
    //                 function pass () {
    //                     test.comment('Visual assertions/tests');

    //                     test.comment('loading done.....');
    //                     test.assertSelectorHasText('body', 'home', "Homepage loaded");

    //                     this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

    //                     test.assertExists('.site-header', "The site header loaded correctly.");
    //                     test.assertVisible('.site-header', "...is also visible.");

    //                     test.assertExists('.brand a img', "The logo loaded correctly.");
    //                     test.assertVisible('.brand a', "...is also visible.");

    //                     // ## Nav tests
    //                     //
    //                     // ######################
                        
    //                     // Move the mouse to the top TVE nav
    //                     test.comment('...testing nav and capturing screenshots');
    //                     this.mouse.move('.nav-small-section.nav-live-tv a');
    //                     test.assertVisible('.nav-small-section.nav-live-tv .nav-small-sub', "tv subnav...is visible.");

    //                         // // Screenshot capture
    //                         // Capture screenshot of current state
    //                         // this.captureSelector('screenshots/' + urlUri + '_mouse-hover-screenshot' + timeStamp + '.png', 'body');
    //                         // test.comment('tv subnav screenshot captured.');

    //                     test.assertExists('.navbar', "The nav loaded correctly.");
    //                     test.assertVisible('.navbar', "...is visible.");

    //                     test.assertExists('.nav-small-section.nav-live-tv', ".nav-small-section.nav-live-tv loaded correctly.");
    //                     test.assertVisible('.nav-small-section.nav-live-tv', "...is visible.");

    //                     if(casper.exists('.weather-module')){
    //                         test.assertExists('.weather-module', "The weather module loaded correctly.");
    //                         test.assertVisible('.weather-module', "...is visible.");
    //                         var weatherNorm = true;
    //                     // If severe weather module is displayed
    //                     } else if(casper.exists('.weather-module-severe')){
    //                         test.comment('.weather-module-severe is set....');
    //                         test.assertExists('.weather-module-severe', "The severe weather module loaded correctly.");
    //                         test.assertExists('.weather-alert-info', "The severe weather module alerts loaded correctly.");
    //                         test.assertVisible('.weather-module-severe', "...is visible.");
    //                     }

    //                     test.assertExists('.weather-module-radar iframe', "The weather radar loaded correctly.");
    //                     test.assertVisible('.weather-module-radar iframe', "...is visible.");


    //                     // Spredfast modules loaded.
                        
    //                     // Capture screenshot if not loaded.
    //                     if(casper.exists('.weather-module')){

    //                     }

    //                     test.assertExists('.sfbox', "The spredfast modules loaded correctly.");
    //                     test.assertVisible('.sfbox', "...is visible.");

    //                     test.assertExists('.footer', "The footer area loaded correctly.");
    //                     test.assertVisible('.footer', "...is visible.");
    //                 },
    //                 function fail () {
    //                     this.captureSelector('screenshots/' + urlUri + '_failure-screenshot' + timeStamp + '.png', 'body');
    //                     test.fail("Unable to test page elements. Did not load element .sfbox");
    //                 },
    //                 null // timeout limit in milliseconds
    //             );
    //         });

    //         // this.waitForSelector("#sfcontentFill",
            

    //         // casper.waitUntilVisible('.sfbox', function(){
    //         //    
    //         // });

    //     } else {
    //     // TLM Testing
    //         this.test.assertNotEquals('body', 'tlm', 'TLM Body class set');
    //         test.assertExists('#logocont a img', "The logo loaded correctly.");
    //         test.assertVisible('#logocont a', "...is also visible.");

    //         test.assertExists('#nav', "The nav loaded correctly.");
    //             test.assertVisible('#nav', "...is visible.");

    //         // Weather module
    //         // .weather-module-wrapper
    //         // .icon-temp-wrapper
    //         // .temperature

    //         test.assertExists('.page_footer', "The footer area loaded correctly.");
    //             test.assertVisible('.page_footer', "...is visible.");
    //     }
    // };

    new regressionSuite(casper.cli.get('url'));
});
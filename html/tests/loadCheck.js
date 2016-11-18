// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: PASS/FAIL Checks to see if a page is loaded as well as if the page elements are loaded and visible.
// Use: casperjs [file_name] --url="[site_url]"

// like interactive radar map - layers
// the connect dropdown- and linkouts in that
// thats all visual
// ./run.sh loadCheck --url=http://www.nbcmiami.com --output=console --env=local

// Tests are set explicitly against ids/classes of page objects


casper.test.begin('Page laod/wrapper tests', function suite(test) {

    // Config vars
    var utils = require('utils');
    var siteUrl = casper.cli.get("url");
    var mouse = require("mouse").create(casper);
    var saveLoc = ('screenshots/');
    var otsTestSuite = false;
    var tlmTestSuite = false;
    casper.options.viewportSize = { width: 1280, height: 5000 };


    // Util vars
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

    if (urlUri.indexOf('stage')) {
        var stageTest = true;
    };


    // Output variables
    var type = casper.cli.get('output');
        
    if (type === 'debug') {
        var debugOutput = true;
    } else if (type === 'dictionary') {
        var createDictionary = true;
        var logResults = false;
    } else if (type === 'console') {
        var showOutput = true;
    }


    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

    // Start testing
    casper.start( siteUrl, function() {
        casper.open(siteUrl, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(response) {
            if ( response.status == 200 || response.status == 304 ) {
                no_error = true;
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status);
                this.exit();
            }
        });

        // Load and visible tests
        casper.then(function(no_error) {
            if ( no_error ) {
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
                        var otsTestSuite = true;
                    } else {
                        console.log('TLM property...');
                        var tlmTestSuite = true;
                    }

                    test.comment('Page title: >> ' + this.getTitle());

                    // Set testing item
                    // NBC OTS Testing
                    if (otsTestSuite) {
                        casper.wait(60000, function() {
                            this.waitForSelector("#sfcontentFill",
                                function pass () {
                                    test.comment('Visual assertions/tests');

                                    test.comment('loading done.....');
                                    test.assertSelectorHasText('body', 'home', "Homepage loaded");

                                    this.test.assertNotEquals('body', 'nbc', 'OTS Body class set');

                                    test.assertExists('.site-header', "The site header loaded correctly.");
                                    test.assertVisible('.site-header', "...is also visible.");

                                    test.assertExists('.brand a img', "The logo loaded correctly.");
                                    test.assertVisible('.brand a', "...is also visible.");

                                    // if (this.visible()) {
                                    //     test.assertExists('.breaking-bar', "The breaking-bar is enabled and loaded correctly.");
                                    //         test.assertVisible('.breaking-bar', "...is visible.");
                                    // };

                                    test.assertExists('.navbar', "The nav loaded correctly.");
                                    test.assertVisible('.navbar', "...is visible.");

                                    test.assertExists('.nav-small-section.nav-live-tv', ".nav-small-section.nav-live-tv loaded correctly.");
                                    test.assertVisible('.nav-small-section.nav-live-tv', "...is visible.");

                                    // Move the mouse to the top TVE nav
                                    this.mouse.move('.nav-small-section.nav-live-tv a');
                                    test.assertVisible('.nav-small-section.nav-live-tv .nav-small-sub', "tv subnav...is visible.");
                                    
                                    // Capture screenshot of current state
                                    this.captureSelector('screenshots/' + urlUri + '_mouse-hover-screenshot' + timeStamp + '.png', 'body');
                                    test.comment('tv subnav screenshot captured.');

                                    test.assertExists('.weather-module', "The weather module loaded correctly.");
                                    test.assertVisible('.weather-module', "...is visible.");

                                    test.assertExists('.weather-module-radar iframe', "The weather radar loaded correctly.");
                                    test.assertVisible('.weather-module-radar iframe', "...is visible.");

                                    test.assertExists('.sfbox', "The spredfast modules loaded correctly.");
                                    test.assertVisible('.sfbox', "...is visible.");

                                    test.assertExists('.footer', "The footer area loaded correctly.");
                                    test.assertVisible('.footer', "...is visible.");
                                },
                                function fail () {
                                    this.captureSelector('screenshots/' + urlUri + '_failure-screenshot' + timeStamp + '.png', 'body');
                                    test.fail("Unable to test page elements. Did not load element .sfbox");
                                },
                                null // timeout limit in milliseconds
                            );
                        });

                        // this.waitForSelector("#sfcontentFill",
                        

                        // casper.waitUntilVisible('.sfbox', function(){
                        //    
                        // });

                    } else {
                    // TLM Testing
                        this.test.assertNotEquals('body', 'tlm', 'TLM Body class set');
                        test.assertExists('#logocont a img', "The logo loaded correctly.");
                        test.assertVisible('#logocont a', "...is also visible.");

                        test.assertExists('#nav', "The nav loaded correctly.");
                            test.assertVisible('#nav', "...is visible.");

                        // Weather module
                        // .weather-module-wrapper
                        // .icon-temp-wrapper
                        // .temperature


                        test.assertExists('.page_footer', "The footer area loaded correctly.");
                            test.assertVisible('.page_footer', "...is visible.");
                    }

                
            }
        });

        // Action tests
        casper.then(function(otsTestSuite) {

            if (otsTestSuite) {
                test.comment('[ -- clicking logo -- ]');
                    this.mouse.click('.brand a');
                test.comment('clicked ok, new location is ' + this.getCurrentUrl());

                test.comment('[ -- map layers -- ]');
                

                this.mouse.move('.weather-btn-text');
                test.assertVisible('.weather-module-btn', "weather module expand button...is visible.");
                this.mouse.click('.weather-module-btn');

                // casper.wait(2700, function() {

                    // casper.withFrame(1, function() {
                    //     this.test.assertTitle('WSI Map Widget');

                        test.assertVisible('.wxmap--map-ui__navbar', 'test.assertVisible is visible');
                        test.assertVisible('.wxmap--layers__toggle-button', '.wxmap--layers__toggle-button visible');

                        this.mouse.click('.wxmap--layers__toggle-button');

                        var nameCount = this.evaluate(function() {
                            // var names = $('span.author-name')
                            // return names.length;
                            var iframe = $('.wx-standalone-map').contents();
                            
                            iframe.find(".wxmap--layers-modal__root").click(function(){
                               return("test inside eval");
                            });
                        });
                        this.comment(nameCount);

                        // $('.wx-standalone-map').contents().find('.wxmap--layers-modal__root').click()



                        test.assertVisible('.wxmap--layers-modal__root', '1 layers option visible');
                        // Capture screenshot of current state
                        this.captureSelector('screenshots/' + urlUri + '_map_layers-1-screenshot' + timeStamp + '.png', 'body');
                        test.comment('weather layers screenshot captured.');

                    // });
                    // casper.withFrame(1, function() {
                    //     this.mouse.click('.wxmap--button__root');
                    //     test.assertVisible('.wxmap--layers-modal__root', '2 layers option visible');
                    //     // Capture screenshot of current state
                    //     this.captureSelector('screenshots/' + urlUri + '_map_layers-2-screenshot' + timeStamp + '.png', 'body');
                    //     test.comment('weather layers screenshot captured.');

                    // });
                    // casper.withFrame(1, function() {
                    //     this.mouse.click('button.wxmap--layers__toggle-button');
                    //     test.assertVisible('.wxmap--layers-modal__root', '3 layers option visible');
                    //     // Capture screenshot of current state
                    //     this.captureSelector('screenshots/' + urlUri + '_map_layers-3-screenshot' + timeStamp + '.png', 'body');
                    //     test.comment('weather layers screenshot captured.');
                    // });
                    // casper.withFrame(1, function() {
                    //     this.mouse.click('button.wxmap--button__root');
                    //     test.assertVisible('.wxmap--layers-modal__root', '4 layers option visible');


                    //     // Capture screenshot of current state
                    //     this.captureSelector('screenshots/' + urlUri + '_map_layers-4-screenshot' + timeStamp + '.png', 'body');
                    //     test.comment('weather layers screenshot captured.');
                    // });



                    // var iframe = document.getElementsByClassName('wx-standalone-map');
                    // doc = iframe.contentDocument;
                    // console.log(doc);
                    // doc.getElementsByTagName('a')[10].click();


                    // this.page.switchToChildFrame('.wx-standalone-map');
                    
                // });

            } else {
                test.comment('[ -- clicking logo -- ]');
                this.click('#logocont a');
            } 
        });
    }).run(function() {
        test.done();
    });
});
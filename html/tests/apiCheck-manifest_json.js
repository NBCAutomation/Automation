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

//
// Casper 1.1.0-beta3 and Phantom 1.9.8
//
// JSON Manifest
// templates/nbc_news_app_json_manifest?apiVersion=5
//
// Added manifest_dictionary table
// Dictionaries are auto updated in the db
// http://stackoverflow.com/questions/1068834/object-comparison-in-javascript


casper.test.begin('OTS SPIRE | API Manifest Audit', function suite(test) {

    var colorizer = require('colorizer').create('Colorizer');
    var logResults = true;
    var envConfig = casper.cli.get('env');

    if (envConfig === 'local') {
        var configURL = 'http://spire.app';
    } else if (envConfig === 'dev') {
        var configURL = 'http://45.55.209.68';
    } else {
        var configURL = 'http://54.243.53.242';
    }

    var type = casper.cli.get('output');
        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'console') {
            var showOutput = true;
        }

    var type = casper.cli.get('task');
        if (type === 'createDictionary') {
            var createDictionary = true;
            var logResults = false;
        }

    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

    var collectionObject = {};
    var dictionaryObject = {};
    var testResultsObject = {};
    var dictionaryManifestObject;
    var manifestTestRefID;

    // Required API keys for app to function correctly. Commented out some items due to not being 100% needed.
    var reqKeys = new Array(
        "domain",
        "market-site-key",
        "launch-image-name",
        "ugc-partition-id",
        "video-autoplay",
        "push-notification-url-key",
        "push-notification-flag-key",
        // "comscore-app-name",
        /*
        "web-links__facebook__url",
        "web-links__google-plus__url",
        "web-links__instagram__url",
        */
        "web-links__search__title",
        "web-links__search__url",
        "web-links__send-feedback__url",
        "web-links__settings-privacy-policy__title",
        "web-links__settings-privacy-policy__url",
        "web-links__traffic__url",
        "web-links__tv-listings__title",
        "web-links__tv-listings__url",
        "web-links__tve__url",
        /*
        "web-links__twitter__url",
        */
        "web-links__weather-alerts__url",
        "web-links__weather-school-closings__url",
        "advertising__display__network-id",
        "advertising__display__echo-transition-delay",
        "echo-transition-delay",
        "advertising__splash__enabled",
        "advertising__splash__ad-unit-level2",
        "advertising__splash__request-timeout",
        "advertising__splash__display-duration",
        "advertising__splash__target-width",
        "advertising__splash__target-height",
        "advertising__splash__scaling-x",
        "advertising__splash__scaling-y",
        "advertising__video__network-id",
        "advertising__video__direct-sold-target-width",
        "advertising__video__direct-sold-target-height",
        "advertising__video__backfill-target-width",
        "advertising__video__backfill-target-height",
        "advertising__video__backfill-app-id",
        "backfill-app-id",
        "wsi-map-id",
        // "wsi-market-default-layer",
        "app-urls__weather-branding",
        "app-urls__iteam-branding",
        "app-urls__alerts",
        "app-urls__ugctemplets",
        "app-urls__breaking",
        "app-urls__home",
        "app-urls__home-investigation",
        "app-urls__facebook-comments-script",
        "app-urls__navigation",
        "app-urls__settings-terms-of-use",
        "app-urls__settings-terms-of-service",
        "app-urls__settings-closed-captioning-faq",
        "app-urls__submit-media",
        "app-urls__trending",
        "app-urls__weather-forcast-video",
        "app-urls__weather-forcast-story",
        "app-urls__weather-maps",
        "app-base-urls__advertising-display",
        "app-base-urls__advertising-video",
        "app-base-urls__home-top-stories",
        "app-base-urls__content",
        "app-base-urls__gallery",
        "app-base-urls__recommended",
        "app-base-urls__related",
        "app-base-urls__weather-conditions-icon",
        "app-base-urls__weather-forcast",
        "app-base-urls__weather-wsi-forcast",
        "app-base-urls__weather-location-lookup",
        "omniture__report-suite-ids",
        "omniture__tracking-server",
        "omniture__app-section-server-name",
        "omniture__page-view-event",
        "omniture__link-type",
        "omniture__station-division",
        "omniture__station-business-unit",
        "omniture__station-call-sign",
        "omniture__station-market",
        /*
        "force-update",
        "update-screen-title",
        "update-screen-desc",
        "update-screen-appUrl",
        "update-screen-appversion",
        */
        "advertising__ad-unit-level1",
        "advertising__fw_ssid",
        /*
        "adtest",
        */
        "advertising__stage",
        "advertising__article-interstitial",
        "advertising__gallery-interstitial",
        "advertising__default-iab-category-tier1",
        "advertising__default-iab-category-tier2",
        "advertising__splash__display-duration",
        "contact__name",
        "contact__address-line1",
        "contact__address-line2",
        "contact__phone",
        /*
        "contact-Info__phone1__contactInfoLabel",
        "contact-Info__phone1__contactInfoNumber",
        "contactInfoNumber",
        "contact-Info__phone2__contactInfoLabel",
        "contact-Info__phone2__contactInfoNumber",
        "contact-Info__phone3__contactInfoLabel",
        "contact-Info__phone3__contactInfoNumber",
        */
        "contact__investigation-phone",
        "contact__investigation-email",
        "weather__meteorologist-summary-disabled",
        "weather__market-default-postal-code",
        "weather__market-default-location-name",
        // "weather__market-default-dma",
        "weather__market-default-lat",
        "weather__market-default-long",
        "weather__scroll-down-animation-hour",
        "weather__scroll-down-animation-display-sec",
        "weather__geo-location-prompt-visit-interval",
        /*
        "app-id",
        */
        "live-promotion__is-live-promotion",
        "live-promotion__promotion-type",
        "live-promotion__url-schema-ios",
        "live-promotion__app-link-ios",
        "live-promotion__url-schema-android",
        "live-promotion__app-link-android"
    );


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
    }

    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        } else {
            var suite = this;

            var parser = document.createElement('a');
            parser.href = url;

            newUrl = parser.href;
            var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
            var urlUri = sourceString.replace('.','_');

            // Add manifest url    
            url = url + '/templates/nbc_news_app_json_manifest?apiVersion=5';

            /*******************
            * Start Test
            *******************/
            casper.start( url ).then(function(response) {
                if ( response.status == 200 ) {
                    if(createDictionary){
                        console.log(urlUri + ' Dictionary creation/update started.');
                    } else {
                        console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                    }
                } else {
                    casper.test.fail('Page did not load correctly. Response: ' + response.status);
                }
            }).then(function () {
                if (createDictionary) {
                    suite.collectManifestData(url, type, 'xx');
                } else {
                    // Create ref test ID and start manifest data collection for testing
                    suite.createTestID(url, type, urlUri);
                }
            }).then(function () {
                if(createDictionary){
                    suite.updateInsertManifestDictionary(urlUri, collectionObject);

                    // Display collection object
                    if (debugOutput) {
                        console.log('---------------------');
                        console.log(' Collection object   ');
                        console.log('---------------------');
                        casper.wait(700, function() {
                            // console.log(collectionObject);
                            for (var thisCollectionOtem in collectionObject) {
                                console.log('>>>>> ' + thisCollectionOtem + ' : ' + collectionObject[thisCollectionOtem]);
                            }
                        })
                    } else {

                    }
                } else {
                    suite.testManifestData(urlUri, collectionObject);
                }

            }).run(function() {
                //Process file to DB
                if (logResults) {
                    suite.processTestResults(urlUri, collectionObject);
                }

                if(createDictionary){
                    console.log(urlUri + ' Dictionary creation/update ended.');
                } else {
                    console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
                }

                this.exit();
                test.done();
            });
        }
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {
        var suite = this;

        // require('utils').dump( current );
        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-manifest&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            suite.collectManifestData(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.open(dbUrl).then(function(resp) {

                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        var manifestTestRefID = casper.getElementInfo('body').text;

                        suite.collectManifestData(url, type, manifestTestRefID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    apiSuite.prototype.updateInsertManifestDictionary = function(urlUri, collectionObject) {
        var processUrl = configURL + '/utils/manage_dictionary&task=createDictionary';
        // &dictionaryStation=' + urlUri + '&dictionaryData=' + JSON.stringify(collectionObject);

        if (debugOutput) {
            console.log('dictionaryStation > ' + urlUri);
            console.log('dictionaryData    > ' + JSON.stringify(collectionObject));
            console.log('---------------------');
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'dictionaryStation': urlUri,
                'dictionaryData':  JSON.stringify(collectionObject)
            }
        });
    };

    apiSuite.prototype.processTestResults = function(urlUri, collectionObject) {
        var processUrl = configURL + '/utils/manage_dictionary&task=processTestResults';

        if (debugOutput) {
            console.log(processUrl);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'dictionaryStation': urlUri,
                'dictionaryData':  JSON.stringify(collectionObject)
            }
        });
    };

    apiSuite.prototype.collectManifestData = function(url, type, testID) {
        var suite = this;

        casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
            resp = resp;
            
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                if (showOutput) {console.log(url + colorizer.colorize(' Status: ' + status, 'INFO') )};
                
                var validated = false;
                var output = this.getPageContent();

                try{
                    jsonParsedOutput = JSON.parse(output);

                    mainItem = jsonParsedOutput;

                    for (var parentManifestItem in jsonParsedOutput) {

                        if (typeof jsonParsedOutput[parentManifestItem] != 'object') {
                            if (debugOutput) {
                                console.log(colorizer.colorize(parentManifestItem.toLowerCase(), 'INFO') + ' : ' + jsonParsedOutput[parentManifestItem]);
                            }

                            var manifestKeyName = parentManifestItem.toLowerCase();
                            var manifestKeyValue = jsonParsedOutput[parentManifestItem];

                            // Add key/val to collection object for testing;
                            suite.buildmanifestCollectionObject(manifestKeyName, manifestKeyValue);
                        
                        } else {
                            suite.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem]);
                        }
                    }
                } catch (e) {
                    // ...
                    if (showOutput) {console.log(e)};
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        })

    };

    apiSuite.prototype.spiderObject = function(parentObjectName, childManifestObject) {
        var suite = this;

        // Manifest keys are built as key__ +
        // Ex: parentKeyName__childKeyName__grandChildKeyName__lineageItemKeyName : Value
        // Live Ex: TVE__OnDemand__featured_shows__0__show_img : http://media.nbcnewyork.com/designimages/featured_show_1_ondemand2x.png

        for (var childItem in childManifestObject) {
            if (typeof childManifestObject[childItem] != 'object') {
                var manifestMainObjectName = parentObjectName.toLowerCase() + '__' + childItem.toLowerCase();

                if (debugOutput) {
                    console.log(colorizer.colorize(manifestMainObjectName, 'INFO') + ' : ' + childManifestObject[childItem]);
                }

                // Add key/val to collection object for testing if required;
                suite.buildmanifestCollectionObject(manifestMainObjectName, childManifestObject[childItem]);

            } else {
                var manifestObjectName = parentObjectName.toLowerCase() + '__' + childItem.toLowerCase();
                suite.spiderObject(manifestObjectName, childManifestObject[childItem]);
            }
        }
    };

    apiSuite.prototype.buildmanifestCollectionObject = function(manifestCollectionObjectName, manifestCollectionObjectValue) {
        var suite = this;
        reqKeys.reverse();

        // If manifestCollectionObjectName found in required manifest key array, add it to the collection object for testing
        for (var reqKeysItem in reqKeys){
            
            if (manifestCollectionObjectName == reqKeys[reqKeysItem]) {

                collectionObject[manifestCollectionObjectName] = manifestCollectionObjectValue;
            }
        }

    };

    apiSuite.prototype.pullManifestDictionaryData = function(station, callback) {
        var suite = this;
        var dbUrl = configURL + '/utils/tasks?task=getDictionaryData&&property=' + station;

        if (dbUrl) {
            casper.open(dbUrl).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    if (debugOutput) { console.log(colorizer.colorize('Manifest dictionary data: ', 'COMMENT') + dbUrl ) };
                    
                    output = casper.getElementInfo('body').text;
                } else {
                    throw new Error('Unable to pull manifest data, util url missing: ' + status);
                }

                if (typeof(callback) === "function") {
                    callback(output);
                }
            })
        } else {
            throw new Error('Unable to pull manifest data, util url missing.');
        }

    };


    apiSuite.prototype.testManifestData = function(url, manifestCollectionObject) {
        var suite = this;
        
        var dictionaryManifestObject = suite.pullManifestDictionaryData(url, function (data) {
            // console.log(JSON.parse(data) == manifestCollectionObject);
            testData = JSON.parse(data);
            for (var testingItem in testData) {
                console.log('>>>>> ' + testingItem + ' : ' + testData[testingItem]);
            }         
        });
        
    };


    new apiSuite(casper.cli.get('url'));
});
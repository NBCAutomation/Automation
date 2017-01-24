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
        } else if (type === 'dictionary') {
            var createDictionary = true;
            var logResults = false;
        } else if (type === 'console') {
            var showOutput = true;
        }

    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

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
        
        if(createDictionary){
            var logName = urlUri + '_dictionary.csv';
        } else {
            var logName = urlUri + '_manifest-audit_' + timeStamp + '.csv';
        }

        var curFolder = month + '_' + day + '_' + year;
        
        if(createDictionary){
            var saveLocation = 'manifest_dictionary/';

            fs.makeDirectory(saveLocation, 775);
            console.log(logName);
            var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);

        } else {
            var saveLocation = 'test_results/api_manifest_audits/' + curFolder;
            fs.makeDirectory(saveLocation, 775);

            if (['local', 'dev'].indexOf(envConfig) < 0) {
                var process = require("child_process"),
                    spawn = process.spawn,
                    child = spawn("chown", ["-hR", "ec2-user:apache", saveLocation]);
            }

            var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);
        }
    }

    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        var suite = this;

        var parser = document.createElement('a');
        parser.href = url;

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');

        // Add manifest url    
        url = url + '/templates/nbc_news_app_json_manifest?apiVersion=5';

        // Start Test
        casper.start( url ).then(function(response) {
            if ( response.status == 200 ) {
                if(createDictionary){
                    console.log('Dictionary creation started.');
                } else {
                    console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                }
            } else {
                casper.test.fail('Page did not load correctly. Response: ' + response.status);
            }
        }).then(function () {
            suite.createTestID(url, type, urlUri);
        }).run(function() {
            //Process file to DB
            if (logResults) {
                suite.processTestResults(save);
            }
            if(createDictionary){
                console.log('Dictionary creation ended.');
            } else {
                console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            }
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {

        var suite = this;
        var testResultFileLocation = encodeURIComponent(save);

        // require('utils').dump( current );
        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-manifest&property=' + stationProperty + '&fileLoc=' + testResultFileLocation;

        if (!logResults){
            suite.getContent(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.open(dbUrl).then(function(resp) {
                    
                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        var __dbID = casper.getElementInfo('body').text;

                        suite.getContent(url, type, __dbID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                    
                });
            }
        }
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(resultsFile) {
        var testResultFileLocation = encodeURIComponent(save);

        var suite = this;

        var processUrl = configURL + '/utils/tasks?task=upload&testType=apiManifest&fileLoc=' + testResultFileLocation;

        if (processUrl) {
            casper.open(processUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    console.log(colorizer.colorize('DB processURL Loaded: ', 'COMMENT') + processUrl );                    
                } else {
                    throw new Error('Unable to get/store Test ID!');
                    this.exit();
                }
                
            });
        }
    };

    apiSuite.prototype.getContent = function(url, type, testID) {
        
        var suite = this;
        var apiVersion = '5';

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
            "web-links_facebook_url",
            "web-links_google-plus_url",
            "web-links_instagram_url",
            */
            "web-links_search_title",
            "web-links_search_url",
            "web-links_send-feedback_url",
            "web-links_settings-privacy-policy_title",
            "web-links_settings-privacy-policy_url",
            "web-links_traffic_url",
            "web-links_tv-listings_title",
            "web-links_tv-listings_url",
            "web-links_tve_url",
            /*
            "web-links_twitter_url",
            */
            "web-links_weather-alerts_url",
            "web-links_weather-school-closings_url",
            "advertising_display_network-id",
            "advertising_display_echo-transition-delay",
            "echo-transition-delay",
            "advertising_splash_enabled",
            "advertising_splash_ad-unit-level2",
            "advertising_splash_request-timeout",
            "advertising_splash_display-duration",
            "advertising_splash_target-width",
            "advertising_splash_target-height",
            "advertising_splash_scaling-x",
            "advertising_splash_scaling-y",
            "advertising_video_network-id",
            "advertising_video_direct-sold-target-width",
            "advertising_video_direct-sold-target-height",
            "advertising_video_backfill-target-width",
            "advertising_video_backfill-target-height",
            "advertising_video_backfill-app-id",
            "backfill-app-id",
            "wsi-map-id",
            // "wsi-market-default-layer",
            "app-urls_weather-branding",
            "app-urls_iteam-branding",
            "app-urls_alerts",
            "app-urls_ugctemplets",
            "app-urls_breaking",
            "app-urls_home",
            "app-urls_home-investigation",
            "app-urls_facebook-comments-script",
            "app-urls_navigation",
            "app-urls_settings-terms-of-use",
            "app-urls_settings-terms-of-service",
            "app-urls_settings-closed-captioning-faq",
            "app-urls_submit-media",
            "app-urls_trending",
            "app-urls_weather-forcast-video",
            "app-urls_weather-forcast-story",
            "app-urls_weather-maps",
            "app-base-urls_advertising-display",
            "app-base-urls_advertising-video",
            "app-base-urls_home-top-stories",
            "app-base-urls_content",
            "app-base-urls_gallery",
            "app-base-urls_recommended",
            "app-base-urls_related",
            "app-base-urls_weather-conditions-icon",
            "app-base-urls_weather-forcast",
            "app-base-urls_weather-wsi-forcast",
            "app-base-urls_weather-location-lookup",
            "title",
            "omniture_report-suite-ids",
            "omniture_tracking-server",
            "omniture_app-section-server-name",
            "omniture_page-view-event",
            "omniture_link-type",
            "omniture_station-division",
            "omniture_station-business-unit",
            "omniture_station-call-sign",
            "omniture_station-market",
            /*
            "force-update",
            "update-screen-title",
            "update-screen-desc",
            "update-screen-appUrl",
            "update-screen-appversion",
            */
            "advertising_ad-unit-level1",
            "advertising_fw_ssid",
            /*
            "adtest",
            */
            "advertising_stage",
            "advertising_article-interstitial",
            "advertising_gallery-interstitial",
            "advertising_default-iab-category-tier1",
            "advertising_default-iab-category-tier2",
            "advertising_splash_display-duration",
            "contact_name",
            "contact_address-line1",
            "contact_address-line2",
            "contact_phone",
            /*
            "contact-Info_phone1_contactInfoLabel",
            "contact-Info_phone1_contactInfoNumber",
            "contactInfoNumber",
            "contact-Info_phone2_contactInfoLabel",
            "contact-Info_phone2_contactInfoNumber",
            "contact-Info_phone3_contactInfoLabel",
            "contact-Info_phone3_contactInfoNumber",
            */
            "investigation-phone",
            "investigation-email",
            "meteorologist-summary-disabled",
            "market-default-postal-code",
            "market-default-location-name",
            // "market-default-dma",
            "market-default-lat",
            "market-default-long",
            "scroll-down-animation-hour",
            "scroll-down-animation-display-sec",
            "geo-location-prompt-visit-interval",
            /*
            "app-id",
            */
            "live-promotion_is-live-promotion",
            "live-promotion_promotion-type",
            "live-promotion_url-schema-ios",
            "live-promotion_app-link-ios",
            "live-promotion_url-schema-android",
            "live-promotion_app-link-android"
        );
        
        collectionObject = {};
        dictionaryObject = {};
        testResultsObject = {};
            
        if (!debugOutput) {
            // Write file headers
            var testInfo = 'Manifest url tested: ' + url;
            var testTime = 'Test completed: ' + month + '/' + day + '/' + year + ' - ' +hours + ':' + minutes + ' ' + toD;
            
            if(createDictionary){
                fs.write(save, 'Expected Key,Expected Value', 'a+');
            } else {
                fs.write(save, 'Test ID,API Version,Expected Key,Expected Value,Live Key,Live Value,Pass/Fail,Info,' + '\n', 'a+');
            }
        }

        // casper.open(url,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
            casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                resp = resp;
                
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    if (showOutput) {console.log(url + colorizer.colorize(' Status: ' + status, 'INFO') )};

                    // casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                        
                        var validated = false;
                        var output = this.getPageContent();

                        try{

                            jsonParsedOutput = JSON.parse(output);

                            mainItem = jsonParsedOutput;

                            var count = 0;
                            

                            console.log(JSON.stringify(jsonParsedOutput));

                            for (var __item in mainItem) {
                                console.log('++++++++++++++++++++++++++///////// in here');
                                console.log(__item);

                                if(mainItem.hasOwnProperty(__item)){
                                    count++;
                                }

                                var parsedOutputItems = jsonParsedOutput.items[count];

                                for (var currentItem in parsedOutputItems) {
                                    // if (debugOutput) {
                                        console.log(currentItem + ' : ' + parsedOutputItems[currentItem]);
                                    // };

                                    if (requiredManifestKeys.indexOf(currentItem) > -1) {

                                        if (parsedOutputItems.length <= 0) {
                                            throw new Error('key blank ' + currentItem);
                                        } else {

                                            if (currentItem === 'appTitle') {
                                                var navItemAppTitle = parsedOutputItems[currentItem];
                                            }

                                            if (currentItem === 'location') {
                                                
                                                if (debugOutput) {
                                                    console.log(currentItem + ' : ' + parsedOutputItems[currentItem]);
                                                };

                                                // Find actual links and append the corrent version string to the end of the url
                                                if (parsedOutputItems[currentItem].indexOf('/apps') > -1) {

                                                    if (parsedOutputItems[currentItem].indexOf('?') > -1) {
                                                        var navItemAppLocationURL = __baseUrl + parsedOutputItems[currentItem] + '&apiVersion=5'
                                                    } else {
                                                        var navItemAppLocationURL = __baseUrl + parsedOutputItems[currentItem] + '?apiVersion=5'
                                                    }
                                                    
                                                    if (debugOutput) {
                                                        console.log(navItemAppLocationURL);
                                                    };
                                                }

                                                // Test to ensure that the navigation urls are working properly
                                                // suite.checkHealth(navItemAppTitle, navItemAppLocationURL, testID);
                                            }
                                        }
                                    }

                                    // -------------------------------------

                                    if (currentItem === 'items' && typeof parsedOutputItems[currentItem] === 'object') {

                                        var __parent = jsonParsedOutput.items[count].title;
                                        console.log(' ++++++++ ' +__parent);

                                        if (debugOutput) {
                                            console.log('-----------------');
                                            console.log(__parent + ' sub links');
                                        }
                                        
                                        var __subItem = jsonParsedOutput.items[count].items;

                                        var __count = 0;

                                        for (var __item in __subItem) {
                                            
                                            if(__subItem.hasOwnProperty(__item)){
                                                __count++;

                                                __offset = (__count - 1);
                                                // console.log(__offset);
                                            }

                                            var __lastItem = jsonParsedOutput.items[count].items[__offset];

                                            for (var __b in __lastItem) {
                                                if (debugOutput) {console.log(' -  ' + __b + ' : ' + __lastItem[__b])};

                                                if (requiredManifestKeys.indexOf(__b) > -1) {
                                                    // console.log(' -  ' + __b + ' : ' + __lastItem[__b]);
                                                    
                                                    if (__b === 'appTitle') {
                                                        var subNavItemAppTitle = __lastItem[__b];
                                                    }

                                                    if (__b === 'location') {
                                                        
                                                        if (debugOutput) {console.log(__b + ' : ' + __lastItem[__b])};

                                                        if (__lastItem[__b].indexOf('/apps') > -1) {

                                                            if (__lastItem[__b].indexOf('?') > -1) {
                                                                var __lastKeyUrl = __baseUrl + __lastItem[__b] + '&apiVersion=5'
                                                            } else {
                                                                var __lastKeyUrl = __baseUrl + __lastItem[__b] + '?apiVersion=5'
                                                            }
                                                            
                                                            if (debugOutput) {
                                                                console.log('>> ' + __lastKeyUrl);
                                                            };
                                                        }

                                                        suite.checkHealth(subNavItemAppTitle, __lastKeyUrl, testID);
                                                    }
                                                }

                                            }
                                            if (debugOutput) { console.log('    -----------------')};
                                        }
                                    }

                                }

                                if (debugOutput) {console.log('-----------------')};
                            }
                        } catch (e) {
                            // ...
                            if (showOutput) {console.log(e)};
                        }
                    // });
                }

                // suite.checkHealth();
            });
    };

    new apiSuite(casper.cli.get('url'));
});
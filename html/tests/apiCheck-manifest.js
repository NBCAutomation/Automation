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
        url = url + '/apps/news-app/manifest/?apiVersion=5';

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
        var apiVersion = '4';

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

        casper.open(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function() {
            var rawContent = this.getHTML();
            
            // if (debugOutput) {console.log(rawContent)};
            
            /******************************
                Notes:

                If sub-nested value, the key/value is built using parent + child + grandchild relationship of dictionary items. Objects are stored as "[keyName]: [value]"

                Based on the example below, the required testing key/value(s) will be built as;
                - "web-links_facebook_url: http://www.facebook.com/NBCNewYork"
                - "web-links_google-plus_url: https://plus.google.com/+NBCNewYork"

                Example:
                <key>web-links</key>
                <dict>
                    <key>facebook</key>
                    <dict>
                        <key>url</key>
                        <string>
                        <![CDATA[ http://www.facebook.com/NBCNewYork ]]>
                        </string>
                    </dict>
                    <key>google-plus</key>
                    <dict>
                        <key>url</key>
                        <string>
                            <![CDATA[ https://plus.google.com/+NBCNewYork ]]>
                        </string>
                    </dict>
                </dict>

             ******************************/

            if ( rawContent ) {

                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(rawContent,'text/xml');

                // Grab first dictionay section on the XMl for parsing
                var mainNodeDictionary = xmlDoc.getElementsByTagName("dict");

                // console.log('nodes ' + mainNodeDictionary.length);

                for(var i = 0; i < mainNodeDictionary.length; i++) {
                    // if (i > 0 && mainNodeDictionary[i].nodeName == 'dict') {
                    //     console.log('topMostKey: ' + mainNodeDictionary[i].previousElementSibling.textContent)
                    // }

                    // console.log(i + ' || ' + mainNodeDictionary[i].nodeName);
                    // console.log(i + ' || ' + mainNodeDictionary[i].textContent);

                    var currentNode = mainNodeDictionary[i];
                    // var previousSiblingText = currentNode.previousSibling;
                    // console.log(' >>> <<< ' + previousSiblingText.textContent);

                    // console.log(previousSiblingText);

                    if (currentNode.hasChildNodes) {
                        var children = currentNode.childNodes;

                        // Loop through children and set the parent string/key of the dictionary based on the previous key item
                        
                        for(var b = 0; b < children.length; b++) {

                            if (children[b].nodeName == 'key') {

                                if (debugOutput) {
                                    console.log('\n============= Debug =============\n');
                                    
                                    // if (children[b].previousElementSibling) {
                                    //     console.log('baseParentName: ' + children[b].previousElementSibling.textContent);
                                    // }

                                    console.log('key : ' + children[b].textContent);
                                };

                                var parentKeyName = children[b].textContent;
                            } else {
                                if (debugOutput) {
                                    if (children[b].nodeName == 'array') {
                                        console.log('dicks out in the  array');
                                    }
                                }
                            }
                            
                            
                            // If children of above @ children[b].nodeName == 'key'
                            if (children[b].childNodes.length > 1) {

                                if (debugOutput) {
                                    console.log(' -----');
                                    console.log('   [  Dict  ]')
                                };
                                
                                var subChildren = children[b].childNodes;

                                for(var c = 0; c < subChildren.length; c++) {

                                    if (subChildren[c].nodeName == 'key' || subChildren[c].nodeName == 'string' || subChildren[c].nodeName == 'integer' || subChildren[c].nodeName == 'real' || subChildren[c].nodeName == 'false' || subChildren[c].nodeName =='true') {
                                        // Find keys within data subset
                                        if (subChildren[c].nodeName == 'key') {
                                            if (debugOutput) {
                                                console.log('    childKeyName = ' + subChildren[c].textContent);
                                                console.log('    combinedchildName = ' + parentKeyName + '_' + subChildren[c].textContent);
                                            }
                                            
                                            var combinedchildName = parentKeyName + '_' + subChildren[c].textContent;
                                        // Find value in data subset
                                        } else if (subChildren[c].nodeName == 'string' || subChildren[c].nodeName == 'integer' || subChildren[c].nodeName == 'real') {
                                            
                                            if (debugOutput) {
                                                console.log('    childVal = ' + subChildren[c].textContent + '\n');

                                            }

                                            var childVal = subChildren[c].textContent;

                                        } else if (subChildren[c].nodeName == 'false' || subChildren[c].nodeName == 'true') {
                                            
                                            if (debugOutput) {
                                                console.log('    childVal = ' + subChildren[c].nodeName + '\n');
                                                console.log('    childVal = ' + subChildren[c].textContent + '\n');

                                            }

                                            var childVal = subChildren[c].nodeName;
                                        }

                                        
                                        if (childVal) {
                                            // Add to collection object
                                            collectionObject[combinedchildName] = childVal;

                                            if (debugOutput) {
                                                // console.log(subKeyName + ' : ' + grandchildVal)
                                                console.log('    object => ' + combinedchildName + ' : ' + childVal);
                                                console.log('    ---------------------\n');
                                                var childVal = null;
                                            }

                                        }
                                    }  else if (children[b].nodeName == 'array') {
                                        var childArray = children[b];

                                        var arrayParentName = children[b].previousElementSibling.textContent;

                                        if (childArray.hasChildNodes) {
                                            var arrayChildren = childArray.childNodes;

                                            // Loop through children and set the parent string/key of the dictionary based on the previous key item
                                            
                                            for(var f = 0; f < arrayChildren.length; f++) {

                                                if (arrayChildren[f].nodeName == 'dict') {
                                                    // console.log('dick butts');

                                                    arrayGrandChildren = arrayChildren[f].childNodes;

                                                    for(var d = 0; d < arrayGrandChildren.length; d++) {
                                                        if (arrayGrandChildren[d].nodeName == 'key') {

                                                            if (debugOutput) {
                                                                console.log('       arrayGrandChildKeyName = ' + arrayGrandChildren[d].textContent + '\n');
                                                                console.log('       arrayGrandchildCombinedKey = ' + arrayParentName + '_' + arrayGrandChildren[d].textContent);
                                                            };

                                                            // Set array key name
                                                            var arrayGrandchildCombinedKey = arrayParentName + '_' + arrayGrandChildren[d].textContent;

                                                        } else if (arrayGrandChildren[d].nodeName == 'string' || arrayGrandChildren[d].nodeName == 'integer' || arrayGrandChildren[d].nodeName == 'real') {
                                                            
                                                            if (debugOutput) {
                                                                console.log('dick butts 1');
                                                                console.log('       arrayGrandChildValue = ' + arrayGrandChildren[d].textContent + '\n');
                                                                console.log('       object => ' + grandchildCombinedKey + ' : ' + grandchildVal + '\n');
                                                                
                                                            };

                                                            // Add to collection object
                                                            collectionObject[grandchildCombinedKey] = grandchildVal;

                                                            // Set array key value
                                                            var arrayGrandChildValue = arrayGrandChildren[d].textContent;

                                                        }
                                                        
                                                        if (arrayGrandChildValue) {
                                                            if (debugOutput) {
                                                                console.log('dick butts 2');
                                                                console.log('       object => ' + arrayGrandchildCombinedKey + ' : ' + arrayGrandChildValue);
                                                                console.log('       ------------------------------\n');
                                                            }

                                                            // Add to collection object
                                                            collectionObject[arrayGrandchildCombinedKey] = arrayGrandChildValue;

                                                            var arrayGrandChildValue = null;
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    // If grandchildren
                                    } else if (subChildren[c].nodeName == 'dict') {

                                        if (debugOutput) {

                                            console.log('=== [dict] ===');
                                            console.log('\n============= Debug =============\n');
                                            console.log('   TopKey Name: ' + parentKeyName)
                                            console.log('   nodeType >> ' + subChildren[c].nodeType);
                                            console.log('   nodeName >> [  ' + subChildren[c].nodeName + '  ]');
                                            console.log('   textContent >> ' + JSON.stringify(subChildren[c].textContent));
                                            console.log('   nodeValue >> ' + subChildren[c].nodeValue);
                                            console.log('\n============= Debug =============\n');
                                        }

                                        // console.log(subChildren[c].previousElementSibling.textContent);

                                        var comdbinedDictionaryItemName = parentKeyName + '_' + subChildren[c].previousElementSibling.textContent;
                                        var singleDictionayName = subChildren[c].previousElementSibling.textContent;

                                        if (debugOutput) {
                                            if (subChildren[c].nodeName == 'dict') {
                                                console.log('\n');
                                                console.log('    --[ Dict ] ' + singleDictionayName);
                                            }
                                        };

                                        if (subChildren[c].childNodes.length > 1) {
                                            var thirdChildren = subChildren[c].childNodes;

                                            for(var d = 0; d < thirdChildren.length; d++) {

                                                if (thirdChildren[d].nodeName == 'key') {

                                                    if (debugOutput) {
                                                        console.log('       grandchildCurrentKeyName = ' + thirdChildren[d].textContent + '\n');
                                                        console.log('       grandchildCombinedKey = ' + comdbinedDictionaryItemName + '_' + thirdChildren[d].textContent);
                                                    };

                                                    var grandchildCombinedKey = comdbinedDictionaryItemName + '_' + thirdChildren[d].textContent;
                                                    var grandchildCurrentKeyName = thirdChildren[d].textContent;
                                                    var subKeyName = thirdChildren[d].textContent;

                                                } else if (thirdChildren[d].nodeName == 'string' || thirdChildren[d].nodeName == 'integer' || thirdChildren[d].nodeName == 'real') {
                                                    
                                                    // Push key/val into collection
                                                    var grandchildVal = thirdChildren[d].textContent;
                                                    collectionObject[grandchildCombinedKey] = grandchildVal;

                                                    if (debugOutput) {
                                                        console.log('       grandchildValue = ' + grandchildVal + '\n');
                                                        console.log('       object => ' + grandchildCombinedKey + ' : ' + grandchildVal + '\n');
                                                        console.log('       ------------------------------\n');
                                                    };

                                                } else if (thirdChildren[d].nodeName == 'false' || thirdChildren[d].nodeName == 'true') {
                                                    
                                                    // Push key/val into collection
                                                    var grandchildVal = thirdChildren[d].nodeName;
                                                    collectionObject[grandchildCombinedKey] = grandchildVal;

                                                    if (debugOutput) {
                                                        console.log('       grandchildValue = ' + grandchildVal + '\n');
                                                        console.log('       object => ' + grandchildCombinedKey + ' : ' + grandchildVal + '\n');
                                                        console.log('       ------------------------------\n');
                                                    };
                                                }
                                            }

                                            // Push key/val into collection
                                            // collectionObject[subKeyName] = grandchildVal;

                                            
                                        }
                                    } else {
                                        if (debugOutput) {
                                            console.log('        not a dictionary');
                                            console.log('        textContent >> ' + JSON.stringify(subChildren[c].textContent));
                                        }
                                    }
                                }
                            } else if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real' || children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                
                                if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real') {
                                    
                                    // Push key/val into collection
                                    var __topVal = children[b].textContent;

                                    collectionObject[parentKeyName] = __topVal;

                                    if (debugOutput) {
                                        console.log('val : ' + children[b].textContent + '\n')
                                        console.log('object => ' + parentKeyName + ' : ' + __topVal);
                                    };

                                    
                                } else if (children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                    var __topVal = children[b].nodeName;
                                    
                                    collectionObject[parentKeyName] = __topVal;

                                    if (debugOutput) {
                                        console.log('val : ' + children[b].nodeName + '\n')
                                        console.log('object => ' + parentKeyName + ' : ' + __topVal);
                                    };

                                }
                            }
                        }
                    }
                }

                if (debugOutput) {
                    console.log(JSON.stringify(collectionObject));
                }

                if (debugOutput) {
                    console.log(parentKeyName + ' : ' + __topVal)
                    casper.echo( 'Testing surpressed due to debug.', 'PARAMETER' );
                } else {
                    var cwd = fs.absolute(".");

                    var currentFile = require('system').args[3];
                    var curFilePath = fs.absolute(currentFile).split('/');

                    // I only bother to change the directory if we weren't already there when invoking casperjs
                    if (curFilePath.length > 1) {
                        curFilePath.pop(); // PhantomJS does not have an equivalent path.baseName()-like method
                        fs.changeWorkingDirectory(curFilePath.join('/'));
                    }


                    // var dictionaryFile = fs.workingDirectory + '/manifest_dictionary/' + urlUri + '_dictionary.csv';
                    var dictionaryFile = 'manifest_dictionary/' + urlUri + '_dictionary.csv';
                    var localDictName =  urlUri + '_dictionary.csv';

                    var dictionaryManifestData = fs.read(dictionaryFile);

                    rows = dictionaryManifestData.split("\n");
                    rows.shift();
                    rows.reverse();

                    for (var i = rows.length - 1; i >= 0; i--) {
                        
                        var __dictKey = rows[i].match(/^(.*?),(.*?)$/)[1];
                        var __dictVal = rows[i].match(/^(.*?),(.*?)$/)[2].replace(/"/g,'').replace(/,(?=[^,]*$)/, '');

                        if (__dictKey.length <= 0) {
                            __dictKey = "[No Key on manifest]";
                        }

                        if (__dictVal.length <= 0) {
                            __dictVal = "[No Value on manifest]";
                        }

                        if (debugOutput) {
                            console.log('dict_key: ' + __dictKey);
                            console.log('dict_val: ' + __dictVal);
                        }

                        dictionaryObject[__dictKey] = __dictVal;
                    }
                    
                    // throw new Error('quit');
                    
                    //Begin manifest key/val check
                    reqKeys.reverse();

                    for (var i = reqKeys.length - 1; i >= 0; i--) {
                       var __colData = reqKeys[i];
                       
                       for (var key in __colData) {
                           // console.log('key = ' + __colData[key]);
                       }

                       // console.log(JSON.stringify(collectionObject));
                       // this.exit();

                        if (!(reqKeys[i] in collectionObject)) {
                            if(!createDictionary){
                                // throw new Error('Missing required API key! ' + reqKeys[i]);
                                if (showOutput) {console.log(colorizer.colorize('FAIL: Missing required API key! ' + reqKeys[i], 'ERROR'))};
                                if (!debugOutput) {
                                    // fs.write(save, ',\n' + 'FAIL: Missing required API key! ' + reqKeys[i], 'a+');
                                    // fs.write(save, testID + ',' + apiVersion + ',' +  reqKeys[i] + ',"--missing--",' + reqKeys[i] + ',"--missing--",' + 'Fail,FAIL: Missing required API key! ' + reqKeys[i] + ',\n', 'a+');
                                }
                            }

                        } else {
                            // console.log('found key:' + reqKeys[i]);
                            for (var key in collectionObject) {

                                var val = collectionObject[key];

                                if ( reqKeys.indexOf(key) > -1 ) {
                                    if (reqKeys[i] == key) {
                                        if(createDictionary){
                                            fs.write(save, ',\n' + key + ',' + '"' + val + '"', 'a+');
                                        } else {
                                            if (val.indexOf('$') >= 0 ) {
                                                if (showOutput) {console.log(colorizer.colorize('FAIL: Variable found "' + val + '" in output for ' + key, 'ERROR'))};
                                                if (!debugOutput) {
                                                    // fs.write(save, ',\n' + 'FAIL: Variable found "' + val + '" in output for ' + key, 'a+');
                                                    fs.write(save, testID + ',' + apiVersion + ',' +  key + ',"--error--",' + key + ',"--error--",' + 'Fail,FAIL: Variable found ' + val + ',\n', 'a+');
                                                };
                                            } else {
                                                //TVE key check
                                                if(/* typeof val === 'undefined' || typeof val === null || val == "" ||*/ val.length <= 0) {
                                                    if (url.indexOf('necn.com') && key == 'tve_url' || url.indexOf('necn.com') && key == 'web-links_tve_url' || url.indexOf('telemundo') && key == 'tve_url' || url.indexOf('telemundo') && key == 'web-links_tve_url') {
                                                        
                                                        if (showOutput) {console.log(colorizer.colorize('TVE not requred for property', 'COMMENT'))};

                                                        if (!debugOutput) {
                                                            fs.write(save, ',\n' + 'TVE not requred for property. ', 'a+');
                                                            fs.write(save, testID + ',' + apiVersion + ',' +  key + ',"--//--",' + key + ',"--//--",' + 'Pass,TVE not requred for property ' + key + ',\n', 'a+');
                                                        };
                                                    } else if (url.indexOf('telemundo') && key == 'investigation-phone') {
                                                        if (showOutput) {console.log(colorizer.colorize('Investigations phone not set for TSG property.', 'COMMENT'))};
                                                        if (!debugOutput) {
                                                            fs.write(save, ',\n' + 'Investigations not requred for property. ', 'a+');
                                                            fs.write(save, testID + ',' + apiVersion + ',' +  key + ',"--//--",' + key + ',"--//--",' + 'Pass,Investigations phone not set for TSG property ' + key + ',\n', 'a+');
                                                        };
                                                    } else if (url.indexOf('telemundo') && key == 'investigation-email') {
                                                        if (showOutput) {console.log(colorizer.colorize('Investigations email not set for TSG property.', 'COMMENT'))};
                                                        if (!debugOutput) {
                                                            fs.write(save, ',\n' + 'Investigations not requred for property. ', 'a+');
                                                            fs.write(save, testID + ',' + apiVersion + ',' +  key + ',"--//--",' + key + ',"--//--",' + 'Pass,Investigations email not set for TSG property ' + key + ',\n', 'a+');
                                                        };
                                                    } else {
                                                        if (showOutput) {console.log(colorizer.colorize('FAIL:  API value missing for: ' + reqKeys[i], 'ERROR'))};
                                                        if (!debugOutput) {
                                                            fs.write(save, testID + ',' + apiVersion + ',' +  reqKeys[i] + ',"--missing--",' + reqKeys[i] + ',"--missing--",' + 'Fail,FAIL:  API value missing for: ' + reqKeys[i] + ',\n', 'a+');
                                                        };
                                                    }
                                                } else {
                                                    // console.log(colorizer.colorize('PASS: ', 'INFO') + key + ' : ' + val);

                                                    for (var __key in dictionaryObject) {

                                                        if (__key === key) {
                                                            if (debugOutput) {
                                                                console.log(colorizer.colorize('- Key found: ', 'INFO') + key);
                                                                console.log(dictionaryObject[__key] + ' > ' + key);
                                                            }
                                                            if (!debugOutput) {
                                                                if (val === dictionaryObject[__key]) {
                                                                    if (showOutput) {console.log(colorizer.colorize('PASS: ', 'INFO') + key + ' : ' + val)};

                                                                    // Write results to log
                                                                    // Test ID,API Version,Expected Key,Expected Value,Live Key,Live Value,Pass/Fail,Info
                                                                    fs.write(save, testID + ',"' + apiVersion + '","' + __key + '","' + dictionaryObject[__key] + '","' + key + '","' + val + '",' + 'Pass, ,' + '\n', 'a+');

                                                                } else {
                                                                    if (showOutput) {console.log(colorizer.colorize('FAIL: ' + key + ' value does not match manifest', 'ERROR') + colorizer.colorize(' dictionary val: ', 'PARAMETER') + dictionaryObject[__key] + ' : ' + colorizer.colorize('manifest val: ', 'PARAMETER') + val)};

                                                                    // Write results to log
                                                                    // Test ID,API Version,Expected Key,Expected Value,Live Key,Live Value,Pass/Fail,Info
                                                                    fs.write(save, testID + ',' + apiVersion + ',' +  __key + ',"' + dictionaryObject[__key] + '",' + key + ',"' + val + '",' + 'Fail,FAIL: ' + key + ' value does not match manifest.,\n', 'a+');
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        if(createDictionary){
                            console.log('Dictionary csv created.');
                        }
                    }
                }

            } else {
                if (showOutput) {throw new Error('Missing XML elements!')};
            }
        });
    };

    new apiSuite(casper.cli.get('url'));
});
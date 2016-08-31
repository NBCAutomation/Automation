/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
// optional string params --output=debug to show logged key/val strings
// optional string params --output=console will show test results

// Dictionary files:
// - OTS Created 2/25/16

/*
* ==== Notes for future release - 3/15/16 === 
* - Download dictionary data from GSheets
* - Write log results to GSheets
* - Cron/NPM process to run concurrent tests
*/

// - TSG Pending..
// -http://collaborative-tools-project.blogspot.com/2012/05/getting-csv-data-into-google.html
//
// Casper 1.1.0-beta3 and Phantom 1.9.8
//


casper.test.begin('OTS SPIRE | API Manifest Audit', function suite(test) {

    var colorizer = require('colorizer').create('Colorizer');
    var logResults = true;

    var type = casper.cli.get('output');
        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'dictionary') {
            var createDictionary = true;
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
            // var saveLocation = fs.pathJoin(fs.workingDirectory, 'manifest_dictionary');
            var saveLocation = 'manifest_dictionary/';

            fs.makeDirectory(saveLocation, 775);
            var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);

        } else {
            var saveLocation = 'test_results/api_manifest_audits/' + curFolder;
            fs.makeDirectory(saveLocation, 775);
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
        url = url + '/apps/news-app/manifest/?apiVersion=4';

        // Start Test
        casper.start( url ).then(function(response) {
            if ( response.status == 200 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
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

            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {

        var suite = this;

        // require('utils').dump( current );
        var dbUrl = 'http://spire.app/utils/tasks?task=generate&testscript=apiCheck-manifest&property=' + stationProperty;

        if (dbUrl) {
            casper.open(dbUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
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
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(resultsFile) {
        var testResultFileLocation = encodeURIComponent(save);

        var suite = this;

        var processUrl = 'http://spire.app/utils/tasks?task=upload&testType=apiManifest&fileLoc=' + testResultFileLocation;

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
        var apiVersion = '3';

        // Required API keys for app to function correctly.
        var reqKeys = new Array(
            "domain",
            "market-site-key",
            "launch-image-name",
            "ugc-partition-id",
            "video-autoplay",
            "push-notification-url-key",
            "push-notification-flag-key",
            "comscore-app-name",
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
            "scaling-y",
            "advertising_video_network-id",
            "advertising_video_direct-sold-target-width",
            "advertising_video_direct-sold-target-height",
            "advertising_video_backfill-target-width",
            "advertising_video_backfill-target-height",
            "advertising_video_backfill-app-id",
            "backfill-app-id",
            "phone3",
            "wsi-map-id",
            "wsi-market-default-layer",
            "weather-branding",
            "iteam-branding",
            "alerts",
            "ugctemplets",
            "breaking",
            "home",
            "home-investigation",
            "facebook-comments-script",
            "navigation",
            "settings-terms-of-use",
            "settings-terms-of-service",
            "settings-closed-captioning-faq",
            "submit-media",
            "trending",
            "weather-forcast-video",
            "weather-forcast-story",
            "weather-maps",
            "advertising-display",
            "advertising-video",
            "home-top-stories",
            "content",
            "gallery",
            "recommended",
            "related",
            "weather-conditions-icon",
            "weather-forcast",
            "weather-wsi-forcast",
            "weather-location-lookup",
            "title",
            "report-suite-ids",
            "tracking-server",
            "app-section-server-name",
            "page-view-event",
            "link-type",
            "station-division",
            "station-business-unit",
            "station-call-sign",
            "station-market",
            /*
            "force-update",
            "update-screen-title",
            "update-screen-desc",
            "update-screen-appUrl",
            "update-screen-appversion",
            */
            "ad-unit-level1",
            "fw_ssid",
            /*
            "adtest",
            */
            "stage",
            "article-interstitial",
            "gallery-interstitial",
            "default-iab-category-tier1",
            /*
            "default-iab-category-tier2",
            */
            "network-id",
            "enabled",
            "ad-unit-level2",
            "request-timeout",
            "display-duration",
            "target-width",
            "target-height",
            "scaling-x",
            "direct-sold-target-width",
            "direct-sold-target-height",
            "backfill-target-width",
            "backfill-target-height",
            "name",
            "address-line1",
            "address-line2",
            "phone",
            "contact-Info_phone1_contactInfoLabel",
            "contact-Info_phone1_contactInfoNumber",
            "contactInfoNumber",
            "contact-Info_phone2_contactInfoLabel",
            "contact-Info_phone2_contactInfoNumber",
            "contact-Info_phone3_contactInfoLabel",
            "contact-Info_phone3_contactInfoNumber",
            "investigation-phone",
            "investigation-email",
            "contactInfoLabel",
            "meteorologist-summary-disabled",
            "market-default-postal-code",
            "market-default-location-name",
            "market-default-dma",
            "market-default-lat",
            "market-default-long",
            "scroll-down-animation-hour",
            "scroll-down-animation-display-sec",
            "geo-location-prompt-visit-interval",
            /*
            "app-id",
            */
            "is-live-promotion",
            "promotion-type",
            "url-schema-ios",
            "app-link-ios",
            "url-schema-android",
            "app-link-android"
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
            /*
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

             */

            if ( rawContent ) {

                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(rawContent,'text/xml');

                var nodeDicts = xmlDoc.getElementsByTagName("dict");

                // console.log('nodes ' + nodeDicts.length);

                for(var i = 0; i < nodeDicts.length; i++) {
                    // console.log(i + ' || ' + nodeDicts[i].namespaceURI);

                    var currentNode = nodeDicts[i];
                    // var previousSiblingText = currentNode.previousSibling;
                    // console.log(' >>> <<< ' + previousSiblingText);

                    console.log(previousSiblingText);

                    if (currentNode.hasChildNodes) {
                        var children = currentNode.childNodes;

                        for(var b = 0; b < children.length; b++) {

                            if (children[b].nodeName == 'key') {

                                if (debugOutput) {console.log('key // ' + children[b].textContent)};
                                var parentKeyName = children[b].textContent;
                            }
                            
                            // console.log('sub-children ' + children[b].childNodes.length);

                            if (children[b].childNodes.length > 1) {
                                var subChildren = children[b].childNodes;

                                for(var c = 0; c < subChildren.length; c++) {

                                    if (subChildren[c].nodeName == 'dict') {

                                        if (debugOutput) {

                                            console.log('=== [dict] ===');
                                            console.log('\nDebug ======\n');
                                            console.log('** TopKey Name: ' + parentKeyName)
                                            console.log('nodeType >> ' + subChildren[c].nodeType);
                                            console.log('nodeName >> ' + subChildren[c].nodeName);
                                            console.log('textContent >> ' + JSON.stringify(subChildren[c].textContent));
                                            console.log('nodeValue >> ' + subChildren[c].nodeValue);
                                            console.log('\n/Debug ======');
                                        }

                                        var dictionaryItemName = parentKeyName + '_' + subChildren[c].previousElementSibling.textContent;
                                        if (debugOutput) {console.log('** Dict Name: ' + dictionaryItemName)};

                                        if (subChildren[c].childNodes.length > 1) {
                                            var thirdChildren = subChildren[c].childNodes;

                                            for(var d = 0; d < thirdChildren.length; d++) {
                                                if (debugOutput) {
                                                        console.log(' ---- third-child ' + thirdChildren[d].nodeName + ' // ' + ' -- content: ' + thirdChildren[d].textContent);
                                                              
                                                    if (thirdChildren[d].nodeName == 'dict') {
                                                        console.log(' ** Subprev ** ' + thirdChildren[d].previousElementSibling.textContent);
                                                    }
                                                }

                                                if (thirdChildren[d].nodeName == 'key') {

                                                    if (debugOutput) {
                                                        console.log('** Dict Name: ' + dictionaryItemName)
                                                        console.log("combinedKeyName = " + dictionaryItemName + '_' + thirdChildren[d].textContent);
                                                        console.log("currentKeyName = " + thirdChildren[d].textContent);
                                                        console.log("subKeyName = " + thirdChildren[d].textContent);
                                                    };

                                                    var combinedKeyName = dictionaryItemName + '_' + thirdChildren[d].textContent;
                                                    var currentKeyName = thirdChildren[d].textContent;
                                                    var subKeyName = thirdChildren[d].textContent;
                                                }
                                                
                                                if (thirdChildren[d].nodeName == 'string' || thirdChildren[d].nodeName == 'integer' || thirdChildren[d].nodeName == 'real') {
                                                    
                                                    // Push key/val into collection
                                                    var __subVal = thirdChildren[d].textContent;
                                                    collectionObject[combinedKeyName] = __subVal;

                                                    if (debugOutput) {console.log(combinedKeyName + ' : ' + __subVal)};

                                                } else if (thirdChildren[d].nodeName == 'false' || thirdChildren[d].nodeName == 'true') {
                                                    
                                                    // Push key/val into collection
                                                    var __subVal = thirdChildren[d].nodeName;
                                                    collectionObject[combinedKeyName] = __subVal;

                                                    if (debugOutput) {console.log(combinedKeyName + ' : ' + __subVal)};
                                                }
                                            }

                                            // Push key/val into collection
                                            collectionObject[subKeyName] = __subVal;

                                            if (debugOutput) {console.log(subKeyName + ' : ' + __subVal)};
                                        }
                                    } else if (subChildren[c].nodeName == 'string' || subChildren[c].nodeName == 'integer' || subChildren[c].nodeName == 'real') {
                                        if (debugOutput) {
                                            // console.log('        not a dictionary');
                                            // console.log('        nodeName ' + subChildren[c].nodeName);
                                        }
                                    } else {
                                        if (debugOutput) {
                                            // console.log('        not a dictionary');
                                            // console.log('        textContent >> ' + JSON.stringify(subChildren[c].textContent));
                                        }
                                    }
                                }
                            } else if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real' || children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                if (debugOutput) {console.log(' -- val // ' + children[b].textContent)};
                                
                                if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real') {
                                    // Push key/val into collection
                                    var __topVal = children[b].textContent;

                                    collectionObject[parentKeyName] = __topVal;

                                    if (debugOutput) {console.log(parentKeyName + ' : ' + __topVal)};

                                    
                                } else if (children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                    var __topVal = children[b].nodeName;
                                    
                                    collectionObject[parentKeyName] = __topVal;

                                    if (debugOutput) {console.log(parentKeyName + ' : ' + __topVal)};

                                }
                            }
                        }
                    }
                }

                // console.log(JSON.stringify(collectionObject));

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

                    var dictionaryData = fs.read(dictionaryFile);

                    rows = dictionaryData.split("\n");
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
                                                    if (url.indexOf('necn.com') && key == 'tve_url' || url.indexOf('telemundo') && key == 'tve_url') {
                                                        if (showOutput) {console.log(colorizer.colorize('TVE not requred for property', 'COMMENT'))};
                                                        if (!debugOutput) {
                                                            fs.write(save, ',\n' + 'TVE not requred for property. ', 'a+');
                                                            fs.write(save, testID + ',' + apiVersion + ',' +  key + ',"--//--",' + key + ',"--//--",' + 'Pass,TVE not requred for property ' + key + ',\n', 'a+');
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

                                if(createDictionary){
                                    console.log('Dictionary csv created.');
                                }

                            }
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
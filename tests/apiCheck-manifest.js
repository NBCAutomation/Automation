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
    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        var suite = this;
        var no_error = false;
        var type = casper.cli.get('output');
        var colorizer = require('colorizer').create('Colorizer');

        // Add manifest url    
        url = url + '/apps/news-app/manifest/?apiVersion=3';

        // Start Test
        casper.start( url ).then(function(response) {

            if ( response.status == 200 ) {
                no_error = true;
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function() {
            console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );

            suite.getContent(url, type);

        }).run(function() {
            console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
            this.exit();
        });
    };

    apiSuite.prototype.getContent = function(url, type) {
        
        var suite = this;

        var colorizer = require('colorizer').create('Colorizer');

        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'dictionary') {
            var createDictionary = true;
        } else if (type === 'console') {
            var showOutput = true;
        }

        if (!debugOutput) {
            var currentTime = new Date();
            var timeStamp = currentTime.toISOString();

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

            var parser = document.createElement('a');
            parser.href = url;

            newUrl = parser.href;
            var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
            var urlUri = sourceString.replace('.','_');

            var fs = require('fs');
            var logName = urlUri + '_manifest-audit_' + timeStamp + '.csv';
            
            var curFolder = month + '_' + day + '_' + year;
            
            if(createDictionary){
                var save = fs.pathJoin(fs.workingDirectory, 'manifest_dictionary', logName);
            } else {
                var saveLocation = 'test_results/api_manifest_audits/' + curFolder;
                fs.makeDirectory(saveLocation, 775);
                var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);
            }
        }



        // Required API keys for app to function correctly.
        var reqKeys = new Array("domain","launch-image-name","ugc-partition-id","video-autoplay","push-notification-url-key","push-notification-flag-key","comscore-app-name","navigation","settings-terms-of-use","settings-terms-of-service","settings-closed-captioning-faq","submit-media","trending","weather-forcast-video","weather-forcast-story","weather-maps","content","gallery","weather-conditions-icon","weather-wsi-forcast",/*"facebook_url","instagram_url","twitter_url",*/"search_title","send-feedback_url","traffic_url","settings-privacy-policy_title","settings-privacy-policy_url","tv-listings_title","tv-listings_url","tve_url","weather-alerts_url","weather-school-closings_url","report-suite-ids","ad-unit-level1","fw_ssid","network-id","echo-transition-delay","splash_enabled","splash_ad-unit-level2","splash_request-timeout","splash_display-duration","splash_target-width","splash_target-height","article-interstitial","gallery-interstitial","backfill-target-width","backfill-target-height","backfill-app-id");

        var gdocSheetkeys = {nbcnewyork:"1237123522",nbclosangeles:"760525331",nbcchicago:"1368539190",nbcbayarea:"382654776",nbcdfw:"837130684",nbcmiami:"206819603",nbcphiladelphia:"1647241295",nbcconnecticut:"1053499483",nbcwashington:"52580851",nbcsandiego:"196020938",nbcboston:"1408094619",necn:"140276335",telemundo40:"618666866",telemundo47:"1440310357",telemundo51:"1586194994",telemundo52:"1528595265",telemundo62:"955449852",telemundoareadelabahia:"1873969221",telemundoarizona:"840179992",telemundoboston:"2081694699",telemundochicago:"803813981",telemundodallas:"1261394201",telemundodenver:"51923675",telemundohouston:"153235565",telemundolasvegas:"248723970",telemundosanantonio:"1675506119",telemundopr:"1689340443"}
        
        __collected = {};
        __dictionary = {};
            
        if (!debugOutput) {
            // Write file headers
            var testInfo = 'Manifest url tested: ' + url;
            var testTime = 'Test completed: ' + month + '/' + day + '/' + year + ' - ' +hours + ':' + minutes + ' ' + toD;
            
            if(createDictionary){
                fs.write(save, 'Expected Key,Expected Value', 'a+');
            } else {
                fs.write(save, ' ' + testInfo + ',\n' + ',\n');
                fs.write(save, ' ' + testTime + ',\n' + ',\n', 'a+');
                fs.write(save, 'Expected Key,Expected Value,Tested Key,Tested Value,Pass/Fail', 'a+');
            }
        }

        casper.open(url, { method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function() {
            var rawContent = this.getHTML();
            
            if (debugOutput) {console.log(rawContent)};

            if ( rawContent ) {

                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(rawContent,'text/xml');

                // var __json = JSON.stringify( rawContent );

                // var urlObject = JSON.parse(__json);

                var nodeDicts = xmlDoc.getElementsByTagName("dict");

                // console.log('nodes ' + nodeDicts.length);

                for(var i = 0; i < nodeDicts.length; i++) {
                    // console.log(i + ' || ' + nodeDicts[i].nodeName);

                    var cNode = nodeDicts[i];

                    if (cNode.hasChildNodes) {
                        var children = cNode.childNodes;

                        for(var b = 0; b < children.length; b++) {

                            if (children[b].nodeName == 'key') {

                                if (debugOutput) {console.log('key // ' + children[b].textContent)};
                                var __topKey = children[b].textContent;
                            }
                            
                            // console.log('sub-children ' + children[b].childNodes.length);

                            if (children[b].childNodes.length > 1) {
                                var subChildren = children[b].childNodes;

                                for(var c = 0; c < subChildren.length; c++) {

                                    if (subChildren[c].nodeName == 'dict') {

                                        if (debugOutput) {console.log('=== [dict] ===')};

                                        var dictName = subChildren[c].previousElementSibling.textContent;
                                        if (debugOutput) {console.log('** Dict Name: ' + dictName)};

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

                                                    if (debugOutput) {console.log('** Dict Name: ' + dictName)};

                                                    var __keyName = dictName + '_' + thirdChildren[d].textContent;
                                                    var __subKey = thirdChildren[d].textContent;
                                                }
                                                
                                                if (thirdChildren[d].nodeName == 'string' || thirdChildren[d].nodeName == 'integer' || thirdChildren[d].nodeName == 'real') {
                                                    
                                                    // Push key/val into collection
                                                    var __subVal = thirdChildren[d].textContent;
                                                    __collected[__keyName] = __subVal;

                                                    if (debugOutput) {console.log(__keyName + ' : ' + __subVal)};

                                                } else if (thirdChildren[d].nodeName == 'false' || thirdChildren[d].nodeName == 'true') {
                                                    
                                                    // Push key/val into collection
                                                    var __subVal = thirdChildren[d].nodeName;
                                                    __collected[__keyName] = __subVal;

                                                    if (debugOutput) {console.log(__keyName + ' : ' + __subVal)};
                                                }
                                            }

                                            // Push key/val into collection
                                            __collected[__subKey] = __subVal;

                                            if (debugOutput) {console.log(__subKey + ' : ' + __subVal)};
                                        }
                                    }
                                }
                            } else if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real' || children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                if (debugOutput) {console.log(' -- val // ' + children[b].textContent)};
                                
                                if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real') {
                                    // Push key/val into collection
                                    var __topVal = children[b].textContent;

                                    __collected[__topKey] = __topVal;

                                    if (debugOutput) {console.log(__topKey + ' : ' + __topVal)};

                                    
                                } else if (children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                    var __topVal = children[b].nodeName;
                                    
                                    __collected[__topKey] = __topVal;

                                    if (debugOutput) {console.log(__topKey + ' : ' + __topVal)};

                                }
                            }
                        }
                    }
                }
                if (debugOutput) {                                                                               
                    console.log(__topKey + ' : ' + __topVal)
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
                    var dictionaryFile = fs.workingDirectory + '/manifest_dictionary/' + urlUri + '_dictionary.csv';
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

                        __dictionary[__dictKey] = __dictVal;
                    }
                    
                    // throw new Error('quit');
                    
                    //Begin manifest key/val check
                    reqKeys.reverse();

                    for (var i = reqKeys.length - 1; i >= 0; i--) {
                       var __colData = reqKeys[i];
                       
                       for (var key in __colData) {
                           // console.log('key = ' + __colData[key]);
                       }

                       if (!(reqKeys[i] in __collected)) {
                           // throw new Error('Missing required API key! ' + reqKeys[i]);
                           if (showOutput) {console.log(colorizer.colorize('FAIL: Missing required API key! ' + reqKeys[i], 'ERROR'))};
                           if (!debugOutput) {fs.write(save, ',\n' + 'FAIL: Missing required API key! ' + reqKeys[i], 'a+');};
                       } else {
                            // console.log('found key:' + reqKeys[i]);
                            for (var key in __collected) {

                                var val = __collected[key];

                                if ( reqKeys.indexOf(key) > -1 ) {
                                    if (reqKeys[i] == key) {
                                        if(createDictionary){
                                            fs.write(save, ',\n' + key + ',' + '"' + val + '"', 'a+');
                                        } else {
                                            if (val.indexOf('$') >= 0 ) {
                                                if (showOutput) {console.log(colorizer.colorize('FAIL: Variable found "' + val + '" in output for ' + key, 'ERROR'))};
                                                if (!debugOutput) {fs.write(save, ',\n' + 'FAIL: Variable found "' + val + '" in output for ' + key, 'a+');};
                                            } else {
                                                //TVE key check
                                                if(/* typeof val === 'undefined' || typeof val === null || val == "" ||*/ val.length <= 0) {
                                                    if (url.indexOf('necn.com') && key == 'tve_url' || url.indexOf('telemundo') && key == 'tve_url') {
                                                        if (showOutput) {console.log(colorizer.colorize('TVE not requred for property', 'COMMENT'))};
                                                        if (!debugOutput) {fs.write(save, ',\n' + 'TVE not requred for property. ', 'a+');};
                                                    } else {
                                                        if (showOutput) {console.log(colorizer.colorize('FAIL:  API value missing for: ' + reqKeys[i], 'ERROR'))};
                                                        if (!debugOutput) {fs.write(save, ',\n' + 'FAIL:  API value missing for: ' + reqKeys[i], 'a+');};
                                                    }
                                                } else {
                                                    // console.log(colorizer.colorize('PASS: ', 'INFO') + key + ' : ' + val);

                                                    for (var __key in __dictionary) {

                                                        if (__key === key) {
                                                            if (debugOutput) {
                                                                console.log(colorizer.colorize('- Key found: ', 'INFO') + key);
                                                                console.log(__dictionary[__key] + ' > ' + key);
                                                            }
                                                            if (!debugOutput) {
                                                                if (val === __dictionary[__key]) {
                                                                    if (showOutput) {console.log(colorizer.colorize('PASS: ', 'INFO') + key + ' : ' + val)};

                                                                    //Write results to log
                                                                    fs.write(save, ',\n' + __key + ',"' + __dictionary[__key] + '",' + key + ',"' + val + '",' + 'Pass', 'a+');

                                                                } else {
                                                                    if (showOutput) {console.log(colorizer.colorize('FAIL: ' + key + ' value does not match manifest', 'ERROR') + colorizer.colorize(' dictionary val: ', 'PARAMETER') + __dictionary[__key] + ' : ' + colorizer.colorize('manifest val: ', 'PARAMETER') + val)};

                                                                    //Write results to log
                                                                    fs.write(save, ',\n' + __key + ',"' + __dictionary[__key] + '",' + key + ',"' + val + '",' + 'Fail', 'a+');
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
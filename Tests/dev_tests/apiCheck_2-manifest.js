/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version:
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
// optional string params --type=debug to show logged key/val strings

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

    var suite = this;
    var no_error = false;
    var type = casper.cli.get('type');

    // Add manifest url    
    url = url + '/apps/news-app/manifest/?apiVersion=2';
    

    casper.start( url ).then(function(response) {
        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
        }
    }).then(function() {
        suite.getContent(url, type);
        // require('utils').dump(jsonText);
    }).run();
};

apiSuite.prototype.getContent = function(url, type) {
    
    var suite = this;

    var colorizer = require('colorizer').create('Colorizer');

    // Required API keys for app to function correctly.
    var reqKeys = new Array("domain","launch-image-name","ugc-partition-id","video-autoplay","push-notification-url-key","push-notification-flag-key","comscore-app-name","navigation","settings-terms-of-use","settings-terms-of-service","settings-closed-captioning-faq","submit-media","trending","weather-forcast-video","weather-forcast-story","weather-maps","content","gallery","weather-conditions-icon","weather-wsi-forcast",/*"facebook_url","instagram_url","twitter_url",*/"search_title","send-feedback_url","traffic_url","settings-privacy-policy_title","settings-privacy-policy_url","tv-listings_title","tv-listings_url","tve_url","weather-alerts_url","weather-school-closings_url","report-suite-ids","ad-unit-level1","fw_ssid","network-id","echo-transition-delay","splash_enabled","splash_ad-unit-level2","splash_request-timeout","splash_display-duration","splash_target-width","splash_target-height","article-interstitial","gallery-interstitial","backfill-target-width","backfill-target-height","backfill-app-id");
    
    __collected = {};

    if (type === 'debug') {
        var showOutput = true;
    }

    casper.test.begin('OTS API Check', function suite(test) {
        casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
            var rawContent = this.getPageContent();

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

                                if (showOutput) {console.log('key // ' + children[b].textContent)};
                                var __topKey = children[b].textContent;
                            }
                            
                            // console.log('sub-children ' + children[b].childNodes.length);

                            if (children[b].childNodes.length > 1) {
                                var subChildren = children[b].childNodes;

                                for(var c = 0; c < subChildren.length; c++) {

                                    if (subChildren[c].nodeName == 'dict') {

                                        if (showOutput) {console.log('=== [dict] ===')};

                                        var dictName = subChildren[c].previousElementSibling.textContent;
                                        if (showOutput) {console.log('** Dict Name: ' + dictName)};

                                        if (subChildren[c].childNodes.length > 1) {
                                            var thirdChildren = subChildren[c].childNodes;

                                            for(var d = 0; d < thirdChildren.length; d++) {
                                                if (showOutput) {
                                                        console.log(' ---- third-child ' + thirdChildren[d].nodeName + ' // ' + ' -- content: ' + thirdChildren[d].textContent);
                                                              
                                                    if (thirdChildren[d].nodeName == 'dict') {
                                                        console.log(' ** Subprev ** ' + thirdChildren[d].previousElementSibling.textContent);
                                                    }
                                                }

                                                if (thirdChildren[d].nodeName == 'key') {

                                                    if (showOutput) {console.log('** Dict Name: ' + dictName)};

                                                    var __keyName = dictName + '_' + thirdChildren[d].textContent;
                                                    var __subKey = thirdChildren[d].textContent;
                                                }
                                                
                                                if (thirdChildren[d].nodeName == 'string' || thirdChildren[d].nodeName == 'integer' || thirdChildren[d].nodeName == 'real') {
                                                    
                                                    // Push key/val into collection
                                                    var __subVal = thirdChildren[d].textContent;
                                                    __collected[__keyName] = __subVal;

                                                    if (showOutput) {console.log(__keyName + ' : ' + __subVal)};

                                                } else if (thirdChildren[d].nodeName == 'false' || thirdChildren[d].nodeName == 'true') {
                                                    
                                                    // Push key/val into collection
                                                    var __subVal = thirdChildren[d].nodeName;
                                                    __collected[__keyName] = __subVal;

                                                    if (showOutput) {console.log(__keyName + ' : ' + __subVal)};
                                                }
                                            }

                                            // Push key/val into collection
                                            __collected[__subKey] = __subVal;

                                            if (showOutput) {console.log(__subKey + ' : ' + __subVal)};
                                        }
                                    }
                                }
                            } else if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real' || children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                if (showOutput) {console.log(' -- val // ' + children[b].textContent)};
                                
                                if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real') {
                                    // Push key/val into collection
                                    var __topVal = children[b].textContent;

                                    __collected[__topKey] = __topVal;

                                    if (showOutput) {console.log(__topKey + ' : ' + __topVal)};

                                    
                                } else if (children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                    var __topVal = children[b].nodeName;
                                    
                                    __collected[__topKey] = __topVal;

                                    if (showOutput) {console.log(__topKey + ' : ' + __topVal)};

                                }
                            }
                        }
                    }
                }
                if (showOutput) {
                    console.log(__topKey + ' : ' + __topVal)
                    casper.echo( 'Testing surpressed due to debug.', 'PARAMETER' );
                } else {
                    reqKeys.reverse();

                    for (var i = reqKeys.length - 1; i >= 0; i--) {
                       var __colData = reqKeys[i];
                       
                       for (var key in __colData) {
                           // console.log('key = ' + __colData[key]);
                       }

                       if (!(reqKeys[i] in __collected)) {
                           // throw new Error('Missing required API key! ' + reqKeys[i]);
                           console.log(colorizer.colorize('FAIL: Missing required API key! ' + reqKeys[i], 'ERROR'));
                       } else {
                            // console.log('found key:' + reqKeys[i]);
                            for (var key in __collected) {

                                var val = __collected[key];

                                if ( reqKeys.indexOf(key) > -1 ) {
                                    if (reqKeys[i] == key) {
                                        if (val.indexOf('$') >= 0 ) {
                                            console.log(colorizer.colorize('FAIL: Variable found "' + val + '" in output for ' + key, 'ERROR'));
                                        } else {
                                            if(typeof val === 'undefined' || typeof val === null || val == "" || val.length <= 0) {    
                                                console.log(colorizer.colorize('FAIL:  API value missing for: ' + reqKeys[i], 'ERROR'));
                                            } else {
                                                console.log(colorizer.colorize('PASS: ', 'INFO') + key + ' : ' + val);
                                            }
                                        }
                                    }
                                }

                            }
                       }
                   } 
                }

            } else {
                throw new Error('Missing XML elements!');
            }
        })
    });
};

new apiSuite(casper.cli.get('url'));
/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Grab the main app navigation url from the manifest, then test each link for correct response, if response, then validate JSON.
// Use: casperjs test [file_name] --url=[url]
// optional string params --output=debug to show logged key/val strings
// optional string params --output=console will show test results

casper.test.begin('OTS SPIRE | API Article/Content Audit', function suite(test) {
    // Global Vars
    var xmlLib = require('./xml2json');
    var x2js = new xmlLib();

    var debugOutput = false;
    var logResults = true;

    var type = casper.cli.get('output');
        if (type === 'debug') {
            var debugOutput = true;
        } else if (type === 'console') {
            var showOutput = true;
        }

    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

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
    var logName = urlUri + '_article-audit_' + timeStamp + '.csv';

    var curFolder = month + '_' + day + '_' + year;

    var saveLocation = 'test_results/api_article_audits/' + curFolder;
    fs.makeDirectory(saveLocation, 775);
    var save = fs.pathJoin(fs.workingDirectory, saveLocation, logName);

    // Write file headers
    // var testTime = 'Test completed: ' + month + '/' + day + '/' + year + ' - ' +hours + ':' + minutes + ' ' + toD;
    
    // fs.write(save, ' ' + testTime + ',\n' + '\n', 'a+');
    fs.write(save, 'Test ID,Endpoint,Content ID,Content Title,Error,Status' + '\n', 'a+');

    var colorizer = require('colorizer').create('Colorizer');


    // Testing Suite Functions
    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        this.__collected = {};

        var suite = this;
        var no_error = false;

        // var type = casper.cli.get('type');

        var parser = document.createElement('a');
        parser.href = url;

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');
        
        url = url + '/apps/news-app/manifest/?apiVersion=3';

        casper.start( url ).then(function(response) {
            // console.log(response);
            if ( response.status == 200 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                suite.createTestID(url, type, urlUri);
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).run(function() {
            //Process file to DB
            if (logResults) {
                suite.processTestResults(save);
            }

            console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {

        var suite = this;

        // require('utils').dump( current );
        var dbUrl = 'http://spire.app/utils/tasks?task=generate&testscript=apiCheck-article&property=' + stationProperty;

        if (dbUrl) {
            // casper.start( 'dbUrl' ).then(function(response) {
                casper.open(dbUrl,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                    
                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        var __dbID = casper.getElementInfo('body').text;

                        suite.getContent(url, type, __dbID);

                        // console.log('derp = '+__dbID);
                        // return __dbID;
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                    
                });
            // });
        }
        // } else {
        //     // delete this.__collected;
        // }
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(resultsFile) {
        var testResultFileLocation = encodeURIComponent(save);

        var suite = this;
        var processUrl = 'http://spire.app/utils/tasks?task=upload&testType=apiArticle&fileLoc=' + testResultFileLocation;

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

        // casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
        casper.open(url,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function() {            
            var rawContent = this.getHTML();
            
            if ( rawContent ) {

                var __jsonObj = x2js.xml_str2json( rawContent );
                
                // var __baseKeys = __jsonObj.plist.dict.key;
                // var __baseVals = __jsonObj.plist.dict.string;
                var __moduleKeys = __jsonObj.plist.dict.dict[0].key;
                var __moduleVals = __jsonObj.plist.dict.dict[0].string;

                // initialize iterator
                var i;

                for (i = __moduleKeys.length - 1; i >= 0; i--) {
                    var key = __moduleKeys[i];
                    var url = __moduleVals[i].toString();

                    if ( ! url.indexOf('/apps') ) {
                        url = casper.cli.get('url') + url + '?apiVersion=3';
                  
                        suite.__collected[key] = url;
                    }
                }

                var __urlSuite = suite.__collected;

                for (var __prog in __urlSuite) {
                    if (__prog === 'navigation') {
                        if (debugOutput) {console.log(__prog + ' :: ' + __urlSuite[__prog])};

                        suite.checkNavigation(url, __urlSuite[__prog], testID);
                    }
                }

            } else {
                throw new Error('Missing XML elements!');
            }
        });
    };

    apiSuite.prototype.checkNavigation = function(url, __url, testID) {

        var suite = this;

        if (__url) {
            casper.open(__url,{ method: 'get', headers: { 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                var status = this.status().currentHTTPStatus;
                if ( status == 200) {
                    if (showOutput) {console.log(__url + colorizer.colorize(' Status: ' + status, 'INFO') )};

                    suite.spiderObjects(url, __url, 'default', 'manifest', testID);
                }

            });
        }
    };


    apiSuite.prototype.spiderObjects = function(url, __url, type, apitest, testID) {    
        var suite = this;
        var __baseUrl = casper.cli.get('url');
        var reqKeys = new Array("appTitle","sectionMapping","location");
        var articleKeys = new Array("contentID","title","byline","summary","displayDate","updatedMessage","shareURL","typeName","fullsizeImageURL","thumbnailImageURL","fullsizeLeadImageURL","leadImageURL","contentBody","extID");

        if (apitest === 'manifest' ) {
            var manifestTest = true;
        } else if (apitest === 'article' ) {
            var articleTest = true;
        }

        __contentSections = {};
        
        if (__url) {
            casper.thenOpen(__url, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }, function(resp) {
                
                var status = this.status().currentHTTPStatus;

                var validated = false;
                var output = this.getPageContent();

                var count = 0;
                var _count = 0;
                var setFail = 0;


                try {
                    // __output = JSON.parse(output);
                    verifyThisOutput = JSON.parse(output);

                    if( verifyThisOutput instanceof Object ) {

                        __output = JSON.parse(output);

                        var mainItem = __output.items;

                        if (manifestTest) {                
                            for (var __item in mainItem) {
                                
                                if(mainItem.hasOwnProperty(__item)){
                                    count++;
                                }

                                var __thisItem = __output.items[count];

                                for (var __i in __thisItem) {
                                    if (debugOutput) {console.log(__i + ' : ' + __thisItem[__i])};
                                    
                                    if (articleTest) {
                                        // console.log(__thisItem[__i]);
                                    }

                                    
                                    if (reqKeys.indexOf(__i) > -1) {

                                        if (__thisItem.length <= 0) {
                                            throw new Error('key blank ' + __i);
                                        } else {

                                            if (__i === 'appTitle') {
                                                var __keyName = __thisItem[__i];
                                            }

                                            if (__i === 'location') {
                                                
                                                if (debugOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                                                if (__thisItem[__i].indexOf('/apps') > -1) {

                                                    if (__thisItem[__i].indexOf('?') > -1) {
                                                        var __keyUrl = __baseUrl + __thisItem[__i] + '&apiVersion=3'
                                                    } else {
                                                        var __keyUrl = __baseUrl + __thisItem[__i] + '?apiVersion=3'
                                                    }
                                                    
                                                    if (debugOutput) {console.log(__keyUrl)};
                                                }

                                                // Set collections array
                                                if (manifestTest) {
                                                    if (!(__keyName in __contentSections)){
                                                        __contentSections[__keyName] = __keyUrl;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // -------------------------------------

                                    if (__i === 'items' && typeof __thisItem[__i] === 'object') {

                                        var __parent = __output.items[count].title;

                                        if (debugOutput) {
                                            console.log('-----------------');
                                            console.log(__parent + ' sub links');
                                        }
                                        
                                        var __subItem = __output.items[count].items;

                                        var __count = 0;

                                        for (var __item in __subItem) {
                                            
                                            if(__subItem.hasOwnProperty(__item)){
                                                __count++;

                                                __offset = (__count - 1);
                                                // console.log(__offset);
                                            }

                                            var __lastItem = __output.items[count].items[__offset];

                                            for (var __b in __lastItem) {
                                                if (debugOutput) {console.log(' -  ' + __b + ' : ' + __lastItem[__b])};

                                                if (reqKeys.indexOf(__b) > -1) {
                                                    // console.log(' -  ' + __b + ' : ' + __lastItem[__b]);
                                                    
                                                    if (__b === 'appTitle') {
                                                        var __lastKeyName = __lastItem[__b];
                                                    }

                                                    if (__b === 'location') {
                                                        
                                                        if (debugOutput) {console.log(__b + ' : ' + __lastItem[__b])};

                                                        if (__lastItem[__b].indexOf('/apps') > -1) {

                                                            if (__lastItem[__b].indexOf('?') > -1) {
                                                                var __lastKeyUrl = __baseUrl + __lastItem[__b] + '&apiVersion=3'
                                                            } else {
                                                                var __lastKeyUrl = __baseUrl + __lastItem[__b] + '?apiVersion=3'
                                                            }
                                                            
                                                            if (debugOutput) {console.log('>> ' + __lastKeyUrl)};
                                                        }

                                                        // Set collections array
                                                        if (manifestTest) {
                                                            if (!(__lastKeyName in __contentSections)){
                                                                // console.log(' - '+__lastKeyName);
                                                                __contentSections[__lastKeyName] = __lastKeyUrl;
                                                            }
                                                        }
                                                    }
                                                }

                                            }
                                            if (debugOutput) { console.log('    -----------------')};
                                        }
                                    }
                                }

                                if (debugOutput) {console.log('-----------------')};
                            }
                        }
                     }
                } catch (e) {
                    // ...
                    if (showOutput) {console.log(e)};
                }
                    

                if (manifestTest) {
                    // console.log('__contentSections -> ',JSON.stringify(__contentSections));
                    suite.grabArticles(__contentSections, testID);
                }


                if (articleTest) {
                    
                    var mainItemArticles = __output.modules;

                    for (var __itemThis in mainItemArticles) {
                        if (showOutput) {
                            console.log('-----------------');
                            console.log(' Test ID: ' + testID + '\n Testing endpoint: ' + __url);
                            console.log(' -------');
                        }

                        if (debugOutput) {
                            console.log('-----------------');
                            console.log('> Endpoint', __url);
                            console.log('-----------------');
                        }

                        // console.log('== '+__itemThis.items);
                        var __thisShit = mainItemArticles[__itemThis];

                        for (var __iK in __thisShit) {

                            if (__iK === 'items' && typeof __thisShit[__iK] === 'object') {
                                
                                var __innerItems = __thisShit[__iK];

                                var __subCount = 0;

                                for (var __items in __innerItems) {

                                    if (typeof __innerItems[__items] === 'object') {

                                        var articleContentID = __innerItems[__items].contentID;
                                        var articleTitle = __innerItems[__items].title;
                                        var articleByline = __innerItems[__items].byline;
                                        var articleSummary = __innerItems[__items].summary;
                                        var articleDisplayDate = __innerItems[__items].displayDate;
                                        var articleUpdatedMessage = __innerItems[__items].updatedMessage;
                                        var articleShareURL = __innerItems[__items].shareURL;
                                        var articleTypeName = __innerItems[__items].typeName;
                                        var articleFullsizeImageURL = __innerItems[__items].fullsizeImageURL;
                                        var articleThumbnailImageURL = __innerItems[__items].thumbnailImageURL;
                                        var articleFullsizeLeadImageURL = __innerItems[__items].fullsizeLeadImageURL;
                                        var articleLeadImageURL = __innerItems[__items].leadImageURL;
                                        var articleFeature = __innerItems[__items].feature;
                                        var articleSponsored = __innerItems[__items].sponsored;
                                        var articleLiveVideoEmbed = __innerItems[__items].liveVideoEmbed;
                                        var articleLiveAppVideoEmbed = __innerItems[__items].liveAppVideoEmbed;
                                        var articleContentBody = __innerItems[__items].contentBody;
                                        var articleLeadMedia = __innerItems[__items].leadMedia;
                                        
                                        if (debugOutput) {
                                            console.log('  -----------------');
                                            console.log('  >> article_contentID  : ' + __innerItems[__items].contentID);
                                            console.log('  >> article_title  : ' + __innerItems[__items].title);
                                            console.log('  >> article_byline  : ' + __innerItems[__items].byline);
                                            // console.log('  >> article_summary  : ' + __innerItems[__items].summary);
                                            console.log('  >> article_displayDate  : ' + __innerItems[__items].displayDate);
                                            console.log('  >> article_updatedMessage  : ' + __innerItems[__items].updatedMessage);
                                            console.log('  >> article_shareURL  : ' + __innerItems[__items].shareURL);
                                            console.log('  >> article_typeName  : ' + __innerItems[__items].typeName);
                                            console.log('  >> article_fullsizeImageURL  : ' + __innerItems[__items].fullsizeImageURL);
                                            console.log('  >> article_thumbnailImageURL  : ' + __innerItems[__items].thumbnailImageURL);
                                            console.log('  >> article_fullsizeLeadImageURL  : ' + __innerItems[__items].fullsizeLeadImageURL);
                                            console.log('  >> article_leadImageURL  : ' + __innerItems[__items].leadImageURL);
                                            console.log('  >> article_feature  : ' + __innerItems[__items].feature);
                                            console.log('  >> article_sponsored  : ' + __innerItems[__items].sponsored);
                                            console.log('  >> article_liveVideoEmbed  : ' + __innerItems[__items].liveVideoEmbed);
                                            console.log('  >> article_liveAppVideoEmbed  : ' + __innerItems[__items].liveAppVideoEmbed);
                                            // console.log('  >> article_contentBody  : ' + __innerItems[__items].contentBody);
                                            console.log('  >> article_leadMedia  : ' + __innerItems[__items].leadMedia);
                                        }

                                        // if (__innerItems[__items].typeName == 'Gallery') {
                                        //     console.log('    ------------------ ');
                                        //     console.log('     Gallery\n');
                                        //     console.log('      >  Gallery items = ' + __baseUrl + '/apps/news-app/content/gallery/?contentId=');
                                        // }

                                        if (__innerItems[__items].fullsizeImageURL.indexOf('0*false') > -1) {
                                            console.log(colorizer.colorize('FAIL: Image url invalid for fullsizeImageURL: ' + __innerItems[__items].fullsizeImageURL + '.', 'ERROR'));
                                        }

                                        if (__innerItems[__items].thumbnailImageURL.indexOf('0*false') > -1) {
                                            console.log(colorizer.colorize('FAIL: Image url invalid for thumbnailImageURL: ' + __innerItems[__items].thumbnailImageURL + '.', 'ERROR'));
                                        }
                                        
                                        // Check for the Feature flag
                                        if (__innerItems[__items].feature === true) {
                                            
                                            if (__innerItems[__items].featureName.length <= 0) {
                                                setFail++;

                                                var __curError = 'Feature flag set to TRUE but featureName empty.';

                                                console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + __innerItems[__items].contentID + ', but featureName empty.', 'ERROR'));

                                                fs.write(save, '"' + testID + '","' + __url + '","' + __innerItems[__items].contentID + '","' + __innerItems[__items].title + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';

                                            } else if (__innerItems[__items].featureId.length <= 0) {
                                                setFail++;

                                                var __curError = 'Feature flag set to TRUE but featureId empty.';
                                                
                                                console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + __innerItems[__items].contentID + ', but featureId empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + __innerItems[__items].contentID + '","' + __innerItems[__items].title + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';
                                            }
                                        }

                                        // Check for the Sponsor flag
                                        if (__innerItems[__items].sponsored === true) {
                                            
                                            if (__innerItems[__items].sponsorName.length <= 0) {
                                                setFail++;
                                                
                                                var __curError = 'Sponsored flag set to TRUE but sponsorName empty.';

                                                console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + __innerItems[__items].contentID + ', but sponsorName empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + __innerItems[__items].contentID + '","' + __innerItems[__items].title + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';


                                            } else if (__innerItems[__items].sponsorID.length <= 0) {
                                                setFail++;
                                                
                                                var __curError = 'Sponsored flag set to TRUE but sponsorID empty.';

                                                console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + __innerItems[__items].contentID + ', but sponsorID empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + __innerItems[__items].contentID + '","' + __innerItems[__items].title + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';


                                            }
                                        }

                                        // Check for the LiveStream flag
                                        if (__innerItems[__items].isLiveStream === true) {
                                            
                                            if (__innerItems[__items].liveVideoEmbed.length <= 0) {
                                                setFail++;

                                                var __curError = 'Livestream flag set to TRUE but liveVideoEmbed empty.';

                                                console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + __innerItems[__items].contentID + ', but liveVideoEmbed empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + __innerItems[__items].contentID + '","' + __innerItems[__items].title + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';
                                            } else if (__innerItems[__items].liveAppVideoEmbed.length <= 0) {
                                                setFail++;
                                                
                                                var __curError = 'Livestream flag set to TRUE but liveAppVideoEmbed empty.';

                                                console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + __innerItems[__items].contentID + ', but liveAppVideoEmbed empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + __innerItems[__items].contentID + '","' + __innerItems[__items].title + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';
                                            }
                                        }
                                        
                                        if (typeof __innerItems[__items].leadMedia === 'object') {

                                            __subItems = __innerItems[__items].leadMedia;
                                            
                                            if (debugOutput) {
                                                console.log('    ------------------ ');
                                            }

                                            for (var __indItems in __subItems) {
                                                // if (typeof __subItems[__indItems] === 'object') {

                                                if (debugOutput) {
                                                    console.log('    >> ' + __indItems + ' : ' + __subItems[__indItems]);
                                                }
                                                
                                                // if (__subItems[__indItems] == 'Gallery') {
                                                //     console.log('    ------------------ ');
                                                //     console.log('     Gallery\n');
                                                //     console.log('      >  Gallery items = ' + __baseUrl + '/apps/news-app/content/gallery/?contentId=');
                                                // }
                                            }

                                            if (debugOutput) {console.log('  >---------------')};

                                        }

                                        if (debugOutput) {console.log('  -----------------')};
                                    }
                                }
                                
                            }
                        }
                    }
                    if (showOutput) { console.log(' >> Endpoint testing completed with ' + setFail + ' FAILs.'); }
                }
            });
        }
    };

    apiSuite.prototype.grabArticles = function(destinations, testID) {
        var suite = this;

        var omitSections = new Array("News","Entertainment","Noticias destacadas","Entretenimiento");

        for(destination in destinations ){
            var val = destinations[destination];

            if (!(destination in omitSections)) {
                if (debugOutput) {
                    console.log(' ' + destination + ' >> ' + val)
                    console.log('-----------------------');
                }
                this.spiderObjects(destination, val, 'json', 'article', testID);
            }
            
        }
    }

    apiSuite.prototype.checkHealth = function(__urlName, __url, testID) {

        var suite = this;
        // var current = suite.__collected.shift();

        // require('utils').dump( current );

        if (__url) {
            casper.open(__url, {
                method: 'head'
            }).then(function(resp) {
                resp = resp;
                var status = this.status().currentHTTPStatus;

                if ( status == 200) {
                    if (showOutput) {console.log('> ' + __urlName + ' : ' + __url + colorizer.colorize(' // Status: ' + status, 'INFO') )};

                    if (__url.indexOf('submit-your-photos') > -1) {
                        if (showOutput) {console.log('Skipping UGC url....')};
                    } else {
                        suite.validateJson(__urlName, __url, status, testID);
                    }
                }
            });
        } else {
            // delete this.__collected;
        }
    };

    apiSuite.prototype.validateJson = function(__jurlName, __jUrl, __status, testID) {
        var suite = this;

        if (__jUrl) {
            casper.open(__jUrl,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                resp = resp;
                var validated = false;
                var output = this.getPageContent();

                if (debugOutput) {console.log('### Content Type ' + resp.headers.get('Content-Type'))};

                try {
                    // __output = JSON.parse(output);
                    __output = JSON.parse(output);
                    // console.log(__output);

                    if( __output instanceof Object ) {
                        var validated = true;
                     }
                } catch (e) {
                    // ...
                    if (showOutput) {console.log(e)};
                }

                if (validated) {
                    if (showOutput) {console.log('> JSON Validation: ' + colorizer.colorize('PASSED', 'INFO') )};
                    fs.write(save, '"' + testID + '","' + __jurlName + '","' + __jUrl + '",' + __status + ',' + 'JSON Validated,' + '\n', 'a+');
                } else {
                    if (showOutput) {console.log('...re-testing JSON')};
                    
                    var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                    __catchJson = output.match(reg)[1];

                    try {
                        __verifyOutput = JSON.parse(__catchJson);

                        if( __verifyOutput instanceof Object ) {
                            if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                            fs.write(save, '"' + testID + '","' + __jurlName + '","' + __jUrl + '",' + __status + ',' + 'JSON Validated,' + '\n', 'a+');
                        } else {
                            if (showOutput) {console.log(__catchJson)};
                        }
                    } catch (e) {
                        // ...
                        if (showOutput) {console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail also with removing HTML tags, possible False/Positive..check url manually.')};
                        fs.write(save, '"' + testID + '","' + __jurlName + '","' + __jUrl + '",' + __status + ',' + 'FAIL - Possible False/Positive,' + '\n', 'a+');
                    }
                }
                if (showOutput) {console.log('-----------------')};
            });
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    new apiSuite(casper.cli.get('url'));
});
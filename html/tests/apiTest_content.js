/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 3.0
// Case: Grab the main app navigation url from the manifest, then test each link for correct response, if response, then validate JSON.
// Use: casperjs test [file_name] --url=[url]
//    optional string params:
//      --output=debug          > to show logged key/val strings
//      --output=console        > will show test results
//
// Run form console.
// ./run.sh apiCheck-article --url=http://www.telemundolasvegas.com --output=console


casper.test.begin('OTS SPIRE | API Navigation Audit', function suite(test) {
    // Global Vars
    var logResults = true;
    var colorizer = require('colorizer').create('Colorizer');

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

    if ( casper.cli.get('testing') ) {
        var logResults = false;
    }

    var collectionObject = {};
    var testResultsObject = {};
    var currentTestObject = {};
    var manifestTestRefID;
    var manifestTestStatus;
    manifestTestStatus = 'Pass';

    var reqKeys = new Array(
        "navigationID",
        "appTitle",
        "sectionMapping",
        "location"
    );

    // Testing Suite Functions
    var apiSuite = function(url) {

        if (!url) {
            throw new Error('A URL is required!');
        }

        this.__collected = {};

        var suite = this;

        var parser = document.createElement('a');
        parser.href = url;

        newUrl = parser.href;
        var sourceString = newUrl.replace('http://','').replace('https://','').replace('www.','').replace('.com','').split(/[/?#]/)[0];
        var urlUri = sourceString.replace('.','_');
        
        url = url + '/apps/news-app/navigation?apiVersion=5';

        /*******************
        *
        * Start Testing
        *
        *******************/
        casper.start( url ).then(function(response) {
            
            if ( response.status == 200 ) {
                console.log(colorizer.colorize('Testing started: ', 'COMMENT') + url );
                suite.createTestID(url, type, urlUri);
            } else {
                throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
            }
        }).then(function () {
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
                // Test Collection data
                suite.testNavigationData(urlUri, collectionObject, manifestTestRefID)
            }

        }).then(function () {
            if (debugOutput) {
                console.log('---------------------');
                console.log(' Test Results object   ');
                console.log('---------------------');
                for (var resultsCollectionItem in testResultsObject) {
                    console.log('- ' + resultsCollectionItem + ' : ' + testResultsObject[resultsCollectionItem]);
                    
                    if (typeof testResultsObject[resultsCollectionItem] == 'object') {
                        var resultsItemSubObject = testResultsObject[resultsCollectionItem];

                        for (var thisSubItem in resultsItemSubObject){
                            console.log('     -- ' + thisSubItem + ' : ' + resultsItemSubObject[thisSubItem]);

                            var thisChildObject = resultsItemSubObject[thisSubItem];
                            if (typeof thisChildObject == 'object') {
                                for (var thisChildItem in thisChildObject){
                                    console.log('      --- ' + thisChildItem + ' : ' + thisChildObject[thisChildItem]);
                                }
                            }
                        }
                    }
                }
            }

            //Process test results to DB
            if (logResults) {
                suite.processTestResults(urlUri, testResultsObject, manifestTestRefID, 'apiNavTest', manifestTestStatus);
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete: ', 'COMMENT') + 'See test_results folder for logs.');
            this.exit();
            test.done();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function(url, type, stationProperty) {
        var suite = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-nav&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults){
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx') };
            suite.collectionNavigationItems(url, type, 'xx');
        } else {
            if (dbUrl) {
                casper.open(dbUrl).then(function(resp) {

                    var status = this.status().currentHTTPStatus;

                    if ( status == 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl ) };

                        var output = this.getHTML();
                        var manifestTestRefID = casper.getElementInfo('body').text;

                        suite.collectionNavigationItems(url, type, manifestTestRefID);
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    // Log results in DB
    apiSuite.prototype.processTestResults = function(urlUri, testResultsObject, testID, testType, manifestTestStatus) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            console.log(processUrl);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'processManifestTestResults',
                'testID': testID,
                'testType': testType,
                'testProperty': urlUri,
                'testStatus': manifestTestStatus,
                'testResults':  JSON.stringify(testResultsObject)
            }
        });
    };

    apiSuite.prototype.collectionNavigationItems = function(url, testType, testID) {
        var suite = this;

        manifestTestRefID = testID;

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
                        } else {
                            suite.spiderObject(parentManifestItem, jsonParsedOutput[parentManifestItem], true);
                        }
                    }
                } catch (e) {
                    console.log('here 2');
                    console.log(e)
                    
                    if (showOutput) {console.log(e)};
                }
            } else {
                console.log(colorizer.colorize('Unable to open the manifest endpoint. ', 'ERROR'));
            }
        })
    };

    apiSuite.prototype.spiderObject = function(parentObjectName, childManifestObject, initialPass) {
        var suite = this;
        var firstPass = true;
        reqKeys.reverse();
        var __baseUrl = casper.cli.get('url');

        for (var childItem in childManifestObject) {
            if (typeof childManifestObject[childItem] != 'object') {

                if ( childItem == 'dateGenerated') {
                    // Print metadata object
                    console.log(childItem + ' : ' + childManifestObject[childItem]);
                    console.log('----------------');
                }

                var manifestMainObjectName = parentObjectName.toLowerCase() + '__' + childItem.toLowerCase();
                console.log(colorizer.colorize(manifestMainObjectName, 'INFO') + ' : ' + childManifestObject[childItem]);

            } else {
                var subObject = childManifestObject[childItem];
                for (var subItem in subObject) {
                    
                        if (subObject.length <= 0) {
                            throw new Error('key blank ' + subItem);
                        } else {

                            if (subItem === 'appTitle') {
                                if (initialPass) {
                                    var navItemAppTitleNiceName = subObject[subItem];
                                    var navItemAppTitle = subObject[subItem].replace('\/',"_").split(' ').join('_').toLowerCase();
                                } else {
                                    var navItemAppTitleNiceName = subObject[subItem];
                                    var mainNavItemTitle = parentObjectName.replace('\/',"_").split(' ').join('_').toLowerCase();
                                    var subNavItemTitle = subObject[subItem].replace('\/',"_").split(' ').join('_').toLowerCase();
                                    var navItemAppTitle = mainNavItemTitle + '__' + subNavItemTitle;
                                }
                            }

                            if (subItem === 'location') {
                                if (debugOutput) {
                                    console.log(subItem + ' : ' + subObject[subItem]);
                                };

                                // Find actual links and append the corrent version string to the end of the url
                                if (subObject[subItem].indexOf('/apps') > -1) {

                                    if (subObject[subItem].indexOf('?') > -1) {
                                        var navItemAppLocationURL = __baseUrl + subObject[subItem] + '&apiVersion=5'
                                    } else {
                                        var navItemAppLocationURL = __baseUrl + subObject[subItem] + '?apiVersion=5'
                                    }
                                    
                                    if (debugOutput) {
                                        console.log(navItemAppLocationURL);
                                    };
                                }
                                
                                if (debugOutput) {
                                    console.log('navItemAppTitleNiceName > ' + navItemAppTitleNiceName);
                                    console.log('navItemAppTitle > ' + navItemAppTitle);
                                    console.log('navItemAppLocationURL > ' + navItemAppLocationURL);    
                                }
                                // Push data into collection
                                collectionObject[navItemAppTitle] = navItemAppLocationURL;
                            }

                            if (typeof subObject[subItem] == 'object') {
                                parentObjectName = false;
                                suite.spiderObject(navItemAppTitle, subObject[subItem], false);
                            }
                        }
                    }
                if (debugOutput) { console.log('------') }
            }
        }
    };


    apiSuite.prototype.testNavigationData = function(url, collectionObject, testID) {
        var suite = this;

        // Build test results object
        testResultsObject['testID'] = testID;
        testResultsObject['testProperty'] = url;

        // Test collection object and add to results object
        for (var thisCollectionItem in collectionObject) {
            var endpointName = thisCollectionItem;
            var endpointUrl = collectionObject[thisCollectionItem];

            if (endpointUrl) {
                suite.validateJson(endpointName, endpointUrl, testID);
            } else {
                throw new Error('NavTestError: No url provided to test against.').exit();
            }
        }
    };

    apiSuite.prototype.validateJson = function(urlName, url, status, testID) {
        var suite = this;
        var currentTestStatus = "Pass";


        if (url) {
            casper.open(url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                
                resp = resp;
                var validated = false;
                var status = this.status().currentHTTPStatus;
                var output = this.getPageContent();
                var currentTestResults = {};

                currentTestResults['url'] = url;
                currentTestResults['httpStatus'] = status;

                if ( status == 200) {
                    if (showOutput) {
                        if (url.indexOf('submit-your-photos') > -1) {
                            if (showOutput) {console.log('Skipping UGC url....')};
                        } else {
                            // console.log(endpointName + '..........');
                            console.log('> ' + urlName + ' : ' + url + colorizer.colorize(' // Status: ' + status, 'INFO') );
                            
                            // Test parsing JSON
                            if (debugOutput) {console.log('### Content Type ' + resp.headers.get('Content-Type'))};

                            try {
                                output = JSON.parse(output);

                                if( output instanceof Object ) {
                                    var validated = true;
                                 }
                            } catch (e) {
                                // ...
                                if (showOutput) {console.log(e)};
                            }

                            if (validated) {
                                if (showOutput) {console.log('> JSON Validation: ' + colorizer.colorize('PASSED', 'INFO') )};
                                currentTestResults['jsonValidated'] = 'Pass';


                            } else {
                                if (showOutput) {console.log('...re-testing JSON')};
                                var reg = /\<body[^>]*\>([^]*)\<\/body/m;

                                try {
                                    cleanedJson = output.match(reg)[1];

                                    if (cleanedJson) {
                                        try {
                                            JSONTestOutput = JSON.parse(cleanedJson);

                                            if( JSONTestOutput instanceof Object ) {
                                                if (showOutput) {console.log('> Re-Eval test: ' + colorizer.colorize('PASSED', 'INFO') )};
                                                // fs.write(save, '"' + testID + '","' + urlName + '","' + url + '",' + status + ',"Pass","PASS - JSON Validated",' + '\n', 'a+');
                                            } else {
                                                if (showOutput) {console.log(cleanedJson)};
                                            }
                                        } catch (e) {
                                            // ...
                                            if (showOutput) {console.log(colorizer.colorize('WARNING: ', 'COMMENT') + 'Parse fail unable to parse programmatically also with removing HTML tags, possible False/Positive..check url manually.')};
                                            currentTestResults['jsonValidated'] = 'Warning';
                                        }
                                    }

                                } catch (e) {
                                    if (showOutput) {console.log(colorizer.colorize('FAIL: ', 'WARNING') + 'Parse fail possible content error...check endpoint manually!')};
                                    
                                    currentTestResults['jsonValidated'] = 'Fail';
                                    currentTestStatus = 'Fail';
                                    manifestTestStatus = 'Fail';
                                }
                            }
                            if (showOutput) {console.log('-----------------')};
                        }
                    }
                }

                // Set current test status & results
                currentTestObject[urlName] = currentTestResults;
                testResultsObject['testStatus'] = currentTestStatus;
                testResultsObject['testResults'] = currentTestObject;
            })
        } else {
            if (showOutput) {console.log(colorizer.colorize('No url provided for JSON validation!', 'ERROR'))};
        }
    };

    apiSuite.prototype.testEndpointContent = function(url, __url, type, testID) {    
        var suite = this;
        var __baseUrl = casper.cli.get('url');
        var reqKeys = new Array("appTitle","sectionMapping","location");
        var articleKeys = new Array("contentID","title","byline","summary","displayDate","updatedMessage","shareURL","typeName","fullsizeImageURL","thumbnailImageURL","fullsizeLeadImageURL","leadImageURL","contentBody","extID");

        __contentSections = {};
        
        if (__url) {
            casper.thenOpen(__url, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }, function(resp) {
                
                var status = this.status().currentHTTPStatus;

                var validated = false;
                var output = this.getPageContent();

                var count = 0;
                var _count = 0;
                var setFail = 0;
                
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
                                    var articleIsLiveStream = __innerItems[__items].isLiveStream;
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
                                        console.log('  >> article_sponsored  : ' + __innerItems[__items].sponsorName);
                                        console.log('  >> article_sponsored  : ' + __innerItems[__items].sponsorID);
                                        console.log('  >> article_liveVideoEmbed  : ' + __innerItems[__items].liveVideoEmbed);
                                        console.log('  >> article_liveAppVideoEmbed  : ' + __innerItems[__items].liveAppVideoEmbed);
                                        // console.log('  >> article_contentBody  : ' + __innerItems[__items].contentBody);
                                        console.log('  >> article_leadMedia  : ' + __innerItems[__items].leadMedia);
                                    }

                                    if (__innerItems[__items].typeName !== 'FeaturePageHeader') {
                                        if (__innerItems[__items].typeName == 'Gallery') {
                                            //     console.log('    ------------------ ');
                                            //     console.log('     Gallery\n');
                                            // console.log('      >  Gallery items = ' + __baseUrl + '/apps/news-app/content/gallery/?contentId=' + articleContentID);
                                            // var galleryContentURL = __baseUrl + '/apps/news-app/content/gallery/?contentId=' + articleContentID;
                                            // console.log('      >  Gallery items = ' + galleryContentURL);
                                            // var urlName = 'Gallery ID - ' + articleContentID;
                                            
                                            // suite.checkHealth(galleryItem, galleeryURL, testID);
                                            var pageData = this.getPageContent();
                                            // console.log('[begin page]' + pageData + '[end page]')
                                            // galleryContentJSON = JSON.parse(pageData);

                                            if( galleryContentJSON instanceof Object ) {

                                                galleryOutput = JSON.parse(pageData);

                                                var fullJSONObject = galleryOutput.items;

                                                for (var jsonItem in fullJSONObject) {
                                                    
                                                    if(fullJSONObject.hasOwnProperty(jsonItem)){
                                                        count++;
                                                    }

                                                    var thisContentItem = galleryOutput.items[count];

                                                    for (var galKey in thisContentItem) {

                                                        if (galKey === 'items' && typeof thisContentItem[galKey] === 'object') {

                                                            var parentInfo = galleryOutput.items[count].title;

                                                            if (debugOutput) {
                                                                console.log('-----------------');
                                                                console.log(parentInfo + ' sub links');
                                                            }
                                                            
                                                            var __subItem = galleryOutput.items[count].items;

                                                            var __count = 0;

                                                            for (var jsonItem in __subItem) {
                                                                
                                                                if(__subItem.hasOwnProperty(jsonItem)){
                                                                    __count++;

                                                                    __offset = (__count - 1);
                                                                    // console.log(__offset);
                                                                }

                                                                var __lastItem = galleryOutput.items[count].items[__offset];

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
                                                                                    var __lastKeyUrl = __baseUrl + __lastItem[__b] + '&apiVersion=5'
                                                                                } else {
                                                                                    var __lastKeyUrl = __baseUrl + __lastItem[__b] + '?apiVersion=5'
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
                                                }
                                            }
                                        }

                                        if (articleFullsizeImageURL.indexOf('0*false') > -1) {
                                            console.log(colorizer.colorize('FAIL: Image url invalid for fullsizeImageURL: ' + articleFullsizeImageURL + '.', 'ERROR'));
                                        }

                                        if (articleThumbnailImageURL == null) {
                                            console.log('  []> article_contentID  : ' + __innerItems[__items].contentID + '\n  []> article_typeName  : ' + __innerItems[__items].typeName + '\n  []> article_title  : ' + __innerItems[__items].title + '\n  []> article_thumbnailImageURL  : ' + __innerItems[__items].thumbnailImageURL);
                                        }

                                        if (articleThumbnailImageURL.indexOf('0*false') > -1) {
                                            console.log(colorizer.colorize('FAIL: Image url invalid for thumbnailImageURL: ' + articleThumbnailImageURL + '.', 'ERROR'));
                                        }
                                        
                                        // Check for the Feature flag
                                        if (articleFeature === true) {
                                            
                                            if (__innerItems[__items].featureName.length <= 0) {
                                                setFail++;

                                                var __curError = 'Feature flag set to TRUE but featureName empty.';

                                                console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureName empty.', 'ERROR'));

                                                fs.write(save, '"' + testID + '","' + __url + '","' + articleContentID + '","' + articleTitle + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';

                                            } else if (__innerItems[__items].featureId.length <= 0) {
                                                setFail++;

                                                var __curError = 'Feature flag set to TRUE but featureId empty.';
                                                
                                                console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureId empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + articleContentID + '","' + articleTitle + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';
                                            }
                                        }

                                        // Check for the Sponsor flag
                                        if (articleSponsored === true) {
                                            
                                            if (__innerItems[__items].sponsorName.length <= 0) {
                                                setFail++;
                                                
                                                var __curError = 'Sponsored flag set to TRUE but sponsorName empty.';

                                                console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorName empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + articleContentID + '","' + articleTitle + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';


                                            } else if (__innerItems[__items].sponsorID.length <= 0) {
                                                setFail++;
                                                
                                                var __curError = 'Sponsored flag set to TRUE but sponsorID empty.';

                                                console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorID empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + articleContentID + '","' + articleTitle + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';


                                            }
                                        }

                                        // Check for the LiveStream flag
                                        if (articleIsLiveStream === true) {
                                            
                                            if (articleLiveVideoEmbed.length <= 0) {
                                                setFail++;

                                                var __curError = 'Livestream flag set to TRUE but liveVideoEmbed empty.';

                                                console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveVideoEmbed empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + articleContentID + '","' + articleTitle + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';
                                            } else if (articleLiveAppVideoEmbed.length <= 0) {
                                                setFail++;
                                                
                                                var __curError = 'Livestream flag set to TRUE but liveAppVideoEmbed empty.';

                                                console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveAppVideoEmbed empty.', 'ERROR'));
                                                fs.write(save, '"' + testID + '","' + __url + '","' + articleContentID + '","' + articleTitle + '","' + __curError + '","Fail",' + '\n', 'a+');

                                                var __curError = '';
                                            }
                                        }

                                        if (typeof articleLeadMedia === 'object') {

                                            __subItems = articleLeadMedia;
                                            
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
                                    }

                                    if (debugOutput) {console.log('  -----------------')};
                                }
                            }
                            
                        }
                    }
                }
                if (showOutput) { console.log(' >> Endpoint testing completed with ' + setFail + ' FAILs.'); }
            });
        }
    };

    new apiSuite(casper.cli.get('url'));
});
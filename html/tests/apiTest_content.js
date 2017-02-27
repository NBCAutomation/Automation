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
    var galleryCollectionObject = {};
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
                suite.testNavigationData(urlUri, collectionObject, manifestTestRefID);
            }
        }).then(function () {
            console.log('--------// Test endpoint content');
            if (debugOutput) {
                console.log('-----------------------------------------');
                console.log(' Start testing content collectionObject   ');
                console.log('-----------------------------------------');
            }
            // Test endpoint content
            suite.testEndpointContent(collectionObject, manifestTestRefID);

        }).then(function () {
            if (debugOutput) {
                console.log('---------------------------------');
                console.log(' galleryCollectionObject object   ');
                console.log('---------------------------------');
                console.log(Object.keys(galleryCollectionObject).length);
                for (var thisGalleryCollectionItem in galleryCollectionObject) {
                    console.log('>>>>> ' + thisGalleryCollectionItem + ' : ' + galleryCollectionObject[thisGalleryCollectionItem]);
                }
            }
            // Test Gallery collection items
            // suite.galleryObjectTest(galleryCollectionObject, manifestTestRefID);

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
        var baseUrl = casper.cli.get('url');

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
                                        var navItemAppLocationURL = baseUrl + subObject[subItem] + '&apiVersion=5'
                                    } else {
                                        var navItemAppLocationURL = baseUrl + subObject[subItem] + '?apiVersion=5'
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


    apiSuite.prototype.testEndpointContent = function(collectionObject, testID) {
        var suite = this;
        for (var thisCollectionItem in collectionObject) {
            var endpointName = thisCollectionItem;
            var endpointUrl = collectionObject[thisCollectionItem];

            if (endpointUrl) {
                suite.endpointContentValidation(endpointName, endpointUrl, testID);
            } else {
                throw new Error('NavTestError: No url provided to test against.').exit();
            }
        }
    };

    apiSuite.prototype.endpointContentValidation = function(endpointName, endpointUrl, testID) {
        var suite = this;
        var baseUrl = casper.cli.get('url');

        var reqKeys = new Array("appTitle","sectionMapping","location");
        var articleKeys = new Array("contentID","title","byline","summary","displayDate","updatedMessage","shareURL","typeName","fullsizeImageURL","thumbnailImageURL","fullsizeLeadImageURL","leadImageURL","contentBody","extID");

        contentSections = {};

        if (endpointUrl) {
            casper.thenOpen(endpointUrl, { method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }, function(resp) {
                var status = this.status().currentHTTPStatus;
                var output = this.getPageContent();
                var setFail = 0;
                
                // rawOutput = JSON.parse(output);

                try{
                    rawOutput = JSON.parse(output);

                    // Main endpoint data module item
                    var mainItemArticles = rawOutput.modules;
                    if (showOutput) {
                        console.log('---------------------------------');
                        // console.log(' Test ID: ' + testID);
                        console.log(' endpointName > '  + endpointName);
                        console.log(' endpointUrl: ' + endpointUrl);
                        console.log('---------------------------------');
                    }
                    for (var innerContentItem in mainItemArticles) {

                        // console.log('== '+innerContentItem.items);
                        var singleArticleItemObject = mainItemArticles[innerContentItem];

                        for (var singleArticleItem in singleArticleItemObject) {

                            if (singleArticleItem === 'items' && typeof singleArticleItemObject[singleArticleItem] === 'object') {
                                
                                var singleArticleInnerItems = singleArticleItemObject[singleArticleItem];

                                var __subCount = 0;

                                for (var __items in singleArticleInnerItems) {

                                    if (typeof singleArticleInnerItems[__items] === 'object') {

                                        var articleContentID = singleArticleInnerItems[__items].contentID;
                                        var articleTitle = singleArticleInnerItems[__items].title;
                                        var articleByline = singleArticleInnerItems[__items].byline;
                                        var articleSummary = singleArticleInnerItems[__items].summary;
                                        var articleDisplayDate = singleArticleInnerItems[__items].displayDate;
                                        var articleUpdatedMessage = singleArticleInnerItems[__items].updatedMessage;
                                        var articleShareURL = singleArticleInnerItems[__items].shareURL;
                                        var articleTypeName = singleArticleInnerItems[__items].typeName;
                                        var articleFullsizeImageURL = singleArticleInnerItems[__items].fullsizeImageURL;
                                        var articleThumbnailImageURL = singleArticleInnerItems[__items].thumbnailImageURL;
                                        var articleFullsizeLeadImageURL = singleArticleInnerItems[__items].fullsizeLeadImageURL;
                                        var articleLeadImageURL = singleArticleInnerItems[__items].leadImageURL;
                                        var articleFeature = singleArticleInnerItems[__items].feature;
                                        var articleFeatureName = singleArticleInnerItems[__items].featureName;
                                        var articleFeatureID = singleArticleInnerItems[__items].featureId;
                                        var articleSponsored = singleArticleInnerItems[__items].sponsored;
                                        var articleSponsorName = singleArticleInnerItems[__items].sponsorName;
                                        var articleSponsorID = singleArticleInnerItems[__items].sponsorID;
                                        var articleIsLiveStream = singleArticleInnerItems[__items].isLiveStream;
                                        var articleLiveVideoEmbed = singleArticleInnerItems[__items].liveVideoEmbed;
                                        var articleLiveAppVideoEmbed = singleArticleInnerItems[__items].liveAppVideoEmbed;
                                        var articleContentBody = singleArticleInnerItems[__items].contentBody;
                                        var articleLeadMedia = singleArticleInnerItems[__items].leadMedia;


                                        if (debugOutput) {
                                            console.log('-------------------------------');
                                            console.log(' Content item var declaration   ');
                                            console.log('-------------------------------');
                                            console.log('    > articleContentID : ' + articleContentID);
                                            console.log('    > articleTitle : ' + articleTitle);
                                            console.log('    > articleByline : ' + articleByline);
                                            // console.log('    > articleSummary : ' + articleSummary);
                                            console.log('    > articleDisplayDate : ' + articleDisplayDate);
                                            console.log('    > articleUpdatedMessage : ' + articleUpdatedMessage);
                                            console.log('    > articleShareURL : ' + articleShareURL);
                                            console.log('    > articleTypeName : ' + articleTypeName);
                                            console.log('    > articleFullsizeImageURL : ' + articleFullsizeImageURL);
                                            console.log('    > articleThumbnailImageURL : ' + articleThumbnailImageURL);
                                            console.log('    > articleFullsizeLeadImageURL : ' + articleFullsizeLeadImageURL);
                                            console.log('    > articleLeadImageURL : ' + articleLeadImageURL);
                                            console.log('    > articleFeature : ' + articleFeature);
                                            console.log('    > articleFeatureName : ' + articleFeatureName);
                                            console.log('    > articleFeatureName : ' + articleFeatureID);
                                            console.log('    > articleSponsored : ' + articleSponsored);
                                            console.log('    > articleSponsorName : ' + articleSponsorName);
                                            console.log('    > articleSponsorID : ' + articleSponsorID);
                                            console.log('    > articleIsLiveStream : ' + articleIsLiveStream);
                                            console.log('    > articleLiveVideoEmbed : ' + articleLiveVideoEmbed);
                                            console.log('    > articleLiveAppVideoEmbed : ' + articleLiveAppVideoEmbed);
                                            // console.log('    > articleContentBody : ' + articleContentBody);
                                            console.log('    > articleLeadMedia : ' + articleLeadMedia);
                                        }

                                        if (articleTypeName !== 'FeaturePageHeader') {
                                            // If gallery collect into gallery object
                                            if (articleTypeName == 'Gallery') {
                                                var galleryContentURL = baseUrl + '/apps/news-app/content/gallery/?contentId=' + articleContentID;

                                                if (debugOutput) {
                                                    console.log('    ------------------ ');
                                                    console.log('     Gallery\n');
                                                    console.log('      >  Gallery items url = ' + galleryContentURL);
                                                }
                                                // Test gallery content
                                                suite.galleryObjectTest(galleryContentURL, testID);
                                            }

                                            if (articleFullsizeImageURL.indexOf('0*false') > -1 || articleFullsizeImageURL == null) {
                                                console.log(colorizer.colorize('FAIL: Image url invalid for fullsizeImageURL: ' + articleFullsizeImageURL + '.', 'ERROR'));
                                            }

                                            if (articleThumbnailImageURL.indexOf('0*false') > -1 || articleThumbnailImageURL == null) {
                                                // console.log('  []> article_contentID  : ' + singleArticleInnerItems[__items].contentID + '\n  []> article_typeName  : ' + articleTypeName + '\n  []> article_title  : ' + singleArticleInnerItems[__items].title + '\n  []> article_thumbnailImageURL  : ' + singleArticleInnerItems[__items].thumbnailImageURL);
                                                console.log(colorizer.colorize('FAIL: Image url invalid for thumbnailImageURL: ' + articleThumbnailImageURL + '.', 'ERROR'));
                                            }

                                            // Check for the Feature flag
                                            if (articleFeature === true) {
                                                if (articleFeatureName.length <= 0) {
                                                    setFail++;

                                                    var __curError = 'Feature flag set to TRUE but featureName empty.';

                                                    console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureName empty.', 'ERROR'));
                                                    var __curError = '';

                                                } else if (articleFeatureID.length <= 0) {
                                                    setFail++;

                                                    var __curError = 'Feature flag set to TRUE but featureId empty.';
                                                    
                                                    console.log(colorizer.colorize('FAIL: Feature flag set to TRUE for ' + articleContentID + ', but featureId empty.', 'ERROR'));
                                                    var __curError = '';
                                                }
                                            }

                                            // Check for the Sponsor flag
                                            if (articleSponsored === true) {
                                                if (articleSponsorName.length <= 0) {
                                                    setFail++;
                                                    
                                                    var __curError = 'Sponsored flag set to TRUE but sponsorName empty.';

                                                    console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorName empty.', 'ERROR'));
                                                    var __curError = '';
                                                } else if (articleSponsorID.length <= 0) {
                                                    setFail++;
                                                    
                                                    var __curError = 'Sponsored flag set to TRUE but sponsorID empty.';

                                                    console.log(colorizer.colorize('FAIL: Sponsored flag set to TRUE for ' + articleContentID + ', but sponsorID empty.', 'ERROR'));
                                                    var __curError = '';
                                                }
                                            }

                                            // Check for the LiveStream flag
                                            if (articleIsLiveStream === true) {
                                                if (articleLiveVideoEmbed.length <= 0) {
                                                    setFail++;

                                                    var __curError = 'Livestream flag set to TRUE but liveVideoEmbed empty.';

                                                    console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveVideoEmbed empty.', 'ERROR'));

                                                    var __curError = '';
                                                } else if (articleLiveAppVideoEmbed.length <= 0) {
                                                    setFail++;
                                                    
                                                    var __curError = 'Livestream flag set to TRUE but liveAppVideoEmbed empty.';

                                                    console.log(colorizer.colorize('FAIL: Livestream flag set to TRUE for ' + articleContentID + ', but liveAppVideoEmbed empty.', 'ERROR'));

                                                    var __curError = '';
                                                }
                                            }

                                            if (typeof articleLeadMedia === 'object') {
                                                if (debugOutput) {
                                                    console.log('    ------------------ ');
                                                }

                                                if (articleLeadMedia['typeName'] == 'Gallery') {
                                                    var galleryContentID = articleLeadMedia['contentID'];
                                                    var galleryContentURL = baseUrl + '/apps/news-app/content/gallery/?contentId=' + galleryContentID;

                                                    if (debugOutput) {
                                                        console.log('    ------------------ ');
                                                        console.log('     Lead Media Gallery\n');
                                                        console.log('      >  Gallery items = ' + baseUrl + '/apps/news-app/content/gallery/?contentId=');
                                                        console.log('       gallery url to test: ' + galleryContentURL);
                                                    }

                                                    var urlHealthStatus = suite.checkURLHealth(galleryContentURL, function (data) {
                                                        if (data) {
                                                            if (showOutput) {
                                                                console.log(' > Lead media: Gallery loaded correctly ok: ' + colorizer.colorize(data, 'INFO'));
                                                            }
                                                        }
                                                    });
                                                }

                                                if (articleLeadMedia['typeName'] == 'Video Release') {
                                                    var videoURL = 'https://link.theplatform.com/s/Yh1nAC/'+ articleLeadMedia['extID'] +'?manifest=m3u&formats=m3u,mpeg4,webm,ogg&format=SMIL&embedded=true&tracking=true';

                                                    if (debugOutput) {
                                                        console.log('    ------------------ ');
                                                        console.log('     Lead Media Video Release\n');
                                                        console.log('       articleLeadMedia[__indItems]' + articleLeadMedia['typeName']);
                                                        console.log('       articleLeadMedia[__indItems]' + articleLeadMedia['extID']);
                                                        console.log('       video url to test ' + videoURL);
                                                    }

                                                    var urlHealthStatus = suite.checkURLHealth(videoURL, function (data) {
                                                        if (data) {
                                                            if (showOutput) {
                                                                console.log(' > Lead media: Video release file url OK: ' + colorizer.colorize(data, 'INFO'));
                                                            }
                                                        }
                                                    });
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
                    if (showOutput) {
                        casper.wait(200, function() {
                            console.log(' > Endpoint testing completed with ' + setFail + ' FAILs.');
                        });
                    }                    
                } catch (e) {
                    if (showOutput) {
                        console.log(' ' + colorizer.colorize('JSON Parse Fail:', 'FAIL') + e);
                        // console.log('   JSON Object ');
                        // console.log('  ------------------------------');
                        // console.log( JSON.stringify(output));
                        // console.log('  ------------------------------');
                    };
                }
            });
        }
    };

    apiSuite.prototype.galleryObjectTest = function(galleryURL, testID) {
        var suite = this;
            
        casper.thenOpen(galleryURL,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                var output = this.getPageContent();
                console.log(' > Gallery url: ' + resp.url);

                jsonParsedOutput = JSON.parse(output);

                for (var parentManifestItem in jsonParsedOutput) {    
                    if (parentManifestItem === 'items') {
                        var innerGalleryObjects = jsonParsedOutput[parentManifestItem];
                        for (var thisGalleryObject in innerGalleryObjects){
                            var gallerySingleImageID = innerGalleryObjects[thisGalleryObject].imageID;
                            var gallerySingleImageURL = innerGalleryObjects[thisGalleryObject].url;
                            
                            // console.log('gallerySingleImageID > ' + gallerySingleImageID);
                            suite.checkURLHealth(gallerySingleImageURL, function (data) {
                                if (data == 'Pass') {
                                    console.log('   - Gallery image loaded.');
                                } else {
                                    console.log('   - Fail: Unable to load gallery image, for gallery:' + gallerySingleImageURL);
                                }
                            });
                        }
                    }
                
                }
            }
        });
    };
    
    apiSuite.prototype.checkURLHealth = function(url, callback) {
        var suite = this;

        if (url) {
            casper.thenOpen(url).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    output = 'Pass';
                } else {
                    output = false;
                }

                if (typeof(callback) === "function") {
                    callback(output);
                }
            })
        } else {
            throw new Error('checkURLHealth: Unable to test url, missing url;');
        }
    };

    new apiSuite(casper.cli.get('url'));
});
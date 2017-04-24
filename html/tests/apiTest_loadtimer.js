// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 1.0 of JSON Testing; V.3 of Manifest testing.
// Casper 1.1.0-beta3 and Phantom 1.9.8
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
//    optional string params:
//      --output=debug          > to show logged key/val strings
//      --output=console        > will show test results
//      --task=createDictionary > to create dictionary for current property/station
//      --testing               > disables DB logging of test results
//
// JSON Manifest
// templates/nbc_news_app_json_manifest?apiVersion=6
//
// Testing starts @ Line 250

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
    var manifestTestRefID;
    var manifestTestStatus;
    var setFail = 0;
    var testStartTime;
    var manifestLoadTime;

    var apiVersion = '6';

    if ( ! casper.cli.get('enablevalidation') ) {
        var enableJsonValidation = '&enableJsonValidation=false';
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
            url = url + '/apps/news-app/manifest/json/?apiVersion=' + apiVersion + enableJsonValidation;

            testStartTime =  new Date();

            /*******************
            *
            * Start Testing
            *
            *******************/
            casper.start( url ).then(function(response) {
                // if ( response.status == 200 ) {
                //     manifestLoadTime = new Date() - testStartTime;

                //     console.log(' > Loadtime: ', manifestLoadTime, 'ms');
                // } else {
                //     casper.test.fail('Page did not load correctly. Response: ' + response.status);
                // }

                var urlCurrentLoadTime = suite.getLoadTime(url, function (data) {
                    if (data) {
                        // if (showOutput) {
                            console.log('> LoadTime: ' +  colorizer.colorize(data + ' ms', 'INFO') );
                        // }
                    } else {
                        console.log('-- no timing returned.');
                    }
                    
                });
            }).run(function() {
                // utils.dump(resourcesTime);
                // console.log(collectionObject['loadtime']);


                this.exit();
                test.done();
            });
        }
    };

    apiSuite.prototype.getLoadTime = function(url, callback) {
        var suite = this;

        if (url) {
            console.log(url);
            var resourcesTime = [];

            casper.on('resource.requested', function(resource) {
                var date_start = new Date();

                resourcesTime[resource.id] = {
                    'id': resource.id,
                    'id_received': '', /* to debug */
                    'start': date_start.getTime(),
                    'end': -1,
                    'time': -1,
                    'status': resource.status,
                    'url': resource.url,
                    'url_received': '' /* to debug */
                }
            });

            casper.on('resource.received', function(resource) {
                var date_end = new Date();

                resourcesTime[resource.id]['end']  = date_end.getTime();
                resourcesTime[resource.id]['time'] = resourcesTime[resource.id]['end'] - resourcesTime[resource.id]['start'];
                collectionObject['loadtime'] = resourcesTime[resource.id]['time'];
                
                if (debugOutput) {
                    /* to debug and compare */
                    resourcesTime[resource.id]['id_received']  = resource.id;
                    resourcesTime[resource.id]['url_received'] = resource.url;
                    console.log('id >> ' + resourcesTime[resource.id]['id_received']);
                    console.log('resource >> ' + resourcesTime[resource.id]['url_received']);
                    console.log('resource time >> ' + resourcesTime[resource.id]['time']);
                    collectionObject['loadtime'] = resourcesTime[resource.id]['time'];
                }
            });

            casper.thenOpen(url).then(function(resp) {
                var status = this.status().currentHTTPStatus,
                    output = false;

                if ( status == 200) {
                    currentSubTestLoadTime = collectionObject['loadtime'];
                    output = currentSubTestLoadTime;
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
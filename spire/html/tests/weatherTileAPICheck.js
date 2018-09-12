/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 2.0
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name] --url=[site]
//    optional string params --output=debug to show logged key/val strings
//    optional string params --output=console will show test results
//
// Casper 1.1.0-beta3 and Phantom 1.9.8
//
casper.test.begin('OTS SPIRE | WSI Weather Tile Check', function suite(test) {
    // casper.options.timeout = 300000;
    casper.options.timeout = 1100000;

    // Config vars
    var utils = require('utils'),
        envConfig = casper.cli.get('env'),
        colorizer = require('colorizer').create('Colorizer'),
        currentTime = new Date(),
        month = currentTime.getMonth() + 1,
        day = currentTime.getDate(),
        year = currentTime.getFullYear(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes(),
        failureType,
        sendEmailAlert = false,
        wsiWeatherTileURL = 'https://wsimap.weather.com/201205/en-us/1117/0019/capability.json?layer=0856',
        weatherTileOutput,
        testingObject = {},
        alertObject = {};

        if (minutes < 10){
            minutes = "0" + minutes;
        }

        if (hours > 11){
            var toD = "PM";
        } else {
            var toD = "AM";
        }

        if (hours === '0'){
            var hours = "12";
        }

    var timeStamp = month+'_'+day+'_'+year+'-'+hours+'_'+minutes+'-'+toD;

    manifestTestRefID = casper.cli.get('refID');

    if (envConfig === 'local') {
        var configURL = 'http://spire.local';

    } else if (envConfig === 'dev') {
        var configURL = 'http://45.55.209.68';

    } else if (envConfig === 'prod') {
        var configURL = 'http://54.243.53.242';

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

    // only have to call this once..
    if (debugOutput) {
        casper.on("page.error", function (msg, trace) {
             casper.echo("A page error was thrown: " + msg, "INFO");
        });
    }

    /*************************
    *
    * Begin test suite setup
    *
    *************************/
    var weatherTileVerificationCheck = function() {
        var suite = this;

        casper.options.onTimeout = function () {
            timeoutDetails['failure'] = 'Script Stopped! Timeout occured, max execution time reached: 300000ms';
            testResultsObject['testResults'] = timeoutDetails;

            suite.processTestResults(urlUri, testResultsObject, '1', testResultsObject['testID'], 'regressionTest', 'Fail', 'Script timeout');

            casper.wait(100, function() {
                console.log(colorizer.colorize(' > Script Stopped! Timeout occured (max execution time reached: 300000ms) ', 'RED_BAR'));
                this.exit();
                test.done();
            });
        };

        /*******************
        *
        * Start Testing
        *
        *******************/
        // casper.start().then(function(response) {
        casper.start( wsiWeatherTileURL ).then(function(response) {
            if (debugOutput) {
                console.log('-------------------------');
                console.log('  Response Output');
                console.log('-------------------------');
                console.log(JSON.stringify(response));
                console.log('-------------------------');
            }

            var headerObject = response.headers;
            weatherTileOutput = this.getPageContent();

            if ( response.status == 200 || response.status == 301) {
                console.log('URL: ' + response.url);
                console.log('> Load OK: ' + response.status);
                console.log('------------------------------------------');
            } else {
                console.log(colorizer.colorize('FAIL/WARN','WARN_BAR') + ' HTTP Response: ' + response.status + ' - page didn\'t load correctly and/or was redirected. Test Manually');
                failureType = 'loadingError';
                sendEmailAlert = true;
            }

        }).then(function() {
            if (sendEmailAlert) {
                suite.sendAlert(failureType);
                console.log('alert sent');
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            this.exit();
        });
    };

    // Create test id in DB
    apiSuite.prototype.createTestID = function (url, stationProperty) {
        // var apiSuiteInstance = this;

        var dbUrl = configURL + '/utils/tasks?task=generate&testscript=apiCheck-staleContentCheck&property=' + stationProperty + '&fileLoc=json_null';

        if (!logResults) {
            if (debugOutput) { console.log(colorizer.colorize('TestID: ', 'COMMENT') + 'xx'); }
            apiSuiteInstance.manifestTestRefID = 'xx';
        } else {
            if (dbUrl) {
                console.log(dbUrl);
                casper.thenOpen(dbUrl).then(function (resp) {
                    var pageOutput = null;

                    if (resp.status === 200) {
                        if (debugOutput) { console.log(colorizer.colorize('DB dbURL Loaded: ', 'COMMENT') + dbUrl); }

                        pageOutput = this.getHTML();
                        apiSuiteInstance.manifestTestRefID = casper.getElementInfo('body').text;
                    } else {
                        throw new Error('Unable to get/store Test ID!');
                    }
                });
            }
        }
    };

    // Send Email Notice
    weatherTileVerificationCheck.prototype.sendAlert = function(failureType) {
        var processUrl = configURL + '/utils/processRequest';

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'taskType': 'weatherTile-alert',
                'failureType': failureType
            }
        });
    };

    // Log results in DB
    weatherTileVerificationCheck.prototype.processTestResults = function (testFailureCount, typeName, manifestTestStatus) {
        var processUrl = configURL + '/utils/processRequest';

        if (debugOutput) {
            // console.log('>> process url: ' + processUrl);
            console.log('------------------------');
            console.log(' Process Results Data  ');
            console.log('------------------------');
            console.log('urlUri => ' + this.stationProperty);
            console.log('testResultsObject => ' + apiSuiteInstance.testResultsObject);
            console.log('contentObject => ' + endpointTestObject);
            console.log('testID => ' + apiSuiteInstance.manifestTestRefID);
            console.log('testFailureCount => ' + testFailureCount);
            console.log('testType => ' + typeName);
            // console.log('manifestLoadTime => ' + manifestLoadTime);
            console.log('manifestTestStatus => ' + manifestTestStatus);
        }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task' : 'processScrapedContentStaleCheck',
                'testID' : apiSuiteInstance.manifestTestRefID,
                'testType' : typeName,
                'testProperty' : this.stationProperty,
                'contentObject' : JSON.stringify(endpointTestObject),
                'testStatus' : manifestTestStatus,
                'testFailureCount' : testFailureCount,
                // 'manifestLoadTime' : 123,
                'testResults' :  JSON.stringify(apiSuiteInstance.testResultsObject)
            }
        });
    };

    new weatherTileVerificationCheck(casper.cli.get('url'));
});
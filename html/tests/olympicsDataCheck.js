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
casper.test.begin('OTS SPIRE | Olympics Payload Checks', function suite(test) {
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
        sendEmailAlert = false,
        watchNowURL = 'http://olympics.otsops.com/watch-now',
        medalCountURL = 'http://olympics.otsops.com/medal-count',
        watchNowOutput,
        medalCountOutput,
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
        var configURL = 'http://spire.local',
            saveLocation = '../test_results/screenshots/';

    } else if (envConfig === 'dev') {
        var configURL = 'http://45.55.209.68',
            saveLocation = '../test_results/screenshots/';

    } else if (envConfig === 'prod') {
        var configURL = 'http://54.243.53.242',
            saveLocation = 'test_results/screenshots/';

    } else {
        var configURL = 'http://54.243.53.242',
            saveLocation = 'test_results/screenshots/';
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

    if (['local', 'dev', 'prod'].indexOf(envConfig) < 0) {
        var process = require("child_process"),
            spawn = process.spawn,
            child = spawn("chown", ["-hR", "ec2-user:apache", saveLocation]);
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
        //   pass/(total/100) pass score
        //   (100/170)164
        

    var olympicsTesting = function() {
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
        casper.start( watchNowURL ).then(function(response) {
            if (debugOutput) {
                console.log('-------------------------');
                console.log('  Response Output');
                console.log('-------------------------');
                console.log(JSON.stringify(response));
                console.log('-------------------------');
            }

            var headerObject = response.headers;
            watchNowOutput = this.getPageContent();

            for (var keys in headerObject) {
                if (headerObject[keys].name == 'X-Server-Name') {
                    if (debugOutput) {
                        console.log(headerObject[keys].name);
                        console.log(headerObject[keys].value);
                    }
                    testResultsObject['clickXServer'] = headerObject[keys].value;
                }

            }

            if ( response.status == 200 || response.status == 301) {
                console.log('URL: ' + response.url);
                console.log('> Load OK: ' + response.status);
                console.log('------------------------------------------');
            } else {
                console.log(colorizer.colorize('FAIL/WARN','WARN_BAR') + ' HTTP Response: ' + response.status + ' - page didn\'t load correctly and/or was redirected. Test Manually');
            }

        }).then(function() {
            casper.thenOpen(medalCountURL).then(function(resp) {
                medalCountOutput = this.getPageContent();

                if ( resp.status == 200 || resp.status == 301) {
                    console.log('URL: ' + resp.url);
                    console.log('> Load OK: ' + resp.status);
                    console.log('------------------------------------------');
                } else {
                    console.log(colorizer.colorize('FAIL/WARN','WARN_BAR') + ' HTTP response: ' + resp.status + ' - page didn\'t load correctly and/or was redirected. Test Manually');
                }
            });
        }).then(function() {
            console.log('==== medal count ====');
            // console.log(JSON.stringify(medalCountOutput));
            
            if (suite.testJSON('medalCount', medalCountOutput)){
                console.log('Parse OK');
            } else {
                console.log('Parse FAIL');
            }


            console.log('==== watch now ====');
            // console.log(JSON.stringify(watchNowOutput))
            if (suite.testJSON('watchNow', watchNowOutput)){
                console.log('Parse OK');
            } else {
                console.log('Parse FAIL');
            }
            sendEmailAlert = true;
        }).then(function() {
            if (sendEmailAlert) {
                suite.sendOlympicsAlert();
                console.log('alert sent');
            }
        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            this.exit();
        });
    };

    // Send Email Notice
    olympicsTesting.prototype.sendOlympicsAlert = function() {
        var processUrl = configURL + '/utils/processRequest';

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task': 'sendOlympicsAlert',
                'taskType': 'regression-notification'
            }
        });
    };

    // Log results in DB
    olympicsTesting.prototype.testJSON = function(refName, jsonObject) {
        var suite = this;
        try {
            output = JSON.parse(jsonObject);

            if( output instanceof Object ) {
                var validated = true;
                return  true;
             }
        } catch (e) {
            // console.log(e);
            var JSONerror = 'Parse Failure: ' + e,
                brokenJSONString = output.replace(/[\n\t\s]+/g, " ");

                testingObject['refName'] = refName;
                testingObject['parseFailure'] = JSONerror;
                console.log('JSON FALSE');
            return false;
        }
    };

    new olympicsTesting(casper.cli.get('url'));
});
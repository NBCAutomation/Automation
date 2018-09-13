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
        alertObject = {},
        resourcesTime = {},
        enableJsonValidation = '',
        linkParser = document.createElement('a'),
        listener = function (resource) {
            linkParser.href = resource.url;
            if (/^\/apps\/news-app/.exec(linkParser.pathname) === null) {
                // not an api call, skip it.
                return;
            }
            var date_start = new Date();

            resourcesTime[resource.id] = {
                'id': resource.id,
                'url': resource.url,
                'start': date_start.getTime(),
                'end': -1,
                'time': -1,
                'status': resource.status
            };

            if (debugOutput) {
                this.echo('resourcesTime :: ' + resourcesTime[resource.id].time);
            }
        },
        receivedListener = function (resource) {
            if (resourcesTime.hasOwnProperty(resource.id) === false) {
                // we don't have any data for this request.
                return;
            }

            var date_end = new Date();
            resourcesTime[resource.id].end  = date_end.getTime();
            resourcesTime[resource.id].time = resourcesTime[resource.id].end - resourcesTime[resource.id].start;

            if (debugOutput) {
                /* to debug and compare */
                this.echo('manifestLoadTime >> ' + resourcesTime[resource.id].time);
                this.echo('resource time >> ' + resourcesTime[resource.id].time);
            }
        };

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

    function setDebugEvents() {
        var triggerEvent = function (event, args) {
                // test.comment(arguments);
                var array_args = Array.prototype.slice.call(args);
                console.log("EVENT: " + event);
                console.log("\t" + JSON.stringify(array_args));
                console.log("\t" + array_args);
            },
            setTriggerEvent = function (evtName) {
                casper.on(evtName, function () {
                    triggerEvent(evtName, arguments);
                });
            },
            eventsArray = [
                "back", "capture.saved", "click", "complete.error", "die", "downloaded.file",
                "downloaded.error", "error", "exit", "fill", "forward", "frame.changed", "http.auth",
                "http.status.[code]", "load.started", "load.failed", "load.finished", "log",
                "mouse.click", "mouse.down", "mouse.move", "mouse.up", "navigation.requested", "open",
                "page.created", "page.error", "page.initialized", "page.resource.received",
                "page.resource.requested", "popup.created", "popup.loaded", "popup.closed",
                "remote.alert", "remote.callback", "remote.longRunningScript", "remote.message",
                "resource.error", "resource.received", "resource.requested", "resource.timeout",
                "run.complete", "run.start", "starting", "started", "step.added", "step.bypassed",
                "step.complete", "step.created", "step.error", "step.start", "step.timeout", "timeout",
                "url.changed", "viewport.changed", "wait.done", "wait.start", "waitFor.timeout",
                "capture.target_filename", "echo.message", "log.message", "open.location", "page.confirm",
                "page.filePicker", "page.prompt"
            ],
            i,
            event;

        for (i = eventsArray.length - 1; i >= 0; i -= 1) {
            event = eventsArray[i];
            setTriggerEvent(event);
        }
    }

    casper.on('resource.requested', listener);
    casper.on('resource.received', receivedListener);

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

     // Output debug logging
    // if (debugOutput) {
    //     setDebugEvents();
    // }
    /*************************
    *
    * Begin test suite setup
    *
    *************************/
    var apiSuiteInstance = function() {
        var suite = this;

        /*******************
        *
        * Start Testing
        *
        *******************/
        // casper.start().then(function(response) {
        casper.start( wsiWeatherTileURL, function(response) {
        // casper.thenOpen(endpointUrl, { method: 'get', headers: { 'accept': 'application/json' } }, function (resp) {
            if (debugOutput) {
                console.log('-------------------------');
                console.log('  Response Output');
                console.log('-------------------------');
                var headerObject = response.headers;
                console.log(JSON.stringify(response));
                console.log('-------------------------');
            }

            weatherTileOutput = this.getPageContent();

            // Log HTTP Status of URL
            suite.processTestResults(response.status);

        }).run(function() {
            console.log(colorizer.colorize('Testing complete. ', 'COMMENT'));
            this.exit();
        });
    };

    // Log results in DB
    apiSuiteInstance.prototype.processTestResults = function (httpStatus) {
        var processUrl = configURL + '/utils/processRequest';

        // if (debugOutput) {
            console.log('>> process url: ' + processUrl);
            console.log('------------------------');
            console.log(' Process Results Data  ');
            console.log('------------------------');
            console.log('httpStatus => ' + httpStatus);
        // }

        casper.open(processUrl, {
            method: 'post',
            data:   {
                'task' : 'logWeatherTileCheck',
                'httpStatus' : httpStatus
            }
        });
    };

    new apiSuiteInstance(casper.cli.get('url'));
});
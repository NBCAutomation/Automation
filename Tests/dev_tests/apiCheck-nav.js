/* globals casper, require, console */
// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version:
// Case: Test API main manifest file to verify main key/values that allow the app to function correctly.
// Use: casperjs test [file_name]

// Dev Notes:
// Add a schema check for the plist/sml files
//  -- parser returning false, appears that the XML object is mising
//  var contentType = utils.getPropertyPath(this, 'currentResponse.contentType'); -- get current doc content type
//  
//  Manifest Testing Requirements:


var xmlLib = require('./xml2json');
var x2js = new xmlLib();

// var sax = require('./sax');
// var PlistParser = require('./plist-parser');

var colorizer = require('colorizer').create('Colorizer');

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

    this.__passed = [];
    this.__collected = {};

    var suite = this;
    var no_error = false;

    var type = casper.cli.get('type');

    if (type === 'manifest') {
        url = url + '/apps/news-app/manifest/?apiVersion=2';
    }

    casper.start( url ).then(function(response) {
        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
        }
    }).then(function() {
        suite.getContent(url, type);
        // require('utils').dump(jsonText);
    }).then(function() {
        // suite.__finished.forEach(function(res) {
        //     if (res.status != 200) {
        //         console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);
        //     };
        // });
    }).run();
};

apiSuite.prototype.getContent = function(url, type) {
    
    var suite = this;

    if (type === 'manifest') {
        casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
            var rawContent = this.getPageContent();

            // var parser = new DOMParser();
            // xmlDoc = parser.parseFromString(rawContent,'text/xml');

            
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
                        url = casper.cli.get('url') + url + '?apiVersion=2';
                  
                        suite.__collected[key] = url;
                    }
                }

                var __urlSuite = suite.__collected;

                for (var __prog in __urlSuite) {
                    if (__prog === 'navigation') {
                        // console.log(__prog + ' :: ' + __urlSuite[__prog]);
                        suite.checkNavigation(__urlSuite[__prog]);
                    }
                }

                // require('utils').dump( suite.__collected );

                // for (i = suite.__collected.length - 1; i >= 0; i--) {
                //     var __urlSuite = suite.__collected[i];
                //     for (var __prog in __urlSuite) {
                //         console.log(__prog + ' :: ' + __urlSuite[__prog]);
                //     }

                //     // suite.checkHealth();
                //     // suite.checkNavigation();
                // }

            } else {
                throw new Error('Missing XML elements!');
            }
        });
    } else if (type === 'navigation') {

    } else {
        console.log('other type of url');
    }
};

apiSuite.prototype.checkHealth = function(__url) {

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
                // this.echo(__url + colorizer.colorize(' Status: ' + status, 'INFO') );
                console.log('json checking 1');
                // suite.__passed.push({
                //     from: current.key,
                //     url: __url,
                //     status: status
                // });
                // console.log( ' -- array length: ' + suite.__passed.length );

                // for (var i = suite.__passed.length - 1; i >= 0; i--) {
                    
                    suite.validateJson(__url);

                    // var passedEndpoint = suite.__passed.shift();
                    // console.log(passedEndpoint);
                    //if ( passedEndpoint.from == current.key && current.key == 'navigation' ) {
                      //  console.log('~~  ' + suite.__passed[i].from);
                        //suite.validateJson(passedEndpoint.url, passedEndpoint.from);
                    //}
                // }
            }

            // suite.checkHealth();
        });
    } else {
        // delete this.__collected;
    }
};

// apiSuite.prototype.validateJson = function(__jUrl) {
//     var suite = this;
//     // var current = suite.__passed.shift();
// console.log('json checking 2');
//     if (__jUrl) {
//         // casper.open(current.url+'?cachebust='+Math.random(),{ method: 'get', headers: { 'Accept': 'text/xml', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
//         casper.open(__jUrl,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
//             resp = resp;
//             var validated = false;
//             var output = this.getPageContent();

//             // if (__output.indexOf('$')) {
//             //     console.log(__output);
//             // }

//             try {
//                 __output = JSON.parse(output);

//                 if( __output instanceof Object ) {
//                     var validated = true;
//                  }
//             } catch (e) {
//                 // ...
                
//             }

//             if (validated) {
//                 console.log('JSON VALIDATED');
//             } else {
//                 throw new Error('JSON error!');
//             }

//         });
//     } else {
//         // delete this.__collected;
//         console.log('here');
//     }
// };

apiSuite.prototype.checkNavigation = function(__url) {

    var suite = this;
    // var current = suite.__collected.shift();

    var showOutput = true;

    var reqKeys = new Array("appTitle","sectionMapping","location");

    // if (current.url) {
    if (__url) {
        casper.open(__url, {method: 'head'}).then(function(resp) {
            
            resp = resp;
            
            var status = this.status().currentHTTPStatus;

            if ( status == 200) {
                this.echo(__url + colorizer.colorize(' Status: ' + status, 'INFO') );

                casper.open(__url,{ method: 'get', headers: { 'accept': 'application/json', 'customerID': '8500529', 'useremail': 'discussion_api@clickability.com' } }).then(function(resp) {
                    resp = resp;
                    var validated = false;
                    var output = this.getPageContent();

                    // console.log(output);

                    __output = JSON.parse(output);

                    var mainItem = __output.items;

                    var count = 0;
                    
                    for (var __item in mainItem) {
                        
                        if(mainItem.hasOwnProperty(__item)){
                            count++;
                        }

                        var __thisItem = __output.items[count];

                        for (var __i in __thisItem) {
                            if (showOutput) {console.log(__i + ' : ' + __thisItem[__i])};

                            if (__i === '' && __i.length <= 0) {

                            }

                            // -------------------------------------

                            if (__i === 'items') {
                                
                                var __subItem = __output.items[count].items;

                                var __count = 0;

                                for (var __item in __subItem) {
                                    
                                    if(__subItem.hasOwnProperty(__item)){
                                        __count++;
                                    }

                                    var __lastItem = __output.items[count].items[__count];

                                    for (var __b in __lastItem) {
                                        if (showOutput) {console.log(' -  ' + __b + ' : ' + __lastItem[__b])};

                                    }
                                    if (showOutput) { console.log('    -----------------')};
                                }
                            }

                        }

                        console.log('-----------------');
                    }

                    // if (__output.indexOf('$')) {
                    //     console.log(__output);
                    // }

                    // try {
                    //     __output = JSON.parse(output);

                    //     if( __output instanceof Object ) {
                    //         var validated = true;
                    //      }
                    // } catch (e) {
                    //     // ...
                        
                    // }

                    // if (validated) {
                    //     console.log('JSON VALIDATED');
                    // } else {
                    //     throw new Error('JSON error!');
                    // }

                });
            }

            suite.checkHealth();
        });
    } else {
        // delete this.__collected; 
    }
};

new apiSuite(casper.cli.get('url'));
// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

// Dev Notes:
// Add a schema check for the plist/sml files
//  -- parser returning false, appears that the XML object is mising

var xmlLib = require('./xml2json');
var x2js = new xmlLib();

// var sax = require('./sax');
// var PlistParser = require('./plist-parser');

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

    this._finished = [];
    this.__collected = [];
    var suite = this;
    var manifestUrl = url + "/apps/news-app/manifest/?apiVersion=2";
    var no_error = false;


    casper.start( manifestUrl ).then(function(response) {

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
        }
    }).then(function() {
        suite.getPageContent(manifestUrl);
        // require('utils').dump(jsonText);
    }).then(function() {
        // suite._finished.forEach(function(res) {
        //     if (res.status != 200) {
        //         console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);
        //     };
        // });
    }).run();
};

apiSuite.prototype.checkHealth = function(endpoint) {

  var suite = this;
  // var current = this.__collected.shift();

    // require('utils').dump( this.__collected );

  if (endpoint) {
      casper.open(endpoint, {
        method: 'head'
      }).then(function(resp) {
        // suite._finished.push({
        //   from: current.from,
        //   url: current.url,
        //   status: this.status().currentHTTPStatus
        // });

        // suite.checkHealth();
        console.log('endpoint ~ ' + endpoint + ' || status ~ ' + this.status().currentHTTPStatus)
      });
    // }
  } else {
    delete this.__collected;
  }
};

apiSuite.prototype.getPageContent = function(manifestUrl) {
    
    var suite = this;
    var __collected = [];
    var __endpoints = [];

    casper.open(manifestUrl, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
        var rawContent = this.getPageContent();

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(rawContent,'text/xml');

        // var plist = new plistLib( rawContent );
        // var plist = new PlistParser( rawContent );
        
        // if(plist.validate()){
        //     // Parse the input, returning a JS object
        //     console.log('validated');
        // }

        // require('utils').dump( plist.validate() );
        
        if ( rawContent ) {

            var __jsonObj = x2js.xml_str2json( rawContent );

            // require('utils').dump( __jsonObj.plist.dict.key[0] );
            // require('utils').dump( __jsonObj );
            // console.log( __jsonObj.plist.dict.key[0] + " : " + __jsonObj.plist.dict.string[0] );
            // console.log( __jsonObj.plist.dict.key.length );
            // 
            // require('utils').dump( __jsonObj );
            
            var __baseKeys = __jsonObj.plist.dict.key;
            var __baseVals = __jsonObj.plist.dict.string;
            var __moduleKeys = __jsonObj.plist.dict.dict[0].key;
            var __moduleVals = __jsonObj.plist.dict.dict[0].string;

            for (var i = __moduleKeys.length - 1; i >= 0; i--) {
                __collected.push({
                    key: __moduleKeys[i],
                    url: __moduleVals[i].toString()
                });
            };

            for (var i = __collected.length - 1; i >= 0; i--) {
                
                var __endpoint = __collected[i].url;

                if ( !__endpoint.indexOf('/apps') ) {
                    suite.checkHealth( casper.cli.get('url') + __endpoint );
                    // console.log( casper.cli.get('url') + __endpoint );
                }
            };
            
        } else {
            throw new Error('Missing XML elements!');
        }
    });
};


new apiSuite(casper.cli.get('url'));
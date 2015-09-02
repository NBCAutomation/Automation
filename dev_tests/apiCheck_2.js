// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

// Dev Notes:
// Add a schema check for the plist/sml files

var xmlLib = require('./xml2json');
var x2js = new xmlLib();

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

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

apiSuite.prototype.checkHealth = function() {

  var suite = this;
  var current = this._tmp_collected.shift();

  if (current) {
      casper.open(current.url, {
        method: 'head'
      }).then(function(resp) {
        suite._finished.push({
          from: current.from,
          url: current.url,
          status: this.status().currentHTTPStatus
        });

        suite.checkHealth();
      });
    // }
  } else {
    delete this._tmp_collected;
  }
};

apiSuite.prototype.getPageContent = function(manifestUrl) {
    
    var suite = this;
    var __collected = [];

    casper.open(manifestUrl, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
        var rawContent = this.getPageContent();

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(rawContent,'text/xml');

        
        if ( rawContent ) {

            // var __jsonObj = x2js.xml_str2json( rawContent );
            var __jsonObj = x2js.json2xml_str( rawContent );

            // require('utils').dump( __jsonObj.plist.dict.key[0] );
            // require('utils').dump( __jsonObj );
            // console.log( __jsonObj.plist.dict.key[0] + " : " + __jsonObj.plist.dict.string[0] );
            // console.log( __jsonObj.plist.dict.key.length );
            
            var __baseKeys = __jsonObj.plist.dict.key;
            var __baseVals = __jsonObj.plist.dict.string;
            var __moduleKeys = __jsonObj.plist.dict.dict[0].key;
            var __moduleVals = __jsonObj.plist.dict.dict[0].string;
//Deltrie see sample xml-2-json
            for (var i = __moduleKeys.length - 1; i >= 0; i--) {
                
                // console.log( __moduleKeys[i] + " : " + __moduleVals[i] );
                var key = __moduleKeys[i];
                var obj = {};
                obj[key] = __moduleVals[i];

                __collected.push(obj);
            };

            require('utils').dump( __collected );
            
        } else {
            throw new Error('Missing XML elements!');
        }
    });
};


new apiSuite(casper.cli.get('url'));
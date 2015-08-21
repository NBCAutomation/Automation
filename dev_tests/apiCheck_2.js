// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

var apiSuite = function(url) {
    if (!url) {
        throw new Error('A URL is required!');
    }

    var suite = this;

    var manifestUrl = url + "/apps/news-app/manifest/?apiVersion=2";

    casper.start( manifestUrl ).then(function(response) {

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        if ( no_error ) {

        }
    }).then(function() {
        suite.xmlToJson(manifestUrl);
        // var jsonText = JSON.stringify(xmlToJson(xmlDoc));
        // require('utils').dump(jsonText);
    }).then(function() {
        // suite._finished.forEach(function(res) {
        //     if (res.status != 200) {
        //         console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);
        //     };
        // });
    }).run();
};

function xml2json(xml) {
    try {
    var obj = {};
    if (xmlUrl.children.length > 0) {
        for (var i = 0; i < xmlUrl.children.length; i++) {
            var item = xmlUrl.children.item(i);
            var nodeName = item.nodeName;

            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xml2json(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                var old = obj[nodeName];

                obj[nodeName] = [];
                obj[nodeName].push(old);
            }
                obj[nodeName].push(xml2json(item));
            }
        }
    } else {
        obj = xmlUrl.textContent;
    }
    return obj;
    } catch (e) {
        console.log(e.message);
    }
}

apiSuite.prototype.xmlToJson = function(xmlUrl) {
    // Create the return object
    var suite = this;
    // var obj = {};
    
    var page = require('webpage').create();
    page.open(xmlUrl, function() {
    // casper.open(xmlUrl, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {

        var rawContent = this.getPageContent();
        var __content = JSON.stringify(rawContent);

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(__content,'text/xml');
        var loc = xmlDoc.getElementsByTagName('plist');s
        
        // var rawData = content.getPageContent();
        // var htmlObject = this.page.framePlainText.replace(/[\r\n]/g, '\\n');
        
        require('utils').dump( this.content );

    });
};

apiSuite.prototype.XML2jsobj = function(node) {

    // var page = require('webpage').create();
    // page.open(node, function() {
    casper.open(node, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {

        var rawContent = this.getPageContent();
        var __json = JSON.stringify( rawContent );

        // require('utils').dump( rawContent.attributes );
        // require('utils').dump(JSON.parse( __json ));
        var pageObject = JSON.parse(__json);

        require('utils').dump( rawContent );


        var data = {};

        // append a value
        function Add(name, value) {
            if (data[name]) {
                if (data[name].constructor != Array) {
                    data[name] = [data[name]];
                }
                data[name][data[name].length] = value;
            }
            else {
                data[name] = value;
            }
        };

        // element attributes
        // var c, cn;
        // for (c = 0; cn = node.attributes[c]; c++) {
        //     Add(cn.name, cn.value);
        // }
        
        // // child elements
        // for (c = 0; cn = node.childNodes[c]; c++) {
        //     if (cn.nodeType == 1) {
        //         if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
        //             // text value
        //             Add(cn.nodeName, cn.firstChild.nodeValue);
        //         }
        //         else {
        //             // sub-object
        //             Add(cn.nodeName, XML2jsobj(cn));
        //         }
        //     }
        // }

        // return data;

    });

}


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


new apiSuite(casper.cli.get('url'));
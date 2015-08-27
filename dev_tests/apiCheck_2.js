// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

// http://stackoverflow.com/questions/21407578/accessing-xml-dom-child-nodes-by-name

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


apiSuite.prototype.xmlToJson = function(xml) {
    var suite = this; 
    
    var obj = {};

    if (xml.nodeType == 1) {                
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { 
        obj = xml.nodeValue;
    }            
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

apiSuite.prototype.getPageContent = function(url) {
    var suite = this;

    casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
        var rawContent = this.getPageContent();

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(rawContent,'text/xml');

        // var jsonObj = suite.xmlToJson();
        
        var xmlNode = xmlDoc.firstChild;
        var childNodes = xmlNode.childNodes;
        var innerNodes = xmlDoc.getElementsByTagName("dict")[0];
        
        // var getKeys = function(obj){
        //    var keys = [];
        //    for(var key in obj){
        //       keys.push(key);
        //    }
        //    return keys;
        // }
        
        // console.log( innerNodes.childNodes.length );

        // require('utils').dump( getKeys(childNodes) );
        // require('utils').dump( childNodes.item );

        // if ( xmlNode.hasChildNodes() ) {
        //     console.log("has children");
            
        //     var children = xmlNode.childNodes;

        //     for (var i = 0; i < innerNodes.length; i++) {
        //        console.log(innerNodes[i].nodeName);
        //     }

            var node;
            var __nodes = [];
            
            var arr = [];
            for (var key in innerNodes){
                arr.push([]);
                var nodes = innerNodes[key].childNodes;
                for (var ele in nodes){  
                    if(nodes[ele]){
                      arr[key].push(nodes[ele]);
                    }
                }
            }
            console.log(arr);
            
            // for(var i = 0; i < innerNodes.childNodes.length; i++) {
            //     node = innerNodes.childNodes[i];
            //     console.log("type: " + node.nodeType + " : " + node.nodeName + " : " + node.textContent);

            //     if (node.nodeName == 'key') {   
            //         // __nodes.push({
            //         //     node.nodeName: node.textContent
            //         // })
            //     }
            //     if (node.childNodes.length > -1 && node.nodeType == 1 && node.nodeName == 'dict') {
            //         var __currentNode = node;

            //         for(var i = 0; i < __currentNode.childNodes.length; i++) {
            //             __node = __currentNode.childNodes[i];
            //             console.log(">> type: " + __node.nodeType + " : " + __node.nodeName + " : " + __node.textContent);
            //         }
            //     }
            //   // if(node.nodeType !== Node.TEXT_NODE) console.log(node.getElementsByTagName('child1')[0].textContent);
            // }
        // }
    });
};

new apiSuite(casper.cli.get('url'));
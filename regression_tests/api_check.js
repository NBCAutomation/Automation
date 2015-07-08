// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: 
// Use: casperjs [file_name] --url="[site_url]"
// http://stackoverflow.com/questions/12980648/map-html-to-json
// http://stackoverflow.com/questions/18308148/trimming-n-s-t-from-javascript-string

var utils = require('utils');
var siteUrl = casper.cli.get("url");


// http://stackoverflow.com/questions/12980648/map-html-to-json
function mapDOM(element, json) {
    var treeObject = {};
    
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser)
        {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
        }
        else // Microsoft strikes again
        {
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element); 
        } 
        element = docNode.firstChild;
    }
    
    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object["content"].push(nodeList[i].nodeValue);
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);
    
    return (json) ? JSON.stringify(treeObject) : treeObject;
}



casper.test.begin('OTS API Check', function suite(test) {

    casper.start( siteUrl, function(response) {
        
        // require('utils').dump(response);

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        casper.then(function() {
            if ( no_error ) {
                this.echo('URL loaded, attempting to parse JSON');

                casper.open(siteUrl, { method: 'get', headers: {'Accept': 'application/json'} }).then(function() {
                    
                    // var json = JSON.parse( this.page.content());
                    var apiObject = this.getHTML('body');

                    // var json = JSON.stringify(eval("(" + apiObject + ")"));

                    // this.echo( json.breakingNews.contentID );
                    json = mapDOM( apiObject, true );
                    require('utils').dump(json);
                });        
            }
        });

    }).run(function() {
        test.done();
    });
});
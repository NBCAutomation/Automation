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
var x2js = new xmlLib({
    attributePrefix : "<string>"
});

// var sax = require('./sax');
// var PlistParser = require('./plist-parser');

var apiSuite = function(url) {

    if (!url) {
        throw new Error('A URL is required!');
    }

    __collected = [];

    var suite = this;
    var no_error = false;

    var type = casper.cli.get('type');

    // Add manifest url    
    url = url + '/apps/news-app/manifest/?apiVersion=2';
    

    casper.start( url ).then(function(response) {
        if ( response.status == 200 ) {
            no_error = true;
        } else {
            throw new Error('Page not loaded correctly. Response: ' + response.status).exit();
        }
    }).then(function() {
        suite.getContent(url, type);
        // require('utils').dump(jsonText);
    }).run();
};

apiSuite.prototype.getContent = function(url, type) {
    
    var suite = this;

    casper.test.begin('OTS API Check', function suite(test) {
        casper.open(url, { method: 'get', headers: { 'Accept': 'text/xml' } }).then(function() {
            var rawContent = this.getPageContent();

            if ( rawContent ) {

                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(rawContent,'text/xml');

                // var __json = JSON.stringify( rawContent );

                // var urlObject = JSON.parse(__json);

                var nodeDicts = xmlDoc.getElementsByTagName("dict");

                // var nodeKeys = xmlDoc.getElementsByTagName("key");
                // var nodeVals = xmlDoc.getElementsByTagName("string");
                // var nodeInts = xmlDoc.getElementsByTagName("int");

                // console.log('nodes ' + nodeDicts.length);

                for(var i = 0; i < nodeDicts.length; i++) {
                    // console.log(i + ' || ' + nodeDicts[i].nodeName);

                    var cNode = nodeDicts[i];
                    // console.log(cNode.childNodes.length);

                    if (cNode.hasChildNodes) {
                        var children = cNode.childNodes;
                        // console.log(children.length);

                        for(var b = 0; b < children.length; b++) {
                                
                            // console.log(b + ' -- name: ' + children[b].nodeName + ' // ' + JSON.stringify(children[b].textContent) );

                            if (children[b].nodeName == 'key') {
                                // console.log('key // ' + children[b].textContent);
                                var __key = children[b].textContent;
                            }
                            
                            // nType = children[b].nodeName;
                            
                            // console.log('sub-children ' + children[b].childNodes.length);

                            if (children[b].textContent.indexOf('$') >= 0 ) {
                                throw new Error('Manifest invalid, variable found in key values; Search "$" on manifest file.');
                            } else {
                                if (children[b].childNodes.length > 1) {
                                    var subChildren = children[b].childNodes;

                                    for(var c = 0; c < subChildren.length; c++) {
                                        // console.log(' -- sub-child ' + ' -- name: ' + subChildren[c].nodeName + ' // ' + ' -- content: ' + subChildren[c].textContent);
                                        
                                        // if (subChildren[c].nodeName == 'dict') {
                                        //     console.log(' - key // ' + subChildren[c].textContent);
                                        // }

                                        if (subChildren[c].nodeName == 'dict') {
                                            // console.log(' ** prev ** ' + subChildren[c].previousElementSibling.textContent);
                                            // console.log(' ** dict **');

                                            if (subChildren[c].childNodes.length > 1) {
                                                var thirdChildren = subChildren[c].childNodes;

                                                for(var d = 0; d < thirdChildren.length; d++) {
                                                    // console.log(' ---- third-child ' + thirdChildren[d].nodeName + ' // ' + ' -- content: ' + thirdChildren[d].textContent);
                                                                                                        
                                                    if (thirdChildren[d].nodeName == 'key') {
                                                        // console.log(' --> key // ' + thirdChildren[d].textContent);
                                                        var __subKey = thirdChildren[d].textContent;
                                                    }
                                                    
                                                    if (thirdChildren[d].nodeName == 'string' || thirdChildren[d].nodeName == 'integer' || thirdChildren[d].nodeName == 'real') {
                                                        // console.log(' --> val // ' + thirdChildren[d].textContent + ' ** type ' + typeof(thirdChildren[d].textContent) );
                                                        var __subVal = thirdChildren[d].textContent;
                                                    } else if (thirdChildren[d].nodeName == 'false' || thirdChildren[d].nodeName == 'true') {
                                                        // console.log(' --> val // ' + thirdChildren[d].nodeName);
                                                        var __subVal = thirdChildren[d].nodeName;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real' || children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                    // console.log(' -- val // ' + children[b].textContent);
                                    
                                    if (children[b].nodeName == 'string' || children[b].nodeName == 'integer' || children[b].nodeName == 'real') {
                                        var __val = children[b].textContent;
                                    } else if (children[b].nodeName == 'false' || children[b].nodeName == 'true') {
                                        var __val = children[b].nodeName;
                                    }
                                }
                            }
                        }
                    }

                    // console.log('-> // ' + nodeVal[i].nodeName + ' // ' + nodeVal[i].textContent);
                    // console.log('--> // ' + nodeInts[i].nodeName + ' // ' + nodeInts[i].textContent);
                }

            } else {
                throw new Error('Missing XML elements!');
            }
        })
    });
};

new apiSuite(casper.cli.get('url'));
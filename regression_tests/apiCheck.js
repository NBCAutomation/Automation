// Author: Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: 
// Use: casperjs [file_name] --url="[site_url]"
// 
// http://www.nbcnewyork.com/apps/news-app/home/modules/
// http://stackoverflow.com/questions/12980648/map-html-to-json
// http://stackoverflow.com/questions/18308148/trimming-n-s-t-from-javascript-string

// *** Running into an error parsing the json string. currently no use cases on how to test or what to look for.

var utils = require('utils');
var siteUrl = casper.cli.get("url");

casper.test.begin('OTS API Check', function suite(test) {

    casper.start( siteUrl, function(response) {
        
        // require('utils').dump(this.page.framePlainText);

        if ( response.status == 200 ) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        
        if ( no_error ) {
            this.echo('URL loaded, attempting to parse JSON');

            var rawData = this.getPageContent();
                var htmlObject = this.page.framePlainText.replace(/[\r\n]/g, '\\n');
                // var htmlObject = rawData.replace(/[\n\t\r]/g,"");
                // Facebook Boyfriend\n" " It is horrific and unprecedented," Union County

                // var json = JSON.stringify( htmlObject );

                this.echo( htmlObject );

                // this.echo(rawData);
                // var apiObject = JSON.parse( htmlObject );

                // this.echo( json.breakingNews.contentID );
                // json = mapDOM( apiObject, true );
                // require('utils').dump( htmlObject );
            // casper.open(siteUrl, { method: 'get', headers: { 'Accept': 'application/json' } }).then(function(page) {
                
                
                
            //     this.echo( typeof apiObject );
            // });        
        }
        

    }).run(function() {
        test.done();
    });
});

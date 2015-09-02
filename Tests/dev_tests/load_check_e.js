var utils = require('utils');
var siteUrl = casper.cli.get("url");
var no_error = false;

viewports = [
  {
    'name': 'samsung-galaxy_y-portrait',
    'viewport': {width: 240, height: 320}
  },
  {
    'name': 'samsung-galaxy_y-landscape',
    'viewport': {width: 320, height: 240}
  },
  {
    'name': 'iphone5-portrait',
    'viewport': {width: 320, height: 568}
  },
  {
    'name': 'iphone5-landscape',
    'viewport': {width: 568, height: 320}
  },
  {
    'name': 'htc-one-portrait',
    'viewport': {width: 360, height: 640}
  },
  {
    'name': 'htc-one-landscape',
    'viewport': {width: 640, height: 360}
  },
  {
    'name': 'nokia-lumia-920-portrait',
    'viewport': {width: 240, height: 320}
  },
  {
    'name': 'nokia-lumia-920-landscape',
    'viewport': {width: 320, height: 240}
  },
  {
    'name': 'google-nexus-7-portrait',
    'viewport': {width: 603, height: 966}
  },
  {
    'name': 'google-nexus-7-landscape',
    'viewport': {width: 966, height: 603}
  },
  {
    'name': 'ipad-portrait',
    'viewport': {width: 768, height: 1024}
  },
  {
    'name': 'ipad-landscape',
    'viewport': {width: 1024, height: 768}
  },
  {
    'name': 'desktop-standard-vga',
    'viewport': {width: 640, height: 480}
  },
  {
    'name': 'desktop-standard-svga',
    'viewport': {width: 800, height: 600}
  },
  {
    'name': 'desktop-standard-hd',
    'viewport': {width: 1280, height: 720}
  },
  {
    'name': 'desktop-standard-sxga',
    'viewport': {width: 1280, height: 1024}
  },
  {
    'name': 'desktop-standard-sxga-plus',
    'viewport': {width: 1400, height: 1050}
  },
  {
    'name': 'desktop-standard-uxga',
    'viewport': {width: 1600, height: 1200}
  },
  {
    'name': 'desktop-standard-wuxga',
    'viewport': {width: 1920, height: 1200}
  },

];


casper.test.begin('Page laod/wrapper tests', function suite(test) {

    casper.start( siteUrl, function(response) {
        
        require('utils').dump(response);

        if (response.status == 200) {
            no_error = true;
        } else {
            this.echo('Page not loaded correctly. Response: ' + response.status).exit();
        }

        casper.then(function() {
            if ( no_error ) {
                test.assertSelectorHasText('body', 'nbc', "NBC Property");

                test.assertSelectorHasText('body', 'home', "Homepage loaded");

                test.assertExists('#masthead', "The masthead area loaded correctly.");
                    test.assertVisible('.homepageTitle img', "...is visible.");

                test.assertExists('#body', "The body area loaded correctly.");
                    test.assertVisible('#body', "...is visible.");

                test.assertExists('#nav', "The nav loaded correctly.");
                    test.assertVisible('#nav', "...is visible.");

                test.assertExists('#footer', "The footer area loaded correctly.");
                    test.assertVisible('#footer', "...is visible.");


                casper.each(viewports, function(casper, viewport) {
                    var screenshotUrl = response.url;

                    this.then(function() {
                        this.viewport(viewport.viewport.width, viewport.viewport.height);
                    });
                    this.thenOpen(screenshotUrl, function() {
                        this.wait(5000);
                    });
                    this.then(function(){
                        this.echo('Screenshot for ' + viewport.name + ' (' + viewport.viewport.width + 'x' + viewport.viewport.height + ')', 'info');
                        this.capture('screenshots/' + screenshotDateTime + '/' + viewport.name + '-' + viewport.viewport.width + 'x' + viewport.viewport.height + '.png', {
                            top: 0,
                            left: 0,
                            width: viewport.viewport.width,
                            height: viewport.viewport.height
                        });
                    });
                });
            }
        });

    }).run(function() {
        test.done();
    });
});
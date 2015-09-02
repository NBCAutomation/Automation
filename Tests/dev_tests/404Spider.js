// Author: Seth Benjamin, Deltrie Allen
// Contact: deltrie.allen@nbcuni.com
// Version: 0.01
// Case: Builds and array of links using the main nav as a starting point, then does a status check on each collected link.
// Use: casperjs test [file_name] --url=[site_url]

var SpiderSuite = function(url) {
  if (!url) {
    throw new Error('A URL is required!');
  }

  this._baseUrl = url.replace(/\/$/, '');
  this._finished = [];
  this._collected = [];

  var suite = this;
  var destinations = [];

  casper.start(url).then(function() {
    suite.evaluateAndPushUrls(this, '#nav a', destinations);

    destinations = destinations.slice(2);
  }).then(function() {
    suite.collectFromDestinations(destinations);
  }).then(function() {
    suite.checkHealth();
  }).then(function() {
    suite._finished.forEach(function(res) {
      if (res.status != 200) {
        console.log(res.from + ' - ' + res.status + ' ~> ' + res.url);
      };
    });
  }).run();
};


SpiderSuite.prototype.collectFromDestinations = function(destinations) {
  if (!this._destinations) {
    this._destinations = [].slice.call(destinations);
  }

  var suite = this;
  var current = this._destinations.shift();

  if (current) {
    casper.open(current.url).then(function() {
      suite.evaluateAndPushUrls(this, 'a', suite._collected, current.url);
      suite.collectFromDestinations();
    });
  } else {
    delete this._destinations;
  }
};

SpiderSuite.prototype.evaluateAndPushUrls = function(page, selector, append, from) {
  var evaluatedUrls = page.evaluate(function(baseUrl, selector) {
    var socialRegex = /(twitter|facebook|instagram|javascript:|mailto:)/;
    var protocolRegex = /:\/\//;

    return __utils__.findAll(selector).map(function(element) {
      return element.getAttribute('href');
    }).filter(function(url) {
      return url && !socialRegex.test(url);
    }).map(function(url) {
      if (!protocolRegex.test(url)) {
        url = baseUrl + ('/' + url).replace(/\/{2,}/g, '/');
      }

      return url;
    });
  }, this._baseUrl, selector);

  evaluatedUrls.forEach(function(url) {
    if (append.indexOf(url) === -1) {
      append.push({
        url: url,
        from: from
      });
    }
  });
};

SpiderSuite.prototype.checkHealth = function() {
  if (!this._tmp_collected) {
    this._tmp_collected = [].slice.call(this._collected);
  }

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
  } else {
    delete this._tmp_collected;
  }
};


new SpiderSuite(casper.cli.get('url'));
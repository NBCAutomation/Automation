var http = require('http');

var options = {
  host: 'www.nbcnewyork.com',
  port: 80,
  path: '/apps/news-app/home/modules/'
};

var content = '';

var req = http.request(options, function(res) {
  res.setEncoding('utf8');

  res.on('data', function(chunk) {
    content += chunk;
  });

  res.on('end', function() {
    var json = JSON.parse(content);

    json.modules.forEach(function(a) {
      console.log('Module[' + a.moduleID + '] ~> ' + a.title);
    });
  });
});

req.end();
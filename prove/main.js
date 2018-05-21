var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = q.href.replace("/", "");
  fs.readFile(filename, function(err, data) {
    if (err) {
    console.log("Qualcuno è entrato nel sito ma ha ricevuto 404");
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
else{
    console.log("Qualcuno è entrato nel sito in: " + req.url);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
}
  });
}).listen(8080); 
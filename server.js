var http = require("http");
var url = require("url");

function start() {
  httpserver = http.createServer(function(req,res){ res.end('hello world'); }).listen(8888);
  console.log("Server has started.");
  return httpserver;
}

exports.start = start;
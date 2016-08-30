/*jslint node: true */
'use strict';
var express = require('express');
var url = require('url');
var morgan = require('morgan');
var prerender = require('prerender-node');

// http://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
process.on('uncaughtException', function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

var app = express();
app.use(morgan("combined"));

app.use(prerender
  .set('prerenderServiceUrl', 'http://prerender.mydomain.com')
  .set('forwardHeaders', true)
);

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('index.html', {
    root: "./"
  });
});

var server = app.listen(80, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Craigsmenu web redeployed. Now serving at http://%s:%s', host, port);
});

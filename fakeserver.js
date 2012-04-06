/*
 * Fake master server. Provides a handful of IP addresses.  The fake server
 * does not interact with a database, so it's useful for testing the worker.
 */

var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());

app.get('/getwork', function(req, res) {
  addresses = [];
  for (d = 1; d <= 254; d++) {
    addresses.push('172.203.55.' + d);
  }
  data = {range: addresses};
  console.log('Providing work to a worker');
  res.send(data);
});

app.post('/postresults', function(req, res) {
  console.log('Got results from worker:');
  //console.log(JSON.stringify(req.body));
  console.log(req.body.length);
  res.send();
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

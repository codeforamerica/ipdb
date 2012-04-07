var dns = require('dns');
var request = require('request');
var uuid = require('node-uuid');

WORK_URL_BASE = 'http://localhost:3000/getwork';
POST_URL_BASE = 'http://localhost:3000/postresults';

var debuglog = function(s) {}
var debuglog = console.log;

var ID = uuid.v1();
var workUrl = WORK_URL_BASE + '/' + ID;
var postUrl = POST_URL_BASE + '/' + ID;


function getWork() {
  debuglog('Getting more work');
  // Get range of IP addresses
  request.get({uri: workUrl}, function(error, response, body) {
    if (error != null && response.statusCode != 200) {
      console.log('Error grabbing a block.');
    } else {
      debuglog('Received more work');
      var data = JSON.parse(body);
      process(data.range);
    }
  });
}

function process(addresses) {
  var results = [];
  var count = 0;
  var total = addresses.length;

  // Iterate over addresses and do the reverse lookup.
  addresses.forEach(function(address) {
    debuglog('Kicking off a dns reverse lookup for: ' + address);
    dns.reverse(address, function(err, domains) {
      if (err != null) {
        console.log('reverse for ' + ip + ' failed: ' + err.message);
      } else {
        debuglog('dns results for: ' + address + ' = ' + domains[0]);
        results.push({address: address, domains: domains});
        if (++count == total) {
          done(results);
        }
      }
    });
  });
}

function done(results) {
  //console.log(JSON.stringify(results));

  // Post the results back to the server
  request.post({url: postUrl, json: results}, function(error, body) {
    if (error != null) {
      console.log('Received an error posting the results back to the server: ' + error.message);
    } else {
      console.log('Posted results back to the server successfully.');
      // Grab another block and start over.
      getWork();
    }
  });
}

getWork();


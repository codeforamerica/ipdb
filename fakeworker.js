var request = require('request');
var uuid = require('node-uuid');

WORK_URL_BASE = 'http://localhost:3000/getwork';
POST_URL_BASE = 'http://localhost:3000/postresults';

var ID = uuid.v1();
var workUrl = WORK_URL_BASE + '/' + ID;
var postUrl = POST_URL_BASE + '/' + ID;


function getWork() {
  console.log('Getting more work from ' + workUrl);
  // Get range of IP addresses
  request.get({uri: workUrl}, function(error, response, body) {
    if (error != null && response.statusCode != 200) {
      console.log('Error grabbing a block.');
    } else {
      console.log('Received more work');
      var data = JSON.parse(body);
      process(data.range);
    }
  });
}

function process(addresses) {
  console.log('This is the work we got from the server:');
  console.log(JSON.stringify(addresses));
  done();
}

function done() {
  var results = [];
  console.log('Posting empty set of results to ' + postUrl);
  // Post the results back to the server
  request.post({url: postUrl, json: results}, function(error, body) {
    if (error != null) {
      console.log('Received an error posting the results back to the server: ' + error.message);
    } else {
      console.log('Posted results back to the server successfully.');
    }
  });
}


console.log('I am worker ' + ID);
getWork();

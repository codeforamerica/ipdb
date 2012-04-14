var dns = require('dns');
var request = require('request');
var uuid = require('node-uuid');

var Worker = {};

(function () {
    // I'm a closure, I have local scope
	var WORK_URL_BASE = 'http://localhost:3000/getwork';
	var POST_URL_BASE = 'http://localhost:3000/postresults';
	
	var debuglog = function(s) {}
	var debuglog = console.log;
	
	var ID = uuid.v1();
	var workUrl = WORK_URL_BASE + '/' + ID;
	var postUrl = POST_URL_BASE + '/' + ID;



	Worker.getWork = function () {
	  debuglog('Getting more work');
	  // Get range of IP addresses
	  request.get({uri: workUrl}, function(error, response, body) {
	    if (error != null && response.statusCode != 200) {
	      console.log('Error grabbing a block.');
	    } 
      else {
	      debuglog('Received more work');

        console.log('body'+body);
	      var data = JSON.parse(body);
	      Worker.process(data);
	    }
	  });
	}

	Worker.process = function (addresses) {
	  var results = [];
	  var count = 0;
	  var total = addresses.length;

    console.log(addresses);
	  // Iterate over addresses and do the reverse lookup.
	  addresses.forEach(function(address) {
	    debuglog('Kicking off a dns reverse lookup for: ' + address._id);
	    dns.reverse(address._id, function(err, domains) {
        if (err != null) {
          console.log('DNS lookup for ' + address._id + ' failed: ' + err.message);
          results.push({_id: address._id, status: 'failed', domains: domains});
        } 
        else {
          debuglog('DNS results for: ' + address._id + ' = ' + domains[0]);
          results.push({_id: address._id, status: 'complete', domains: domains});
        }
        
        if (++count == total) {
          console.log('Sending work back')
          console.log(results.length);    
          Worker.done(results);
        }
      });
	  });
	}

	Worker.done = function (results) {
	  //console.log(JSON.stringify(results));
	  // Post the results back to the server
      
	  request.post({url: postUrl, json: results}, function(error, body) {
	    if (error != null) {
	      console.log('Received an error posting the results back to the server: ' + error.message);
	    } else {
	      console.log('Posted results back to the server successfully.');
	      // Grab another block and start over.
	      Worker.getWork();
	    }
	  });
	}

}) ();


Worker.getWork();







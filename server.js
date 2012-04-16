/*
 * Master server. Provides a handful of IP addresses.
 */

var express = require('express');
var mongodb = require('mongodb');

var app = express.createServer();

var db = new mongodb.Db('test', new mongodb.Server('127.0.0.1', 27017, {}), {});

app.use(express.bodyParser());


var arguments = process.argv.splice(2);




app.get('/getwork/:id', function(request, response) {  

  db.collection('ipdb', function(err, collection) {	  
  	addresses = [];
    
    /*
    TODO: we need an IP generator.
    */
  	for (d = 1; d <= 5; d++) {
  		addresses.push( {ip: '172.203.55.' + d, worker: request.params.id, status: 'pending'});
  	}
  
    collection.insert( addresses,
                      { safe:true },
                      function(err, objects) {
                        if (err){
                          console.warn(err.message);
                          response.send();
                        }
                        else{
                          console.log('Providing work to worker ' + request.params.id);
                          response.send(addresses);
                        }
    });
  });
});

app.post('/postresults/:id', function(request, res) {
  response = res.req.body;
  
  console.log('Got ' +response.length +' results from worker:');
	
  var status_sets = {complete : [], failed : []};

  for (i =0; i < response.length; i++) {
    status_sets[response[i].status].push(response[i].ip);
  }  
  
  console.log('There are  '+Object.keys(status_sets).length + ' number of statuses');
  for (var current_status in status_sets) {    
     
    db.collection('ipdb', function(err, collection) {
      if(status_sets[current_status].length){
        console.log('We are now updating addresses with status set to: ' + current_status);

        collection.update(	{ worker: request.params.id, ip:  {"$in": status_sets[current_status]} }, 
                {"$set": {status: current_status}}, 
    						{ safe:true, multi:true },
    						function(err) {
    							if (err){
    								console.log("Error: " + err.message);
    							}
    							else {
    								res.send();
    								console.log('Successfully updated');
    							}
    						});
      }
    });
  }

});

db.open(function() {
  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });
});





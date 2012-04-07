/*
 * Fake master server. Provides a handful of IP addresses.  The fake server
 * does not interact with a database, so it's useful for testing the worker.
 */

var express = require('express');
var mongodb = require('mongodb');

var app = express.createServer();

var db = new mongodb.Db('test', new mongodb.Server('127.0.0.1', 27017, {}), {});

app.use(express.bodyParser());

app.get('/getwork/:id', function(request, response) {  

  db.collection('ipdb', function(err, collection) {	  
	addresses = [];
	for (d = 1; d <= 254; d++) {
		addresses.push('172.203.55.' + d);
	}
	data = {range: addresses, worker: request.params.id, status: 'pending'};
	
	console.log(data)
	  
	collection.insert(  data, 
						{ safe:true },
                    	function(err, objects) {
							console.log(objects);
							if (err){ 
								console.warn(err.message);
							    response.send();
							}
							else{
							    console.log('Providing work to a worker');
							    response.send(data);
							}
  						});
  });
  
});

app.post('/postresults/:id', function(request, response) {
  console.log('Got ' +response.length +' results from worker:');
	
  db.collection('ipdb', function(err, collection) {
    collection.update(	{ worker: request.params.id }, 
						response, 
						{ safe:true, multi:true },
						function(err) {
							if (err){
								console.warn(err.message);
							}
							else {
								console.log(request.body);
								response.send();
								console.log('successfully updated');
							}
						});
	});

});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



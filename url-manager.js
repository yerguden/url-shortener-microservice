var MongoClient = require('mongodb').MongoClient

var mongoDB;
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/urls';

exports.getShorthenedUrl = function(url) {

}

exports.connectToDB = function(callback){
	MongoClient.connect(url, function (err, db) {
 	if (err) {
 		console.log('Unable to connect to the mongoDB server. Error:', err);
 		if(!!callback)
 			callback(err);
  	} else {
    	console.log('Connection established');
    	mongoDB = db
    	if(!!callback)
 			callback();
  	}
	});
}

exports.findUrl = function(shortUrl, callback){
	
	var urls = mongoDB.collection('urls');
	console.log(shortUrl);
	urls.findOne( { shorthened_url: shortUrl } ,function(err, item){
		if(err)
			callback(err);
		else if(!!item)
			callback(null, item.original_url);
		else 
			callback(true);
	});
}

exports.insertUrl = function(url, callback){
	var shortUrl = random(1000, 9999);
	var urls = mongoDB.collection('urls');
	var url = {original_url : url, shorthened_url : shortUrl};
	urls.insert(url, function(err, result){
		if(err)
			callback(err);
		else
			callback(null, shortUrl);
	});
}

exports.getAllUrls = function(shortUrl, callback){
	
		var urls = mongoDB.collection('urls');
		var cursor = urls.find();
		cursor.each(function(err, item) {
	    // If the item is null then the cursor is exhausted/empty and closed
	    if(item == null) {
	        return;
	    }
	    // otherwise, do something with the item
	});
}

function random(low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
}
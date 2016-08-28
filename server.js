var express = require('express');
var app = express();

var validUrl = require('valid-url');
var urlManager = require('./url-manager');

urlManager.connectToDB();

app.get('/new/*', function(req, res){
	var url;
	if(req.url.length > "/new/".length)
		url = req.url.substring("/new/".length);

	if(!!url && validUrl.isUri(url))
		urlManager.insertUrl(url,setResponse);
	else
		res.json({ error: "Wrong url format, make sure you have a valid protocol and real site."});

	function setResponse(err, shorthenedUrl){
		if(err)
			res.json({error : "I Failed You :(" , details : err});
		else
			res.json({ original_url: url, shorthened_url: req.protocol + '://' + req.get('host') + '/' +  shorthenedUrl });
	}
});

app.get('/', function(req, res){
	res.json({ how_to: 'go to ' + req.protocol + '://' + req.get('host') + '/new/YOUR_URL to get your short Url' });	
});

app.get('/*', function(req, res){
	var shorthenedUrl;
	if(req.url.length > 1){
		shorthenedUrl = req.url.substring("/".length);
	}

	if(!!shorthenedUrl){
		shorthenedUrl = parseInt(shorthenedUrl);
		urlManager.findUrl(shorthenedUrl,forward);
	}
	else
		res.json({ error: "Wrong url format, make sure you have a valid protocol and real site."});

	function forward(err, url){
		if(err)
			res.json({error : "Failed to find original_url"});
		else
			res.redirect(url);
	}
	
});

app.listen(process.env.PORT||3000);



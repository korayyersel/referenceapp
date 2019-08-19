"use strict";

var https = require("https");

module.exports = function (app) {
	app.get("/callJavaService", function (req, res) {
        var destinations = JSON.parse(process.env.destinations);        
        var filteredDestinations = destinations.filter(function (obj) {
            return obj.name === "referenceapp-java-api";
        });
        if (!filteredDestinations) {
            res.status(500).send("Destination is not set");
            return;
        }
        var javaDestination = filteredDestinations[0];        
        var javaDestinationHost = javaDestination.url.toString().replace("https://", "").replace("http://", "");
		var options = {
            host: javaDestinationHost,
			port: 443,
			method: 'GET',
			path: '/hello',
			headers: {
				authorization: req.headers.authorization
			}
		};           
		
		// request object
		var req1 = https.request(options, function (res1) {
			var result = '';
			res1.on('data', function (chunk) {
				result += chunk;
			});
			res1.on('end', function () {
				res.status(200).send(result);
				return;
			});
			res1.on('error', function (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			})
		});
		// req error
		req1.on('error', function (err) {
			console.log(err);
			res.status(500).send(err);
			return;
		});

		req1.end();
	});
};
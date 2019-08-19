"use strict";

var https = require("https");
var xsenv = require("@sap/xsenv");

module.exports = function (app) {
	app.get("/callJavaService", function (req, res) {
		// TODO use here destination / user provided service > not a static URL
		var options = {
			host: "sbb-e1n1dev-i-0001-mra-mittelfristige-ressourcenplanung-e27eff5.cfapps.eu10.hana.ondemand.com",
			port: 443,
			method: 'GET',
			path: '/hello',
			headers: {
				authorization: req.headers.authorization
			}
		};
		
		var userProvided = xsenv.getServices("user-provided");
		console.dir(userProvided);
		
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
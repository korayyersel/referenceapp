"use strict";

var express = require("express");
var hdbext = require("@sap/hdbext");
var xsenv = require("@sap/xsenv");
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

module.exports = function (app) {
	app.get("/replicate/replicateRemoteData", function (req, res) {
		console.log("replicateRemoteData job started...");
		hdbext.createConnection(hanaOptions.hana, (err, client) => {
			if (err) {
				console.error("ERROR: " + err.toString());
				res.type("text/plain").status(500).send('ERROR: ${err.toString()}');
				return;
			}
			// Load procedure (client, schemaName, procedureName, callback)
			hdbext.loadProcedure(client, null, "replicateRemoteData", (err1, sp) => {
				if (err1) {
					console.error("ERROR: " + err1.toString());
					res.type("text/plain").status(500).send('ERROR: ${err1.toString()}');
					return;
				}
				// Execute procedure (Input Params, callback(errors, Output [Scalar Params | Table Params])
				sp({}, (err2) => {
					client.close();

					if (err2) {
						console.log("ERROR: " + err2.toString());
						res.type("text/plain").status(500).send('ERROR: ${err2.toString()}');
						return;
					}
					console.log("replicateRemoteData job ended...");
					res.json({
						status: "job ok"
					});
				});
			});
		});
	});
};
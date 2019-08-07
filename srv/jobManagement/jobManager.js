"use strict";

var schedulerLib = require("../lib/schedulerLib");

module.exports = function (app) {
	app.get("/jobs/create/replicateRemoteData", function (req, res) {
		if (!req.authInfo.checkScope("$XSAPPNAME.JobManager.Create")) {
		    res.type("text/plain").status(403).send("Forbidden");
		}
		// get the full URI of this app
		var thisApp = JSON.parse(process.env.VCAP_APPLICATION);
		var thisAppURI = thisApp.application_uris[0];
		var myJob = {
			job: {
				"name": "replicateRemoteData",
				"description": "replicateRemoteData",
				"action": "https://" + thisAppURI + "/replicate/replicateRemoteData",
				"active": true,
				"httpMethod": "GET",
				"schedules": [{
					"cron": "* * * * * */5 0",
					"description": "every 5 minutes, run this schedule",
					"data": {},
					"active": true
				}]
			}
		};

		schedulerLib.createJob(myJob)
			.then(function (body) {
				res.status(200).json(body);
			})
			.catch(function (err) {
				res.status(500).send(err.toString());
			});
	});
};
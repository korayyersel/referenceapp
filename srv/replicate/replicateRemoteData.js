"use strict";

var hdbext = require("@sap/hdbext");
var xsenv = require("@sap/xsenv");
var schedulerLib = require("../lib/schedulerLib");

module.exports = function (app) {
	app.get("/replicate/replicateRemoteData", function (req, res) {
		console.log("replicateRemoteData job started...");
		var jobID = req.get("x-sap-job-id");
		var jobScheduleId = req.get("x-sap-job-schedule-id");
		var jobRunId = req.get("x-sap-job-run-id");

		var schedulerUpdateRequest = {
			jobId: jobID,
			scheduleId: jobScheduleId,
			runId: jobRunId,
			data: ''
		};     
        
		var promise = prepareProcedure();
		promise
			.then(function ([client, sp]) {
				var jobStartPromise = messageJobStart(res);
				jobStartPromise.then(function () {
					sp({}, (err2) => {
						client.close();
						if (err2) {
							var errMsg2 = "DB execute procedure error: " + JSON.stringify(err2);
							console.log(errMsg2);
							schedulerLib.updateJob(schedulerUpdateRequest, false, errMsg2);
							return;
						}
						console.log("replicateRemoteData job ended...");
						schedulerLib.updateJob(schedulerUpdateRequest, true, "job ended succesfully");
						return;
					});
				});
			})
			.catch(function (rej) {
				res.type("text/plain").status(500).send(rej);
			});;
	});
};

//TODO optimize / simplify
function messageJobStart(res) {
	return new Promise(function (resolve, reject) {
		res.type("text/plain").status(202).send('job started').then(resolve());
	});
}

function prepareProcedure() {
	return new Promise(function (resolve, reject) {
		var hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		hdbext.createConnection(hanaOptions.hana, (err, client) => {
			if (err) {
				var errMsg = "DB connection error: " + JSON.stringify(err);
				console.error(errMsg);
				reject(errMsg);
			}
			// Load procedure (client, schemaName, procedureName, callback)
			hdbext.loadProcedure(client, null, "replicateRemoteData", (err1, sp) => {
				if (err1) {
					var errMsg1 = "DB load procedure error: " + JSON.stringify(err1);
					console.error(errMsg1);
					reject(errMsg1);
				}
				resolve([client, sp]);
			});
		});
	});
};
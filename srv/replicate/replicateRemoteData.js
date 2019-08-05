"use strict";

var https = require('https');
var express = require("express");
var hdbext = require("@sap/hdbext");
var xsenv = require("@sap/xsenv");
var jobsc = require("@sap/jobs-client");

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

		var jobOptions = xsenv.getServices({
			jobs: {
				tag: "jobscheduler"
			}
		});
		var schedulerOptions = {
			baseURL: jobOptions.jobs.url,
			token: '',
			timeout: 15000
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
							updateJob(schedulerUpdateRequest, schedulerOptions, jobOptions, false, errMsg2);
							return;
						}
						console.log("replicateRemoteData job ended...");
						updateJob(schedulerUpdateRequest, schedulerOptions, jobOptions, true, "job ended succesfully");
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

function getJobSchedulerAPIToken(jobOptions) {
	return new Promise(function (resolve, reject) {
		var https = require('https');
		var querystring = require('querystring');

		var host = jobOptions.jobs.uaa.url.toString().replace("https://", "").replace("http://", "");
		var clientid = jobOptions.jobs.uaa.clientid;
		var clientsecret = jobOptions.jobs.uaa.clientsecret;

		// form data
		var postData = querystring.stringify({
			grant_type: "client_credentials",
			client_id: clientid,
			client_secret: clientsecret
		});

		// request option
		var options = {
			host: host,
			port: 443,
			method: 'POST',
			path: '/oauth/token',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};

		// request object
		var req = https.request(options, function (res) {
			var result = '';
			res.on('data', function (chunk) {
				result += chunk;
			});
			res.on('end', function () {
				//console.log(result);
				var resultJSON = JSON.parse(result);
				if (resultJSON && resultJSON.access_token) {
					resolve(resultJSON.access_token);
				} else {
					reject();
				};
			});
			res.on('error', function (err) {
				console.log(err);
				reject();
			})
		});

		// req error
		req.on('error', function (err) {
			console.log(err);
		});

		//send request witht the postData form
		req.write(postData);
		req.end();
	});
};

function updateJob(schedulerUpdateRequest, schedulerOptions, jobOptions, success, message) {
	var tokenPromise = getJobSchedulerAPIToken(jobOptions);
	tokenPromise.then(function (token) {
		var schedulerUpdateBody = {
			success: success,
			message: message
		};
		schedulerOptions.token = token;
		var scheduler = new jobsc.Scheduler(schedulerOptions);
		schedulerUpdateRequest.data = schedulerUpdateBody;
		scheduler.updateJobRunLog(schedulerUpdateRequest, function (err, result) {
			if (err) {
				return console.log('Error updating run log: %s', err);
			}
		});
	});
}
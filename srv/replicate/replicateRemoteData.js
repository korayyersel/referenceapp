"use strict";

module.exports = function (app) {
	app.get("/replicate/replicateRemoteData", function (req, res) {
		console.log("JOB IS CALLED");
		res.json({
			status: "job ok"
		});
	});
};
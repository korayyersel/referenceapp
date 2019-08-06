"use strict";
var csv = require("fast-csv");
var multer = require("multer");
var fs = require("fs");
var upload = multer({
	dest: "tmp/csv/"
});

module.exports = function (app) {
	app.post("/csvImport/Books", upload.single("file"), function (req, res) {
		if (!req.authInfo.checkScope("$XSAPPNAME.CSVImport.Edit")) {
			res.type("text/plain").status(403).send("Forbidden");
		}
		console.log("Called '/csvImport/Books'");
		var fileRows = [];
		csv.fromPath(req.file.path)
			.on("data", function (data) {
				var array = data[0].split(";");
				array[1] = Number(array[1]);
				fileRows.push(array); // push each row		
			})
			.on("end", function () {
				fs.unlinkSync(req.file.path);
				fileRows.shift();
				if (fileRows.length > 0) {
					var sql = "INSERT INTO MY_BOOKSHOP_BOOKS (TITLE, STOCK) VALUES(?,?)";
					var client = req.db;
					client.prepare(sql, function (prepareErr, statement) {
						if (prepareErr) {
							console.log("ERROR: " + JSON.stringify(prepareErr));
							res.status(500).send(prepareErr);
							return;
						}

						statement.exec(fileRows, function (execErr, results) {
							if (execErr) {
								console.log("ERROR: " + JSON.stringify(execErr));
								res.status(500).send(execErr);
								return;
							} else {
								console.log("Affected rows:" + results);
								res.json({
									status: "ok",
									rowsAffected: results
								});
							}
						});
					});
				}
			});
	});
};
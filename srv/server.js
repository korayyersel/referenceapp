/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var express = require("express");
var passport = require("passport");

var app = express();
var xssec = require("@sap/xssec");
var xsenv = require("@sap/xsenv");
var xsHDBConn = require("@sap/hdbext");
var csv = require("fast-csv");
var multer = require("multer");
var fs = require("fs");
var upload = multer({
	dest: "tmp/csv/"
});


//Initialize Express App for XS UAA and HDBEXT Middleware
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(passport.initialize());

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

app.use(
	passport.authenticate("JWT", {
		session: false
	}),
	xsHDBConn.middleware(hanaOptions.hana)
);

var cds = require("@sap/cds");
cds.connect();
cds.serve("odata/csn.json").in(app);

app.post("/csvImport/Books", upload.single("file"), function (req, res) {
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
    						res.json({ status: "ok", rowsAffected: results });
						}
					});
				});
			}
		});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("myapp listening on port " + port);
});
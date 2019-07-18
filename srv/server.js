/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var express = require("express");
var passport = require("passport");

var app = express();
var xssec = require("@sap/xssec");
var xsenv = require("@sap/xsenv");
var xsHDBConn = require("@sap/hdbext");

/*
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(passport.initialize());
*/

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
app.use(
	/*passport.authenticate("JWT", {
		session: false
	}),*/
	xsHDBConn.middleware(hanaOptions.hana)
);

var cds = require("@sap/cds");
cds.connect();
cds.serve("odata/csn.json").in(app);

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("myapp listening on port " + port);
});
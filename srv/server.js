/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var express = require("express");
var passport = require("passport");

var app = express();
var xssec = require("@sap/xssec");
var xsenv = require("@sap/xsenv");
var xsHDBConn = require("@sap/hdbext");

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

// token tracing 
app.get("/auth/:type", function (req, res) {
    console.log("Called '/auth'");
    var type = req.params.type;

    if (type === "token") {
        var jwt = require('jsonwebtoken');
        var token = req.authInfo.token;
        var decoded = jwt.decode(token);
        res.send(("decoded token [" + JSON.stringify(decoded) + "]"));
    } else {
        res.json(req.authInfo);
    }
});

var cds = require("@sap/cds");
cds.connect();
//cds.serve("odata/csn.json").in(app);
// TODO better error handling if something fails at the moment we get a plain 500 "Internal Server Error"
cds.serve("odata/csn.json", {
    crashOnError: false
})
    .with(require("./lib/odatahandlers"))
    .in(app)
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

require("./csvImport/importBooks")(app);
require("./replicate/replicateRemoteData")(app);
require("./jobManagement/jobManager")(app);
require("./callJavaService/index")(app);

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("myapp listening on port " + port);
});
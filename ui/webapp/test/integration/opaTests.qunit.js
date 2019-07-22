/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/qperior/reference/ui/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
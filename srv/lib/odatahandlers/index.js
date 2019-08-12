/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0, new-cap:0*/
/*eslint-env node, es6 */

"use strict";


var cds = require("@sap/cds");

/**
 * Register handlers to events.
 * @param {Object} entities
 * @param {Object} entities.DVD
 */
module.exports = function (entities) {
    const {
        Catalog
    } = entities;



    this.on("CREATE", "DVD", (entity) => {
        console.log("oData CREATE override...");
        //console.dir(entity);
        if (entity.data.ID === 666) {
            throw new Error("I don't like your ID");
        }
    });
};
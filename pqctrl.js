/* @flow */

(function(exports) {
    /* use strict; */

    var log = {
        debug: function(s) {
            // odd... why doesn't console.log work?
            alert(s);
        }
    };

    // http://stackoverflow.com/a/14725945
    function assert(condition, message) {
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }

    function mkPortQuery(queryTextArea, doitButton, doQuery) {
        function onClick(elt, doit) {
            if(elt.addEventListener){
                 elt.addEventListener("click", doit);
             }
            else if(elt.attachEvent) {
                elt.attachEvent("onclick", doit);
            }
        }

        onClick(doitButton, function() {
            // TODO: teach flow about .value
	    var queryText = queryTextArea.value;
            var queryDef = i2b2.h.parseXml(queryText);
            doQuery({refXML: queryDef});
        });
    }

    function Init(loadedDiv) {
        //@@ i2b2.PortQuery.view.containerDiv = loadedDiv;

        function elt(id) {
            var e = document.getElementById(id);
            assert(e, "no such element: " + id);
            return e;
        }

        // TODO: how tell flow to "import" doQueryLoadCallback
        mkPortQuery(elt("pq-query-text"), elt("pq-doit"), doQueryLoadCallback);
    }

    exports.Init = Init;

}(i2b2.PortQuery));

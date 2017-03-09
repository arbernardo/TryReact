/**
 * Created by jalmario on 2/16/17.
 */

var LimitSort = function (data, props) {
    var keyName = null;

    if (data[0]) {
        keyName = Object.keys(data[0]).find(function (element) {
            if (["key", "count"].indexOf(element) >= 0) {
                return false;
            }
            return true;
        });
    }

    var getAscendingData = function (data) {
        if (data) {
            return data.sort(function (a, b) {
                if (a[keyName] < b[keyName]) {
                    return -1;
                }

                if (a[keyName] > b[keyName]) {
                    return 1;
                }
                return 0;
            });
        }
    };

    var getDescendingData = function (data) {
        if (data) {
            return data.sort(function (a, b) {
                if (a[keyName] > b[keyName]) {
                    return -1;
                }

                if (a[keyName] < b[keyName]) {
                    return 1;
                }
                return 0;
            });
        }
    };

    var retrieveFilteredData = function () {
        var data = getForImportExport(props);

        if (props.sortLimit) {
            var s = props.sortLimit.trim().split(" ");
            if (s[0] == "TOP") {
                return getDescendingData(data).slice(0, s[1]);
            }

            if (s[0] == "BOTTOM") {
                return getAscendingData(data).slice(0, s[1]);
            }
        }

        return getDescendingData(data);
    };

    var getForImportExport = function (props) {
        var returnObject = [];
        var regime = props.regime;

        if (regime == null) {
            regime = [];
        }
        //if data is regime
        if (data.length && (data[0].key.indexOf("IM") == 0 || data[0].key.indexOf("EX") == 0)) {
            if (regime.length == 0) {
                var importTotal = 0, exportTotal = 0,
                    importCount = 0, exportCount = 0;
                data.forEach(function (e) {
                    if (!e.key.indexOf("IM")) {
                        importTotal += e[keyName];
                        importCount += e.count;
                    } else {
                        exportTotal += e[keyName];
                        exportCount += e.count;
                    }
                });

                returnObject.push({
                    key: "EX", count: exportCount, [keyName]: exportTotal
                });
                returnObject.push({
                    key: "IM", count: importCount, [keyName]: importTotal
                });
            } else {
                returnObject = returnObject.concat(data.map(function(e) {
                    //for single selection of regime
                    if(regime.includes(e.key)) {
                        return e;
                    } else {
                        //for categorize regarding import and export
                        for(var i in regime) {
                            if(e.key.indexOf(regime[i]) == 0) {
                                return e;
                            }
                        }
                    }
                }).filter(function(element) {
                    return element != undefined;
                }));

            }

            return returnObject;
        }

        return data;
    };

    return retrieveFilteredData();
};

export default LimitSort
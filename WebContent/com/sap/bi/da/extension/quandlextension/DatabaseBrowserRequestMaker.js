/**
 * Created by Niklas on 15.09.2016.
 */
jQuery.sap.declare("com.sap.bi.da.extension.quandlextension.DatabaseBrowserRequestMaker");

com.sap.bi.da.extension.quandlextension.DatabaseBrowserRequestMaker = function (fServiceCall) {
    this.fServiceCall = fServiceCall;
    this.databaseListCache = {};
    this.datasetListCache = {};
};

com.sap.bi.da.extension.quandlextension.DatabaseBrowserRequestMaker.prototype.getDatabaseList = function (elementsPerPage, page, query, fSuccess, fFailure, apiKey) {
    var queryToUse = query === "" ? "absolutely_no_query_" : query;
    if (!this.databaseListCache[queryToUse]) {
        this.databaseListCache[queryToUse] = {};
    }
    if (!this.databaseListCache[queryToUse]["" + elementsPerPage]) {
        this.databaseListCache[queryToUse]["" + elementsPerPage] = [];
    }
    if (this.databaseListCache[queryToUse]["" + elementsPerPage][page]) {
        fSuccess(this.databaseListCache[queryToUse]["" + elementsPerPage][page]);
    } else {
        var request = "databases.json?per_page=" + elementsPerPage + "&page=" + page + (queryToUse === "absolutely_no_query_" ? "" : "&query=" + queryToUse ) + (apiKey ? "&api_key=" + apiKey : "" );
        var that = this;
        var success = function (data) {
            var jsonResult = JSON.parse(data.replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f"));
            that.databaseListCache[queryToUse]["" + elementsPerPage][page] = jsonResult;
            fSuccess(jsonResult);
        }
        this.fServiceCall(request, success, fFailure);
    }
}

com.sap.bi.da.extension.quandlextension.DatabaseBrowserRequestMaker.prototype.getDatasetList = function (elementsPerPage, page, query, databaseCode, fSuccess, fFailure, apiKey) {
    var queryToUse = query === "" ? "absolutely_no_query_" : query;
    if (!this.datasetListCache[databaseCode]) {
        this.datasetListCache[databaseCode] = {};
    }
    if (!this.datasetListCache[databaseCode][queryToUse]) {
        this.datasetListCache[databaseCode][queryToUse] = {};
    }
    if (!this.datasetListCache[databaseCode][queryToUse]["" + elementsPerPage]) {
        this.datasetListCache[databaseCode][queryToUse]["" + elementsPerPage] = [];
    }

    if (this.datasetListCache[databaseCode][queryToUse]["" + elementsPerPage][page]) {
        fSuccess(this.datasetListCache[databaseCode][queryToUse]["" + elementsPerPage][page]);
    } else {
        var request = "datasets.json?per_page=" + elementsPerPage + "&page=" + page + "&query=" + (queryToUse == "absolutely_no_query_" ? "" : queryToUse) + (databaseCode  == "" ? "" : "&database_code=" + databaseCode) + (apiKey ? "&api_key=" + apiKey : "" );
        var that = this;
        var success = function (data) {
            var jsonResult = JSON.parse(data.replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f"));
            that.datasetListCache[databaseCode][queryToUse]["" + elementsPerPage][page] = jsonResult;
            fSuccess(jsonResult);
        };
        this.fServiceCall(request, success, fFailure);
    }

}

jQuery.sap.declare("com.sap.bi.da.extension.quandlextension.ExtensionUtils");

com.sap.bi.da.extension.quandlextension.ExtensionUtils = function() {};

com.sap.bi.da.extension.quandlextension.ExtensionUtils.prototype.calcLastNDaysFromToday = function(n)
{
	  var today = new Date();
	  var before = new Date();
	  before.setDate(today.getDate() - n);

	  var year = before.getFullYear();

	  var month = before.getMonth() + 1;
	  if (month < 10) {
	    month = '0' + month;
	  }

	  var day = before.getDate();
	  if (day < 10) {
	    day = '0' + day;
	  }

	  return new Date([year, month, day].join('-'));
}
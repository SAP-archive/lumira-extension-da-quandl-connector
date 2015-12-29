/*
Copyright 2015, SAP SE

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
       http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

define(function() {
    "use strict";

    var QuandlExtensionDialogController = function(acquisitionState, oDeferred, fServiceCall, workflow, ExtensionUtils) {

    	/*
        Create dialog controls
        */
        var dLayout = new sap.ui.commons.layout.MatrixLayout({
            layoutFixed : true,
            columns : 2,
            width : "570px",
            widths : [ "25%", "75%" ]
        });
        
        // Dataset Name
        var datasetNameTxt = new sap.ui.commons.TextField({
            width : '100%',
            value : "New Dataset",
            enabled : workflow === "CREATE"
        });

        var datasetNameLbl = new sap.ui.commons.Label({
            text : "Dataset Name:",
            labelFor : datasetNameTxt
        });

        dLayout.createRow({
            height : "30px"
        }, datasetNameLbl, datasetNameTxt);
       
        var QuandlDatasetCodeTxt = new sap.ui.commons.TextField({
            width : '100%',
            value : "WIKI/AAPL"
        });

        var QuandlDatasetCodeLbl = new sap.ui.commons.Label({
            text : "Quandl Code:",
            labelFor : QuandlDatasetCodeTxt
        });

        dLayout.createRow({
            height : "30px"
        }, QuandlDatasetCodeLbl, QuandlDatasetCodeTxt);
        
        var oRB1 = new sap.ui.commons.RadioButton({
        	text : 'All Data',
        	key : 'all',
        	tooltip : 'All data',
        	groupName : 'Group1',
        	selected : true,
        	select : function() {
        				startDatePicker.setEnabled(false);
        				endDatePicker.setEnabled(false);
        			} 
        	});

        var oRB2 = new sap.ui.commons.RadioButton({
        	text : 'Selected Date Range',
        	key : 'selected',
        	tooltip : 'Selected Date Range',
        	groupName : 'Group1',
        	select : function() {
						startDatePicker.setEnabled(true);
						endDatePicker.setEnabled(true);
					} 
        	});

        dLayout.createRow({
            height : "30px"
        }, oRB1, oRB2);
        
        //start date
        var startDatePicker = new sap.ui.commons.DatePicker();
        startDatePicker.setYyyymmdd(ExtensionUtils.calcLastNDaysFromToday(30));
        startDatePicker.setEnabled(false);
        
        var startDateLbl = new sap.ui.commons.Label({
            text : "Start Date",
            labelFor : startDatePicker
        });

        dLayout.createRow({
            height : "30px"
        }, startDateLbl, startDatePicker);

        //End Date
        var endDatePicker = new sap.ui.commons.DatePicker();
        endDatePicker.setYyyymmdd(ExtensionUtils.calcLastNDaysFromToday(0));
        endDatePicker.setEnabled(false);
        
        var endDateLbl = new sap.ui.commons.Label({
            text : "End Date",
            labelFor : endDatePicker
        });

        dLayout.createRow({
            height : "30px"
        }, endDateLbl, endDatePicker);
        
        var sortTypeDropdown = new sap.ui.commons.DropdownBox();
        sortTypeDropdown.setTooltip("Sorting Order");
        sortTypeDropdown.setEditable(true);
        sortTypeDropdown.setWidth("30%");
        
        var requestItem = new sap.ui.core.ListItem({text: "Descending", key: "desc"});
        sortTypeDropdown.addItem(requestItem);
        
        requestItem = new sap.ui.core.ListItem({text: "Ascending", key: "asc"});
        sortTypeDropdown.addItem(requestItem);

        var sortTypeLbl = new sap.ui.commons.Label({
            text : "Sorting Order:",
            labelFor : sortTypeDropdown
        });

        dLayout.createRow({
            height : "30px"
        }, sortTypeLbl, sortTypeDropdown);

        
        var limitTxt = new sap.ui.commons.TextField({
            width : '100%',
            value : ""
        });

        var limitLbl = new sap.ui.commons.Label({
            text : "Limit Rows:",
            labelFor : limitTxt
        });

        dLayout.createRow({
            height : "30px"
        }, limitLbl, limitTxt);
        
        // collapse dataset, none|daily|weekly|monthly|quarterly|annual
        var collapseTypeDropdown = new sap.ui.commons.DropdownBox();
        collapseTypeDropdown.setTooltip("End of period");
        collapseTypeDropdown.setEditable(true);
        collapseTypeDropdown.setWidth("30%");
        
        var requestItem = new sap.ui.core.ListItem({text: "None", key: "none"});
        collapseTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "Daily", key: "daily"});
        collapseTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "Weekly", key: "weekly"});
        collapseTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "Monthly", key: "monthly"});
        collapseTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "Quarterly", key: "quarterly"});
        collapseTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "Annual", key: "annual"});
        collapseTypeDropdown.addItem(requestItem);
        
        var collapseTypeLbl = new sap.ui.commons.Label({
            text : "End of period:",
            labelFor : collapseTypeDropdown
        });
        
        dLayout.createRow({
            height : "30px"
        }, collapseTypeLbl, collapseTypeDropdown);

        // none|diff|rdiff|rdiff_from|cumul|normalize
        var transformTypeDropdown = new sap.ui.commons.DropdownBox();
        transformTypeDropdown.setTooltip("Transform");
        transformTypeDropdown.setEditable(true);
        transformTypeDropdown.setWidth("70%");
        
        var requestItem = new sap.ui.core.ListItem({text: "None", key: "none"});
        transformTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "diff - Row-on-row change", key: "diff"});
        transformTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "rdiff - Row-on-row % change", key: "rdiff"});
        transformTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "rdiff_from - Row-on-row % change from latest value", key: "rdiff_from"})
        transformTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "cumul - Cumulative sum", key: "cumul"});
        transformTypeDropdown.addItem(requestItem);
        
        var requestItem = new sap.ui.core.ListItem({text: "normalize - Start at 100", key: "normalize"});
        transformTypeDropdown.addItem(requestItem);
        
        var transformTypeLbl = new sap.ui.commons.Label({
            text : "Transform:",
            labelFor : transformTypeDropdown
        });
        
        dLayout.createRow({
            height : "30px"
        }, transformTypeLbl, transformTypeDropdown);
        
        //API Key
        var APIKeyTxt = new sap.ui.commons.TextField({
            width : '100%',
            value : ""
        });
        
        var APIKeyLbl = new sap.ui.commons.Label({
            text : "Quandl API Key:",
            labelFor : APIKeyTxt
        });

        dLayout.createRow({
            height : "30px"
        }, APIKeyLbl, APIKeyTxt);
        
        /*
        Button press events
        */
        var buttonCancelPressed = function() {
        	oDeferred.reject(); //promise fail
            dialog.close(); // dialog is hoisted from below
        };
        
        var buttonOKPressed = function() {
        	var info = {};
            
            info.quandldatasetcode = QuandlDatasetCodeTxt.getValue();
            info.datarange = oRB1.getSelected() ? "all" : "selected";
            info.startdate = startDatePicker.getValue();
            info.enddate = endDatePicker.getValue();
            info.sorttype = sortTypeDropdown.getSelectedKey();
            info.limitnumber = limitTxt.getValue();
            info.collapsetype = collapseTypeDropdown.getSelectedKey();
            info.transformtype = transformTypeDropdown.getSelectedKey();
            info.apikey = APIKeyTxt.getValue();
            
            info.datasetName =  datasetNameTxt.getValue();
            
            acquisitionState.info = JSON.stringify(info);
            oDeferred.resolve(acquisitionState, datasetNameTxt.getValue());
            dialog.close();
        };

        var okButton = new sap.ui.commons.Button({
            press : [ buttonOKPressed, this ],
            text : "Create",
            tooltip : "Create"
        }).setStyle(sap.ui.commons.ButtonStyle.Accept);

        var cancelButton = new sap.ui.commons.Button({
            press : [ buttonCancelPressed, this ],
            text : "Cancel",
            tooltip : "Cancel"
        }).addStyleClass(sap.ui.commons.ButtonStyle.Default);

        var onClosed = function() {
        	this.destroy();
            oDeferred.reject();
        };
        
        /*
        Modify controls based on acquisitionState
        */
        var envProperties = acquisitionState.envProps;
        if (acquisitionState.info) {
            var info = JSON.parse(acquisitionState.info);

            QuandlDatasetCodeTxt.setValue(info.quandldatasetcode);
            info.datarange == "all" ? oRB1.setSelected(true) : oRB2.setSelected(true);
            info.datarange == "all" ? startDatePicker.setEnabled(false) : startDatePicker.setEnabled(true);
            info.datarange == "all" ? endDatePicker.setEnabled(false) : endDatePicker.setEnabled(true);
            
            startDatePicker.setValue(info.startdate);
            endDatePicker.setValue(info.enddate);
            sortTypeDropdown.setSelectedKey(info.sorttype);
            limitTxt.setValue(info.limitnumber);
            collapseTypeDropdown.setSelectedKey(info.collapsetype);
            transformTypeDropdown.setSelectedKey(info.transformtype);
            APIKeyTxt.setValue(info.apikey);
            
            envProperties.datasetName = info.datasetName;
        }
        datasetNameTxt.setValue(envProperties.datasetName);
        
        /*
        Create the dialog
        */
        var dialog = new sap.ui.commons.Dialog({
            width : "720px",
            height : "560px",
            modal : true,
            resizable : false,
            closed : onClosed,
            content: [dLayout],
            buttons : [okButton, cancelButton]
        });
        
        dialog.setTitle("Quandl Connector: " + envProperties.datasetName);

        this.showDialog = function() {
            dialog.open();
        }; 
    };

    return QuandlExtensionDialogController;
});
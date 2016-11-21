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

define(function () {
    "use strict";

    var QuandlExtensionDialogController = function (acquisitionState, oDeferred, fServiceCall, workflow, ExtensionUtils, requestMaker) {
            /*
             Create dialog controls
             */
            var filter = {
                "databaseQuery": "",
                "datasetQuery": "",
                "database_code": ""
            };

            var dLayout = new sap.ui.commons.layout.MatrixLayout({
                layoutFixed: true,
                columns: 3,
                width: "580px",
                widths: ["25%", "55%", "20%"]
            });

            // Dataset Name
            var datasetNameTxt = new sap.ui.commons.TextField({
                width: '100%',
                value: "New Dataset",
                enabled: workflow === "CREATE"
            });

            var datasetNameLbl = new sap.ui.commons.Label({
                text: "Dataset Name:",
                labelFor: datasetNameTxt
            });

            dLayout.createRow({
                height: "30px"
            }, datasetNameLbl, datasetNameTxt);

            var QuandlDatasetCodeTxt = new sap.ui.commons.TextField({
                width: '100%',
                value: "WIKI/AAPL"
            });

            var QuandlDatasetCodeLbl = new sap.ui.commons.Label({
                text: "Quandl Code:",
                labelFor: QuandlDatasetCodeTxt
            });

            var openDatabaseBrowserBtnPressed = function () {
                loadDatabaseScreen();
                databaseBrowserDialog.open();
            };

            var openDatabaseBrowserBtn = new sap.ui.commons.Button({
                press: [openDatabaseBrowserBtnPressed, this],
                text: "Database Browser",
                tooltip: "Browse Quandl Databases"
            }).addStyleClass(sap.ui.commons.ButtonStyle.Default);

            dLayout.createRow({
                height: "30px"
            }, QuandlDatasetCodeLbl, QuandlDatasetCodeTxt, openDatabaseBrowserBtn);

            var oRB1 = new sap.ui.commons.RadioButton({
                text: 'All Data',
                key: 'all',
                tooltip: 'All data',
                groupName: 'Group1',
                selected: true,
                select: function () {
                    startDatePicker.setEnabled(false);
                    endDatePicker.setEnabled(false);
                }
            });

            var oRB2 = new sap.ui.commons.RadioButton({
                text: 'Selected Date Range',
                key: 'selected',
                tooltip: 'Selected Date Range',
                groupName: 'Group1',
                select: function () {
                    startDatePicker.setEnabled(true);
                    endDatePicker.setEnabled(true);
                }
            });

            dLayout.createRow({
                height: "30px"
            }, oRB1, oRB2);

            //start date
            var startDatePicker = new sap.ui.commons.DatePicker();
            startDatePicker.setYyyymmdd(ExtensionUtils.calcLastNDaysFromToday(30));
            startDatePicker.setEnabled(false);

            var startDateLbl = new sap.ui.commons.Label({
                text: "Start Date",
                labelFor: startDatePicker
            });

            dLayout.createRow({
                height: "30px"
            }, startDateLbl, startDatePicker);

            //End Date
            var endDatePicker = new sap.ui.commons.DatePicker();
            endDatePicker.setYyyymmdd(ExtensionUtils.calcLastNDaysFromToday(0));
            endDatePicker.setEnabled(false);

            var endDateLbl = new sap.ui.commons.Label({
                text: "End Date",
                labelFor: endDatePicker
            });

            dLayout.createRow({
                height: "30px"
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
                text: "Sorting Order:",
                labelFor: sortTypeDropdown
            });

            dLayout.createRow({
                height: "30px"
            }, sortTypeLbl, sortTypeDropdown);


            var limitTxt = new sap.ui.commons.TextField({
                width: '100%',
                value: ""
            });

            var limitLbl = new sap.ui.commons.Label({
                text: "Limit Rows:",
                labelFor: limitTxt
            });

            dLayout.createRow({
                height: "30px"
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
                text: "End of period:",
                labelFor: collapseTypeDropdown
            });

            dLayout.createRow({
                height: "30px"
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

            var requestItem = new sap.ui.core.ListItem({
                text: "rdiff_from - Row-on-row % change from latest value",
                key: "rdiff_from"
            })
            transformTypeDropdown.addItem(requestItem);

            var requestItem = new sap.ui.core.ListItem({text: "cumul - Cumulative sum", key: "cumul"});
            transformTypeDropdown.addItem(requestItem);

            var requestItem = new sap.ui.core.ListItem({text: "normalize - Start at 100", key: "normalize"});
            transformTypeDropdown.addItem(requestItem);

            var transformTypeLbl = new sap.ui.commons.Label({
                text: "Transform:",
                labelFor: transformTypeDropdown
            });

            dLayout.createRow({
                height: "30px"
            }, transformTypeLbl, transformTypeDropdown);

            //API Key
            var APIKeyTxt = new sap.ui.commons.TextField({
                width: '100%',
                value: ""
            });

            var APIKeyLbl = new sap.ui.commons.Label({
                text: "Quandl API Key:",
                labelFor: APIKeyTxt
            });

            dLayout.createRow({
                height: "30px"
            }, APIKeyLbl, APIKeyTxt);

            /*
             Button press events
             */
            var buttonCancelPressed = function () {
                oDeferred.reject(); //promise fail
                dialog.close(); // dialog is hoisted from below
            };


            var buttonOKPressed = function () {
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

                info.datasetName = datasetNameTxt.getValue();

                acquisitionState.info = JSON.stringify(info);
                oDeferred.resolve(acquisitionState, datasetNameTxt.getValue());
                dialog.close();
            };

            var okButton = new sap.ui.commons.Button({
                press: [buttonOKPressed, this],
                text: "Create",
                tooltip: "Create"
            }).setStyle(sap.ui.commons.ButtonStyle.Accept);

            var cancelButton = new sap.ui.commons.Button({
                press: [buttonCancelPressed, this],
                text: "Cancel",
                tooltip: "Cancel"
            }).addStyleClass(sap.ui.commons.ButtonStyle.Default);

            var onClosed = function () {
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


            // ----------Database Browser----------------

            var loadDatasetScreen = function () {
                databaseBrowserDialog.removeAllButtons();
                databaseBrowserDialog.addButton(backToDatabaseSelectionButton);
                databaseBrowserDialog.addButton(cancelDatabaseBrowserButton);
                databaseBrowserDialog.removeAllContent();
                databaseBrowserDialog.addContent(datasetBrowserLayout);
                databaseBrowserDialog.setTitle("2. Select dataset");
                datasetBrowserLayout.setBusy(true);
                datasetPaginator.setCurrentPage(1);
                requestMaker.getDatasetList(7, 1, filter.datasetQuery, filter.database_code, datasetListCallback, datasetFailureCallback, APIKeyTxt.getValue());
            }

            var loadDatabaseScreen = function () {
                databaseBrowserDialog.removeAllButtons();
                databaseBrowserDialog.addButton(proceedToDatasetSelectionButton);
                databaseBrowserDialog.addButton(cancelDatabaseBrowserButton);
                databaseBrowserDialog.removeAllContent();
                databaseBrowserDialog.addContent(databaseBrowserLayout);
                databaseBrowserDialog.setTitle("1. Select database");
                databaseBrowserLayout.setBusy(true);
                databasePaginator.setCurrentPage(1);
                requestMaker.getDatabaseList(7, 1, filter.databaseQuery, databaseListCallback, databaseFailureCallback, APIKeyTxt.getValue());
            }

            var databaseBrowserLayout = new sap.ui.commons.layout.MatrixLayout({
                layoutFixed: true,
                columns: 1,
                width: "700px",
                widths: ["100%"]
            });


            //Button Events
            var buttonCancelDatabaseBrowserPressed = function () {
                databaseBrowserDialog.close(); // dialog is hoisted from below
            };

            var databaseListCallback = function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(data);
                databaseList.setModel(oModel);
                databaseList.bindAggregation("items", "/databases", itemTemplate);
                var items = databaseList.getItems();
                for (var z = 0; z < items.length; z++) {
                    items[z].attachBrowserEvent("click", function (e) {
                        filter.database_code = this.getBindingContext().getObject()["database_code"];
                        filter.datasetQuery = "";
                        loadDatasetScreen();
                    });
                }
                databasePaginator.setNumberOfPages(data.meta.total_pages);
                databaseBrowserLayout.setBusy(false);
            }

            var datasetListCallback = function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(data);
                datasetList.setModel(oModel);
                datasetList.bindAggregation("items", "/datasets", itemDatasetTemplate);
                var items = datasetList.getItems();
                for (var z = 0; z < items.length; z++) {
                    items[z].attachBrowserEvent("click", function (e) {
                        var quandlCode = this.getBindingContext().getObject()["database_code"] + "/" + this.getBindingContext().getObject()["dataset_code"];
                        QuandlDatasetCodeTxt.setValue(quandlCode);
                        databaseBrowserDialog.close();
                    });
                }
                datasetPaginator.setNumberOfPages(data.meta.total_pages);
                datasetBrowserLayout.setBusy(false);
            }

            var datasetFailureCallback = function (e) {
                datasetBrowserLayout.setBusy(false);
                datasetList.removeAllItems();
                sap.ui.commons.MessageBox.alert("Unable to retrieve dataset list. Check your daily Quandl API usage limit or your internet connection.");
            }

            var databaseFailureCallback = function (e) {
                databaseBrowserLayout.setBusy(false);
                databaseList.removeAllItems();
                sap.ui.commons.MessageBox.alert("Unable to retrieve database list. Check your daily Quandl API usage limit or your internet connection.");
            }

            var proceedToDatasetSelectionButtonPressed = function () {
                filter.datasetQuery = "";
                filter.database_code = "";
                loadDatasetScreen();
            }

            var backToDatabaseSelectionButtonPressed = function () {
                loadDatabaseScreen();
            };

            //Buttons
            var cancelDatabaseBrowserButton = new sap.ui.commons.Button({
                press: [buttonCancelDatabaseBrowserPressed, this],
                text: "Cancel",
                tooltip: "Cancel"
            }).addStyleClass(sap.ui.commons.ButtonStyle.Default);

            var proceedToDatasetSelectionButton = new sap.ui.commons.Button({
                press: [proceedToDatasetSelectionButtonPressed, this],
                text: "Proceed without selecting database...",
                tooltip: "Proceed to dataset selection without selecting a database"
            }).addStyleClass(sap.ui.commons.ButtonStyle.Default);

            var backToDatabaseSelectionButton = new sap.ui.commons.Button({
                press: [backToDatabaseSelectionButtonPressed, this],
                text: "Back",
                tooltip: "Back to database selection"
            }).addStyleClass(sap.ui.commons.ButtonStyle.Default);

            var databaseSearchField = new sap.ui.commons.SearchField({
                enableListSuggest: false,
                search: function (oEvent) {
                    filter.databaseQuery = oEvent.getParameters().query.replace(/ /g, '+');
                    loadDatabaseScreen();
                },
                width: "100%"
            });
            databaseBrowserLayout.createRow({
                height: "30px"
            }, databaseSearchField);
            var databaseList = new sap.m.List();

            databaseBrowserLayout.setBusyIndicatorDelay(100);

            var itemTemplate = new sap.m.StandardListItem({
                type: "Active",
                title: "{name}",
                icon: "{image}",
                description: "{description}",
                info: {
                    path: "premium",
                    formatter: function (premium) {
                        if (premium === true) {
                            return "Premium";
                        } else {
                            return "Free";
                        }
                    }
                },
                infoState: {
                    path: "premium",
                    formatter: function (premium) {
                        if (premium === true) {
                            return sap.ui.core.ValueState.Warning;
                        } else {
                            return sap.ui.core.ValueState.Success;
                        }
                    }
                },
                iconInset: false,
                tooltip: "{description}"
            });

            databaseBrowserLayout.createRow({
                height: "90%"
            }, databaseList);

            var databasePaginator = new sap.ui.commons.Paginator();

            databasePaginator.attachPage(function () {
                databaseBrowserLayout.setBusy(true);
                requestMaker.getDatabaseList(7, this.getCurrentPage(), filter.databaseQuery, databaseListCallback, databaseFailureCallback, APIKeyTxt.getValue());
            });

            databaseBrowserLayout.createRow({
                height: "20px"
            }, databasePaginator);

            //----------Dataset Browser-------------------

            var datasetBrowserLayout = new sap.ui.commons.layout.MatrixLayout({
                layoutFixed: true,
                columns: 1,
                width: "700px",
                widths: ["100%"]
            });

            var datasetList = new sap.m.List();
            datasetBrowserLayout.setBusyIndicatorDelay(100);
            var itemDatasetTemplate = new sap.m.CustomListItem({
                type: "Active",
                tooltip: {
                    parts: ["name", "description"],
                    formatter: function (name, description) {
                        return name + ": " + description;
                    }
                },
                content: [
                    new sap.ui.layout.VerticalLayout({
                        content: [
                            new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Label({
                                        text: {
                                            parts: ["database_code", "dataset_code"],
                                            formatter: function (db_code, ds_code) {
                                                return "[" + db_code + "/" + ds_code + "]";
                                            }
                                        },
                                        width: "180px",
                                        design: "Bold"
                                    }).addStyleClass("sapUiSmallMargin"),

                                    new sap.m.Label({
                                        text: "{name}",
                                        width: "430px",
                                        design: "Bold"
                                    }).addStyleClass("sapUiSmallMargin"),

                                    new sap.m.Text({
                                        text: {
                                            path: "premium", formatter: function (premium) {
                                                if (premium === true) {
                                                    this.addStyleClass("sapMSLIInfo sapMSLIInfoWarning");
                                                    return "Premium";
                                                } else {
                                                    this.addStyleClass("sapMSLIInfo sapMSLIInfoSuccess")
                                                    return "Free";
                                                }
                                            }
                                        },
                                        maxLines: 1,
                                        textAlign: "Right"
                                    })

                                ]
                            }),

                            new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Label({
                                        text: "{description}",
                                        width: "690px"
                                    }).addStyleClass("sapMSLIDescription")
                                ]
                            }),

                            new sap.ui.layout.HorizontalLayout({
                                content: [

                                    new sap.m.Label({
                                        text: {
                                            parts: ["frequency", "refreshed_at", "newest_available_date", "oldest_available_date"],
                                            formatter: function (frequency, refreshed_at, newest_available_date, oldest_available_date) {
                                                return frequency + ", from " + (new Date(oldest_available_date)).toLocaleDateString() + " to " + (new Date(newest_available_date)).toLocaleDateString() + ", refreshed at " + (new Date(refreshed_at)).toLocaleDateString();
                                            }
                                        },
                                        width: "690px"
                                    }).addStyleClass("sapUiSmallMargin")
                                ]
                            })
                        ]
                    })
                ]

            }).addStyleClass("quandlConntectorDatasetListItem");


            var datasetSearchField = new sap.ui.commons.SearchField({
                enableListSuggest: false,
                search: function (oEvent) {
                    filter.datasetQuery = oEvent.getParameters().query.replace(/ /g, '+');
                    loadDatasetScreen();
                },
                width: "100%"
            });
            datasetBrowserLayout.createRow({
                height: "30px"
            }, datasetSearchField);

            datasetBrowserLayout.createRow({
                height: "100%"
            }, datasetList);

            var datasetPaginator = new sap.ui.commons.Paginator();

            datasetPaginator.attachPage(function () {
                datasetBrowserLayout.setBusy(true);
                requestMaker.getDatasetList(7, this.getCurrentPage(), filter.datasetQuery, filter.database_code, datasetListCallback, datasetFailureCallback, APIKeyTxt.getValue());
            });
            datasetBrowserLayout.createRow({

                height: "20px"
            }, datasetPaginator);


            var databaseBrowserDialog = new sap.ui.commons.Dialog({
                width: "780px",
                height: "665px",
                modal: true,
                resizable: false,
                minHeight: "665px",
                content: [databaseBrowserLayout],
                buttons: [proceedToDatasetSelectionButton, cancelDatabaseBrowserButton]
            });

            databaseBrowserDialog.setTitle("1. Select Database");

            /*
             Create the dialog
             */
            var dialog = new sap.ui.commons.Dialog({
                width: "720px",
                height: "560px",
                modal: true,
                resizable: false,
                closed: onClosed,
                content: [dLayout],
                buttons: [okButton, cancelButton]
            });

            dialog.setTitle("Quandl Connector: " + envProperties.datasetName);

            this.showDialog = function () {
                dialog.open();
            };
        }
        ;

    return QuandlExtensionDialogController;
})
;
Quandl Connector
==========================================================
[Quandl.com](https://www.quandl.com) is a data platform that gives you access to financial and economic datasets online. SAP Lumira users can now use this connector to import data from Quandl directly into Lumira documents without having to download and import csv files manually. This Lumira extension is built with the V2 SAP Lumira Data Access Extension SDK.

Install
-----------------
* Open Extension Manager, `File > Extensions`
* Click `Manual Installation`
* Download the zip file from `\install-extension` in this repo or click this [link](https://github.com/SAP/lumira-extension-da-quandl-connector/blob/master/install-extension/com.sap.bi.da.extension.quandlextension_1.30.0.201610241554.zip?raw=true) to download.
* Restart SAP Lumira Desktop

Usage
----------
* Select `File > New Dataset`
* Select `Quandl Connector` from the list of connectors in Lumira Desktop
* Enter the dataset name and these parameters
 + `Quandl Code`: Quandl Code of the dataset. Ex: WIKI/AAPL, OPEC/ORB, RATEINF/CPI_USA.
 + `All Data`: Retrieve the complete dataset. 
 + `Selected Date Range`: Retrieve a subset of data between two dates selected below. 
 + `Start Date`: Start Date of the dataset being imported.
 + `End Date` : End Date of the dataset being imported.
 + `Sorting Order`: Sort dataset in Ascending or Descending order.
 + `Limit Rows`: Limit the number of rows being imported. Ex: 100.
 + `End of period`: Use this option to collapse the dataset and retrieve one value at the end of every period selected here. Set this option to `None` to import daily data and use Lumira for aggregated measures like `Average` and `Sum` for these periods.
 + `Transform`: Add transformations to values across all columns being imported. Please refer to the data section in [Quandl API docs](https://www.quandl.com/docs/api?csv#data) for more details.
 + `API Key` : Enter your Quandl API Key to access premium dataset subscriptions. Also required to bypass rate-limits if they kick in and calls fail for free datasets. Please register for an account at [Quandl.com](https://www.quandl.com/users/sign_up) and get your key [here](https://www.quandl.com/account/api).
* Select `Create` to import data into a new document
* * Use the `Data > Refresh document` option to fetch the latest data and update the existing Lumira document.
* Use the `Data > Edit Data source` option to change parameters in an existing Lumira document.

Build
-----------------
* Please refer to the [Sample Extension project](https://github.com/SAP/lumira-extension-da-sample) for instructions to setup your dev environment, make changes, and build this extension.

Resources
-----------
* SCN Blog post - [Quandl connector for SAP Lumira](http://scn.sap.com/community/lumira/blog/2016/01/05/quandl-connector-for-sap-lumira)

License
---------

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

 [1]: https://github.com/SAP/lumira-extension-da-quandl-connector

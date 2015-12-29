Quandl Connector
==========================================================
[Quandl.com](https://www.quandl.com) is a data platform that gives you access to financial and economic datasets online. SAP Lumira users can now use this connector to import data from Quandl directly into Lumira documents without having to download and import csv files manually. This Lumira extension is built with the V2 SAP Lumira Data Access Extension SDK.

Install
-----------------
* Open Extension Manager, `File > Extensions`
* Click `Manual Installation`
* Select the zip file from `\install-extension` in this repo
* Restart SAP Lumira Desktop

Usage
----------
* Select `File > New Dataset`
* Select `Quandl Connector` from the list of connectors in Lumira Desktop
* Enter the dataset name and these parameters
 + `Quandl Code`: Quandl Code of the dataset. Ex: WIKI/AAPL, OPEC/ORB, RATEINF/CPI_USA.
 + `All Data`: All to retrieve complete dataset. 
 + `Selected Date Range`: Retrieve only a subset of data between two dates selected below 
 + `Start Date`: Start Date of the data going to be imported.
 + `End Date` : End Date of the data going to be imported.
 + `Sorting Order`: Import data for dates in Ascending or Descending order.
 + `Limit Rows`: Enter a number to limit the number of rows being imported.
 + `End of period`: Use this option to collapse and retrieve value at the end of every period selected here. Set this option to None and use Lumira for aggregated measures like average and sum for these periods.
 + `Transform`: Add transformations to values. Please refer to [Quandl API docs](https://www.quandl.com/docs/api?csv#data) for more details.
 + `API Key` : Enter your Quandl API Key. Please register for an account at [Quandl.com](https://www.quandl.com/users/sign_up) and get your key [here](https://www.quandl.com/account/api).
* Select `Create` to import data into a new document
* Use the `Data > Edit Data source` option to change parameters in an existing Lumira document.

Build
-----------------
* Please refer to the [Sample Extension project](https://github.com/SAP/lumira-extension-da-sample) for instructions to setup your dev environment, make changes, and build this extension.

Resources
-----------
* SCN Blog post - [Coming soon](https://www.google.com/search?q=baby+cat+pics)

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

 [1]: https://github.com/SAP/lumira-extension-da-quandl
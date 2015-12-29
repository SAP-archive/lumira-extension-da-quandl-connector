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

package com.sap.bi.da.extension.quandlextension;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;
import java.util.EnumSet;
import java.util.Set;

import org.json.JSONObject;

import com.sap.bi.da.extension.sdk.DAEWorkflow;
import com.sap.bi.da.extension.sdk.DAException;
import com.sap.bi.da.extension.sdk.IDAEAcquisitionJobContext;
import com.sap.bi.da.extension.sdk.IDAEAcquisitionState;
import com.sap.bi.da.extension.sdk.IDAEClientRequestJob;
import com.sap.bi.da.extension.sdk.IDAEDataAcquisitionJob;
import com.sap.bi.da.extension.sdk.IDAEEnvironment;
import com.sap.bi.da.extension.sdk.IDAEMetadataAcquisitionJob;
import com.sap.bi.da.extension.sdk.IDAEProgress;
import com.sap.bi.da.extension.sdk.IDAExtension;

public class QuandlExtension implements IDAExtension {
	
	static public final String EXTENSION_ID = "com.sap.bi.da.extension.Quandlextension";
	private IDAEEnvironment environment;

    public QuandlExtension() {
    }

    @Override
    public void initialize(IDAEEnvironment environment) {
    	this.environment = environment;
    	// This function will be called when the extension is initially loaded
    	// This gives the extension to perform initialization steps, according to the provided environment
    }

    @Override
    public IDAEAcquisitionJobContext getDataAcquisitionJobContext (IDAEAcquisitionState acquisitionState) {
        return new QuandlExtensionAcquisitionJobContext(environment, acquisitionState);
    }

    @Override
    public IDAEClientRequestJob getClientRequestJob(String request) {
        return new QuandlExtensionClientRequestJob(request);
    }

    private static class QuandlExtensionAcquisitionJobContext implements IDAEAcquisitionJobContext {

        private IDAEAcquisitionState acquisitionState;
        private IDAEEnvironment environment;

        QuandlExtensionAcquisitionJobContext(IDAEEnvironment environment, IDAEAcquisitionState acquisitionState) {
            this.acquisitionState = acquisitionState;
            this.environment = environment;
        }

        @Override
        public IDAEMetadataAcquisitionJob getMetadataAcquisitionJob() {
            return new QuandlExtensionMetadataRequestJob(environment, acquisitionState);
        }

        @Override
        public IDAEDataAcquisitionJob getDataAcquisitionJob() {
            return new QuandlExtensionDataRequestJob(environment, acquisitionState);
        }
        
        @Override
        public void cleanup() {
        	// Called once acquisition is complete
        	// Provides the job the opportunity to perform cleanup, if needed
        	// Will be called after both job.cleanup()'s are called
        }
    }

	private class QuandlExtensionClientRequestJob implements IDAEClientRequestJob {

        String request;

        QuandlExtensionClientRequestJob(String request) {
            this.request = request;
        }

        @Override
        public String execute(IDAEProgress callback) throws DAException {
            return null;
        }

        @Override
        public void cancel() {
        	// Cancel is currently not supported
        }

        @Override
        public void cleanup() {
        	// This function is NOT called
        }

    }

    @Override
    public Set<DAEWorkflow> getEnabledWorkflows(IDAEAcquisitionState acquisitionState) {
    	// If the extension is incompatible with the current environment, it may disable itself using this function
    	// return EnumSet.allOf(DAEWorkflow.class) to enable the extension
    	// return EnumSet.noneOf(DAEWorkflow.class) to disable the extension
    	// Partial enabling is not currently supported
        return EnumSet.allOf(DAEWorkflow.class);
    }
}

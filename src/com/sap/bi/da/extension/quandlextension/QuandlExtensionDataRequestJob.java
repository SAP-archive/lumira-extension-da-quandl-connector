package com.sap.bi.da.extension.quandlextension;

import java.io.File;

import com.sap.bi.da.extension.sdk.DAException;
import com.sap.bi.da.extension.sdk.IDAEAcquisitionState;
import com.sap.bi.da.extension.sdk.IDAEDataAcquisitionJob;
import com.sap.bi.da.extension.sdk.IDAEEnvironment;
import com.sap.bi.da.extension.sdk.IDAEProgress;

public class QuandlExtensionDataRequestJob implements IDAEDataAcquisitionJob
{
    IDAEAcquisitionState acquisitionState;
    IDAEEnvironment environment;
    
    QuandlExtensionDataRequestJob (IDAEEnvironment environment, IDAEAcquisitionState acquisitionState) {
        this.acquisitionState = acquisitionState;
        this.environment = environment;
    }

    @Override
    public File execute(IDAEProgress callback) throws DAException {
    	try {
        	File dataFile = QuandlExtensionMetadataRequestJob.dataFile;
        	dataFile.deleteOnExit();

        	return dataFile;
        } catch (Exception e) {
            throw new DAException("HTTP CSV Extension acquisition failed" + e.toString(), e);
        }
    }

    @Override
    public void cancel() {
    	// Cancel is currently not supported
    }

    @Override
    public void cleanup() {
    	// Called once acquisition is complete
    }
}


package com.sap.bi.da.extension.quandlextension;

import com.sap.bi.da.extension.sdk.DAException;
import com.sap.bi.da.extension.sdk.IDAEClientRequestJob;
import com.sap.bi.da.extension.sdk.IDAEProgress;
import org.apache.commons.codec.binary.Base64OutputStream;
import org.apache.commons.io.IOUtils;

import javax.imageio.ImageIO;
import javax.net.ssl.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Niklas on 15.09.2016.
 */
public class QuandlExtensionClientRequestJob implements IDAEClientRequestJob {
    private static final String API_BASE_URL = "https://www.quandl.com/api/v3/";
    String query;

    QuandlExtensionClientRequestJob(String request) {
        this.query = request;
    }

    @Override
    public String execute(IDAEProgress callback) throws DAException {
        // simple proxy for json api calls.
        // Needed to enable cross-origin HTTP requests from UI which normally are not allowed
        // due to the same origin policy.
        String myurl = API_BASE_URL + query;
        String charset = "UTF-8";
        try {
            // create custom truststore because Lumira's truststore currently does not include Quandl's CA
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            InputStream trustStore = getClass().getResourceAsStream("/truststore.ts");
            keyStore.load(trustStore, "asdfasdf".toCharArray());
            trustStore.close();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init(keyStore);
            SSLContext ctx = SSLContext.getInstance("TLS");
            ctx.init(null, tmf.getTrustManagers(), null);
            SSLSocketFactory sslFactory = ctx.getSocketFactory();
            HttpsURLConnection con = (HttpsURLConnection) new URL(myurl).openConnection();
            con.setSSLSocketFactory(sslFactory);
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "*/*");
            InputStream in = con.getInputStream();
            String encoding = con.getContentEncoding();
            encoding = encoding == null ? charset : encoding;
            String responseBody = IOUtils.toString(in, encoding);
            in.close();
            int code = con.getResponseCode();
            if (code >= 300) {
                throw new DAException(responseBody);
            }
            // replace image links with base64 encoded raw image data
            String responseWithRawImages = loadImagesRawData(responseBody);
            // remove html tags from response since they are not rendered inside UI5 controls
            String responseWithoutHTMLTags = responseWithRawImages.replaceAll("(\\\\u003c).*?(\\\\u003e)", "");
            return responseWithoutHTMLTags;
        } catch (Exception e) {
            throw new DAException("Could not retrieve database list", e);
        }
    }

    private String loadImagesRawData(String json) {
        String regex = "(http[^\\s]+(.)(jpg|jpeg|png|tiff|gif)\\b)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(json);
        String newJson = json + "";
        TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs, String authType) {
            }

            public void checkServerTrusted(X509Certificate[] certs, String authType) {
            }
        }
        };

        // Install the all-trusting trust manager
        SSLContext sc;
        try {
            sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
        } catch (Exception e) {
            return json;
        }

        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };

        while (matcher.find()) {
            String urlString = matcher.group(0);
            try {
                URL url =  new URL(urlString);
                HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
                con.setHostnameVerifier(allHostsValid);
                con.setSSLSocketFactory(sc.getSocketFactory());
                BufferedImage image = ImageIO.read(url);
                BufferedImage scaledImage = new BufferedImage(48, 48, BufferedImage.TYPE_INT_RGB);
                Graphics g = scaledImage.createGraphics();
                g.drawImage(image, 0, 0, 48, 48, null);
                g.dispose();
                ByteArrayOutputStream os = new ByteArrayOutputStream();
                OutputStream b64 = new Base64OutputStream(os);
                ImageIO.write(scaledImage, "png", b64);
                String result = os.toString("UTF-8");
                result = "data:image/png;base64," + result;
                newJson = newJson.replace(urlString, result);
            } catch (Exception e) {
                //
            }
        }
        return newJson;
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

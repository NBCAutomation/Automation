package wdMethods;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.openqa.selenium.JavascriptExecutor;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Parameters;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.saucerest.SauceREST;

import utils.DataInputProvider;


public class ProjectMethods extends SeMethods{

	public String browserName;
	public String dataSheetName;
	public String jobId;
	public String URL1;
	
	@BeforeSuite(groups= {"Regression"})
	public void beforeSuite(){
		startResult();
	}

	@BeforeTest(groups= {"Regression"})
	public void beforeTest() {
	}
	
	@Parameters({"browser","platform","url"})
	@BeforeMethod(groups= {"Regression"})
	public void beforeMethod(String browser, String platform, String applicationUrl){
		test = startTestCase(testCaseName, testDescription);
		test.assignCategory(category);
		test.assignAuthor(authors);
		String tcname=testCaseName;
		startApp(browser,platform,applicationUrl,tcname);
		URL1 = applicationUrl;
	}
	
	@AfterSuite (groups= {"Regression"})
	public void afterSuite() throws Exception{
		endResult();
		//sendmailAttachment();
		
	}

	@AfterTest(groups= {"Regression"})
	public void afterTest()  {
		
	}
	
	@AfterMethod(groups= {"Regression"})
	public void afterMethod(){
		
		endTestcase();
		closeAllBrowsers();
	}
		
		/*Properties prop = new Properties();
		prop.load(new FileInputStream(new File("./src/main/resources/config.properties")));
		SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication( prop.getProperty("USERNAME"), prop.getProperty("ACCESS_KEY")); 
		SauceREST client = new SauceREST(authentication.getUsername(), authentication.getAccessKey());
		
		public void jobPassed(String jobId) {
	        updates.put("passed", true);
	        updateJobInfo(jobId, updates);
		}
		
		public void jobFailed(String jobId) {
	        updates.put("passed", false);
	        updateJobInfo(jobId, updates);
	    }
		updates.put("passed", passed);
		client.updateJobInfo(jobId, updates);
		
		if (passed) {
            client.jobPassed(jobId);
        } else {
            client.jobFailed(jobId);
        }
			try
			{
	          //code block
	            client.jobPassed(this.jobId);
	        } catch (Exception e) {
	            client.jobFailed(this.jobId);
	            throw e;
	        }
		((JavascriptExecutor) driver.get()).executeScript("sauce:job-result=" + (result.isSuccess() ? "passed" : "failed"));*/


	@DataProvider(name="fetchData")
	public  Object[][] getData(){
		
		/*Object [][] data = new Object [1][1];
		data[0][0] = "https://www.nbcnewyork.com";
		
		return data;*/
		return DataInputProvider.getSheet(dataSheetName);		
	}

	public void beforeMethod() {
		// TODO Auto-generated method stub
		
	}
}

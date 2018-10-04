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

/*import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.saucerest.SauceREST;*/

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
	public void beforeMethod(String browser, String platform, String applicationUrl) {
		test = startTestCase(testCaseName, testDescription);
		test.assignCategory(category);
		test.assignAuthor(authors);
		String tcname=testCaseName;
		startApp(browser,platform,applicationUrl,tcname);
		URL1 = applicationUrl;
		
	}
	
	@AfterSuite (groups= {"Regression"})
	public void afterSuite(){
		
		endResult();
		//sendmailAttachment();
		
	}

	@AfterTest(groups= {"Regression"})        
	public void afterTest() {	
		//shutDownDriver(result);
		endTestcase();
		closeAllBrowsers();
	}


	@DataProvider(name="fetchData")
	public  Object[][] getData(){
		return DataInputProvider.getSheet(dataSheetName);		
	}

	public void beforeMethod() {
		// TODO Auto-generated method stub
		
	}
}

package wdMethods;

import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Parameters;

import utils.DataInputProvider;


public class ProjectMethods extends SeMethods{

	public String browserName;
	public String dataSheetName;
	
	@BeforeSuite
	public void beforeSuite(){
		startResult();
	}

	@BeforeTest
	public void beforeTest() {
	}
	
	@Parameters({"browser","platform","url"})
	@BeforeMethod
	public void beforeMethod(String browser, String platform, String applicationUrl){
		test = startTestCase(testCaseName, testDescription);
		test.assignCategory(category);
		test.assignAuthor(authors);
		String tcname=testCaseName;
		startApp(browser,platform,applicationUrl,tcname);
		
	}
	
	@AfterSuite
	public void afterSuite() throws Exception{
		endResult();
		//sendmailAttachment();
		
	}

	@AfterTest
	public void afterTest(){
	}
	
	@AfterMethod
	public void afterMethod(ITestResult result){
		
		/*((JavascriptExecutor) webDriver.get()).executeScript("sauce:job-result=" + (result.isSuccess() ? "passed" : "failed"));
        webDriver.get().quit();
    }

    protected void annotate(String text) {
        ((JavascriptExecutor) webDriver.get()).executeScript("sauce:context=" + text);*/
        
		endTestcase();
		closeAllBrowsers();
	}
	
	/*@DataProvider(name="fetchData")
	public  Object[][] getData(){
		return DataInputProvider.getSheet(dataSheetName);		
	}*/	
	
	@DataProvider(name="fetchData")
	public  Object[][] getData(){
		
		/*Object [][] data = new Object [1][1];
		data[0][0] = "https://www.nbcnewyork.com";
		
		return data;*/
		return DataInputProvider.getSheet(dataSheetName);		
	}
}

package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC001_Logo_is_clickable extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC01_NbcPage_logo";
		testCaseName = "TC01_NbcPage_logo";
		testDescription = "To Test Logo has to click and should get refreshed";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test
	public void NbcPage(){

		try {
			Thread.sleep(4000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	new NbcPage(driver, test)
	.clicknbclogo();
	
	}
}
	/*try {
		Thread.sleep(10000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	
	}*/


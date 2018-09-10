package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC017_Footer_appears_on_all_pages extends ProjectMethods{

	@BeforeClass
	public void setData() {
		
		testCaseName = "Footer appears on all pages";
		testDescription = "To Test News Page Loads with Sub-Nav successfully";
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
	.clickfooter();
	
	}
}


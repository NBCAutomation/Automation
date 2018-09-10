package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC012_Traffic_Page_Loads_with_SubNav extends ProjectMethods{

	@BeforeClass
	public void setData() {
		
		testCaseName = "Traffic Page Loads with Sub-Nav";
		testDescription = "To Test raffic Page Loads with Sub-Nav";
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
	.clicknbclist()
	.clicktraffic()
	.clickverifytraffic();
	
	}
}


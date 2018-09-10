package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC013_Investigations_page_loads_along_with_sub_nav extends ProjectMethods{

	@BeforeClass
	public void setData() {
		
		testCaseName = "Investigations page loads along with sub nav";
		testDescription = "To Test Investigations page loads along with sub nav successfully";
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
	.clickinvestigations()
	.clickinvestigationvaild()
	.clickmoreinvestigation();
	
	}
}


package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC004_Right_rail_has_Spredfast extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC004_Right_rail_has_Spredfast";
		testCaseName = "TC004_Right_rail_has_Spredfast";
		testDescription = "To Test Right rail has Spredfast";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clicknbclogo()
	.clickthisjustin()
	.clickminutesago();
	
	try {
		Thread.sleep(5000);
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
	}
}

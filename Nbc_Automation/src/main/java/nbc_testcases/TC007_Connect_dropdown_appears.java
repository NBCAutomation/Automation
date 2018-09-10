package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC007_Connect_dropdown_appears extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Connect dropdown appears";
		testDescription = "To Test Connect dropdown appears";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clicknbclogo()
	.clickconnect();
	}
}

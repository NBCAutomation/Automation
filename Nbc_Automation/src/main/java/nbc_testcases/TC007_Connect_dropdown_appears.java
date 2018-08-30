package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC007_Connect_dropdown_appears extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC007_Connect_dropdown_appears";
		testCaseName = "TC007_Connect_dropdown_appears";
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
	
	try {
		Thread.sleep(5000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}
}

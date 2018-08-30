package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC003_Weather_module_appears_on_HP_and_map_loads extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC003_Weather_module_appears_on_HP_and_map_loads";
		testCaseName = "TC003_Weather_module_appears_on_HP_and_map_loads";
		testDescription = "To Test wether module has to be loaded";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test
	public void NbcPage(){

	new NbcPage(driver, test)
	.clicknbclogo()
	.clickelewetheriframe()
	.clickwethermodule();
	
	
	try {
		Thread.sleep(10000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}
}

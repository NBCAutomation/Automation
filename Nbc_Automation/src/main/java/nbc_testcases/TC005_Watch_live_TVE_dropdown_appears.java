package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC005_Watch_live_TVE_dropdown_appears extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Watch live TVE dropdown appears";
		testDescription = "To Test TV dropdown appears";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clickwatchlivelogo()
	.clicklivetv()
	.clickonnow()
	.clickondemand()
	.clickfullschedule();
	
	}
}

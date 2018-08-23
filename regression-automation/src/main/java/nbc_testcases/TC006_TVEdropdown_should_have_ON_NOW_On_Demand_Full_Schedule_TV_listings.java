package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC006_TVEdropdown_should_have_ON_NOW_On_Demand_Full_Schedule_TV_listings extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC005_Watch live TVE dropdown appears";
		testCaseName = "TC005_Watch live TVE dropdown appears";
		testDescription = "To Test TV dropdown appears";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clickwatchlivelogo()
	.clickfullschedule()
	.clicknbc4()
	.clickdaySelect()
	.clickdaynbcnow()
	.clickcozitv()
	.clickdaySelect()
	.clickdaynbcnow();
	
	try {
		Thread.sleep(5000);
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
	}
}

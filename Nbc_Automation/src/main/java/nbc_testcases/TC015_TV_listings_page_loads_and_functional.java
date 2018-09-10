package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC015_TV_listings_page_loads_and_functional extends ProjectMethods{

	@BeforeClass
	public void setData() {
		
		testCaseName = "News Page Loads with Sub-Nav";
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
	.clicknbclist()
	.clicknbccontact()
	.clicktvlistings()
	.clickdaySelect()
	.clicktvListingContainer();
	
	}
}


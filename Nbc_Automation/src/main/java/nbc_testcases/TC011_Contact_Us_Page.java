package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC011_Contact_Us_Page extends ProjectMethods{

	@BeforeClass
	public void setData() {

		
		testCaseName = "Contact Us Page";
		testDescription = "To Test Contact Us Page is loading";
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
	.clicknbclogo()
	.clickcontactus()
	.clickcontactWNBC();
	
	}
}


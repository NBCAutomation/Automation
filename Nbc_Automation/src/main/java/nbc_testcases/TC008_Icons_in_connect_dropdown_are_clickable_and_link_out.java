package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC008_Icons_in_connect_dropdown_are_clickable_and_link_out extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Connect have all the configuration";
		testDescription = "To Test Logo has to click";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clicknbclogo()
	.clickconnect()
	.clickconnecttwitter()
	.clickconnect()
	.clickconnectinstagram()
	.clickconnect()
	.clickconnectfacebook()
	.clickconnect()
	.clickourapps()
	.clickconnect()
	.clicknewsletter()
	.clickconnect()
	.clickvideosandpictures()
	.clickconnect()
	.clicknbclogo()
	.clickconnect()
	.clicksendfeedback()
	.clickconnect()
	.clicktermsofservice()
	.clickconnect()
	.clickprivacypolicy()
	.clickconnect()
	.clickprivacypolicy()
	.clickconnect()
	.clickvisitourpartner();
	try {
		Thread.sleep(5000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}
}

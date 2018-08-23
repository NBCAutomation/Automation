package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC009_Share_bar_is_visible_and_functions_Article extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC009_Share_bar_is_visible_and_functions_Article";
		testCaseName = "TC009_Share_bar_is_visible_and_functions_Article";
		testDescription = "To Test Share bar is visible";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clicknbclogo()
	.clicktopstories()
	.clickfacebook();
	//.clicktwitter();
	//.clickcomments();
//	.clickenvelope()
//	.clickprint();
	
	try {
		Thread.sleep(5000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}
}

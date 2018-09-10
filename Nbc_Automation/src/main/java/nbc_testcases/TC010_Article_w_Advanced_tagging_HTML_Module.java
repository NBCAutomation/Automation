package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC010_Article_w_Advanced_tagging_HTML_Module extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Article Advanced tagging HTML Module";
		testDescription = "To Test HTML Module Appears";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	new NbcPage(driver, test)
	.clickrayrice()
	.clickframe();
//	.clickiframe()
//	.clicknavnext();
	
	
	try {
		Thread.sleep(5000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}
}

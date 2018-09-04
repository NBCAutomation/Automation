package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC002_Top_stories_playback_with_pre_roll extends ProjectMethods{

	@BeforeClass
	public void setData() {

		dataSheetName = "TC002_Top_stories_playback_with_pre_roll";
		testCaseName = "TC002_Top_stories_playback_with_pre_roll";
		testDescription = "To Test stories playback with-pre roll";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test
	public void NbcPage(){

	new NbcPage(driver, test)
	.clicknbclogo()
	.clicktopstories();
	//.clickplayer();
	
	
	try {
		Thread.sleep(10000);
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	}
}

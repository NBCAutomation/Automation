package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC018_Investigations_Lead_Playback_with_No_Preroll extends ProjectMethods{

	@BeforeClass
	public void setData() {
		
		testCaseName = "Investigations Lead Playback - with No Pre-roll";
		testDescription = "To Test Investigations Lead Playback - with No Pre-roll successfully";
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
	.clickinvestigations()
	.clickinvestigationvideo();
	
	}
}


package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC002_Top_stories_playback_with_pre_roll extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Top stories playback with pre roll";
		testDescription = "To Test stories playback with-pre roll";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test
	public void NbcPage(){
			 
					//if (sUrl.equalsIgnoreCase(sUrl)) {
						new NbcPage(driver, test)
						.clicknbclogo()
						.clicktopstories();
					/*} else if (LUrl.equalsIgnoreCase(LUrl)) {
						new NbcPage(driver, test).clicknbclogo().clicktopstories();
					} else if (TPUrl.equalsIgnoreCase(TPUrl)) {
						new NbcPage(driver, test).clicknbclogo().clicktopstoriesTM();
					} else if (T5Url.equalsIgnoreCase(T5Url)) {
						new NbcPage(driver, test).clicknbclogo().clicktopstoriesTM();
			};*/
	}
}
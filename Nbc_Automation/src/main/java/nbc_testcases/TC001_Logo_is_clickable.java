package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC001_Logo_is_clickable extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "NbcPage logo clickable";
		testDescription = "To Test Logo has to click and should get refreshed";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test
	public void NbcPage(){

			new Runnable() {
			public void run() {
				if (sUrl.equalsIgnoreCase(sUrl)) {
					new NbcPage(driver, test).clicknbclogo();
				} else if (LUrl.equalsIgnoreCase(LUrl)) {
					new NbcPage(driver, test).clicknbclogo();
				} else if (TPUrl.equalsIgnoreCase(TPUrl)) {
					new NbcPage(driver, test).clicknbclogo();
				} else if (T5Url.equalsIgnoreCase(T5Url)) {
					new NbcPage(driver, test).clicknbclogo();
				}
			}
		};
		
		try {
			Thread.sleep(4000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
	}
}


package nbc_testcases;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC004_Right_rail_has_Spredfast extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Right rail has Spredfast";
		testDescription = "To Test Right rail has Spredfast";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}

	@Test 
	public void NbcPage(){
	
			//if (sUrl.equalsIgnoreCase(sUrl)) {
				new NbcPage(driver, test)
				.clicknbclogo()
				.clickthisjustin()
				.clickminutesago();
			/*} else if (LUrl.equalsIgnoreCase(LUrl)) {
				new NbcPage(driver, test).clicknbclogo().clickthisjustin().clickminutesago();
			} else if (TPUrl.equalsIgnoreCase(TPUrl)) {
				new NbcPage(driver, test).clicknbclogo().clicknavtiempoTM().clickmapplayTM();
			} else if (T5Url.equalsIgnoreCase(T5Url)) {
				new NbcPage(driver, test).clicknbclogo().clicknavtiempoTM().clickmapplayTM();
			}
		}
	};*/
	}
}

package nbc_testcases;

import java.io.File;
import java.io.FileInputStream;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.collections4.map.HashedMap;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC003_Weather_module_appears_on_HP_and_map_loads extends ProjectMethods{

	@BeforeClass
	public void setData() {

		testCaseName = "Weather Radar Interactive Loads/Plays";
		testDescription = "To Test Weather Radar Interactive Loads/Plays";
		category= "Smoke";
		authors	="Vinoth";
		browserName ="chrome";
	}
	/*public  Map<String, String> appData = new HashedMap<>();
	public String applicationUrl;*/
	
		@Test
		public void NbcPage() {
			
			new NbcPage(driver, test)
			.clicknbclogo()
			.clickelewetheriframe()
			.clickwethermodule();
		}
			/*Properties prop = new Properties();
			try {
				prop.load(new FileInputStream(new File("./src/main/resources/config.properties")));
				appData.put("sUrl", prop.getProperty("NYURL"));
				appData.put("LUrl", prop.getProperty("LAURL"));
				appData.put("T5Url", prop.getProperty("T51URL"));
				appData.put("TPUrl", prop.getProperty("TPRURL"));
				String url1 = "https://www.nbcnewyork.com", url2 = "http://www.nbclosangeles.com", url3 = "http://www.telemundo51.com", url4 = "http://www.telemundopr.com";
				*/
				
//			if (appData.get(applicationUrl).equalsIgnoreCase(prop.getProperty("NYURL"))) {
				//System.out.println(appData.get(URL1));
				//if(url1.equalsIgnoreCase(appData.get(URL1))) {
				
			/*} else if (url2.equalsIgnoreCase(appData.get(URL1))) {
				new NbcPage(driver, test)
				.clicknbclogo()
				.clickelewetheriframe()
				.clickwethermodule();
			} else if (url3.equalsIgnoreCase(appData.get(URL1))) {
				new NbcPage(driver, test)
				.clicknbclogo()
				.clicknavtiempoTM()
				.clickmapplayTM();
			} else if (url4.equalsIgnoreCase(appData.get(URL1))) {
				new NbcPage(driver, test)
				.clicknbclogo()
				.clicknavtiempoTM()
				.clickmapplayTM();
			}
//try {
*///	Thread.sleep(10000);
//} catch (InterruptedException e) {
//	// TODO Auto-generated catch block
//	e.printStackTrace();
//}
		/*}
			
			catch(Exception e) {
				System.out.println(e);
				e.printStackTrace();
				
				}*/
}

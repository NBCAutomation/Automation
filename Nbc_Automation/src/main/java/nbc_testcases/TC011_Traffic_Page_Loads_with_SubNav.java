package nbc_testcases;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.collections4.map.HashedMap;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import nbc_pages.NbcPage;
import wdMethods.ProjectMethods;

public class TC011_Traffic_Page_Loads_with_SubNav extends ProjectMethods{

	@BeforeClass(groups= {"Regression"})
	public void setData() {

		testCaseName = "Traffic Page Loads with Sub-Nav";
		testDescription = "To Test raffic Page Loads with Sub-Nav";
		category= "Regression";
		authors	="Vinoth";
		browserName ="chrome";
	}

	public  Map<String, String> appData = new HashedMap<>();

	@Test(groups= {"Regression"}, priority=11)
	public void NbcPage(){

		Properties prop = new Properties();
		try {
			prop.load(new FileInputStream(new File("./src/main/resources/config.properties")));

			if(driver.getCurrentUrl().startsWith(prop.getProperty("NYURL"))==true || driver.getCurrentUrl().startsWith(prop.getProperty("LAURL"))==true){
				new NbcPage(driver, test)
				.clicknbclist()
				.clicktraffic()
				.clickverifytraffic();
			}
			else if(driver.getCurrentUrl().startsWith(prop.getProperty("T51URL"))==true || driver.getCurrentUrl().startsWith(prop.getProperty("TPRURL"))==true){
				new NbcPage(driver, test)
				.clicknbclogo();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}


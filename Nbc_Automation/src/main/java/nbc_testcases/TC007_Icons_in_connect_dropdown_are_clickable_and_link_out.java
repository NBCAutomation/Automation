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

public class TC007_Icons_in_connect_dropdown_are_clickable_and_link_out extends ProjectMethods{

	@BeforeClass(groups= {"Regression"})
	public void setData() {

		testCaseName = "Connect have all the configuration";
		testDescription = "To Test Logo has to click";
		category= "Regression";
		authors	="Vinoth";
		browserName ="chrome";
	}

	public  Map<String, String> appData = new HashedMap<>();

	@Test(groups= {"Regression"}, priority=7)

	public void NbcPage(){

		Properties prop = new Properties();
		try {
			prop.load(new FileInputStream(new File("./src/main/resources/config.properties")));

			if(driver.getCurrentUrl().startsWith(prop.getProperty("NYURL"))==true || driver.getCurrentUrl().startsWith(prop.getProperty("LAURL"))==true){
				new NbcPage(driver, test)
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
			}
			else if(driver.getCurrentUrl().startsWith(prop.getProperty("T51URL"))==true || driver.getCurrentUrl().startsWith(prop.getProperty("TPRURL"))==true){
				new NbcPage(driver, test)
				.clickconnectTM()
				.clickconnecttwitter()
				.clickconnectTM()
				.clickconnectinstagram()
				.clickconnectTM()
				.clickconnectfacebook()
				.clickconnectTM()
				.clickourapps()
				.clickconnectTM()
				.clicknewsletter()
				.clickconnectTM()
				.clickvideosandpictures()
				.clickconnectTM()
				.clickconnectteam()
				.clicknbclogo()
				.clickconnectTM()
				.clickconnectourstations()
				.clickconnectTM()
				.clickconnectpromotions()
				.clickconnectTM()
				.clickconnectprogramming()
				.clickconnectTM()
				.clicksendfeedback()
				.clickconnectTM()
				.clicktermsofservice()
				.clickconnectTM()
				.clickprivacypolicy()
				.clickconnectTM()
				.clickprivacypolicy();
			}

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}

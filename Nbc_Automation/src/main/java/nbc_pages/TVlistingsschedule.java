package nbc_pages;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import org.apache.poi.ddf.EscherColorRef.SysIndexSource;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import com.relevantcodes.extentreports.ExtentTest;

import wdMethods.ProjectMethods;
@Test
public class TVlistingsschedule extends ProjectMethods{

	public TVlistingsschedule(RemoteWebDriver driver,ExtentTest test) {
		this.driver = driver;
		this.test = test;

		PageFactory.initElements(driver, this);		
		/*if(!verifyTitle("TV Listings, Schedule, and What's on Tonight on WNBC 4 New York | NBC New York")) {
				throw new RuntimeException();
			}*/
		
		/*Properties prop = new Properties();
		try {
			prop.load(new FileInputStream(new File("./src/main/resources/config.properties")));
			appData.put("sUrl", prop.getProperty("NYURL"));
			appData.put("LUrl", prop.getProperty("LAURL"));
			appData.put("T5Url", prop.getProperty("T51URL"));
			appData.put("TPUrl", prop.getProperty("TPRURL"));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}*/
	}
	
	

	@FindBy(how=How.XPATH,using="//li[contains(text(),'NBC 4')]")
	private WebElement elenbc4;	
	@FindBy(how=How.XPATH,using="//li[contains(text(),'NBC4')]")
	private WebElement elenbc4LA;
	public TVlistingsschedule clicknbc4() {
		
		if(this.driver.getCurrentUrl().startsWith(appData.get("sUrl"))==true){
			click(elenbc4);
			System.out.println(elenbc4);
		}
		else if(this.driver.getCurrentUrl().startsWith(appData.get("LUrl"))==true){
			click(elenbc4LA);
			System.out.println(elenbc4LA);
		}
		return this;
	}

	@FindBy(how=How.XPATH,using="//li[contains(text(),'Cozi TV')]")
	private WebElement elecozitv;	
	public TVlistingsschedule clickcozitv() {
		click(elecozitv);
		System.out.println(elecozitv);
		//driver.findElementByXPath("//li[contains(text(),'Cozi TV')]").isDisplayed();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[contains(text(),'NOW')]")
	private WebElement eledaynbcnow;	
	public TVlistingsschedule clickdaynbcnow() {
		click(eledaynbcnow);
		System.out.println(eledaynbcnow);
		//driver.findElementByXPath("//div[contains(text(),'NOW')]").isDisplayed();
		return this;
	}

	@FindBy(how=How.XPATH,using="//select[@id='daySelect']")
	private WebElement eledaySelect;	
	public TVlistingsschedule clickdaySelect() {
		click(eledaySelect);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='tvListingContainer']//h3[@class='header0']")
	private WebElement eletvListingContainer;	
	public TVlistingsschedule clicktvListingContainer() {
		click(eletvListingContainer);
		System.out.println(eletvListingContainer);
		return this;
	}

}

package nbc_pages;

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
		}
		
		@FindBy(how=How.XPATH,using="//li[contains(text(),'NBC 4')]")
		private WebElement elenbc4;	
		public TVlistingsschedule clicknbc4() {
			driver.findElementByXPath("//li[contains(text(),'NBC 4')]").isDisplayed();
			click(elenbc4);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[contains(text(),'Cozi TV')]")
		private WebElement elecozitv;	
		public TVlistingsschedule clickcozitv() {
			click(elecozitv);
			driver.findElementByXPath("//li[contains(text(),'Cozi TV')]").isDisplayed();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[contains(text(),'NOW')]")
		private WebElement eledaynbcnow;	
		public TVlistingsschedule clickdaynbcnow() {
			driver.findElementByXPath("//div[contains(text(),'NOW')]").isDisplayed();
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

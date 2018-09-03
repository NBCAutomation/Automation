package nbc_pages;

import java.util.concurrent.TimeUnit;

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
			click(elenbc4);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[contains(text(),'Cozi TV')]")
		private WebElement elecozitv;	
		public TVlistingsschedule clickcozitv() {
			click(elecozitv);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[contains(text(),'NOW')]")
		private WebElement eledaynbcnow;	
		public TVlistingsschedule clickdaynbcnow() {
			verifyDisplayed(eledaynbcnow);
			getText(eledaynbcnow);
			System.out.println(eledaynbcnow);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//select[@id='daySelect']/option")
		private WebElement eledaySelect;	
		public TVlistingsschedule clickdaySelect() {
			driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
			click(eledaySelect);
			return this;
		}
		
		
}

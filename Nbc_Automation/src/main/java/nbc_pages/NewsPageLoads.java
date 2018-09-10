package nbc_pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import com.relevantcodes.extentreports.ExtentTest;

import wdMethods.ProjectMethods;
	@Test
	public class NewsPageLoads extends ProjectMethods{

		public NewsPageLoads(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Local']")
		private WebElement elelocal;	
		public NewsPageLoads clicklocal() {
			verifyDisplayed(elelocal);
			System.out.println(elelocal);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Top Video ']")
		private WebElement eletopvideo;	
		public NewsPageLoads clicktopvideo() {
			verifyDisplayed(elelocal);
			System.out.println(eletopvideo);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='U.S. & World']")
		private WebElement eleusworld;	
		public NewsPageLoads clickusworld() {
			verifyDisplayed(eleusworld);
			System.out.println(eletopvideo);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Health']")
		private WebElement elehealth;	
		public NewsPageLoads clickhealth() {
			verifyDisplayed(elehealth);
			System.out.println(elehealth);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weird']")
		private WebElement eleweird;	
		public NewsPageLoads clickweird() {
			verifyDisplayed(eleweird);
			System.out.println(eleweird);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weather']")
		private WebElement eleweather;	
		public NewsPageLoads clickweather() {
			verifyDisplayed(eleweather);
			System.out.println(eleweather);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Tech']")
		private WebElement eletech;	
		public NewsPageLoads clicktech() {
			verifyDisplayed(eletech);
			System.out.println(eletech);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Sports']")
		private WebElement elesports;	
		public NewsPageLoads clicksports() {
			verifyDisplayed(elesports);
			System.out.println(elesports);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//h1[@id='top-news-header']")
		private WebElement eletopnewsheader;	
		public NewsPageLoads clicktopnewsheader() {
			verifyDisplayed(eletopnewsheader);
			System.out.println(eletopnewsheader);
			return this;
		}
}

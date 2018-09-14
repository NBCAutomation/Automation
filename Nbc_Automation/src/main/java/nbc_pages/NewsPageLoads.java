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
			click(elelocal);
			System.out.println(elelocal.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='story_details']//following::span[@class='bordermask'][1]")
		private WebElement elelocalarticle;	
		public NewsPageLoads clicklocalarticle() {
			click(elelocalarticle);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='story_details']//following::span[@class='playButtonSmall'][1]")
		private WebElement elelocalvideo;
		public NewsPageLoads clicklocalvideo() {
			click(elelocalvideo);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Top Video ']")
		private WebElement eletopvideo;	
		public NewsPageLoads clicktopvideo() {
			click(eletopvideo);
			System.out.println(eletopvideo.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='U.S. & World']")
		private WebElement eleusworld;	
		public NewsPageLoads clickusworld() {
			System.out.println(eleusworld.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Health']")
		private WebElement elehealth;	
		public NewsPageLoads clickhealth() {
			System.out.println(elehealth.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weird']")
		private WebElement eleweird;	
		public NewsPageLoads clickweird() {
			System.out.println(eleweird.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weather']")
		private WebElement eleweather;	
		public NewsPageLoads clickweather() {
			System.out.println(eleweather.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Tech']")
		private WebElement eletech;	
		public NewsPageLoads clicktech() {
			System.out.println(eletech.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Sports']")
		private WebElement elesports;	
		public NewsPageLoads clicksports() {
			System.out.println(elesports.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//h1[@id='top-news-header']")
		private WebElement eletopnewsheader;	
		public NewsPageLoads clicktopnewsheader() {
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='footer-nav']//a[@name='&lpos=footer&lid=New York Live']")
		private WebElement elenewyorklive;
		public NewsPageLoads clicknewyorklive() {
			scrollingByCoordinatesofAPage();
			click(elenewyorklive);
			driver.navigate().back();
			return this;
		}
}

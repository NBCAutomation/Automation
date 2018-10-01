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
	public class EntertainmentNews extends ProjectMethods{

		public EntertainmentNews(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Entertainment News']")
		private WebElement eleentertainmentnews;	
		public EntertainmentNews clickentertainmentnews() {
			click(eleentertainmentnews);
			System.out.println(eleentertainmentnews.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='subsectionHeaderBreadcrumb']")
		private WebElement elehomeheader;	
		public EntertainmentNews clickhomeheader() {
			click(elehomeheader);
			System.out.println(elehomeheader.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='The Scene']")
		private WebElement elethescene;	
		public EntertainmentNews clickthescene() {
			click(elethescene);
			System.out.println(elethescene.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='subsectionHeader']")
		private WebElement elethesceneheader;	
		public EntertainmentNews clickthesceneheader() {
			click(elethesceneheader);
			System.out.println(elethesceneheader.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='In The Wings']")
		private WebElement elewings;	
		public EntertainmentNews clickwings() {
			click(elewings);
			System.out.println(elewings.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='featureIdGraphic']")
		private WebElement elewingsheader;	
		public EntertainmentNews clickwingsheader() {
			click(elewingsheader);
			System.out.println(elewingsheader.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='NY Live']")
		private WebElement eleNYlive;	
		public EntertainmentNews clickNYlive() {
			click(eleNYlive);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Your Guide 4 NY']")
		private WebElement eleyourguide;	
		public EntertainmentNews clickyourguide() {
			click(eleyourguide);
			System.out.println(eleyourguide.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='featureIdGraphic']")
		private WebElement eleyourguideheader;	
		public EntertainmentNews clickyourguideheader() {
			click(eleyourguideheader);
			System.out.println(eleyourguideheader.getText());
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Open House']")
		private WebElement eleopenhoues;	
		public EntertainmentNews clickopenhoues() {
			click(eleopenhoues);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='headerBanner']//span")
		private WebElement elehouseheader;	
		public EntertainmentNews clickhouseheader() {
			click(elehouseheader);
			System.out.println(elehouseheader.getText());
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Breakfast With Open House']")
		private WebElement elebreakfast;	
		public EntertainmentNews clickbreakfast() {
			click(elebreakfast);
			System.out.println(elebreakfast.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='George to the Rescue']")
		private WebElement eleGeorge;	
		public EntertainmentNews clickGeorge() {
			click(eleGeorge);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='featureIdGraphic']")
		private WebElement elegeorgeheader;	
		public EntertainmentNews clickgeorgeheader() {
			click(elegeorgeheader);
			System.out.println(elegeorgeheader.getText());
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='1st Look']")
		private WebElement ele1stlook;	
		public EntertainmentNews click1stlook() {
			click(ele1stlook);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='headerBanner']//h2")
		private WebElement ele1stlookheader;	
		public EntertainmentNews click1stlookheader() {
			click(ele1stlookheader);
			System.out.println(ele1stlookheader.getText());
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='COZI TV']")
		private WebElement elecozitv;	
		public EntertainmentNews clickcozitv() {
			click(elecozitv);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[@alt='A-Listed: Luxury Real Estate']")
		private WebElement eleluxuryLA;	
		public EntertainmentNews clickluxuryLA() {
			click(eleluxuryLA);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='headerBanner']//h2")
		private WebElement eleluxuryheader;	
		public EntertainmentNews clickluxuryheader() {
			click(eleluxuryheader);
			System.out.println(eleluxuryheader.getText());
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Worth the Trip: California Travel']")
		private WebElement eleworthtrip;	
		public EntertainmentNews clickworthtrip() {
			click(eleworthtrip);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='featureIdGraphic']")
		private WebElement eleworthtripheader;	
		public EntertainmentNews clickworthtripheader() {
			click(eleworthtripheader);
			System.out.println(eleworthtripheader.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section nav-more']")
		private WebElement elenbclist;
		public EntertainmentNews clicknbclist() {
			mouseMoveTo(elenbclist);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='George to the Rescue']")
		private WebElement elegeorgeLA;	
		public EntertainmentNews clickgeorgeLA() {
			click(elegeorgeLA);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Open House']")
		private WebElement eleopenhouse;	
		public EntertainmentNews clickopenhouse() {
			click(eleopenhouse);
			System.out.println(eleopenhouse.getText());
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='sectionHeader']//h1[@id='top-news-header']")
		private WebElement eleentertainmentheader;	
		public EntertainmentNews clickentertainmentheader() {
			click(eleentertainmentheader);
			System.out.println(eleentertainmentheader.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='carousel-story-selection']//ul[@class='carousel-stories']//li[@id='ts-story1']")
		private WebElement eleentertainmentcarousel;	
		public EntertainmentNews clickentertainmentcarousel() {
			click(eleentertainmentcarousel);
			return this;
		}
}

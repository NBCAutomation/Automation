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
	public class NewsPageLoads extends ProjectMethods{

		public NewsPageLoads(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=footer&lid=Investigations']")
		private WebElement eleinvestigations;
		public I_Team_newyork clickinvestigations() {
			click(eleinvestigations);
			return new I_Team_newyork(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section News']")
		private WebElement elenbcnews;
		public NewsPageLoads clicknbcnews() {
			click(elenbcnews);
			System.out.println(elenbcnews.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section I-Team']//a[@class='nav-section-title ']")
		private WebElement elei_team;
		public NewsPageLoads clicki_team() {
			click(elei_team);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section Weather']//a[@class='nav-section-title ']")
		private WebElement elenbcweather;
		public NewsPageLoads clicknbcweather() {
			click(elenbcweather);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Local']")
		private WebElement elelocal;	
		public NewsPageLoads clicklocal() {
			click(elelocal);
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
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='U.S. & World']")
		private WebElement eleusworld;	
		public NewsPageLoads clickusworld() {
			click(eleusworld);
			System.out.println(eleusworld);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Health']")
		private WebElement elehealth;	
		public NewsPageLoads clickhealth() {
			click(eleusworld);
			System.out.println(eleusworld.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weird']")
		private WebElement eleweird;	
		public NewsPageLoads clickweird() {
			click(eleweird);
			System.out.println(eleweird.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weather']")
		private WebElement eleweather;	
		public NewsPageLoads clickweather() {
			click(eleweather);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Tech']")
		private WebElement eletech;	
		public NewsPageLoads clicktech() {
			click(eletech);
			System.out.println(eletech.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Sports']")
		private WebElement elesports;	
		public NewsPageLoads clicksports() {
			click(elesports);
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
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//a[@alt='Entertainment']")
		private WebElement eleentertainment;	
		public NewsPageLoads clickentertainment() {
			click(eleentertainment);
			System.out.println(eleentertainment.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section nav-more']")
		private WebElement elenbclist;
		public NewsPageLoads clicknbclist() {
			mouseMoveTo(elenbclist);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='wunderPane']//li[@class='IRV tab selected']")
		private WebElement eleirvtab;	
		public NewsPageLoads clickirvtab() {
			click(eleirvtab);
			System.out.println(eleirvtab.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='wuContainer']//div[@id='expandMap']")
		private WebElement eleexpandmap;	
		public NewsPageLoads clickexpandmap() {
			click(eleexpandmap);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//button[@class='wxmap--src-widgets-map-components-default-timeline-timeline-controls__play ']")
		private WebElement elemapplay;	
		public NewsPageLoads clickmapplay() {
			click(elemapplay);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Forecast']")
		private WebElement eleweatherforecast;	
		public NewsPageLoads clickweatherforecast() {
			click(eleweatherforecast);
			System.out.println(eleweatherforecast.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='First Alert Forecast']")
		private WebElement eleweatheralertforecast;	
		public NewsPageLoads clickweatheralertforecast() {
			click(eleweatheralertforecast);
			System.out.println(eleweatheralertforecast.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weather Alerts']")
		private WebElement eleweatheralerts;	
		public NewsPageLoads clickweatheralerts() {
			click(eleweatheralerts);
			System.out.println(eleweatheralerts.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='School Closing Alerts']")
		private WebElement eleweatherschool;	
		public NewsPageLoads clickweatherschool() {
			click(eleweatherschool);
			System.out.println(eleweatherschool.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weather News']")
		private WebElement eleweathernews;	
		public NewsPageLoads clickweathernews() {
			click(eleweathernews);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='Weather Stories']")
		private WebElement eleweatherstories;	
		public NewsPageLoads clickweatherstories() {
			click(eleweatherstories);
			System.out.println(eleweatherstories.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[text()='California Drought']")
		private WebElement eleweathercalifornia;	
		public NewsPageLoads clickweathercalifornia() {
			click(eleweathercalifornia);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='wuBanner']")
		private WebElement eleweatherbanner;	
		public NewsPageLoads clickweatherbanner() {
			click(eleweatherbanner);
			scrollingByCoordinatesofAPage();
			System.out.println(eleweatherbanner.getText());
			return this;
		}
}

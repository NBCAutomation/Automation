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
	public class NbcPage extends ProjectMethods{

		public NbcPage(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			//if(!verifyTitle("New York News, Local News, Weather, Traffic, Entertainment, Breaking News")){
//				if(!verifyTitle("Los Angeles News, Local News, Weather, Traffic, Entertainment, Breaking News")){
//				throw new RuntimeException();
//				
//			}	
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
		private WebElement elenbclogo;	
		public NbcPage clicknbclogo() {
			click(elenbclogo);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Connect']")
		private WebElement eleconnect;	
		public NbcPage clickconnect() {
			mouseover(eleconnect);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			//driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//i[@class='fa fa-twitter']")
		private WebElement eleconnecttwitter;	
		public NbcPage clickconnecttwitter() {
			click(eleconnecttwitter);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//i[@class='fa fa-instagram']")
		private WebElement eleconnectinstagram;	
		public NbcPage clickconnectinstagram() {
			click(eleconnectinstagram);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//i[@class='fa fa fa-facebook-official']")
		private WebElement eleconnectfacebook;	
		public NbcPage clickconnectfacebook() {
			click(eleconnectfacebook);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//iframe[@class='wx-standalone-map']")
		private WebElement elewetheriframe;
		public NbcPage clickelewetheriframe() {
			switchToFrame(elewetheriframe);
			return this;
		}
		
		
		@FindBy(how=How.XPATH,using="//div[@id='__wxmap_MapboxAttribution']")
		private WebElement elewethermodule;
		public NbcPage clickwethermodule() {
			click(elewethermodule);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//I[@class=‘fa fa-instagram’]")
		private WebElement eleinstagram;	
		public NbcPage clickinstagram() {
			click(eleinstagram);
			return this;
		}
		
		
		@FindBy(how=How.XPATH,using="//div[text()='Our Apps']")
		private WebElement eleourapps;	
		public Mobilenbc_ny clickourapps() {
			click(eleourapps);
			return new Mobilenbc_ny(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='connect-subnav-title']")
		private WebElement elesocialmedia;	
		public NbcPage clickelesocialmedia() {
			click(elesocialmedia);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Newsletters']")
		private WebElement elenewsletters;	
		public NbcPage clicknewsletter() {
			click(elenewsletters);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[contains(text(),'Send us Videos and Pictures')]")
		private WebElement elevideosandpictures;	
		public Emailnewsletter clickvideosandpictures() {
			click(elevideosandpictures);
			return new Emailnewsletter(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Home']")
		private WebElement elehome;	
		public NbcPage clickhome() {
			click(elehome);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[contains(text(),'Submit a Complaint')]")
		private WebElement elesubmitcomplaint;	
		public Consumercomplaint clicksubmitcomplaint() {
			click(elesubmitcomplaint);
			return new Consumercomplaint(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Submit Tips']")
		private WebElement elesubmittips;	
		public NbcPage clicksubmittips() {
			click(elesubmittips);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Send Feedback']")
		private WebElement elesendfeedback;	
		public NbcPage clicksendfeedback() {
			click(elesendfeedback);
			return this;
		}
	
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=Navigation - Connect&lid=Duopoly']/img")
		private WebElement eletelemundo;	
		public NbcPage clicktelemundo() {
			click(eletelemundo);
			return this;
		}

		
		@FindBy(how=How.XPATH,using="//div[@class='watch-live-logo']")
		private WebElement elewatchlivelogo;	
		public NbcPage clickwatchlivelogo() {
			mouseover(elewatchlivelogo);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//ul[@class='nav-small']//a[text()='Click for full schedule']")
		private WebElement elefullschedule;	
		public TVlistingsschedule clickfullschedule() {
			click(elefullschedule);
			return new TVlistingsschedule(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='livetv']")
		private WebElement elelivetv;	
		public NbcPage clicklivetv() {
			click(elelivetv);
			System.out.println(elelivetv);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='onnow']")
		private WebElement eleonnow;	
		public NbcPage clickonnow() {
			click(eleonnow);
			System.out.println(eleonnow);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='ondemand']")
		private WebElement eleondemand;	
		public NbcPage clickondemand() {
			click(eleondemand);
			System.out.println(eleondemand);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='module-2 homepage-module spredfast']//h4")
		private WebElement elethisjustin;	
		public NbcPage clickthisjustin() {
			click(elethisjustin);
			verifyDisplayed(elethisjustin);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='sfcontentFill']//following::p[@class='reltime'][3]")
		private WebElement eleminutesago;	
		public NbcPage clickminutesago() {
			click(eleminutesago);
			switchToWindow(1);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='play-grey-medium'][1]")
		private WebElement eletopstories;	
		public NbcPage clicktopstories() {
			click(eletopstories);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//h2[text()='Ray Rice: A Timeline']")
		private WebElement elerayrice;
		public NbcPage clickrayrice() {
			driver.navigate().to("https://www.nbcnewyork.com/news/local/Ray-Rice-Appeal-Hearing-Janay-Palmer-Roger-Goodell-Atlantic-City-NFL-Domestic-Abuse-281594071.html");
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//iframe[@src='https://cdn.knightlab.com/libs/timeline/latest/embed/index.html?source=0AtzG4fxNBjQjdDFYalFyTW1DR3BjWlVoYnpONkY3c1E&font=Georgia-Helvetica&maptype=toner&lang=en&width=620&height=575']")
		private WebElement eleframe;
		public NbcPage clickframe() {
			scrollingByCoordinatesofAPage();
			click(eleframe);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Terms of Service']")
		private WebElement eletermsofservice;	
		public NbcPage clicktermsofservice() {
			click(eletermsofservice);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Privacy Policy']")
		private WebElement eleprivacypolicy;	
		public NbcPage clickprivacypolicy() {
			click(eleprivacypolicy);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=Navigation - Connect&lid=Duopoly']/img")
		private WebElement elevisitourpartner;	
		public NbcPage clickvisitourpartner() {
			click(elevisitourpartner);
			return this;
		}
		
		
		@FindBy(how=How.XPATH,using="//div[@class='tpVideoBlocker']")
		private WebElement eleplayer;	
		public NbcPage clickplayer() {
			//scrollingByCoordinatesofAPage();
			click(eleplayer);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='social-icon facebook']")
		private WebElement elefacebook;
		public NbcPage clickfacebook() {
			click(elefacebook);
			switchToWindow(1);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='social-icon twitter']/a/span")
		private WebElement eletwitter;
		public Heartbreakingtimeline clicktwitter() {
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			click(eletwitter);
			return new Heartbreakingtimeline(driver, test);
		}
		
}

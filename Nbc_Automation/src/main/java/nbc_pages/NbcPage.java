package nbc_pages;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import com.relevantcodes.extentreports.ExtentTest;

import wdMethods.ProjectMethods;
	@Test (groups= {"Regression"})
	public class NbcPage extends ProjectMethods{

		public NbcPage(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("New York News, Local News, Weather, Traffic, Entertainment, Breaking News")){
				if(!verifyTitle("Los Angeles News, Local News, Weather, Traffic, Entertainment, Breaking News")){
				throw new RuntimeException();
				
			}*/	
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
			Actions action = new Actions(driver);
	        action.moveToElement(eleconnect).perform();
			//mouseMoveTo(eleconnect);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//a[@alt='Twitter']")
		private WebElement eleconnecttwitter;	
		public NbcPage clickconnecttwitter() {
			click(eleconnecttwitter);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//a[@alt='Instagram']")
		private WebElement eleconnectinstagram;	
		public NbcPage clickconnectinstagram() {
			click(eleconnectinstagram);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//a[@alt='Facebook']")
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
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=El Tiempo']")
		private WebElement elenavtiempoTM;
		public NbcPage clicknavtiempoTM() {
			click(elenavtiempoTM);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//button[@class='wxmap--src-widgets-map-components-default-timeline-timeline-controls__play ']")
		private WebElement elemapplayTM;
		@FindBy(how=How.XPATH,using="//div[@id='wsiRadarFrame']//iframe[@class='wx-standalone-map']")
		private WebElement elemapiframe;
		public NbcPage clickmapplayTM() {
		this.driver.switchTo().frame(elemapiframe);
		this.driver.switchTo().frame(0);
			click(elemapplayTM);
			this.driver.switchTo().defaultContent();
			return this;
		}
		
		
		@FindBy(how=How.XPATH,using="//div[@id='__wxmap_MapboxAttribution']")
		private WebElement elewethermodule;
		public NbcPage clickwethermodule() {
			click(elewethermodule);
			System.out.println(elewethermodule.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//I[@class=‘fa fa-instagram’]")
		private WebElement eleinstagram;	
		public NbcPage clickinstagram() {
			click(eleinstagram);
			System.out.println(eleinstagram.getText());
			return this;
		}
		
		
		@FindBy(how=How.XPATH,using="//div[text()='Our Apps']")
		private WebElement eleourapps;	
		public Mobilenbc_ny clickourapps() {
			click(eleourapps);
			System.out.println(eleourapps.getText());
			return new Mobilenbc_ny(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='connect-subnav-title']")
		private WebElement elesocialmedia;	
		public NbcPage clickelesocialmedia() {
			click(elesocialmedia);
			System.out.println(elesocialmedia.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Newsletters']")
		private WebElement elenewsletters;	
		public NbcPage clicknewsletter() {
			click(elenewsletters);
			System.out.println(elenewsletters.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[contains(text(),'Send us Videos and Pictures')]")
		private WebElement elevideosandpictures;	
		public Emailnewsletter clickvideosandpictures() {
			click(elevideosandpictures);
			System.out.println(elevideosandpictures.getText());
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
			System.out.println(elesubmitcomplaint.getText());
			return new Consumercomplaint(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Submit Tips']")
		private WebElement elesubmittips;	
		public NbcPage clicksubmittips() {
			click(elesubmittips);
			System.out.println(elesubmittips.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Send Feedback']")
		private WebElement elesendfeedback;	
		public NbcPage clicksendfeedback() {
			click(elesendfeedback);
			System.out.println(elesendfeedback.getText());
			return this;
		}
	
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=Navigation - Connect&lid=Duopoly']/img")
		private WebElement eletelemundo;	
		public NbcPage clicktelemundo() {
			click(eletelemundo);
			return this;
		}

		
		@FindBy(how=How.XPATH,using="//li[@class='nav-small-section nav-live-tv']//div[@class='watch-live-logo']")
		private WebElement elewatchlivelogo;	
		public NbcPage clickwatchlivelogo() {
			mouseMoveTo(elewatchlivelogo);
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//ul[@class='nav-small']//a[text()='Click for full schedule']")
		private WebElement elefullschedule;	
		public TVlistingsschedule clickfullschedule() {
			click(elefullschedule);
			System.out.println(elefullschedule.getText());
			return new TVlistingsschedule(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-small-section nav-live-tv']//li[text()='LIVE TV']")
		private WebElement elelivetv;	
		public NbcPage clicklivetv() {
			click(elelivetv);
			System.out.println(elelivetv.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='watch-live-title']")
		private WebElement elewatchlive;	
		public NbcPage clickwatchlive() {
			click(elewatchlive);
			switchToWindow(1);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-small-section nav-live-tv']//li[@class='onnow']")
		private WebElement eleonnow;	
		public NbcPage clickonnow() {
			click(eleonnow);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-small-section nav-live-tv']//li[@class='ondemand']")
		private WebElement eleondemand;	
		public NbcPage clickondemand() {
			click(eleondemand);
			System.out.println(eleondemand.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='module-2 homepage-module spredfast']//h4")
		private WebElement elethisjustin;	
		public NbcPage clickthisjustin() {
			click(elethisjustin);
			System.out.println(elethisjustin.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//p[@class='reltime']//a[1]")
		//div[@id='sfcontentFill']//following-sibling::p[@class='reltime'][1]")
		private WebElement eleminutesago;	
		public NbcPage clickminutesago() {
			click(eleminutesago);
			//switchToWindow(1);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='story-icon']//following::div[@class='play-grey-medium'][1]")
		private WebElement eletopstories;	
		public NbcPage clicktopstories() {
			click(eletopstories);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='topStory right-image']//div[@class='smallPlayButton']")
		private WebElement eletopstoriesTM;	
		public NbcPage clicktopstoriesTM() {
			click(eletopstoriesTM);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='leadMediaRegion gallery']//div[@class='pg_article_viewport']")
		private WebElement elegallery;
		public NbcPage clickgallery() {
			click(elegallery);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='pg_article_footer']//button[text()='Play Gallery']")
		private WebElement eleplaygallery;
		public NbcPage clickplaygallery() {
			driver.navigate().to("https://www.nbcnewyork.com/news/national-international/World-Cup-Soccer-Brazil-Most-Popular-Facebook--263978591.html");
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			scrollingByCoordinatesofAPage();
			click(eleplaygallery);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Terms of Service']")
		private WebElement eletermsofservice;	
		public NbcPage clicktermsofservice() {
			click(eletermsofservice);
			System.out.println(eletermsofservice.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='privacy-policy']")
		private WebElement eleprivacypolicy;	
		public NbcPage clickprivacypolicy() {
			click(eleprivacypolicy);
			driver.navigate().back();
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
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
		
		@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon facebook']")
		private WebElement elefacebook;
		public NbcPage clickfacebook() {
			click(elefacebook);
			switchToWindow(1);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon twitter']")
		private WebElement eletwitter;
		public NbcPage clicktwitter() {
			click(eletwitter);
			switchToWindow(1);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon comment']")
		private WebElement eleiconcomment;
		public NbcPage clickiconcomment() {
			click(eleiconcomment);
			System.out.println(eleiconcomment.getText());
			driver.navigate().back();
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon email']")
		private WebElement eleiconemail;
		public NbcPage clickiconemail() {
			click(eleiconemail);
			System.out.println(eleiconemail.getText());
			switchToWindow(1);
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon print']")
		private WebElement eleiconprint;
		public NbcPage clickiconprint() {
			click(eleiconprint);
			System.out.println(eleiconprint.getText());
			switchToWindow(1);
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=footer&lid=Contact Us']")
		private WebElement elecontactus;
		public ContactUS clickcontactus() {
			scrollingByCoordinatesofAPage();
			click(elecontactus);
			return new ContactUS(driver, test);
		}
		
		
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section nav-more']")
		private WebElement elenbclist;
		public NbcPage clicknbclist() {
			mouseMoveTo(elenbclist);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=ellipsis hover&lid=Traffic']")
		private WebElement eletraffic;
		public Newyorktraffic clicktraffic() {
			click(eletraffic);
			return new Newyorktraffic(driver, test);
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
			return new NewsPageLoads(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section Weather']//a[@class='nav-section-title ']")
		private WebElement elenbcweather;
		public NewsPageLoads clicknbcweather() {
			click(elenbcweather);
			return new NewsPageLoads(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//a[text()='Home']")
		private WebElement elenbchome;
		public NewsPageLoads clicknbchome() {
			click(elenbchome);
			System.out.println(elenbchome.getText());
			return new NewsPageLoads(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=ellipsis hover&lid=Contact Us']")
		private WebElement elenbccontact;
		public ContactUS clicknbccontact() {
			click(elenbccontact);
			System.out.println(elenbccontact.getText());
			return new ContactUS(driver, test);
		}
	
		
		@FindBy(how=How.XPATH,using="//div[@class='footer']/div")
		private WebElement elefooter;
		public NbcPage clickfooter() {
			click(elefooter);
			scrollingByCoordinatesofAPage();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='footer-nav']//a[@name='&lpos=footer&lid=New York Live']")
		private WebElement elenewyorklive;
		public NewsPageLoads clicknewyorklive() {
			scrollingByCoordinatesofAPage();
			click(elenewyorklive);
			System.out.println(elenewyorklive.getText());
			driver.navigate().back();
			return new NewsPageLoads(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//li[@class='nav-section Weather']//a[@class='nav-section-title ']")
		private WebElement eleweather;
		public Newyorkweather clickweather() {
			click(eleweather);
			return new Newyorkweather(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//span[contains(text(),'Photos')]")
		private WebElement elephoto;	
		public NbcPage clickphoto() {
			click(elephoto);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='slide_count']")
		private WebElement eleslidecount;	
		public NbcPage clickslidecount() {
			List<WebElement> drplist= driver.findElements(By.xpath("//div[@class='slide_count']"));
			int size=drplist.size();
			System.out.println("Total xpath: " + size);
			for(int i=0; i<drplist.size(); i++)
			{

			System.out.println(drplist.get(i).getText());
			}
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='section mid']//div[@class='citymodule full']/h1[@class='moduletitle']")
		private WebElement elemoduletitle;	
		public NbcPage clickmoduletitle() {
			click(elemoduletitle);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//span[@class='Gallery headline_color']//following::h3[@class='headline'][6]")
		private WebElement elestory1;	
		public NbcPage clickstory1() {
			scrollingByCoordinatesofAPage();
			click(elestory1);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//a[@alt='Entertainment']")
		private WebElement eleentertainment;	
		public EntertainmentNews clickentertainment() {
			click(eleentertainment);
			System.out.println(eleentertainment.getText());
			return new EntertainmentNews(driver, test);
		}
}

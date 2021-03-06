package nbc_pages;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.lang.model.element.Element;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
//import org.openqa.selenium.remote.server.handler.SwitchToWindow;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;

import com.graphbuilder.math.VarMap;
import com.relevantcodes.extentreports.ExtentTest;

import okio.Timeout;
import wdMethods.ProjectMethods;
@Test (groups= {"Regression"})
public class NbcPage extends ProjectMethods{

	public NbcPage(RemoteWebDriver driver,ExtentTest test) {
		this.driver = driver;
		this.test = test;

		PageFactory.initElements(driver, this);
	}

	@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
	private WebElement elenbclogo;	
	public NbcPage clicknbclogo() {
		click(elenbclogo);
		WebElement elenbclogo = driver.findElement(By.xpath("//a[@name='&lpos=section navigation&lid=logo']/img"));

		Boolean ImagePresent = (Boolean) ((JavascriptExecutor)driver).executeScript("return arguments[0].complete && typeof arguments[0].naturalWidth != \"undefined\" && arguments[0].naturalWidth > 0", elenbclogo);
		if (!ImagePresent)
		{
			System.out.println("Image not displayed.");
		}
		else
		{
			System.out.println("Image displayed.");
		}
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Connect')]")
	private WebElement eleconnect;	
	public NbcPage clickconnect() {
		mouseMoveTo(eleconnect);
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Conócenos')]")
	private WebElement eleconnectTM;	
	public NbcPage clickconnectTM() {
		mouseMoveTo(eleconnectTM);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//i[@class='fa fa-twitter']")
	private WebElement eleconnecttwitter;	
	public NbcPage clickconnecttwitter() {
		click(eleconnecttwitter);
		driver.navigate().back();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//i[@class='fa fa-instagram']")
	private WebElement eleconnectinstagram;	
	public NbcPage clickconnectinstagram() {
		click(eleconnectinstagram);
		driver.navigate().back();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//i[@class='fa fa fa-facebook-official']")
	private WebElement eleconnectfacebook;	
	public NbcPage clickconnectfacebook() {
		click(eleconnectfacebook);
		driver.navigate().back();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='weather']//div[@class='weather_video']//div[@class='videoPlayButton']")
	private WebElement elenavtiempoTM;
	public NbcPage clicknavtiempoTM() {
		click(elenavtiempoTM);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='globalRightRail']//div[@class='weather-module']//a[@name='&lpos=weather module&lid=weather alerts']")
	private WebElement elewethermodule;
	public NbcPage clickwethermodule() {
		click(elewethermodule);
		return this;
	}

	@FindBy(how=How.XPATH,using="//I[@class=‘fa fa-instagram’]")
	private WebElement eleinstagram;	
	public NbcPage clickinstagram() {
		click(eleinstagram);
		System.out.println(eleinstagram.getText());
		return this;
	}


	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//following::div[@class='connect-apps-icon'][1]")
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

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//div[@class='connect-email']")
	private WebElement elenewsletters;	
	public NbcPage clicknewsletter() {
		click(elenewsletters);
		System.out.println(elenewsletters.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//div[@class='connect-ugc']")
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

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//div[@class='connect-send']")
	private WebElement elesubmittips;	
	public NbcPage clicksubmittips() {
		click(elesubmittips);
		System.out.println(elesubmittips.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='send-feedback']")
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
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		WebElement elewatchlivelogo = driver.findElement(By.xpath("//a[@name='&lpos=section navigation&lid=logo']/img"));

		Boolean ImagePresent = (Boolean) ((JavascriptExecutor)driver).executeScript("return arguments[0].complete && typeof arguments[0].naturalWidth != \"undefined\" && arguments[0].naturalWidth > 0", elewatchlivelogo);
		if (!ImagePresent)
		{
			System.out.println("TV Logo not displayed.");
		}
		else
		{
			System.out.println("TV Logo displayed.");
		}
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

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[contains(text(),'ON NOW')]")
	private WebElement eleonnow;	
	public NbcPage clickonnow() {
		click(eleonnow);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[text()='AHORA']")
	private WebElement eleahoraTM;	
	public NbcPage clickahoraTM() {
		click(eleahoraTM);
		System.out.println(eleahoraTM.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='watch-live-key']//following::div[@id='liveTVE']")
	private WebElement elelivetvTM;	
	public NbcPage clicklivetvTM() {
		click(elelivetvTM);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[text()='ON DEMAND']")
	private WebElement eleondemandTM;	
	public NbcPage clickondemandTM() {
		click(eleondemandTM);
		System.out.println(eleondemandTM.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//span[@class='desc']")
	private WebElement eleondemanddescTM;	
	public NbcPage clickondemanddescTM() {
		click(eleondemanddescTM);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[@class='schedule']")
	private WebElement elescheduleTM;	
	public NbcPage clickscheduleTM() {
		click(elescheduleTM);
		System.out.println(elescheduleTM.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='nav-section-subnav']//a[contains(text(),'TV Listings')]")
	private WebElement eleTvlistings;	
	public TVlistingsschedule clickTvlistings() {
		click(eleTvlistings);
		return new TVlistingsschedule(driver, test);
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

	@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//span[@class='fa-stack']")
	private WebElement eleSocial;
	public NbcPage clickSocial() {
		
		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='socialNetworks-top']//span[@class='fa-stack']"));

		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='socialNetworks-top']//span[@class='fa-stack'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='socialNetworks-top']//span[@class='fa-stack'])["+ i +"]")).size() > 0){

			}

			driver.findElement(By.xpath("(//div[@class='socialNetworks-top']//span[@class='fa-stack'])["+ i +"]")).click();
			System.out.println(curLink.getText());
			switchToWindow(1);
			driver.close();
			switchToWindow(0);
		}
		return this;
	}


	@FindBy(how=How.XPATH,using="//div[@class='section mid']//div[@id='scrollRegion']//following::div[@class='story slick-slide slick-active'][1]")
	private WebElement elearticleTM;
	public NbcPage clickarticleTM() {
		click(elearticleTM);
		return this;
	}


	@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//span[@class='fa-stack']")
	private WebElement eleSocialTM;
	public NbcPage clickSocialTM() {

		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='socialNetworks-top']//span[@class='fa-stack']"));

		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='socialNetworks-top']//span[@class='fa-stack'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='socialNetworks-top']//span[@class='fa-stack'])["+ i +"]")).size() > 0){

			}
			driver.findElement(By.xpath("(//div[@class='socialNetworks-top']//span[@class='fa-stack'])["+ i +"]")).click();
			System.out.println(curLink.getText());
			switchToWindow(1);
			driver.close();
			switchToWindow(0);
		}
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='story lower']//following::div[@class='image small'][1]")
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

	@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='terms']")
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

	@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='our-stations']")
	private WebElement eleconnectourstations;	
	public NbcPage clickconnectourstations() {
		click(eleconnectourstations);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.navigate().back();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='promotions']")
	private WebElement eleconnectpromotions;	
	public NbcPage clickconnectpromotions() {
		click(eleconnectpromotions);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.navigate().back();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='programming']")
	private WebElement eleconnectprogramming;	
	public NbcPage clickconnectprogramming() {
		click(eleconnectprogramming);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
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
		scrollingByCoordinatesofAPage();
		click(eleplayer);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//i[@class='fa fa-facebook fa-stack-1x fa-inverse']")
	private WebElement elefacebook;
	public NbcPage clickfacebook() {
		click(elefacebook);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		switchToWindow(1);
		driver.close();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon twitter']")
	private WebElement eletwitter;
	public NbcPage clicktwitter() {
		click(eletwitter);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		switchToWindow(1);
		driver.close();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='socialNetworks-top']//div[@class='social-icon comment']")
	private WebElement eleiconcomment;
	public NbcPage clickiconcomment() {
		click(eleiconcomment);
		driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		System.out.println(eleiconcomment.getText());
		driver.navigate().back();
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
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
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

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[@class='nav-section News']")
	private WebElement elenews;
	public NewsPageLoads clicknews() {
		click(elenews);
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[@class='nav-section News']")
	private WebElement elenbcnews;
	public NewsPageLoads clicknbcnews() {
		click(elenbcnews);
		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation']"));

		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]")).size() > 0){
				System.out.println(curLink.getText());
			}

			driver.findElement(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]")).click();

			driver.navigate().back();

		}
		return new NewsPageLoads(driver, test);
	}


	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//a[contains(text(),'Noticias')]")
	private WebElement eleNoticias;
	public NewsPageLoads clickNoticias() {
		mouseMoveTo(eleNoticias);
		try {
			Thread.sleep(6000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(eleNoticias.getText());
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[@class='nav-section Weather']")
	private WebElement elenbcweather;
	public NewsPageLoads clicknbcweather() {
		click(elenbcweather);
		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation']"));
		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]")).size() > 0){
				System.out.println(curLink.getText());
			}

			driver.findElement(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]")).click();
		}
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//li[@class='nav-section Weather']")
	private WebElement elenbcweatherSubNav;
	public NewsPageLoads clicknbcweatherSubNav() {
		click(elenbcweatherSubNav);
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//a[contains(@class,'nav-section-title')]")
	private WebElement elenbchome;
	public NewsPageLoads clicknbchome() {

		List<WebElement> navLinks = driver.findElements(By.xpath("//a[contains(@class,'nav-section-title')]"));
		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//a[contains(@class,'nav-section-title')])["+ i +"]"));

			if (driver.findElements(By.xpath("(//a[contains(@class,'nav-section-title')])["+ i +"]")).size() > 0){
				System.out.println(curLink.getText());
			}

			driver.findElement(By.xpath("(//a[contains(@class,'nav-section-title')])["+ i +"]")).click();
		}
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//a[@name='&lpos=ellipsis hover&lid=Contact Us']")
	private WebElement elenbccontact;
	public ContactUS clicknbccontact() {
		click(elenbccontact);
		System.out.println(elenbccontact.getText());
		return new ContactUS(driver, test);
	}


	@FindBy(how=How.XPATH,using="//div[@class='footer']//div[@class='footer-container']//following::li")
	private WebElement elefooter;
	public NbcPage clickfooter() {

		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='footer']//div[@class='footer-container']//following::li"));

		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='footer']//div[@class='footer-container']//following::li)["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='footer']//div[@class='footer-container']//following::li)["+ i +"]")).size() > 0){

			}

			driver.findElement(By.xpath("(//div[@class='footer']//div[@class='footer-container']//following::li)["+ i +"]"));
			System.out.println(curLink.getText());
		}
		return this;
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
		driver.navigate().to("https://www.nbcnewyork.com/qa-test-section-only/NATL-NYAutomated-Testing---FullPageGallery-456150923.html");

		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='slide_count']"));

		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='slide_count'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='slide_count'])["+ i +"]")).size() > 0){

			}

			driver.findElement(By.xpath("(//div[@class='slide_count'])["+ i +"]")).click();
			System.out.println(curLink.getText());
			scrollingByCoordinatesofAPage();
		}
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='slide_count']")
	private WebElement eleslidecountTM;	
	public NbcPage clickslidecountTM() {
		driver.navigate().to("https://www.telemundo51.com/qa-test-section-only/TLM-T51-Automated-Testing---Full-page-gallery-493604801.html");

		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='slide_count']"));

		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='slide_count'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='slide_count'])["+ i +"]")).size() > 0){

			}

			driver.findElement(By.xpath("(//div[@class='slide_count'])["+ i +"]")).click();
			System.out.println(curLink.getText());
			scrollingByCoordinatesofAPage();

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
		List<WebElement> navLinks = driver.findElements(By.xpath("//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation']"));
		for (int i = 1; i <=navLinks.size(); i++) {

			WebElement curLink = driver.findElement(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]"));

			if (driver.findElements(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]")).size() > 0){
				System.out.println(curLink.getText());
			}

			driver.findElement(By.xpath("(//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation'])["+ i +"]")).click();

			driver.navigate().back();	
		}

		List<WebElement> COZITV = driver.findElements(By.xpath("//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation']"));

		for (WebElement CoziTv : COZITV) 
		{            
			WebElement available = (WebElement) driver.findElement(By.xpath("//div[@class='subnav-large-container']//a[contains(text(),'COZI TV')]"));
			if (available.getText().equals("Available)"))

			{
				CoziTv.click();
				System.out.println("COZITV is available");
				break;
			} else {
				System.out.println("COZITV is available");

			}
		}

		List<WebElement> Breakfast = driver.findElements(By.xpath("//div[@class='subnav-section-landing']//a[@data-lpos='subsection navigation']"));

		for (WebElement BreakFast : Breakfast) 
		{            
			WebElement available = (WebElement) driver.findElement(By.xpath("//div[@class='subnav-large-container']//a[contains(text(),'Breakfast With Open House')]"));
			if (available.getText().equals("Available)"))

			{
				BreakFast.click();
				System.out.println("Breakfast With Open House is the last element to click");
				break;
			} else {
				System.out.println("Breakfast With Open House is the last element to click");

			}
		}
		return new EntertainmentNews(driver, test);
	}


}

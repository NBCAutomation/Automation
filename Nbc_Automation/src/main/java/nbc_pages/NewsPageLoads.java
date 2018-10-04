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

	}

	@FindBy(how=How.XPATH,using="//div[@class='subnav-section-landing']//a[contains(text(),'Local')]")
	private WebElement elenbclocal;
	public NewsPageLoads clicknbcLoacal() {
		click(elenbclocal);
		System.out.println(elenbclocal.getText());
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//div[@class='nav-section-subnav']//a[text()='Lo q']")
	private WebElement eleLoacalPR;
	public NewsPageLoads clickLoacalPR() {
		click(eleLoacalPR);
		System.out.println(eleLoacalPR.getText());
		return new NewsPageLoads(driver, test);
	}

	@FindBy(how=How.XPATH,using="//div[@id='news-top-stories-all']//h1[@id='top-news-header']")
	private WebElement elenewsheader;
	public NewsPageLoads clicknewsheader() {
		click(elenewsheader);
		System.out.println(elenewsheader.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='news-top-stories-module']//div[@id='carousel-story-selection']//following::h2[@class='flaggedHeadline'][1]")
	private WebElement elenbcnewstopstory;
	public NewsPageLoads clicknbcnewstopstory() {
		click(elenbcnewstopstory);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='article_0_headline_byline']//h1[@class='headline']")
	private WebElement elenbcnewstopstoryHeader;
	public NewsPageLoads clicknbcnewstopstoryHeader() {
		click(elenbcnewstopstoryHeader);
		System.out.println(elenbcnewstopstoryHeader.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//li[@class='nav-section I-Team']//a[@class='nav-section-title ']")
	private WebElement elei_team;
	public NewsPageLoads clicki_team() {
		click(elei_team);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='module-1 local-module module most-popular ']//ul[@class='mostWatched list one selected']//li[@class='l1']")
	private WebElement elelocalarticle;	
	public NewsPageLoads clicklocalarticle() {
		click(elelocalarticle);
		return this;
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='module-civicScience']//iframe[@name='civsci-iframe-civsci-1801149203']")
	private WebElement elelocalpool;	
	public NewsPageLoads clicklocalpool() {
		click(elelocalpool);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='story_details']//following::span[@class='playButtonSmall'][1]")
	private WebElement elelocalvideo;
	public NewsPageLoads clicklocalvideo() {
		click(elelocalvideo);
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
		//scrollingByCoordinatesofAPage();
		click(elenewyorklive);
		driver.navigate().back();
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//a[contains(text(),'Maps & Radar')]")
	private WebElement eleMapRadar;	
	public NewsPageLoads clickMapRadar() {
		click(eleMapRadar);
		System.out.println(eleMapRadar.getText());
		return this;
	}



	@FindBy(how=How.XPATH,using="//div[@id='interactive']//h1[contains(text(),' Interactive Radar')]")
	private WebElement eleintractiveRadar;	
	public NewsPageLoads clickintractiveRadar() {
		click(eleintractiveRadar);
		System.out.println(eleintractiveRadar.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='bodyWrap']//iframe[@class='wx-standalone-map']")
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


}

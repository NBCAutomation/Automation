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

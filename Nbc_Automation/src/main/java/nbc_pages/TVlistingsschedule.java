package nbc_pages;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import org.apache.poi.ddf.EscherColorRef.SysIndexSource;
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



	@FindBy(how=How.XPATH,using="//div[@id='listings']//li[contains(text(),'NBC 4')]")
	private WebElement elenbc4;	
	public TVlistingsschedule clicknbc4(){
		click(elenbc4);
		System.out.println(elenbc4.getText());
		return this;
	}
	@FindBy(how=How.XPATH,using="//div[@id='listings']//li[contains(text(),'NBC4')]")
	private WebElement elenbc4LA;
	public TVlistingsschedule clicknbc4LA(){
		click(elenbc4LA);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='listings']//li[contains(text(),'Cozi TV')]")
	private WebElement elecozitv;	
	public TVlistingsschedule clickcozitv() {
		click(elecozitv);
		System.out.println(elecozitv.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='listing slick-slide slick-current slick-active']//div[contains(text(),'NOW')]")
	private WebElement eledaynbcnow;	
	public TVlistingsschedule clickdaynbcnow() {
		click(eledaynbcnow);
		System.out.println(eledaynbcnow.getText());
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@class='daySelectWrapper']//select[@id='daySelect']")
	private WebElement eledaySelect;	
	public TVlistingsschedule clickdaySelect() {
		click(eledaySelect);
		return this;
	}

	@FindBy(how=How.XPATH,using="//div[@id='tvListingContainer']//h3[@class='header0']")
	private WebElement eletvListingContainer;	
	public TVlistingsschedule clicktvListingContainer() {
		click(eletvListingContainer);
		System.out.println(eletvListingContainer);
		return this;
	}

}

package nbc_pages;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import com.relevantcodes.extentreports.ExtentTest;

import wdMethods.ProjectMethods;
@Test
public class ContactUS extends ProjectMethods{

	public ContactUS(RemoteWebDriver driver,ExtentTest test) {
		this.driver = driver;
		this.test = test;

		PageFactory.initElements(driver, this);		
		/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/
	}


	@FindBy(how=How.XPATH,using="//span[contains(text(),'Contact NBC 4 NY')]")
	private WebElement elecontactWNBC;
	@FindBy(how=How.XPATH,using="//span[contains(text(),'Contact NBC4')]")
	private WebElement elecontactWNBCLA;
	public ContactUS clickcontactWNBC() {
		
		if(this.driver.getCurrentUrl().startsWith(appData.get("sUrl"))==true){
			click(elecontactWNBC);
			System.out.println(elecontactWNBC.getText());
		}
		else if(this.driver.getCurrentUrl().startsWith(appData.get("LUrl"))==true){
			click(elecontactWNBCLA);
			System.out.println(elecontactWNBCLA.getText());
		}
		
		return this;
	}

	@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
	private WebElement elenbclogo;	
	public NbcPage clicknbclogo() {
		click(elenbclogo);
		return new NbcPage(driver, test);
	}

	@FindBy(how=How.XPATH,using="//a[@name='&lpos=Navigation&lid=TV Listings']")
	private WebElement eletvlistings;	
	public TVlistingsschedule clicktvlistings() {
		click(eletvlistings);
		return new TVlistingsschedule(driver, test);
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='social_module']//a[contains(text(),'Social')]")
	private WebElement elecontactsocial;
	public ContactUS clickcontactsocial() {
		click(elecontactsocial);
		System.out.println(elecontactsocial.getText());
		return this;
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='mobile_module']//a[contains(text(),'mobile')]")
	private WebElement elecontactmobile;
	public ContactUS clickcontactmobile() {
		click(elecontactmobile);
		System.out.println(elecontactmobile.getText());
		return this;
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='team_module']//a[text()='meet the team']")
	private WebElement elemeettheteam;
	public ContactUS clickmeettheteam() {
		click(elemeettheteam);
		System.out.println(elemeettheteam.getText());
		return this;
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='contact-landing-module containerNewsletter']//a[text()='Newsletters']")
	private WebElement elecontactnewsletters;
	public ContactUS clickcontactnewsletters() {
		click(elecontactnewsletters);
		System.out.println(elecontactnewsletters.getText());
		return this;
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='contact-landing-module']//a[text()='tv listings']")
	private WebElement elecontacttvlistings;
	public ContactUS clickcontacttvlistings() {
		click(elecontacttvlistings);
		System.out.println(elecontacttvlistings.getText());
		return this;
	}
	
	@FindBy(how=How.XPATH,using="//div[@class='photos-videos_module']//a[text()='Photos & Videos']")
	private WebElement elecontactphoto;
	public ContactUS clickcontactphoto() {
		click(elecontactphoto);
		System.out.println(elecontactphoto.getText());
		return this;
	}
}

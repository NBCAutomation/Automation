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
		public ContactUS clickcontactWNBC() {
			click(elecontactWNBC);
			driver.findElementByXPath("//span[contains(text(),'Contact NBC 4 NY')]").isDisplayed();
			//System.out.println(elecontactWNBC);
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
}

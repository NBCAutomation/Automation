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
	public class Manhidingrestaurant extends ProjectMethods{

		public Manhidingrestaurant(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Consumer Complaint Form | NBC New York")) {
				throw new RuntimeException();
			}*/
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Connect')]")
		private WebElement eleconnect;	
		public Manhidingrestaurant clickconnect() {
			mouseMoveTo(eleconnect);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Conócenos')]")
		private WebElement eleconnectTM;	
		public Manhidingrestaurant clickconnectTM() {
			mouseMoveTo(eleconnectTM);
	        driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
		private WebElement elenbclogo;	
		public NbcPage clicknbclogo() {
			click(elenbclogo);
			return new NbcPage(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//canvas[@class='IconPlay']")
		private WebElement eleiconplay;	
		public Manhidingrestaurant clickiconplay() {
			click(eleiconplay);
			return this;
		}
}

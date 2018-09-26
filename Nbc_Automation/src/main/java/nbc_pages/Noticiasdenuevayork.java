package nbc_pages;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import com.relevantcodes.extentreports.ExtentTest;

import wdMethods.ProjectMethods;
	@Test
	public class Noticiasdenuevayork extends ProjectMethods{

		public Noticiasdenuevayork(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Consumer Complaint Form | NBC New York")) {
				throw new RuntimeException();
			}*/
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Connect')]")
		private WebElement eleconnect;	
		public Termsofservice clickconnect() {
			mouseMoveTo(eleconnect);
			return new Termsofservice(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Conócenos')]")
		private WebElement eleconnectTM;	
		public Termsofservice clickconnectTM() {
			mouseMoveTo(eleconnectTM);
	        driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return new Termsofservice(driver, test);
		}
		
}

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
	public class Privacypolicy extends ProjectMethods{

		public Privacypolicy(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Consumer Complaint Form | NBC New York")) {
				throw new RuntimeException();
			}*/
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Connect']")
		private WebElement eleconnect;	
		public Termsofservice clickconnect() {
			mouseMoveTo(eleconnect);
			return new Termsofservice(driver, test);
		}
		
}

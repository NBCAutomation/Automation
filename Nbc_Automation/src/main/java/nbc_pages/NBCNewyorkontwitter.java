package nbc_pages;

import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.Test;
import com.relevantcodes.extentreports.ExtentTest;

import wdMethods.ProjectMethods;
	@Test
	public class NBCNewyorkontwitter extends ProjectMethods{

		public NBCNewyorkontwitter(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("NBC New York on Twitter:")) {
				throw new RuntimeException();
			}*/
		}
		
		
}

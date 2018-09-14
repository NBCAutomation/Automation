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
	public class Uploadyourmedia extends ProjectMethods{

		public Uploadyourmedia(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Upload Your Media | NBC New York")) {
				throw new RuntimeException();
			}*/
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
		private WebElement elenbclogo;	
		public NbcPage clicknbclogo() {
			click(elenbclogo);
			return new NbcPage(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Connect']")
		private WebElement eleconnect;	
		public Uploadyourmedia clickconnect() {
			mouseMoveTo(eleconnect);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Send Tips']")
		private WebElement elesendtips;	
		public Uploadyourmedia clicksendtips() {
			click(elesendtips);
			System.out.println(elesendtips.getText());
			switchToWindow(3);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[text()='Send Feedback']")
		private WebElement elesendfeedback;	
		public Sendfeedback clicksendfeedback() {
			click(elesendfeedback);
			System.out.println(elesendfeedback.getText());
			return new Sendfeedback(driver, test);
		}
}

package nbc_pages;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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
			WebElement elenbclogo = driver.findElement(By.xpath("//a[@name='&lpos=section navigation&lid=logo']/img"));

		    Boolean ImagePresent = (Boolean) ((JavascriptExecutor)driver).executeScript("return arguments[0].complete && typeof arguments[0].naturalWidth != \"undefined\" && arguments[0].naturalWidth > 0", elenbclogo);
		    if (!ImagePresent)
		    {
		         System.out.println("Image not displayed.");
		    }
		    else
		    {
		        System.out.println("Image displayed.");
		    }
			return new NbcPage(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Connect')]")
		private WebElement eleconnect;	
		public Uploadyourmedia clickconnect() {
			mouseMoveTo(eleconnect);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Conócenos')]")
		private WebElement eleconnectTM;	
		public Uploadyourmedia clickconnectTM() {
			mouseMoveTo(eleconnectTM);
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
		
		@FindBy(how=How.XPATH,using="//div[@class='nav-connect-footer']//li[@class='send-feedback']")
		private WebElement elesendfeedback;	
		public Sendfeedback clicksendfeedback() {
			click(elesendfeedback);
			driver.navigate().back();
			System.out.println(elesendfeedback.getText());
			return new Sendfeedback(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//div[@class='connect-team']")
		private WebElement eleconnectteam;	
		public Uploadyourmedia clickconnectteam() {
			click(eleconnectteam);
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			driver.navigate().back();
			System.out.println(eleconnectteam.getText());
			return this;
		}
}

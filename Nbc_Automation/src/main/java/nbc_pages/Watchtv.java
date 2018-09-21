package nbc_pages;

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
	public class Watchtv extends ProjectMethods{

		public Watchtv(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='watch-live-logo']")
		private WebElement eletvicon;	
		public Watchtv clickeletvicon() {
			click(eletvicon);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
		private WebElement elenbclogo;	
		public Watchtv clicknbclogo() {
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
			return this;
		}
}

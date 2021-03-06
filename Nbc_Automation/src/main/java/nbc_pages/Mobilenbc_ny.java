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
	public class Mobilenbc_ny extends ProjectMethods{

		public Mobilenbc_ny(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Mobile | NBC New York")) {
				if(!verifyTitle("Mobile | NBC")) {
				throw new RuntimeException();
			}*/
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Connect')]")
		private WebElement eleconnect;	
		public Mobilenbc_ny clickconnect() {
			mouseMoveTo(eleconnect);
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='navbar-container']//div[contains(text(),'Conócenos')]")
		private WebElement eleconnectTM;	
		public Mobilenbc_ny clickconnectTM() {
			Actions action = new Actions(driver);
	        action.moveToElement(eleconnectTM).perform();
	        driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
		private WebElement elenbclogo;	
		public NbcPage clicknbclogo() {
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			click(elenbclogo);
			return new NbcPage(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//div[@class='connect-email']")
		private WebElement elenewsletters;	
		public Mobilenbc_ny clicknewsletter() {
			click(elenewsletters);
			driver.navigate().back();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='subnav-large-container']//div[@class='connect-ugc']")
		private WebElement elevideosandpictures;	
		public Uploadyourmedia clickvideosandpictures() {
			click(elevideosandpictures);
			return new Uploadyourmedia(driver, test);
		}
		
		@FindBy(how=How.XPATH,using="//i[@class='fa fa-comments-o fa-stack-1x fa-inverse']")
		private WebElement elecomments;
		public Heartbreakingtimeline clickcomments() {
			click(elecomments);
			switchToWindow(1);
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			driver.close();
			return new Heartbreakingtimeline(driver, test);
		}
}

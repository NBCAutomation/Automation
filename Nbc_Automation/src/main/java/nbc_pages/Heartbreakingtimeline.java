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
	public class Heartbreakingtimeline extends ProjectMethods{

		public Heartbreakingtimeline(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Cabbie Bites Driver, Rams Car in Midtown Road Rage Meltdown: Officials  - NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='tpVideoBlocker']")
		private WebElement eleplayer;	
		public Heartbreakingtimeline clickplayer() {
			mouseover(eleplayer);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='tpPlay']")
		private WebElement eleplay;	
		public Heartbreakingtimeline clickplay() {
			click(eleplay);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//canvas[@class='IconPause']")
		private WebElement eleiconpause;	
		public Heartbreakingtimeline clickiconpause() {
			driver.manage().timeouts().implicitlyWait(80, TimeUnit.SECONDS);
			click(eleiconpause);
			return this;
		}	
		
		@FindBy(how=How.XPATH,using="//i[@class='fa fa-twitter fa-stack-1x fa-inverse']")
		private WebElement eletwitter;
		public Heartbreakingtimeline clicktwitter() {
			click(eletwitter);
			switchToWindow(1);
			driver.close();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//i[@class='fa fa-comments-o fa-stack-1x fa-inverse']")
		private WebElement elecomments;
		public Heartbreakingtimeline clickcomments() {
			click(elecomments);
			return this;
		}
		
}

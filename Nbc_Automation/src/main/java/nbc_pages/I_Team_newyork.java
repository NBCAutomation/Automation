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
	public class I_Team_newyork extends ProjectMethods{

		public I_Team_newyork(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='postHeader']//following::span[@class='seriesName'][1]")
		private WebElement eleinvestigationvaild;	
		public I_Team_newyork clickinvestigationvaild() {
			click(eleinvestigationvaild);
			System.out.println(eleinvestigationvaild);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='module-1 investigations-module module more-investigations ']//h4[text()='More Investigations']")
		private WebElement elemoreinvestigation;	
		public I_Team_newyork clickmoreinvestigation() {
			scrollingByCoordinatesofAPage();
			click(elemoreinvestigation);
			driver.findElementByXPath("/div[@class='module-1 investigations-module module more-investigations ']//h4[text()='More Investigations']\"").isDisplayed();
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='leadVideo']//span")
		private WebElement eleinvestigationvideo;	
		public I_Team_newyork clickinvestigationvideo() {
			click(eleinvestigationvideo);
			return this;
		}
}

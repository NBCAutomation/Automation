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
	public class Newyorkweather extends ProjectMethods{

		public Newyorkweather(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Watch Live TV | NBC New York")) {
				throw new RuntimeException();
			}*/		
		}
		
		@FindBy(how=How.XPATH,using="//div[@id='wunderPane']//li[@class='PWSV tab']")
		private WebElement elepersonalweather;	
		public Newyorkweather clickpersonalweather() {
			click(elepersonalweather);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='leaflet-marker-icon my-div-icon standard-pin leaflet-zoom-animated leaflet-clickable']//following::span[1]")
		private WebElement elepersonalweatherDegree;	
		public Newyorkweather clickpersonalweatherDegree() {
			click(elepersonalweatherDegree);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[@class='wuBanner']")
		private WebElement eleweatherbanner;	
		public Newyorkweather clickweatherbanner() {
			click(eleweatherbanner);
			//scrollingByCoordinatesofAPage();
			System.out.println(eleweatherbanner.getText());
			return this;
		}
		
}

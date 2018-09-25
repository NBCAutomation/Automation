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
	public class Emailnewsletter extends ProjectMethods{

		public Emailnewsletter(RemoteWebDriver driver,ExtentTest test) {
			this.driver = driver;
			this.test = test;

			PageFactory.initElements(driver, this);		
			/*if(!verifyTitle("Email Newsletters and Mobile Alerts | NBC New York'")) {
				
				throw new RuntimeException();
			}*/
		}
		
		@FindBy(how=How.XPATH,using="//a[@name='&lpos=section navigation&lid=logo']/img")
		private WebElement elenbclogo;	
		public Emailnewsletter clicknbclogo() {
			click(elenbclogo);
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[text()='Connect']")
		private WebElement eleconnect;	
		public Emailnewsletter clickconnect() {
			mouseMoveTo(eleconnect);
			System.out.println(eleconnect.getText());
			return this;
		}
		
		@FindBy(how=How.XPATH,using="//div[contains(text(),'Send us Videos and Pictures')]")
		private WebElement elevideosandpictures;	
		public Uploadyourmedia clickvideosandpictures() {
			click(elevideosandpictures);
			System.out.println(elevideosandpictures.getText());
			return new Uploadyourmedia(driver, test);
		}
		

}

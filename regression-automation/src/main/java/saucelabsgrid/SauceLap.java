package saucelabsgrid;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.Platform;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.Test;

public class SauceLap {

	@Test
	public void login() throws InterruptedException, MalformedURLException {
		
		DesiredCapabilities dc = new DesiredCapabilities();
		dc.setBrowserName("firefox");
		dc.setPlatform(Platform.WIN10);
		
		RemoteWebDriver driver = new RemoteWebDriver(
				//new URL("http://192.168.1.56:4444/wd/hub"), dc);
				new URL("http://10.1.0.172:5566/wd/hub"), dc);
		
		//Load the URL
		driver.get("https://www.nbcnewyork.com/");
		
		// Set wait
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			
		//Maximize
		driver.manage().window().maximize();
	}
}
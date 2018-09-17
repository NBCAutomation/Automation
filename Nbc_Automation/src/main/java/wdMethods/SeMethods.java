package wdMethods;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.json.Json;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.collections4.map.HashedMap;
import org.apache.commons.io.FileUtils;
//import org.apache.xmlbeans.impl.xb.xsdschema.Public;
import org.openqa.selenium.Alert;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.NoSuchFrameException;
import org.openqa.selenium.NoSuchWindowException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.ITestResult;
import org.yaml.snakeyaml.external.biz.base64Coder.Base64Coder;

import utils.Reporter;
public class SeMethods extends Reporter implements WdMethods {
	public String URL;
	public DesiredCapabilities dc;
	public RemoteWebDriver driver;
	public String jobId;
	public String sUrl,primaryWindowHandle,sHubUrl,sHubPort,name,LUrl,T5Url,TPUrl, USERNAME1,ACCESS_KEY1,status,attachment,filename,to,cc,email,password;
	public  Map<String, String> appData = new HashedMap<>();

	public SeMethods() {

		Properties prop = new Properties();
		try {
			prop.load(new FileInputStream(new File("./src/main/resources/config.properties")));

			appData.put("sUrl", prop.getProperty("NYURL"));
			appData.put("LUrl", prop.getProperty("LAURL"));
			appData.put("T5Url", prop.getProperty("T51URL"));
			appData.put("TPUrl", prop.getProperty("TPRURL"));
			sHubUrl = prop.getProperty("HUB");
			sHubPort = prop.getProperty("PORT");
			name=prop.getProperty("NAME");
			status=prop.getProperty("STATUS");
			USERNAME1=prop.getProperty("USERNAME");
			ACCESS_KEY1=prop.getProperty("ACCESS_KEY");
			attachment=prop.getProperty("Filepath");
			filename=prop.getProperty("FileName");
			to=prop.getProperty("To");
			cc=prop.getProperty("CC");
			email=prop.getProperty("Email");
			password=prop.getProperty("Password");

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void startApp(String b, String p, String applicationUrl, String tcname){

		URL = "https://" + USERNAME1 + ":" + ACCESS_KEY1 + "@ondemand.saucelabs.com:443/wd/hub";
		try {

			dc = new DesiredCapabilities();
			if (b.equalsIgnoreCase("chrome") && p.equalsIgnoreCase("Win10")) {


				/*if(browser.equalsIgnoreCase("chrome")) {
							System.setProperty("webdriver.chrome.driver", "./drivers/chromedriver");
							driver = new ChromeDriver();
						} else if(browser.equalsIgnoreCase("ie")) {
							System.setProperty("webdriver.ie.driver", "./drivers/internetexplorerserver.exe");
							driver = new InternetExplorerDriver();}*/

				DesiredCapabilities dc = DesiredCapabilities.chrome();
				System.out.println(tcname);
				dc.setBrowserName("Chrome");
				dc.setCapability("platform", "Windows 10");
				dc.setCapability("version", "68.0");
				//dc.setCapability("version", "66.0");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

			}

			if (b.equalsIgnoreCase("Firefox") && p.equalsIgnoreCase("Win10")) {
				DesiredCapabilities dc = DesiredCapabilities.firefox();
				System.out.println(tcname);
				dc.setBrowserName("Firefox");
				dc.setCapability("platform", "Windows 10");
				//dc.setCapability("version", "61.0");
				dc.setCapability("version", "55.0");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				//webURL=LUrl;
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					e1.printStackTrace();
				}
			}

			if(b.equalsIgnoreCase("Edge") && p.equalsIgnoreCase("Win10")){
				DesiredCapabilities dc = DesiredCapabilities.edge();
				System.out.println(tcname);
				dc.setCapability("platform", "Windows 10");
				dc.setCapability("version", "17.17134");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					e1.printStackTrace();
				}

			}

			if(b.equalsIgnoreCase("internetExplorer") && p.equalsIgnoreCase("Win10")){
				DesiredCapabilities dc = DesiredCapabilities.internetExplorer();
				System.out.println(tcname);
				dc.setCapability("platform", "Windows 10");
				dc.setCapability("version", "11.03");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					e1.printStackTrace();
				}

			}


			if(b.equalsIgnoreCase("Safari") && p.equalsIgnoreCase("Mac")){
				DesiredCapabilities dc = DesiredCapabilities.safari();
				System.out.println(tcname);
				dc.setCapability("platform", "macOS 10.13");
				dc.setCapability("version", "11.1");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					e1.printStackTrace();
				}

			}

			if(b.equalsIgnoreCase("chrome") && p.equalsIgnoreCase("Mac")){  
				DesiredCapabilities dc = DesiredCapabilities.chrome();
				System.out.println(tcname);
				dc.setCapability("platform", "macOS 10.13");
				dc.setCapability("version", "68.0");
				//dc.setCapability("version", "66.0");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					e1.printStackTrace();
				}

			}

			if (b.equalsIgnoreCase("Firefox") && p.equalsIgnoreCase("Mac")) {
				DesiredCapabilities dc = DesiredCapabilities.firefox();
				System.out.println(tcname);
				dc.setCapability("platform", "macOS 10.13");
				//dc.setCapability("version", "61.0");
				dc.setCapability("version", "47.0.1");
				dc.setCapability("name", "(" + b + ") " + appData.get(applicationUrl)+":"+tcname);
				//dc.setCapability("passed", "True");
				try {
					driver = new RemoteWebDriver(new URL(URL), dc);
					jobId = (((RemoteWebDriver) driver).getSessionId()).toString();
				}
				catch (MalformedURLException e1) {
					e1.printStackTrace();
				}
			}
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);	
			System.out.println("Launching NBC--->URL --> "+appData.get(applicationUrl));
			driver.get(appData.get(applicationUrl));
			driver.manage().window().maximize();	

			reportStep("The browser: launched successfully", "PASS");
		} catch (WebDriverException e) {			
			reportStep("The browser: could not be launched", "FAIL");
		}
	}

	public WebElement locateElement(String locator, String locValue) {
		try {
			switch(locator) {

			case("id"): return driver.findElementById(locValue);
			case("link"): return driver.findElementByLinkText(locValue);
			case("xpath"):return driver.findElementByXPath(locValue);
			case("name"): return driver.findElementByName(locValue);
			case("class"): return driver.findElementByClassName(locValue);
			case("tag"):return driver.findElementByTagName(locValue);
			}
		} catch (NoSuchElementException e) {
			reportStep("The element with locator "+locator+" and with value "+locValue+" not found.","FAIL");
			throw new RuntimeException();
		} catch (WebDriverException e) {
			reportStep("WebDriverException", "FAIL");
		}
		return null;
	}

	public WebElement locateElement(String locValue) {
		return driver.findElementById(locValue);
	}


	public void type(WebElement ele, String data) {
		try {
			ele.clear();
			ele.sendKeys(data);
			reportStep("The data: "+data+" entered successfully in field :"+ele, "PASS");
		} catch (InvalidElementStateException e) {
			reportStep("The element: "+ele+" is not interactable","FAIL");
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		}
	}

	public void click(WebElement ele) {
		String text = "";
		try {
			WebDriverWait wait = new WebDriverWait(driver, 100);
			wait.until(ExpectedConditions.elementToBeClickable(ele));			
			text = ele.getText();
			ele.click();
			reportStep("The element : "+text+" is clicked "+text, "PASS");
		} catch (InvalidElementStateException e) {
			reportStep("The element: "+text+" is not interactable", "FAIL");
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		} 

	}

	public void clickWithNoSnap(WebElement ele) {
		String text = "";
		try {
			WebDriverWait wait = new WebDriverWait(driver, 10);
			wait.until(ExpectedConditions.elementToBeClickable(ele));	
			text = ele.getText();
			ele.click();
			//	switchToWindow(0);
			reportStep("The element :"+text+"  is clicked.", "PASS",false);
		} catch (InvalidElementStateException e) {
			reportStep("The element: "+text+" is not interactable", "FAIL",false);
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL",false);
		} 
	}

	public String getText(WebElement ele) {	
		String bReturn = "";
		try {
			bReturn = ele.getText();
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		}
		return bReturn;
	}

	public String getTitle() {		
		String bReturn = "";
		try {
			bReturn =  driver.getTitle();
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		} 
		return bReturn;
	}

	public String getAttribute(WebElement ele, String attribute) {		
		String bReturn = "";
		try {
			bReturn=  ele.getAttribute(attribute);
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		} 
		return bReturn;
	}

	public void selectDropDownUsingText(WebElement ele, String value) {
		try {
			new Select(ele).selectByVisibleText(value);
			reportStep("The dropdown is selected with text "+value,"PASS");
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		}

	}

	public void selectDropDownUsingIndex(WebElement ele, int index) {
		try {
			new Select(ele).selectByIndex(index);
			reportStep("The dropdown is selected with index "+index,"PASS");
		} catch (WebDriverException e) {
			reportStep("WebDriverException"+e.getMessage(), "FAIL");
		} 

	}

	public boolean verifyTitle(String expectedTitle) {
		boolean bReturn =false;
		try {
			if(getTitle().equals(expectedTitle)) {
				reportStep("The expected title matches the actual "+expectedTitle,"PASS");
				bReturn= true;
			}else {
				reportStep(getTitle()+" The expected title doesn't matches the actual "+expectedTitle,"FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 
		return bReturn;

	}

	public void verifyExactText(WebElement ele, String expectedText) {
		try {
			if(getText(ele).equals(expectedText)) {
				reportStep("The expected text matches the actual "+expectedText,"PASS");
			}else {
				reportStep("The expected text doesn't matches the actual "+expectedText,"FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 

	}

	public void verifyPartialText(WebElement ele, String expectedText) {
		try {
			if(getText(ele).contains(expectedText)) {
				reportStep("The expected text contains the actual "+expectedText,"PASS");
			}else {
				reportStep("The expected text doesn't contain the actual "+expectedText,"FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 
	}

	public void verifyExactAttribute(WebElement ele, String attribute, String value) {
		try {
			if(getAttribute(ele, attribute).equals(value)) {
				reportStep("The expected attribute :"+attribute+" value matches the actual "+value,"PASS");
			}else {
				reportStep("The expected attribute :"+attribute+" value does not matches the actual "+value,"FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 

	}

	public void verifyPartialAttribute(WebElement ele, String attribute, String value) {
		try {
			if(getAttribute(ele, attribute).contains(value)) {
				reportStep("The expected attribute :"+attribute+" value contains the actual "+value,"PASS");
			}else {
				reportStep("The expected attribute :"+attribute+" value does not contains the actual "+value,"FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		}
	}

	public void verifySelected(WebElement ele) {
		try {
			if(ele.isSelected()) {
				reportStep("The element "+ele+" is selected","PASS");
			} else {
				reportStep("The element "+ele+" is not selected","FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		}
	}

	public void verifyDisplayed(WebElement ele) {
		try {
			if(ele.isDisplayed()) {
				reportStep("The element "+ele+" is visible","PASS");
			} else {
				reportStep("The element "+ele+" is not visible","FAIL");
			}
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 
	}

	public void switchToWindow(int index) {
		try {
			Set<String> allWindowHandles = driver.getWindowHandles();
			List<String> allHandles = new ArrayList<>();
			allHandles.addAll(allWindowHandles);
			driver.switchTo().window(allHandles.get(index));
		} catch (NoSuchWindowException e) {
			reportStep("The driver could not move to the given window by index "+index,"PASS");
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		}
	}

	public void switchToFrame(WebElement ele) {
		try {
			this.driver.switchTo().frame(ele);
			reportStep("switch In to the Frame "+ele,"PASS");
		} catch (NoSuchFrameException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 
	}

	public void acceptAlert() {
		String text = "";		
		try {
			Alert alert = driver.switchTo().alert();
			text = alert.getText();
			alert.accept();
			reportStep("The alert "+text+" is accepted.","PASS");
		} catch (NoAlertPresentException e) {
			reportStep("There is no alert present.","FAIL");
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		}  
	}

	public void dismissAlert() {
		String text = "";		
		try {
			Alert alert = driver.switchTo().alert();
			text = alert.getText();
			alert.dismiss();
			reportStep("The alert "+text+" is dismissed.","PASS");
		} catch (NoAlertPresentException e) {
			reportStep("There is no alert present.","FAIL");
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 

	}

	public String getAlertText() {
		String text = "";		
		try {
			Alert alert = driver.switchTo().alert();
			text = alert.getText();
		} catch (NoAlertPresentException e) {
			reportStep("There is no alert present.","FAIL");
		} catch (WebDriverException e) {
			reportStep("WebDriverException : "+e.getMessage(), "FAIL");
		} 
		return text;
	}

	public long takeSnap(){
		long number = (long) Math.floor(Math.random() * 900000000L) + 10000000L; 
		try {
			FileUtils.copyFile(driver.getScreenshotAs(OutputType.FILE) , new File("./reports/images/"+number+".jpg"));
		} catch (WebDriverException e) {
			System.out.println("The browser has been closed.");
		} catch (IOException e) {
			System.out.println("The snapshot could not be taken");
		}
		return number;
	}

	public void closeBrowser() {
		try {
			driver.close();
			reportStep("The browser is closed","PASS", false);
		} catch (Exception e) {
			reportStep("The browser could not be closed","FAIL", false);
		}
	}

	public void closeAllBrowsers() {
		try {
			driver.quit();
			reportStep("The opened browsers are closed","PASS", false);
		} catch (Exception e) {
			reportStep("Unexpected error occured in Browser","FAIL", false);
		}
	}

	public void mouseMoveTo(WebElement ele){
		
			try {
				Actions act = new Actions(driver);
				act.moveToElement(ele).build().perform();
			} catch (WebDriverException e) {
				reportStep("WebDriverException : "+e.getMessage(), "FAIL"); {
				// TODO Auto-generated catch block
				e.printStackTrace();
				}
			}
	}
	
	public void scrollingByCoordinatesofAPage() {
		((JavascriptExecutor) driver).executeScript("window.scrollBy(0,500)");
	}

	public void jiraSendRequest(String method, String description) {
		try {
			URL url = new URL("https://tringapps.atlassian.net/rest/api/2/issue/");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);

			String encodedData = getJSON_Body(method,description );
			System.out.println(encodedData);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Basic " + Base64Coder.encode("sankalp.g:Welcome@ta123".getBytes()));
			conn.setRequestProperty("Content-Type", "application/json");
			conn.getOutputStream().write(encodedData.getBytes());

			try {
				InputStream inputStream = conn.getInputStream();
				System.out.println(inputStream);
				System.out.println("Jira ticket created");
			} catch (IOException e) {
				System.out.println(e.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static String getJSON_Body(String summary, String description) {
		javax.json.JsonObject createIssue = Json.createObjectBuilder().add("fields",
				Json.createObjectBuilder().add("project",
						Json.createObjectBuilder().add("key", "NQA"))
				.add("summary", summary)
				.add("description", description)
				.add("issuetype",
						Json.createObjectBuilder().add("name", "Bug"))
				).build();

		return createIssue.toString();
	}

	public Boolean sendmailAttachment() throws Exception {

		String fileAttachment = attachment;

		Properties props = new Properties();

		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.socketFactory.port", "465");
		props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.port", "465");

		Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(email,password);
			}});
		try {

			Message message = new MimeMessage(session);

			message.setFrom(new InternetAddress(email));
			message.setRecipients(Message.RecipientType.TO ,InternetAddress.parse(to));
			message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(cc));
			message.setSubject("NBC Regression Automation Testing Report NBC NewYork and NBC Losangeles");
			message.setText(filename);  

			MimeBodyPart messageBodyPart =new MimeBodyPart();
			messageBodyPart.setText("Hi Team, \n \n Please find the automation report for the NBC. Tested Modules are:"
					+ " \n \n TC-1. NbcPage logo clickable."
					+ " \n TC-2. Top stories playback with pre roll."
					+ " \n TC-3. Weather Radar Interactive Loads/Plays."
					+ " \n TC-4. Right rail has Spredfast."
					+ " \n TC-5. Watch live TVE dropdown appears."
					+ " \n TC-6. TVEdropdown should have ON NOW On Demand Full Schedule TV listings."
					+ " \n TC-7. Connect dropdown appears."
					+ " \n TC-8. Connect have all the configuration."
					+ " \n TC-9. Share bar is visible and functions Article."
					+ " \n TC-10. Article Advanced tagging HTML Module."
					+ " \n \n Kindly download the attachment to review the report.\n \n");


			Multipart multipart = new MimeMultipart();
			multipart.addBodyPart(messageBodyPart);

			messageBodyPart = new MimeBodyPart();
			DataSource source = new FileDataSource(fileAttachment);
			messageBodyPart.setDataHandler(new DataHandler(source));
			messageBodyPart.setFileName(filename);
			multipart.addBodyPart(messageBodyPart);

			message.setContent(multipart);

			Transport.send( message );
			System.out.println("Mail sent");
		} catch (MessagingException e) {
			e.printStackTrace();
			System.out.println("exception in Send Mail");
			return false;
		}
		return true;
	}

}


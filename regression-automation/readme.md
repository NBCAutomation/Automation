**Project Title**			
					
					**NBC Automation Testing**


**Why POM?**

Starting an UI Automation in Selenium WebDriver is NOT a tough task. You just need to find elements, perform operations on it.

The chief problem with script maintenance is that if 10 different scripts are using the same page element, with any change in that element, you need to change all 10 scripts. This is time consuming and error prone.

A better approach to script maintenance is to create a separate class file which would find web elements, fill them or verify them. This class can be reused in all the scripts using that element. In future, if there is a change in the web element, we need to make the change in just 1 class file and not 10 different scripts.

This approach is called Page Object Model(POM). It helps make the code more readable, maintainable, and reusable.


	driver.get("url");
	driver.findElement(By.(ID)).sendKeys();
	driver.findElement(By.(name)).click();

**What is POM?**


Page Object Model is a design pattern to create Object Repository for web UI elements.
Under this model, for each web page in the application, there should be corresponding page class.
This Page class will find the WebElements of that web page and also contains Page methods which perform operations on those WebElements.
Name of these methods should be given as per the task they are performing, i.e., if a loader is waiting for the payment gateway to appear, POM method name can be waitForPaymentScreenDisplay().


	1.nbcpages (Package)
		1.nbcpage (page1)
		2.newsletter (page2)
	2.nbctestcases (Package)
		1.TCOO1_Logoclickable
		2.TC002_Clicknewsletter
	3.Utils (package)
		1.Datainputprovider
		2.Reports
	4.WdMethod (Package)
		1.ProjectMethod (Annotations)
		2.SeMethod (SuperClass)
		3.WdMethod (Interface)
	
The above structure is the actual POM.


**Advantages of POM**


Page Object Patten says operations and flows in the UI should be separated from verification. This concept makes our code cleaner and easy to understand.
The Second benefit is the object repository is independent of test cases, so we can use the same object repository for a different purpose with different tools. For example, we can integrate POM with TestNG/JUnit for functional Testing and at the same time with JBehave/Cucumber for acceptance testing.
Code becomes less and optimized because of the reusable page methods in the POM classes.
Methods get more realistic names which can be easily mapped with the operation happening in UI. i.e. if after clicking on the button we land on the home page, the method name 



	public void NbcPage(){
		new NbcPage(driver, test)
		.clicknbclogo()
		.clickelewetheriframe()
		.clickwethermodule();


**How to implement POM?**


Simple POM:

It's the basic structure of Page object model (POM) where all Web Elements of the AUT(Automatic Ultrasonic Testing) and the method that operate on these Web Elements are maintained inside a class file.A task like verification should be separate as part of Test methods.


**What is Page Factory?**

Page Factory is an inbuilt Page Object Model concept for Selenium WebDriver but it is very optimized.

Here as well, we follow the concept of separation of Page Object Repository and Test Methods. Additionally, with the help of PageFactory class, we use annotations @FindBy to find WebElement. We use initElements method to initialize web elements

*@FindBy can accept tagName, partialLinkText, name, linkText, id, css, className, xpath as attributes.*


	
			
	PageFactory.initElements(driver, this);
			
		if(!verifyTitle("Mobile | NBC New York'")) {
			throw new RuntimeException();
			}
		}
		//WebElements are identify by @FindBy annotaion
		
		@FindBy(how=How.XPATH,using="//div[text()='Connect']")
		private WebElement eleconnect;	
		public Consumercomplaint clickconnect() {
			mouseover(eleconnect);
			return this;
		}
		

Let's look at the same example as above using Page Factory


**Why Maven & Jenkins and TestNG**


Selenium WebDriver is great for browser automation. But, when using it for testing and building a test framework, it feels underpowered. Integrating Maven with Selenium provides following benefits
Apache Maven provides support for managing the full lifecycle of a test project.

1.	Maven is used to define project structure, dependencies, build, and test management.
2.	Using pom.xml(Maven) you can configure dependencies needed for building testing and running code.
3.	Maven automatically downloads the necessary files from the repository while building the project.

		<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
		  <modelVersion>4.0.0</modelVersion>
		<depandency>
		  <groupId>org.example</groupId>
		  <artifactId>jpademo</artifactId>
		  <version>1.0</version>
		  <packaging>jar</packaging>
		  </depandency>


**Jenkins**

Jenkins is a Continuous Integration (CI) server or tool which is written in java. It provides Continuous Integration services for software development, which can be started via command line or web application server. And also, it is happy to know that Jenkins is free software to download and install.



**TestNG**

TestNg is a testing framework inspired from JUnit and NUnit but introducing some new functionalities that make it more powerful and easier to use, such as:

	1.Annotations.
	2.Run your tests in arbitrarily big thread pools with various policies available (all methods in their own thread, one thread per test class, etc...).
	3.Test that your code is multithread safe.
	4.Flexible test configuration.
	5.Support for data-driven testing (with @DataProvider).
	6.Support for parameters.
	7.Powerful execution model (no more TestSuite).
	8.Supported by a variety of tools and plug-ins (Eclipse, IDEA, Maven, etc...).
	9.Embeds BeanShell for further flexibility.
	10.Default JDK functions for runtime and logging (no dependencies).
	11.Dependent methods for application server testing.
	
	
**Here is a very simple test:**

	package example1;
 
	import org.testng.annotations.*;
	 
	public class SimpleTest {
	 @BeforeClass
	 public void setUp() {
	   // code that will be invoked when this test is instantiated
	 }
	 @Test(groups = { "fast" })
	 public void aFastTest() {
	   System.out.println("Fast test");
	 }
	 @Test(groups = { "slow" })
	 public void aSlowTest() {
	    System.out.println("Slow test");
	 }
	 
	}


**Tools Involed:-**


	1.	Eclipse
	2.	GitHub
	3.  Jenkins

**Technology Involved**

	1.Java


**Java**

OOPS Concepts or Object Oriented Programming Concepts are very important. Without having idea about OOPS concepts, you will not be able to design systems in object oriented programming model.

**Table of Contents**

	1.	OOPS Concepts
	2.	Abstraction
	3.	Encapsulation
	4.	Polymorphism
	5.	Inheritance
	6.	Association
	7.	Aggregation
	8.	Composition


**Appium**

Appium test scripts can be written in multiple languages. Appium provides separate client libraries for following languages. Basically, these are the extensions of WebDriver’s client bindings. You can download the particular client library of your favorite language from     Appium site. Once you download, you should have to include that library into your project.

	1.	Ruby
	2.	Python
	3.	Java
	4.	JavaScript
	5.	PHP
	6.	C#

but here we using only JAVA.

**Extent-reports**

	The Extent API can produce more interactive reports, a dashboard view, graphical view, capture screenshots as images 	in the reports, and emailable reports which can be mailed right after the unit test is completed.

	The Extent API can be configured to support programming languages like Java and .Net and unit testing frameworks like 	JUnit, TestNG, NUnit, etc.

	Implementation of Extent API in Selenium Using TestNG 
	To create reports with the Extent API, we need to follow the below steps.

	Create a Maven project in Eclipse and add artifacts like Selenium, TestNG, and the Extent API as dependencies in the 
	
pom.xml, as shown below:

	<dependencies>
	<!-- https://mvnrepository.com/artifact/com.relevantcodes/extentreports -->
	<dependency>
	<groupId>com.relevantcodes</groupId>
	<artifactId>extentreports</artifactId>
	<version>2.41.2</version>
	</dependency>
	</dependencies>
	
	ExtentTest is initialized from the ExtentReports object by calling the lifecycle methods of reports. To start the log 		information in the reports, call startTest(). The return of startTest() is assigned to the test as a reference 		variable to ExtentTest.

	The LogStatus enum is used to add the status message based on the test execution. We have constant values in LogStatus 		like INFO, PASS, FAIL, SKIP, ERROR, FATAL, WARNING, and UNKNOWN. Call the status message in the respective lifecycle 		method to get the appropriate message in the report.

End the test reports by calling endTest() and flush() from the reports to properly close the resources

**.gitignore**

	1.	Re-commiting the SauceLabs userKey and AccessKey and stored in respective directory.
	2.	Ensure whenever the push is happen those gitignore file has not to added into your repository.
	3.	Your base code should be clean with no accessing data which has depending on the execution.
	4.	All the authorized credentilas has been stored in my local machine and the respective file has been loaded in 		.gitignore file.

**Authors**

	1	Vinothkumar



	
	

# NBC OTS SPIRE
*A regression & automation testing suite*

**Description**

Spire is in-house testing suite of automation tools and scripted utilities used for regression and smoke tests for NBC OTS. The testing suite is currently being developed using the [ PhantomJS ](http://phantomjs.org/) and [ CasperJS ](http://casperjs.org/) Javascript libraries. Both of these libraries function as headless WebKit scriptable libraries with a built in JavaScript API. 

Spire’s core purpose is to speed up regression testing, automate site health checks, as well as provide testing utilities to ensure product overall stability.


### Current proposed tests (in development) ###
*	CasperJS / SPIRE Tests
	+ Verify Content pages
		*	Verify page loads - 200 status/page wrapper check.(load_check.js) 
		*	Verify visual elemnets are loaded and visible
		*	404 Link check (url_check.js)
		*	Gallery w/ PreRoll & Interstitial
	+ Verify Ad calls and/or ad loading
		*	Verify ad call structure
		*	Verify ad container and ad display and are visible
		*	Verify pre-roll ad plays
		*	Verify sponsored content
	+ Verify video load and playback
		*	Homepage Inline Player Playback
		*	Article video Playback
		*	Article Embed Playback
		*	Main Video page playback
		*	News Carousel Playback
		*	Investigations Lead Playback
		*	Investigations Content VideoPlayback
		*	Entertainment Carousel Playback
		*	Feature Page Carousel Playback
	+ Verify weather page load
		*	Weather Page Video Playback
		*	Verify the weather forecast information loads
		*	Verify interactive radar loaded
	+ Verify API Endpoints
		*	Verify API enpoint loading/accessibilty (api_check.js v0 dev)
		*	Verify API enpoint structure (api_check.js v0 dev)
		*	JSON/XML validation
	+ Misc Checks
		*	Verify traffic map loads
		*	Verify Contact Us page loads
		*	All Navs/Subnavs Display
		*	Verify search functionality
		*	Verify Omniture calls and events


### Misc Spire related tasks ###
+ Desktop app - Electron
+ Documentation
+ Mandrill email notifications/reports
+ Google Sheets API Integration
+ Internal Status Pages
	*	NBC OTS status page - This page will connect to every 3rd party API endpoint to allow for easy and up-to-date reliable hub of information. Ideally these pages can/will be use for communication on outages and/or announcements.
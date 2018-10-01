<?php
// Routes
/*
Notes:
- Code section name blocks appear as:
	//=======================
	//
	// Stations Admin
	//
	//=======================

*/

//=======================
//
// Home
//
//=======================
$app->get('/', function ($request, $response, $args) {

	$permissions = $request->getAttribute('spPermissions');

    if ($request->getAttribute('spAuth')) {
	    $uri = $request->getUri()->withPath($this->router->pathFor('dashboard'));
		return $response = $response->withRedirect($uri);
    } else {
	    $uri = $request->getUri()->withPath($this->router->pathFor('login-view'));
		return $response = $response->withRedirect($uri, 403);
    }

})->setName('home')->add( new SpireAuth() );


//=======================
//
// Dashboard
//
//=======================
$app->group('/dashboard', function () use ($app) {
	$this->get('/main', function ($request, $response, $args) {

		$db = new DbHandler();
		$permissions = $request->getAttribute('spPermissions');
		$dashboardData = Spire::buildQueryCache();

		$recentAlerts = $db->getRecentActiveNotificationAlerts();

		// Server time
		$info = getdate();
		$date = $info['mday'];
		$month = $info['mon'];
		$year = $info['year'];
		$hour = $info['hours'];
		$min = $info['minutes'];
		$sec = $info['seconds'];

		$current_date = "$month/$date//$year @ $hour:$min:$sec";

		return $this->renderer->render($response, 'home.php', [
	        'title' => 'Dashboard',
	        'page_name' => 'home',
	        'dashClass' => true,
	        'hideBreadcrumbs' => true,
	        'todayManifestTotalFailureReports' => $dashboardData['todayManifestTotalFailureReports'],
			'todayNavTotalFailureReports' => $dashboardData['todayNavTotalFailureReports'],
			'todayContentTotalFailureReports' => $dashboardData['todayContentTotalFailureReports'],
			'todayOTTTotalFailureReports' => $dashboardData['todayOTTTotalFailureReports'],
			'serverTimeStamp' => $current_date,
			'apiManifestTestLoadTime' => $dashboardData['apiManifestTestLoadTime'],
			'apiNavTestLoadTime' => $dashboardData['apiNavTestLoadTime'],
			'apiContentTestLoadTime' => $dashboardData['apiContentTestLoadTime'],
			'apiOTTTestLoadTime' => $dashboardData['apiOTTLoadTime'],
			'apiSectionContentLoadTime' => $dashboardData['apiSectionContentLoadTime'],
			'chartLoadTimeData' => $dashboardData['chartLoadTimeData'],
			'recentRegressionScore' => $recentRegressionScore['data'],
			'recentRegressionScore' => $recentRegressionScore['data'],
			'weatherTileUptimeAverage_today' => $dashboardData['weatherTileUptimeAverage_today'],
			'weatherTileUptimeAverage_yesterday' => $dashboardData['weatherTileUptimeAverage_yesterday'],
			'weatherTileUptimeAverage_week' => $dashboardData['weatherTileUptimeAverage_week'],
			'weatherTileUptimeAverage_month' => $dashboardData['weatherTileUptimeAverage_month'],
			'weatherRadarAverage_today' => $dashboardData['weatherRadarAverage_today'],
			'weatherRadarAverage_yesterday' => $dashboardData['weatherRadarAverage_yesterday'],
			'weatherRadarAverage_week' => $dashboardData['weatherRadarAverage_week'],
			'weatherRadarAverage_month' => $dashboardData['weatherRadarAverage_month'],
			'recentAlerts' => $recentAlerts,

	        //Auth Specific
	        'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
	    // ]);
	    ]);
	})->setName('dashboard')->add( new SpireAuth() );

	$this->get('/account', function ($request, $response, $args) {
		$db = new DbHandler();

		$permissions = $request->getAttribute('spPermissions');

		return $this->renderer->render($response, 'account.php', [
	        'title' => 'Dashboard - My Account',
	        'page_name' => 'account',
	        'accountClass' => true,
	        'hideBreadcrumbs' => true,

	        //Auth Specific
	        'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
	    // ]);
	    ]);
	})->setName('account-dashboard')->add( new SpireAuth() );

	//
	// Account update

	$this->post('/{view}', function ($request, $response, $args) {
		$db = new DbHandler();

		$permissions = $request->getAttribute('spPermissions');
		$user = $request->getAttribute('spAuth')['email'];

		$__postVars = $request->getParsedBody();

		if ($__postVars['task'] == 'updateUser') {
			$updateUserInfo = true;
		}

		if ($__postVars['task'] == 'clearNotification') {
			$clearNotification = true;
		}


		if ($updateUserInfo) {
		  	verifyRequiredParams(array('email', 'password'));

			// reading post params
			$email = $__postVars['email'];
			$uid = $__postVars['uid'];
			$password = $__postVars['password'];
			$new_password = $__postVars['new_password'];

			$formResponse = array();
			$uResponse = array();

			// check for correct email and password
			if ($db->checkLogin($email, $password)) {
				// get the user by email
				$user = $db->getUserByEmail($email);

				if ($user != NULL) {

					$pwUpdate = $db->updateUserPassword($uid, $new_password);

					$uri = $request->getUri()->withPath($this->router->pathFor('dashboard'));
					return $response = $response->withRedirect($uri, 403);
				} else {
					// unknown error occurred
					$uResponse['error'] = true;
					$uResponse['message'] = "An error occurred. Please try again";
				}
			} else {
				// user credentials are wrong
				$formResponse['error'] = true;
				$formResponse['message'] = 'Login failed. Incorrect credentials';

				return $this->renderer->render($response, 'login.php', [
				    'title' => 'Login',
				    'page_name' => 'login',
				    'view' => $args['view'],
				    'viewPath' => $args['view'],
				    'mainView' => true,
				    'hideBreadcrumbs' => true,
				    'messages' => $formResponse["message"]
				]);
			}	
		}

		// Disable email notification
		if ($clearNotification) {
			$clearEmailNotification = $db->updateRecentNotificationAlert($__postVars['alertID'], $user.' - Disabled alert email notifications. ('.date('Y-m-d G:i:s').')');

			$cacheFile = './tmp/' . implode('/', array_slice(str_split($__postVars['refCacheLocation'], 2), 0, 3));
			$cacheClear = Spire::purgeAllCache($cacheFile);
			$dashboardData = Spire::buildQueryCache();

			$logTask = $db->logTask('disableEmailNotification', $user, 'Disabled email notification.');

			if ( $clearEmailNotification ) {
				$formResponse['error'] = false;
				$formResponse['message'] = "Email notification temporarily stopped until new/additional errors";

			} else {
				$formResponse['error'] = true;
				$formResponse['message'] = "Email notification didn't disbale properly, try again.";
			}

			return $this->renderer->render($response, 'home.php', [
		        'title' => 'Dashboard',
		        'page_name' => 'home',
		        'dashClass' => true,
		        'hideBreadcrumbs' => true,
		        'todayManifestTotalFailureReports' => $dashboardData['todayManifestTotalFailureReports'],
				'todayNavTotalFailureReports' => $dashboardData['todayNavTotalFailureReports'],
				'todayContentTotalFailureReports' => $dashboardData['todayContentTotalFailureReports'],
				'serverTimeStamp' => $current_date,
				'apiManifestTestLoadTime' => $dashboardData['apiManifestTestLoadTime'],
				'apiNavTestLoadTime' => $dashboardData['apiNavTestLoadTime'],
				'apiContentTestLoadTime' => $dashboardData['apiContentTestLoadTime'],
				'apiOTTTestLoadTime' => $dashboardData['apiOTTLoadTime'],
				'apiSectionContentLoadTime' => $dashboardData['apiSectionContentLoadTime'],
				'chartLoadTimeData' => $dashboardData['chartLoadTimeData'],
				'recentRegressionScore' => $dashboardData['recentRegressionScore'],
				'message_e' => $formResponse['error'],
				'messages' => $formResponse["message"],

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    ]);
		}
	})->setName('dashboard')->add( new SpireAuth() );
});


//=======================
//
// Reporting
//
//=======================
$app->group('/reports', function () {
	$this->get('/{view}', function ($request, $response, $args) {
		$db = new DbHandler();

		$permissions = $request->getAttribute('spPermissions');
		$pageName = 'Reports';
		$breadcrumbPageName = $args['view'];
		$allPostPutVars = $request->getQueryParams();

		$testDir = 'test_results/'.$args['view'];

		// View path
		$__viewPath = $args['view']."/".$args['subView'];

		switch ($args['view']) {

		    case "main":
		        $mainView = true;
		        $pullAllReportData = false;
		        break;

		    case "api_article_audits":
		        $reportsView = true;
		        $pullAllReportData = true;
		        break;

		    case "api_navigation_audits":
		        $reportsView = true;
		        $pullAllReportData = true;
		        break;

	        case "api_manifest_audits":
	            $reportsView = true;
	            $pullAllReportData = true;
	            break;

            case "regression_tests":
                $regressionView = true;
                $pullAllReportData = true;
                break;

            case "ott_tests":
                $reportsView = true;
                $pullAllReportData = true;
                break;

            case 'loadtimes':
            	$loadTimesView = true;
            	$pullAllReportData = false;
            	break;

       	    case "stale_content_check":
       	        $staleContentView = true;
       	        $pullStaleContentData = true;
       	        break;

   	        case "radar_averages":
       	        $radarAveragesView = true;
       	        break;

		    default:
		        $testTypeName = 'none-existent';
		}

		if ($pullAllReportData) {
			// $allReports = $db->getAllTestResultData($args['view'], 'all', 'all');
			$todayReports = $db->getAllTestResultData($args['view'], 'all', 'today');
			$todayFailureReports = $db->getAllTestResultData($args['view'], 'fail', 'today');

			$yesterdayReports = $db->getAllTestResultData($args['view'], 'all', 'yesterday');
			$yesterdayFailureReports = $db->getAllTestResultData($args['view'], 'fail', 'yesterday');
			
			$yesterdayTotalWarnings = $db->getTestReportCount($args['view'], 'warning', 'yesterday');
			$yesterdayTotalErrors = $db->getTestReportCount($args['view'], 'fail', 'yesterday');

			$todayTotalWarnings = $db->getTestReportCount($args['view'], 'warning', 'today');
			$todayTotalErrors = $db->getTestReportCount($args['view'], 'fail', 'today');
			// var_dump($todayTotalErrors);
			// exit();
		}

		// Loadtimes page data
		if ($loadTimesView) {
			$pageTemplate = 'reports-loadtimes.php';
			$loadtimeSubnavClass = true;
			$chartLoadTimeData = $db->getAllAverageLoadTimes();

			$apiManifestAverageLoadTime = $db->getAverageLoadTime('apiManifestTest', 'today');
			$apiNavAverageLoadTime = $db->getAverageLoadTime('apiNavTest', 'today');
			$apiContentAverageLoadTime = $db->getAverageLoadTime('apiContentTest', 'today');
			$apiOTTAverageLoadTime = $db->getAverageLoadTime('apiOTTTest', 'today');
			$apiSectionContentAverageLoadTime = $db->getAverageLoadTime('apiSectionContent', 'today');

			$apiManifestLoadTimes = $db->getLoadTimes('apiManifestTest', 'today');
			$apiNavLoadTimes = $db->getLoadTimes('apiNavTest', 'today');
			$apiOTTLoadTimes = $db->getLoadTimes('apiOTTTest', 'today');
			$apiSectionContentLoadTimes = $db->getLoadTimes('apiSectionContent', 'today');

		} else if ($regressionView) {
			// $regressionResults = $db->getAllRegressionTestData();
			// $recentRegressionTests = $db->getAllTestResultData($args['view'], 'all', 'today');
			
			// $recentRegressionTests = $db->getAllRegressionTests();
			$regressionSubnavClass = true;
			$pageTemplate = 'reports-regression.php';

		} else if ($pullStaleContentData) {
			$pageName = 'Stale Content Overview';
			$pageTemplate = 'reports-stale-content.php';
			$breadcrumbPageName = 'overview';

			$queryStaleContentAverage = $allPostPutVars['queryStaleContentAverage'];
			
			if ($queryStaleContentAverage) {
				$cacheFile = './tmp/' . implode('/', array_slice(str_split($staleContentAverages['refLoc'], 2), 0, 3));
				$cacheClear = Spire::purgeAllCache($cacheFile);
				$staleQueryRange = $allPostPutVars['range'];
				$staleContentAverages = $db->getStaleContentAverages($staleQueryRange);
			} else {
				$staleContentAverages = $db->getStaleContentAverages(30);
			}

		} else if ($radarAveragesView) {
			$pageName = 'Radar Uptime Averages';
			$pageTemplate = 'reports-radar-averages.php';
			$breadcrumbPageName = 'main';
			$radarSubnavClass = true;
		} else {
			$pageTemplate = 'reports.php';
		}

        return $this->renderer->render($response, $pageTemplate, [
            'title' => $pageName,
            'page_name' => 'reports',
            'view' => $breadcrumbPageName,
            'viewPath' => $args['view'],
            'mainView' => $mainView,
            'reportsView' => $reportsView,
            'singleView' => $singleView,
            'overView' => $overView,
            'regressionView' => $regressionView,
            'ottReportView' => $ottReportView,
            'loadtimeSearchView' => $loadtimeSearchView,
            'fileView' => $fileView,
            'staleContentAverages' => $staleContentAverages['data'],
            'staleContentAveragesRefLoc' => $staleContentAverages['refCacheKey'],
            'reportClass' => true,
            'reportRegressionSubNav' => $regressionSubnavClass,
            'reportLoadtimeSubNav' => $loadtimeSubnavClass,
            'radarSubNav' => $radarSubnavClass,
            'reportStaleContentSubNav' => $staleContentView,
            'staleContentData' => $staleContentData,
    		'allReports' => $allReports,
    		'todayReports' => $todayReports['data'],
    		'todayFailureReports' => $todayFailureReports['data'],
    		'yesterdayReports' => $yesterdayReports['data'],
    		'yesterdayFailureReports' => $yesterdayFailureReports['data'],
    		// 'yesterdayTotalWarningReports' => $yesterdayTotalWarningReports,
    		'todayTotalErrors' => $todayTotalErrors['data'],
			'todayTotalWarnings' => $todayTotalWarnings['data'],
			'yesterdayTotalErrors' => $yesterdayTotalErrors['data'],
			'yesterdayTotalWarnings' => $yesterdayTotalWarnings['data'],
			'recentRegressionTests' => $recentRegressionTests['data'],
			'regressionTests' => $regressionTests,
			// Loadtimes data
			'loadTimesView' => $loadTimesView,
			'chartLoadTimeData' => $chartLoadTimeData['data'],
			'apiManifestAverageLoadTime' => $apiManifestAverageLoadTime['data'],
			'apiNavAverageLoadTime' => $apiNavAverageLoadTime['data'],
			'apiContentAverageLoadTime' => $apiContentAverageLoadTime['data'],
			'apiOTTAverageLoadTime' => $apiOTTAverageLoadTime['data'],
			'apiSectionContentAverageLoadTime' => $apiSectionContentAverageLoadTime['data'],
			'apiManifestLoadTimes' => $apiManifestLoadTimes['data'],
			'apiNavLoadTimes' => $apiNavLoadTimes['data'],
			'apiOTTLoadTimes' => $apiOTTLoadTimes['data'],
			'apiContentLoadTimes' => $apiContentLoadTimes['data'],
			'apiSectionContentLoadTimes' => $apiSectionContentLoadTimes['data'],
			'dayRange' => $staleQueryRange,

    		//Auth Specific
    		'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
        ]);
    })->setName('directory-reports-view')->add( new SpireAuth() );


    // All reports view
    $this->get('/{view}/{subView}', function ($request, $response, $args) {
    	$db = new DbHandler();
    	$allPostPutVars = $request->getQueryParams();
    	$permissions = $request->getAttribute('spPermissions');
    	// View path
		$viewPath = $args['view']."/".$args['subView'];

		switch ($args['view']) {
		    case "main":
		        $mainView = true;
		        $pullAllReportData = false;
		        break;

		    case "api_article_audits":
		        $reportsView = true;
		        $pullAllReportData = true;
		        break;

		    case "api_navigation_audits":
		        $reportsView = true;
		        $pullAllReportData = true;
		        break;

	        case "api_manifest_audits":
	            $reportsView = true;
	            $pullAllReportData = true;
	            break;

            case "regression_tests":
                $regressionView = true;
                $pullAllReportData = true;
                break;

            case "loadtime-search":
                $loadtimeSearchView = true;
                $pullAllReportData = false;
                break;

           	case "stalecontent-search":
           	    $loadtimeSearchView = true;
           	    $pullAllReportData = false;
           	    break;

       	    case "radar-search":
       	        $radarSearchView = true;
       	        $pullAllReportData = false;
       	        break;

		    default:
		        $testTypeName = 'none-existent';
		}
    	
		$breadcrumbPageName = 'all';
		$pageName = 'All Reports';

    	if ($pullAllReportData) {
    		$allReports = $db->getAllTestResultData($args['view'], 'all', 'all');
    	}

		// Report View
		if ($args['subView'] == 'loadtime-search') {
			$pageTemplate = 'reports-loadtimes-search.php';
			$loadtimeSubnavClass = true;
			$breadcrumbPageName = 'search';
			$pageName = 'API Loadtime Search';

		} else if ($args['subView'] == 'stalecontent-search') {
			$pageTemplate = 'reports-stale-content-search.php';
			$staleContentView = true;
			$breadcrumbPageName = 'search';
			$pageName = 'Stale Content Report Search';

			$dayRange = $allPostPutVars['range'];
			$searchTerm = $allPostPutVars['term'];
			$updateTime = $allPostPutVars['updateTime'];
			$queryStaleContent = $allPostPutVars['queryStaleContent'];

			if ($queryStaleContent) {
				if (! $allPostPutVars['stale']) {
					$staleFilter = 'false';
				} else {
					$staleFilter = $allPostPutVars['stale'];
				}

				$pageQueryRef = $args['subView'].'?range='.$dayRange.'&term='.$searchTerm.'&updateTime='.$updateTime.'&stale='.$staleFilter.'&queryStaleContent='.$queryStaleContent.'&view=staleContent&';

				$searchResults = $db->getPagedStaleContentChecks($dayRange, $searchTerm, $updateTime, $staleFilter, $pageQueryRef);
			}
		} else if ($args['subView'] == 'regression-search') {
			$pageTemplate = 'reports-regression-search.php';
			$regressionView = true;
			$regressionSubnavClass = true;
			$breadcrumbPageName = 'search';
			$pageName = 'Regression Report Search';

			$dayRange = $allPostPutVars['range'];
			$searchTerm = $allPostPutVars['term'];
			$queryRegressionReports = $allPostPutVars['queryRegressionReports'];

			if ($queryRegressionReports) {
				if (! $allPostPutVars['failuresOnly']) {
					$staleFilter = 'false';
				} else {
					$staleFilter = $allPostPutVars['failuresOnly'];
				}

				$pageQueryRef = $args['subView'].'?range='.$dayRange.'&term='.$searchTerm.'&stale='.$failuresOnly.'&queryRegressionReports='.$queryRegressionReports.'&view=regressionReports&';
				$searchResults = $db->getPagedRegressionReports($dayRange, $searchTerm, $failuresOnly, $pageQueryRef);
			}
		} else if ($args['subView'] == 'radar-search') {
			$pageTemplate = 'reports-radar-averages-search.php';
			$radarSubnavClass = true;
			$breadcrumbPageName = 'search';
			$pageName = 'Radar Uptime Averages Search';

			$dayRange = $allPostPutVars['range'];
			$searchTerm = $allPostPutVars['term'];
			$queryRadarAverages = $allPostPutVars['queryRadarAverages'];

			if ($queryRadarAverages) {
				if (! $allPostPutVars['offline']) {
					$offlineFilter = 'false';
				} else {
					$offlineFilter = $allPostPutVars['offline'];
				}

				if ($allPostPutVars['radar_id']) {
					$queryType = 'radarID';
					$searchTerm = $allPostPutVars['radar_id'];
				} else {
					$queryType = 'radarName';
					$searchTerm = $allPostPutVars['radar_name'];
				}

				$pageQueryRef = $args['subView'].'?range='.$dayRange.'&queryType='.$queryType.'$term='.$searchTerm.'&updateTime='.$updateTime.'&offline='.$offlineFilter.'&queryStaleContent='.$queryStaleContent.'&view=radarAverages&';

				$searchResults = $db->getPagedRadarStatusChecks($dayRange, $searchTerm, $updateTime, $offlineFilter, $queryType, $pageQueryRef);
			}
		} else {
			$pageTemplate = 'reports.php';
			$loadtimeSubnavClass = false;
		}

        return $this->renderer->render($response, $pageTemplate, [
		    'title' => $pageName,
		    'page_name' => 'reports',
		    'view' => $breadcrumbPageName,
		    'viewPath' => $args['view'],
		    'fullPath' => $viewPath,
		    'allView' => true,
		    'reportClass' => true,
		    'reportRegressionSubNav' => $regressionSubnavClass,
		    'reportLoadtimeSubNav' => $loadtimeSubnavClass,
		    'reportStaleContentSubNav' => $staleContentView,
		    'radarSubNav' => $radarSubnavClass,
		    'allReports' => $allReports,
		    'searchResults' => $searchResults['data'],
		    'dayRange' => $dayRange,
		    'queryType' => $queryType,
		    'searchTerm' => $searchTerm,
		    'staleFilter' => $staleFilter,
		    'offlineFilter' => $offlineFilter,
		    'updateTime' => $updateTime,

		    //Auth Specific
		    'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
		]);
    })->setName('report-subview')->add( new SpireAuth() );

    // Report View
    $this->get('/{view}/{subView}/{recordNumber}', function ($request, $response, $args) {
    	$db = new DbHandler();

    	$permissions = $request->getAttribute('spPermissions');

    	$allPostPutVars = $request->getQueryParams();

    	if ($args['view'] == 'regression_tests') {
    		$currentRecord = $db->getTestDataById($args['recordNumber'], $allPostPutVars['refID']);
    	} else {
    		$currentRecord = $db->getTestDataById($allPostPutVars['refID'], $args['recordNumber']);	
    	}
    	
    	$recordViewType = $currentRecord['data']['test_type'];
    	$currentRecordResults = $currentRecord['data']['results_data'];

		// View path
		$viewPath = $args['view']."/".$args['subView'];

		if ($recordViewType == 'regressionTest') {
			$pageTemplate = 'reports-regression.php';
		} else {
			$pageTemplate = 'reports-single.php';
		}

		// Report View
		return $this->renderer->render($response, $pageTemplate, [
		    'title' => 'Reports',
		    'page_name' => 'reports',
		    'view' => 'single',
		    'viewPath' => $args['view'],
		    'fullPath' => $viewPath,
		    'viewType' => $recordViewType,
		    'singleView' => true,
		    'reportClass' => true,
		    'reportID' => $currentRecord['data']['ref_test_id'],
		    'reportProperty' => $currentRecord['data']['property'],
		    'reportData' => $currentRecordResults,
		    'fullReportData' => $currentRecord['data'],

		    //Auth Specific
		    'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
		]);
    })->setName('report-subview')->add( new SpireAuth() );

    // Search results.
    $this->post('/{view}/{subView}', function ($request, $response, $args) {
    	$db = new DbHandler();

    	$__postVars = $request->getParsedBody();
      	
      	$dayRange = $__postVars['range'];
      	$minResponseTime = $__postVars['mintime'];
      	$searchTerm = $__postVars['term'];
      	$staleFilter = $__postVars['stale'];
      	
      	// var_dump($dayRange, $minResponseTime, $searchTerm);

      	if ($__postVars['processDownload'] == true) {
      		$downloadFile = "loadtimes_export_".date('m-d-Y_hia').'.csv';
      		$downloadData = urldecode($__postVars['downloadData']);

			header("Content-type: text/x-csv");
			header('Content-Disposition: attachment; filename="'.$downloadFile.'"');
			header('Content-Transfer-Encoding: binary');
			header('Content-Length: '.strlen($downloadData));
			set_time_limit(0);
			echo $downloadData;
			exit();
      	}

      	if ($__postVars['queryLoadtimes']) {
      		$searchResults = $db->getHighLoadTimesOverTime($dayRange, $minResponseTime, $searchTerm);
      		$pageTemplate = 'reports-loadtimes-search.php';
      	}

      	if ($__postVars['trending']) {
      		$trending = true;
      		$trendingSearchResults = $db->getHighLoadTimesOverTime($dayRange, $minResponseTime, $searchTerm);
      		$pageTemplate = 'reports-loadtimes-search.php';
      	}

      	return $this->renderer->render($response, $pageTemplate, [
	        'title' => 'Loadtime Search',
	        'page_name' => 'loadtime-search',
	        'reportClass' => true,
	        'reportLoadtimeSubNav' => true,
	        'hideBreadcrumbs' => true,
	        'searchResults' => $_SESSION['searchResults'],
	        'formResponse' => true,
	        'searchDayRange' => $dayRange,
			'searchMinResponseTime' => $minResponseTime,
			'searchTerm' => $searchTerm,
			'trending' => $trending,
			'trendingSearchResults' => $trendingSearchResults['data'],

	        //Auth Specific
	        'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
	    ]);
    })->setName('loadtimes-search')->add( new SpireAuth() );

});

//============================
//
// Script Run & Test/tasking
//
//============================
$app->group('/scripts', function () {

	$this->get('/{view}', function ($request, $response, $args) {
		$permissions = $request->getAttribute('spPermissions');

		$testDir = 'test_results/'.$args['view'];

		if ($args['view'] != 'spire-run') {
			$showOutput = true;
		} else {
			$showOutput = false;
		}

		$files_array = Spire::dirToArray($testDir);

		if ($args['view'] != 'main') {
			// View path
			$__viewPath = $args['view']."/".$args['subView'];

	        return $this->renderer->render($response, 'scripts.php', [
	            'title' => 'Scripts & Tests',
	            'page_name' => 'scripts',
	            'view' => $args['view'],
	            'viewPath' => $args['view'],
	            'scriptView' => true,
	            'scriptClass' => true,
	    		'results' => $files_array,
	    		'configureOutput' => $showOutput,

	    		//Auth Specific
	    		'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
	        ]);
	    } else {
	    	// View path
			$__viewPath = $args['view']."/".$args['subView'];

	        return $this->renderer->render($response, 'scripts.php', [
	            'title' => 'Scripts & Tests',
	            'page_name' => 'scripts',
	            'view' => $args['view'],
	            'viewPath' => $args['view'],
	            'mainView' => true,
	            'scriptClass' => true,
	    		'results' => $files_array,
	    		'configureOutput' => $showOutput,

	    		//Auth Specific
	    		'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
	        ]);
	    }
    })->setName('scripts-main-view')->add( new SpireAuth() );


    $this->post('/{view}', function ($request, $response, $args) {
    	$db = new DbHandler();
    	$permissions = $request->getAttribute('spPermissions');

    	// Temp File
    	$__tmpFile = BASEPATH .'/tmp/__tempSites_'. rand() .'.txt';
    	$__data = file_get_contents($__tmpFile);


    	$allPostPutVars = $request->getParsedBody();


    	if (strpos($_SERVER['SERVER_NAME'], 'spire') !== false) {
    		$serverEnv = '--env=local';
    	} else {
    		$serverEnv = '';
    	}
    	/********************************************
    	*
    	*   Configure testing vars from POST config
    	*
    	*********************************************/
    		// Set protocol flag
    		if($allPostPutVars['protocol'] == 'Secure (HTTPS)') {
    			$secureTesting = true;
    		}

	    	// Set stage flag
	    	if($allPostPutVars['enviroment'] == 'Stage') {
	    		$stageTesting = true;
	    	}

	    	// Set output flag
	    	if($allPostPutVars['output'] == 'console') {
	    		$__output = ' --output=console';
	    	}

	    	// Set content ID
	    	if($allPostPutVars['content_id']) {
	    		$__contentID = '--contentID='.$allPostPutVars['content_id'];
	    	}

	    	// Set sections path to test
	    	if($allPostPutVars['section_path']) {
	    		$__sectionPath = '--sectionPath='.$allPostPutVars['section_path'];
	    	}

	    	// Set API Version
	    	if($allPostPutVars['api_version']) {
	    		$__apiVersion = '--apiVersion='.$allPostPutVars['api_version'];
	    	}

	    	// Set JSON Validation
	    	if($allPostPutVars['json_validation']) {
	    		$__enablevalidation = '--enablevalidation='.$allPostPutVars['json_validation'];
	    	}

	    	// Set testing script
	    	if($allPostPutVars['script']) {
	    		$__runScript = $allPostPutVars['script'];
	    	}

	    	// Test all sites
	    	if($allPostPutVars['brand_test'] == 'all') {
	    		shell_exec("rm ". $__tmpFile);
	    		if ($stageTesting) {
	    			$__tmpFile = './stage_sites.txt';
	    		} else {
	    			if ($secureTesting) {
	    				$__tmpFile = './secure-sites.txt';
	    			} else {
	    				$__tmpFile = './sites.txt';
	    			}
	    		}
	    	}

	    	// Test all OTS sites
	    	if($allPostPutVars['brand_test'] == 'nbc') {
	    		shell_exec("rm ". $__tmpFile);
	    		if ($stageTesting) {
	    			$__tmpFile = './stage_sites-nbc.txt';
	    		} else {
	    			if ($secureTesting) {
	    				$__tmpFile = './secure-sites-nbc.txt';
	    			} else {
	    				$__tmpFile = './sites-nbc.txt';
	    			}
	    		}
	    	}

	    	// Test all TLM sites
	    	if($allPostPutVars['brand_test'] == 'telemundo') {
	    		shell_exec("rm ". $__tmpFile);
	    		if ($stageTesting) {
	    			$__tmpFile = './stage_sites-tsg.txt';
	    		} else {
	    			if ($secureTesting) {
	    				$__tmpFile = './secure-sites-tsg.txt';
	    			} else {
	    				$__tmpFile = './sites-tsg.txt';
	    			}
	    		}
	    	}

	    	// Create testing site list, if options chose
	    	if($allPostPutVars['test_site']) {
	    		$writeTempFile = true;

	    		$siteArray = $allPostPutVars['test_site'];

	    		foreach ($siteArray as $__key => $__value) {
	    			if ($stageTesting) {
	    				$__data .= 'http://stage.www.'.$__value.'.com';
	    			} else {
	    				if ($secureTesting) {
	    					$__data .= 'https://www.'.$__value.'.com';
	    				} else {
	    					$__data .= 'http://www.'.$__value.'.com';
	    				}
	    			}
	    			$__data .= "\r\n";
	    		}
	    	}



    	if ($writeTempFile) {
    		file_put_contents($__tmpFile, $__data, FILE_APPEND | LOCK_EX);
    		$__delCMD = "rm ". $__tmpFile;
    	} else {
    		$__delCMD = '';
    	}

		if ($__runScript == 'spire-run') {
		        $__runCommand = 'npm run runall';
		} elseif ($__runScript == 'apiCheck-manifest') {
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiTest_manifest.js" --url="{}"'.$__output .' '.$__apiVersion.' '.$serverEnv.' '.$__enablevalidation;
		} elseif ($__runScript == 'apiCheck-nav') {
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiTest_nav.js" --url="{}"'.$__output .' '.$__apiVersion.' '.$serverEnv.' '.$__enablevalidation;
		} elseif ($__runScript == 'apiCheck-article') {
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiTest_content.js" --url="{}"'.$__output .' '.$__contentID.' '.$__sectionPath.' '.$__apiVersion.' '.$serverEnv.' '.$__enablevalidation;
		} elseif ($__runScript == 'regressionTest') {
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/regressionTest.js" --url="{}"'.$__output .' '.$__apiVersion.' '.$serverEnv.' '.$__enablevalidation;
		} elseif ($__runScript == 'updateDictionaries') {
			$updateNotesObject = array();

			if($allPostPutVars['brand_test'] == 'all') {
				$updateSites = "All";
			} elseif($allPostPutVars['brand_test'] == 'nbc') {
				$updateSites = "OTS - all";
			} elseif($allPostPutVars['brand_test'] == 'telemundo') {
				$updateSites = "TLM - all";
			} elseif($allPostPutVars['test_site']) {
				$updateSites = array();
				foreach ($siteArray as $stationKey => $stationValue) {
					$updateSites['station_'.$stationKey] = $stationValue;
				}
			}

			$task = $__runScript;
			$user = $request->getAttribute('spAuth')['email'];
			$updateNotesObject['user_notes'] = $allPostPutVars['update_notes'];
			$updateNotesObject['update_stations'] = $updateSites;
			$updateNotes = serialize($updateNotesObject);
			// $__output = ' --output=dictionary';
			$__output = ' --task=createDictionary';

			$logTask = $db->logTask($task, $user, $updateNotes);
			
			if ($logTask > 0) {
				// $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiCheck-manifest.js" --url="{}"'.$__output;
				$__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiTest_manifest.js" --url="{}"'.$__output;
			}
		}

		sleep(1);

		$setThisEnv = getenv('PATH');
		$spEnv = putenv("PATH=".$setThisEnv.":/usr/local/bin");

		if (gethostname() == 'ip-10-9-169-143') {
		    putenv('PATH=/home/ec2-user/.nvm/versions/node/v4.6.0/bin:'.getenv('PATH'));
		}

		if ($request->isPost()) {
	        return $this->renderer->render($response, 'scripts.php', [
	            'title' => 'Scripts & Tests',
		        'page_name' => 'scripts',
		        'view' => $args['view'],
		        'viewPath' => $args['view'],
		        'scriptRunView' => true,
		        'scriptClass' => true,
		        'setEnv' => $spEnv,
		        // 'setEnv' => putenv("PATH={$setThisEnv}"),
				'execCmd' => $__runCommand,
				'delCmd' => $__delCMD,

	    		//Auth Specific
	    		'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
	        ]);
	    }
    })->setName('scripts-run')->add( new SpireAuth() );
});

//=======================
//
// Help
//
//=======================
$app->get('/help', function ($request, $response, $args) {
	$permissions = $request->getAttribute('spPermissions');

    return $this->renderer->render($response, 'help.php', [
        'title' => 'Help',
        'page_name' => 'help',
        'helpClass' => true,
        'hideBreadcrumbs' => true,

        //Auth Specific
        'user' => $request->getAttribute('spAuth'),
        'uAuth' => $permissions['auth'],
        'uRole' => $permissions['role'],
        'uAthMessage' => $permissions['uAthMessage']
    ]);
})->setName('help')->add( new SpireAuth() );


//=======================
//
// User Register
//
//=======================
$app->group('/register', function () {

	$this->get('/{view}', function ($request, $response, $args) {

        return $this->renderer->render($response, 'register.php', [
            'title' => 'Register',
            'page_name' => 'register',
            'view' => $args['view'],
            'viewPath' => $args['view'],
            'mainView' => true,
            'hideBreadcrumbs' => true
        ]);
    })->setName('register-view');


	$this->post('/{view}', function ($request, $response, $args) {

		$__postVars = $request->getParsedBody();

		// var_dump($__postVars);

		// reading post params
		$first_name = $__postVars['first_name'];
		$last_name = $__postVars['last_name'];
		$email = $__postVars['email'];
		$password = $__postVars['password'];

		// check for form required params
		verifyRequiredParams(array('first_name', 'last_name', 'email', 'password'));
		$formResponse = array();

		// validating email address
		validateEmail($email);
		$db = new DbHandler();
		$res = $db->createUser($first_name, $last_name, $email, $password);

		if ($res) {
			if ($res == 'USER_CREATED_SUCCESSFULLY') {
				$formResponse["error"] = false;
				$formResponse["message"] = "You are successfully registered. <a href=\"/login/main\">Please click here to login</a>.";
			} else if ($res == 'USER_CREATE_FAILED') {
				$formResponse["error"] = true;
				$formResponse["message"] = "An error occurred while registereing.";
			} else if ($res == 'USER_ALREADY_EXISTED') {
				$formResponse["error"] = true;
				$formResponse["message"] = "This email has already been registered.";
			}

	        return $this->renderer->render($response, 'register.php', [
	            'title' => 'Register',
	            'page_name' => 'register',
	            'view' => $args['view'],
	            'viewPath' => $args['view'],
	            'mainView' => true,
	            'message_e' => $formResponse["error"],
	            'messages' => $formResponse["message"]
	        ]);
		} else {
			echo 'Failed creation response.';
		}
	});
});

//=======================
//
// Admin
//
//=======================
$app->group('/admin', function () use ($app) {

	// === Admin Deashboard ===
	$this->get('/main', function ($request, $response, $args) {

		$permissions = $request->getAttribute('spPermissions');

		return $this->renderer->render($response, 'admin.php', [
	        'title' => 'Admin Dashboard',
	        'page_name' => 'admin-main',
	        'admin_dashClass' => true,
	        'hideBreadcrumbs' => true,
	        'mainView' => true,

	        //Auth Specific
	        'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
	    // ]);
	    ]);
	})->setName('admin-dashboard')->add( new SpireAuth() );

	//=======================
	//
	// Users Admin
	//
	//=======================
	$app->group('/users', function () use ($app) {
		$this->get('/main', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$db = new DbHandler();
			$users = $db->getAllUsers();

			return $this->renderer->render($response, 'admin-users.php', [
		        'title' => 'User Administration',
		        'page_name' => 'admin-users',
		        'admin_usersClass' => true,
		        'hideBreadcrumbs' => true,
		        'userView' => true,
		        'spireUsers' => $users,

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    // ]);
		    ]);
		})->setName('admin-users')->add( new SpireAuth() );


		$this->get('/update/{user_id}', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$db = new DbHandler();
			// $users = $db->getAllUsers();

			$editingUser = $db->getUserById($args['user_id']);

			return $this->renderer->render($response, 'admin-users.php', [
		        'title' => 'User Administration',
		        'page_name' => 'admin-users',
		        'admin_usersClass' => true,
		        'hideBreadcrumbs' => true,
		        'userEditView' => true,
		        'editingUser' => $editingUser,

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    ]);
		})->setName('admin-users')->add( new SpireAuth() );

		// == [POST] Update user information ==
		$this->post('/update/{user_id}', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$__postVars = $request->getParsedBody();

			$user_id = $__postVars['u_id'];
			$new_password = $__postVars['u_password'];
			$role = $__postVars['u_role'];
			$status = $__postVars['u_status'];
			$formResponse = array();
			$uResponse = array();
			$db = new DbHandler();

			$editingUser = $db->getUserById($args['user_id']);

			// Update user information
			if ( $db->updateUser($user_id, $new_password, $role, $status) ) {
				$formResponse['error'] = false;
				$formResponse['message'] = 'User information updated';

			} elseif ( ! $db->updateUser($user_id, $new_password, $role, $status) ) {
				$formResponse['error'] = true;
				$formResponse['message'] = 'User information not updated. If page refresh, stahp';
			}

			return $this->renderer->render($response, 'admin-users.php', [
		        'title' => 'User Administration',
		        'page_name' => 'admin-users',
		        'admin_usersClass' => true,
		        'hideBreadcrumbs' => true,
		        'userEditView' => true,
		        'editingUser' => $editingUser,
		        'message_e' => $formResponse['error'],
		        'messages' => $formResponse["message"],

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    ]);

		})->setName('admin-users')->add( new SpireAuth() );

	});

	//=======================
	//
	// Stations Admin
	//
	//=======================
	$app->group('/stations', function () use ($app) {
		$this->get('/main', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$db = new DbHandler();
			$globalAPIVer = $db->getStationsGlobalAPIVer();
			$stations = $db->getAllStations();

			return $this->renderer->render($response, 'admin-stations.php', [
		        'title' => 'Station Properties',
		        'page_name' => 'admin-stations',
		        'admin_stationsClass' => true,
		        'hideBreadcrumbs' => true,
		        'stationsView' => true,
		        'stations' => $stations['data'],
		        'stationsRefCacheLocation' => $stations['refCacheKey']->scalar,
		        'globalAPIVer' => $globalAPIVer['data'],

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    // ]);
		    ]);
		})->setName('admin-stations')->add( new SpireAuth() );


		$this->get('/update/{page_ref}', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');
			$db = new DbHandler();

			if ($args['page_ref'] == 'globalAPIVer') {
				$globalAPIVer = $db->getStationsGlobalAPIVer();
				$pageView = 'globalAPIVer';
				$allStationsRefCacheLocation = $args['ref'];
			} else {
				$editingStation = $db->getStationById($args['page_ref']);
				$pageView = 'stationEditView';
			}

			return $this->renderer->render($response, 'admin-stations.php', [
		        'title' => 'Station Settings',
		        'page_name' => 'admin/stations',
		        'admin_stationsClass' => true,
		        'hideBreadcrumbs' => false,
		        'pageView' => $pageView,
		        'editingStation' => $editingStation['data'],
		        'globalAPIVer' => $globalAPIVer['data'],
		        'allStationsRefCacheLocation' => $allStationsRefCacheLocation,

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    ]);
		})->setName('admin-stations-update')->add( new SpireAuth() );

		// == [POST] Update user information ==
		$this->post('/update/{page_ref}', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$__postVars = $request->getParsedBody();

			// // reading post params
			$globalAPIVer = $__postVars['globalAPIVer'];
			$stationID = $__postVars['stationID'];
			$stationApiVersion = $__postVars['stationApiVersion'];
			$stationURL = $__postVars['stationURL'];
			$stationShortname = $__postVars['stationShortname'];
			$stationCallLetters = $__postVars['stationCallLetters'];
			$stationGroup = $__postVars['stationGroup'];
			$stationBrand = $__postVars['stationBrand'];
			$stationStatus = $__postVars['stationStatus'];
			$formResponse = array();
			$uResponse = array();
			$db = new DbHandler();
			$user = $request->getAttribute('spAuth')['email'];

			// Clear current station cache
			$cacheClear = Spire::purgeAllCache($__postVars['refCacheLocation']);
			$cacheClear = Spire::purgeAllCache($__postVars['refAllStationsCacheLocation']);


			if (strlen($__postVars['update_notes']) > 0) {
				$updateNotes = $__postVars['update_notes'].'; Updated global API Version to:'. $globalAPIVer;
			} else {
				$updateNotes = 'Updated global API Version to: '. $globalAPIVer;
			}

			// Update information
			if ($__postVars['task'] == 'updateStation') {
				if ( $db->updateStationData($stationID, $stationApiVersion, $stationURL, $stationShortname, $stationCallLetters, $stationGroup, $stationBrand, $stationStatus) ) {
					$formResponse['error'] = false;
					$formResponse['message'] = 'Station information updated';

				} elseif ( ! $db->updateStationData($stationID, $stationApiVersion, $stationURL, $stationShortname, $stationCallLetters, $stationGroup, $stationBrand, $stationStatus) ) {
					$formResponse['error'] = true;
					$formResponse['message'] = 'Station information did not update correctly.';
				}

				$editingStation = $db->getStationById($stationID);
				$pageView = 'stationEditView';

			} elseif ($__postVars['task'] == 'updateGlobalAPI'){
				$logTask = $db->logTask('updateGlobalAPI', $user, $updateNotes);

				$setGlobalAPI = $db->updateGlobalAPI($globalAPIVer);
				$formResponse['error'] = false;
				$formResponse['message'] = 'Global API version updated.';

				$globalAPIVer = $db->getStationsGlobalAPIVer();
				$stations = $db->getAllStations();

				$pageView = 'globalAPIVer';
			}

			return $this->renderer->render($response, 'admin-stations.php', [
		        'title' => 'Station Settings',
		        'page_name' => 'admin/stations',
		        'admin_stationsClass' => true,
		        'hideBreadcrumbs' => false,
		        'pageView' => $pageView,
		        'editingStation' => $editingStation['data'],
		        'message_e' => $formResponse['error'],
		        'messages' => $formResponse["message"],
		        'stations' => $stations['data'],
		        'globalAPIVer' => $globalAPIVer['data'],

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    ]);

		})->setName('admin-stations-update-post')->add( new SpireAuth() );

	});

	// === Admin Logger ===
	// Staging log viewer
	$this->get('/logger', function ($request, $response, $args) {

		$permissions = $request->getAttribute('spPermissions');
		$siteAppLog = fopen(__DIR__ . '/../logs/app.log', "r");

		return $this->renderer->render($response, 'admin.php', [
	        'title' => 'Site Log',
	        'page_name' => 'admin-main',
	        'admin_dashClass' => true,
	        'hideBreadcrumbs' => true,
	        'loggerView' => true,
	        'siteLog' => $siteAppLog,

	        //Auth Specific
	        'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
	    // ]);
	    ]);
	})->setName('admin-dashboard')->add( new SpireAuth() );
});


//=======================
//
// Spire Login
//
//=======================
$app->group('/login', function () use ($app) {

	$this->get('/main', function ($request, $response, $args) {

        return $this->renderer->render($response, 'login.php', [
            'title' => 'Login',
            'page_name' => 'login',
            'view' => $args['view'],
            'viewPath' => $args['view'],
            'mainView' => true,
            'hideBreadcrumbs' => true
        ]);
    })->setName('login-view');

    $this->get('/forgot', function ($request, $response, $args) {

        return $this->renderer->render($response, 'login.php', [
            'title' => 'Forgot password',
            'page_name' => 'forgot',
            'view' => $args['view'],
            'viewPath' => $args['view'],
            'passResetView' => true,
            'hideBreadcrumbs' => true
        ]);
    })->setName('login-view');


	$this->post('/{view}', function ($request, $response, $args) {

		$__postVars = $request->getParsedBody();

		// var_dump($__postVars);
		

		if ($__postVars['method'] == 'login') {
		  	verifyRequiredParams(array('email', 'password'));

			// reading post params
			$email = $__postVars['email'];
			$password = $__postVars['password'];
			$formResponse = array();
			$uResponse = array();
			$db = new DbHandler();

			// var_dump($db->checkLogin());

			// check for correct email and password
			if ($db->checkLogin($email, $password)) {
				// get the user by email
				$user = $db->getUserByEmail($email);

				if ($user != NULL) {

					$_SESSION['spUser']   = $user['email'];
					// $uResponse["error"] = false;
					// $uResponse['name'] = $user['name'];
					// $uResponse['email'] = $user['email'];
					// $uResponse['apiKey'] = $user['api_key'];

					$this->logger->info("User login - ". $user['email'] );

					$uri = $request->getUri()->withPath($this->router->pathFor('dashboard'));
					return $response = $response->withRedirect($uri, 403);
				} else {
					// unknown error occurred
					$uResponse['error'] = true;
					$uResponse['message'] = "An error occurred. Please try again";
				}
			} else {
				// user credentials are wrong
				$formResponse['error'] = true;
				$formResponse['message'] = 'Login failed. Incorrect credentials';

				return $this->renderer->render($response, 'login.php', [
				    'title' => 'Login',
				    'page_name' => 'login',
				    'view' => $args['view'],
				    'viewPath' => $args['view'],
				    'mainView' => true,
				    'hideBreadcrumbs' => true,
				    'messages' => $formResponse["message"]
				]);
			}	
		} elseif ($__postVars['method'] == 'forgot') {
			echo "forgot";
		}

		exit();

	  	
	});
});

//=======================
//
// Logout
//
//=======================
$app->get('/logout', function ($request, $response, $args) {
	$_SESSION['spUser'] = NULL;
	$uri = $request->getUri()->withPath($this->router->pathFor('login-view'));
	return $response = $response->withRedirect($uri, 403);
});

//=======================
//
// Utils
//
//=======================
$app->group('/utils', function () {

	$this->get('/tasks', function ($request, $response, $args) {

		$db = new DbHandler();

		// Set necessary vars
		$utilReqParams = $request->getQueryParams();
		$randTestID = rand(0, 9999);

		$stationProperty = $utilReqParams['property'];

		$testType = $utilReqParams['testscript'];

		// Set task to run
		if ($utilReqParams['task'] == 'generate'){
			$createTestID = true;
		}

		if ($utilReqParams['task'] == 'upload'){
			$uploadResultsFile = true;
		}

		if ($utilReqParams['task'] == 'getDictionaryData'){
			$getDictionaryData = true;
		}

		if ($utilReqParams['task'] == 'getStationsGlobalAPIVer'){
			$getStationsGlobalAPIVer = true;
		}

		// Check logged data from logWeatherTileCheck and determie if an alert needs to be sent
		if ($utilReqParams['task'] == 'evalWeatherTileChecks'){
			$weatherCheckData = $db->getWeatherTileChecks();

			if ($weatherCheckData) {
				$weatherAlert = 0;
				foreach ($weatherCheckData['data'] as $key => $value) {

					if ($value['http_status'] != '200') {
						$weatherAlert++;
					}
				}

				if ($weatherAlert > 2) {
					$spireNotifications = true;
					$notificationType = "weatherTileAlert";
				}
			}
		}

		if ($utilReqParams['task'] == 'evalWeatherRadarChecks'){
	    	$radarStat = array(
		    	"0845" => "First Alert Live Doppler - Los Angeles",
	            "0846" => "First Alert Live Doppler - Orange County",
	            "0847" => "First Alert Live Doppler - San Diego",
	            "0848" => "StormRanger - Los Angeles",
	            "0849" => "NBC 5 S-Band Radar - DFW",
	            "0850" => "StormRanger - DFW",
	            "0851" => "StormRanger - Philadelphia",
	            "0854" => "NBC Boston Fixed",
	            "0855" => "StormTracker 4 - New York",
	            "0856" => "Live Doppler 5 - Chicago",
	            "0837" => "TeleDoppler - Puerto Rico",
	            "0853" => "First Alert Doppler 6000",
	            "0870" => "StormRanger 2 - New York/Boston",
	            "0871" => "StormRanger 2 - Philadelphia",
	            "0872" => "StormRanger 2 - DFW"
            );

            $radarAlerts = array();
            $radarSRAlerts = array();
            $radarStatus = array();

            foreach ($radarStat as $key => $value) {
            	$weatherCheckData = $db->getAllWeatherRadarChecks($key);
            	$weatherDataArray = array_reverse($weatherCheckData['data']);
            	
            	$weatherRadarAlert = 0;
            	// echo "<pre>";
            	// print_r($weatherDataArray);
            	// echo "</pre><br />";
            	// exit();

            	foreach ($weatherDataArray as $radarKey => $radarValue) {

            		$radarStatus['check_1'] = $weatherDataArray[0]['radar_status'];
            		$radarStatus['check_2'] = $weatherDataArray[1]['radar_status'];
            		$radarStatus['check_3'] = $weatherDataArray[2]['radar_status'];
            		
            		if ( strpos($radarValue['pretty_ref'], 'StormRanger') !== false ) {
            			if ($radarStatus['check_2'] != $radarStatus['check_3']) {
            				$radarSRAlerts[$radarValue['layer_id'].' - '.$radarValue['pretty_ref']] = $radarValue['radar_status'];
            			}
            		} else {
            			if ( strpos($radarValue['pretty_ref'], 'Puerto Rico') == false && $radarValue['radar_status'] === 'offline') {
            				if ($radarStatus['check_1'] == 'offline' && $radarStatus['check_2'] == 'offline' && $radarStatus['check_3'] == 'offline') {
            					$radarAlerts[$radarValue['pretty_ref']] = $radarValue['radar_status'];
            				}
            			}
            		}
            	}
            }

	        if (!empty($radarAlerts) || !empty($radarSRAlerts)) {
	        	$spireNotifications = true;
				$notificationType = "weatherRadarAlert";
	        }
		}

		if ($utilReqParams['task'] == 'sendAlert'){
			$spireNotifications = true;
			$notificationType = $utilReqParams['notificationType'];
			$taskRef = $utilReqParams['taskRef'];
		}


		if ($createTestID) {
			// Create test ID
			$thisID = $db->createTestID($randTestID, $stationProperty, $testType, $testResultsFile);

			if ($thisID != NULL) {
				echo $thisID;
			} else {
				echo('che le derp');
			}
		}

		if ($getStationsGlobalAPIVer) {
			// Create test ID
			$globalAPIVer = $db->getStationsGlobalAPIVer();

			if ($globalAPIVer != NULL) {
				echo $globalAPIVer['data']['value'];
			} else {
				echo('che le derp');
			}
		}

		if ($getDictionaryData) {
			$dData = $db->getManifestDictionaryData($stationProperty);
			// echo '<pre>';
			echo($dData['data']['dictionary_object']);
			// echo '</pre>';
		}

		if ($utilReqParams['task'] == 'clearAndBuildQueryCache') {
			// Clear cache then rebuild
			Spire::buildQueryCache(true);

    		return $response->withRedirect('/dashboard/main');
			
		}

		if ($spireNotifications) {

	    	if ($notificationType == 'api-notification') {	    			
	    		
	    		$db = new DbHandler();

	    		$current_date = date("F j, Y \a\t g:ia");

				$notificationTotals = Spire::buildQueryCache(true);
				$errorTotals = array($notificationTotals['todayManifestTotalFailureReports'], $notificationTotals['todayNavTotalFailureReports'], $notificationTotals['todayContentTotalFailureReports'], $notificationTotals['todayOTTTotalFailureReports']);
				$notificationErrors = array_sum($errorTotals);
				$recentNotifications = $db->getRecentNotificationAlerts();

				if ($recentNotifications['data']['error_count'] < 1 && $notificationErrors >= 1) {
					$sendEmailNotification = true;
					echo "sendable alert 0";
					$randID = rand(0, 9999);
					$logTask = $db->logNotificationAlert($randID, $notificationErrors, 1, '');	
				} else {
					if ( $notificationErrors >= 1 ) {
						if ($notificationErrors > $recentNotifications['data']['error_count']) {
							$sendEmailNotification = true;
							echo "sendable alert 1";
							$randID = rand(0, 9999);
							$logTask = $db->logNotificationAlert($randID, $notificationErrors, 1, '');
						} else {
							if ($notificationErrors == $recentNotifications['data']['error_count'] && $recentNotifications['data']['sendable'] > 0) {
								$sendEmailNotification = true;
								echo "sendable alert 2";
								$randID = rand(0, 9999);
								$logTask = $db->logNotificationAlert($randID, $notificationErrors, 1, '');
							} else {
								$sendEmailNotification = false;
								$logTask = $db->logTask('sendEmailNotification', 'SpireBot', 'API Errors, notification not sent, current errors already reviewed, seen. Alert ref: ' . $recentNotifications['data']['id']);
							}
						}
					}
				}

				function setStatusColor($errorCount) {
					if ( $errorCount > 0) {
						$boxColor = "#cc0000";
					} else {
						$boxColor = "#93c54b";
					}
					return $boxColor;
				}

				$emailRecipient = 'deltrie.allen@nbcuni.com';
				// $emailRecipient = 'NBCOTSOpsTeam@nbcuni.com';
				// $emailRecipient .= ", eduardo.martinez@nbcuni.com";

				$emailSubject = 'Automation Failures/Warnings';

	    		$emailContent .= '<table align="center" width="500" cellpadding="10" style="text-align: center; border: 1px solid;">';
	    		$emailContent .= '<tr><th colspan="4">Automation Error/Warnings</th></tr>';
	    		$emailContent .= '<tr bgcolor="#ddd"><th>Manifest</th><th>Navigation</th><th>Content</th><th>OTT</th></tr>';
	    		$emailContent .= '<tr style="color: #fff; text-align: center;"><td bgcolor="'.setStatusColor($notificationTotals['todayManifestTotalFailureReports']).'">'.$notificationTotals['todayManifestTotalFailureReports'].'</td>';
	    		$emailContent .= '<td bgcolor="'.setStatusColor($notificationTotals['todayNavTotalFailureReports']).'">'.$notificationTotals['todayNavTotalFailureReports'].'</td>';
	    		$emailContent .= '<td bgcolor="'.setStatusColor($notificationTotals['todayContentTotalFailureReports']).'">'.$notificationTotals['todayContentTotalFailureReports'].'</td>';

	    		$emailContent .= '<td bgcolor="'.setStatusColor($notificationTotals['todayOTTTotalFailureReports']).'">'.$notificationTotals['todayOTTTotalFailureReports'].'</td></tr>';

	    		$emailContent .= '<tr style="color: #000; text-align: center;"><td bgcolor="#ffd000">'.$notificationTotals['todayManifestTotalWarningReports'].'</td>';
	    		$emailContent .= '<td bgcolor="#ffd000">'.$notificationTotals['todayNavTotalWarningReports'].'</td>';
	    		$emailContent .= '<td bgcolor="#ffd000">'.$notificationTotals['todayContentTotalWarningReports'].'</td>';
	    		$emailContent .= '<td bgcolor="#ffd000">---</td></tr>';
	    		$emailContent .= '<tr bgcolor="#ddd"><td><a href="http://54.243.53.242/reports/api_manifest_audits">view reports</a></td><td><a href="http://54.243.53.242/reports/api_navigation_audits">view reports</a></td><td><a href="http://54.243.53.242/reports/api_article_audits">view reports</a></td><td><a href="http://54.243.53.242/reports/ott_tests">view reports</a></td></tr>';
	    		$emailContent .= '<tr><td colspan="4"></td></tr>';
	    		$emailContent .= '<tr><td colspan="4">Visit <a href="http://54.243.53.242/">Dashbaord</a> to disable email alert.</td></tr>';
	    		$emailContent .= '</table>';
	    	}

			// if ($taskRef == 'APITestingComplete') {
	  //   		$emailRecipient = 'deltrie.allen@nbcuni.com';
	  //   		$sendEmailNotification = true;
			// 	$emailSubject = 'SPIRE: API Testing Complete';
			// 	$emailContent = 'API Testing has completed';
			// }

			if ($notificationType == 'weatherTileAlert') {
	    		$emailRecipient = 'deltrie.allen@nbcuni.com';
	    		$sendEmailNotification = true;
				$emailSubject = '[SPIRE] WSI Weather tile data failure';
				$emailContent = 'The weather tile data is failing to load properly. The site has returned a 404 on consecutive checks, please investigate.<br /><br />URL:  https://wsimap.weather.com/201205/en-us/1117/0019/capability.json?layer=0856';
			}

			if ($notificationType == 'weatherRadarAlert') {
	    		$emailRecipient = 'deltrie.allen@nbcuni.com';
	    		$sendEmailNotification = true;
				$emailSubject = '[SPIRE] WSI Weather radars alerts';
				
				if ($radarAlerts) {
					$emailContent .= 'Local weather station radars returning as "offline" in multiple tests/checks, please investigate.<br /><br />Offline radars:<br />';

					foreach ($radarAlerts as $failKey => $failVal) {
		            	$emailContent .= "   - ".$failKey." - ".$failVal."<br />";
		            }
				}

				if ($radarSRAlerts) {
					$emailContent .= 'Storm Ranger radar status changed.<br />Radar(s):<br />';
					
					foreach ($radarSRAlerts as $failKey => $failVal) {
		            	$emailContent .= "   - ".$failKey." - ".$failVal."<br />";
		            }
				}
			}

	    	if ($notificationType == 'regression-notification') {
	    		$db = new DbHandler();

	    		$todayRegressionCronFailures = $db->getTestReportCount('regression_tests', 'fail', 'today');
	    		$emailRecipient = 'deltrie.allen@nbcuni.com';
	    		// $emailContent = 'LIMQualityAssurance@nbcuni.com';
	    		$sendEmailNotification = true;
	    		$emailSubject = 'Automation Regression '.$utilPostParams['taskRef'];
	    		$emailContent .= 'Regression cron process: '.$utilPostParams['taskRef'].'ed';

	    		if ($utilPostParams['regression-alert'] == 'end') {
	    			$emailContent .= '<br /> Process completed. Total Errors: '. $todayRegressionCronFailures;
	    			$emailContent .= '<br /> - <a href="http://54.243.53.242/reports/regression_tests">view reports</a>';
	    		}
	    	}

	    	if ($notificationType == 'olympics-alert'){
	    		$emailRecipient = 'NBCOTSOpsTeam@nbcuni.com';
	    		$sendEmailNotification = true;
				$emailSubject = 'Olympics Alert: Watch Now / Medal Count Loading Errors';
				$emailContent = 'Unable to load or parse WatchNow / MedalCount feeds. Check feeds for issues. <br /><a href="http://olympics.otsops.com/watch-now">Watch Now</a><br /><a href="http://olympics.otsops.com/medal-count">Medal Count</a>';
	    	}

	    	if ($sendEmailNotification) {
	    		$this->logger->info("Alert notification email sent; type: ". $utilPostParams['taskType'] . ", process: " . $utilPostParams['taskRef'] . ", note: " . $utilPostParams['logNote']);
	    		Spire::sendEmailNotification($emailRecipient, $emailContent, $emailSubject);
	    		echo($emailRecipient."<br />".$emailContent."<br />".$emailSubject);
	    	}
	    	// Force redirect
			// return $response->withRedirect('/dashboard/main');
	    }

	    if ($utilReqParams['task'] == 'testingOutput'){
	    	$db = new DbHandler();

	    }
    });

	$this->get('/staleAverageOutput', function ($request, $response, $args) {
		$db = new DbHandler();
		$stations = $db->getAllStations();

		echo json_encode($stations['data'][0]);
    });

	// Manage test POST requests
    // $this->post('/manage_dictionary', function ($request, $response, $args) {
	$this->post('/{view}', function ($request, $response, $args) {
		$db = new DbHandler();

    	$utilPostParams = $request->getParsedBody();

    	if ($utilPostParams['failureType'] == 'loadingError') {
    		$olympLoadingAlert = true;
    	}

		if ($utilPostParams['failureType'] == 'jsonError') {
			$olympJSONAlert = true;
		}
    	
    	// Create Dictionary entries into DB
    	if ($utilPostParams['task'] == 'createDictionary') {
    		$dictionaryStation = $utilPostParams['dictionaryStation'];
    		$dictionaryData = $utilPostParams['dictionaryData'];
    		  	
    		$manifestDictionaryStatus = $db->insertUpdateManifestDictionary($dictionaryStation, $dictionaryData);
			
			$tmpLocation = BASEPATH .'/tmp/';
    		
    		if ($manifestDictionaryStatus){
    			$purgeDBCache = Spire::purgeAllCache($tmpLocation);
    			$this->logger->info("Dictionary insert/updated: ". $dictionaryStation ." : ". $manifestDictionaryStatus . " -- DbCahce Purged");
    		}
    	}

    	// Log Manifest test results to DB
    	if ($utilPostParams['task'] == 'processManifestTestResults') {
    		$testID = $utilPostParams['testID'];
    		$testType = $utilPostParams['testType'];
    		$station = $utilPostParams['testProperty'];
    		$status = $utilPostParams['testStatus'];
    		$testFailureCount = $utilPostParams['testFailureCount'];
    		$testScore = $utilPostParams['testScore'];
    		$results = $utilPostParams['testResults'];
    		$info = $utilPostParams['testInfo'];

    		if ($utilPostParams['manifestLoadTime']) {
    			$testLoadtime = $utilPostParams['manifestLoadTime'];	
    		} else {
    			$testLoadtime = '0';
    		}

    		if (! $testScore = $utilPostParams['testScore']) {
    			$testScore = '0';
    		}

    		$processManifestTestResults = $db->insertTestResults($testID, $testType, $station, $status, $testFailureCount, $testScore, $testLoadtime, $results, $info);

    		if ($processManifestTestResults){
    			$this->logger->info("Manifest test results logged: [testID=>". $testID .",station=>". $station .",loadTime=>". $testLoadtime .",testType=>". $testType .",testStatus=>". $status ."]");
    		}
    	}

    	if ($utilPostParams['task'] == 'logLoadTime') {
    		$testID = $utilPostParams['testID'];
    		$testType = $utilPostParams['testType'];
    		$manifestLoadTime = $utilPostParams['manifestLoadTime'];
    		$endPoint = $utilPostParams['endPoint'];
    		$clickXServerName = $utilPostParams['clickXServerName'];
    		$testInfo = $utilPostParams['testInfo'];

    		$logLoadTime = $db->logLoadTime($testID, $testType, $manifestLoadTime, $endPoint, $clickXServerName, $testInfo);
    		
    		if ($logLoadTime){
    			$this->logger->info("Loadtime logged: [testID=>". $testID .",endPoint=>". $endPoint .",loadTime=>". $manifestLoadTime .",testType=>". $testType ."]");
    		}
    	}

    	if ($utilPostParams['task'] == 'logPayloadError') {
    		$testID = $utilPostParams['testID'];
    		$testType = $utilPostParams['testType'];
    		$error = $utilPostParams['error'];
    		$endpoint = $utilPostParams['endpoint'];
    		$payload = $utilPostParams['payload'];

    		$logPaylodError = $db->logPayloadError($testID, $testType, $error, $endpoint, $payload);
    		
    		if ($logPaylodError){
    			$this->logger->info("Loadtime logged: [testID=>". $testID .",endPoint=>". $endPoint .",loadTime=>". $manifestLoadTime .",testType=>". $testType ."]");
    		}
    	}

    	if ($utilPostParams['task'] == 'processScrapedContentStaleCheck') {
    		$refTestID = $utilPostParams['testID'];
    		$testType = $utilPostParams['testType'];
    		$station = $utilPostParams['testProperty'];
    		$status = $utilPostParams['testStatus'];
    		$testFailureCount = $utilPostParams['testFailureCount'];
    		$sectionContentPayload = $utilPostParams['contentObject'];
    		$results = $utilPostParams['testResults'];

    		if ($status == 'Pass') {
				$thisContentObject = $db->getRecentContentObject($station);
				$recentCotnentPayload = $thisContentObject['data']['payload'];
				$payloadID = $thisContentObject['data']['id'];

				$udpateTimeDiff = Spire::dateDiff("now", $thisContentObject['data']['created']);
			
				$to_time = strtotime("now");
				$from_time = strtotime($thisContentObject['data']['created']);
				$updateTimeDiffMin = round(abs($to_time - $from_time) / 60);

				if ($recentCotnentPayload) {
					$payloadID = $thisContentObject['data']['id'];
					$refTestID = $thisContentObject['data']['ref_test_id'];

					if ($recentCotnentPayload == $sectionContentPayload) {
						// echo "matches";
						$db->logContentCheck($refTestID, $payloadID, $station, 1, 0, 0);
					} else {
						// echo "NO";						
						$storeScrapedContent = $db->storeScrapedContent($refTestID, $station, $sectionContentPayload);
						$db->logContentCheck($refTestID, $storeScrapedContent, $station, 0, $udpateTimeDiff, $updateTimeDiffMin);
					}
				} else {
					$storeScrapedContent = $db->storeScrapedContent($refTestID, $station, $sectionContentPayload);
					$db->logContentCheck($refTestID, $storeScrapedContent, $station, 0, $udpateTimeDiff, $updateTimeDiffMin);
				}
    		}
    	}

    	if ($utilPostParams['task'] == 'logWeatherTileCheck') {
			$httpStatus = $utilPostParams['httpStatus'];
			// $httpStatus = 404;

			$logWeatherTileCheck = $db->logWeatherTileCheck($httpStatus);
			if ($logWeatherTileCheck) {
				return $response->withRedirect('/utils/tasks?task=evalWeatherTileChecks');
			}
		}

    	if ($utilPostParams['task'] == 'logRadarStatus') {
			$refTestID = $utilPostParams['testID'];
			$weatherRadarSite = $utilPostParams['weatherRadarSite'];
			$weatherRadarPrettyRef = $utilPostParams['weatherRadarPrettyRef'];
			$weatherRadarID = $utilPostParams['weatherRadarID'];
			$weatherRadarStatus = $utilPostParams['weatherRadarStatus'];

			$logWeatherRadarStatus = $db->logWeatherRadarStatus($refTestID, $weatherRadarSite, $weatherRadarPrettyRef, $weatherRadarID, $weatherRadarStatus);
			if ($logWeatherRadarStatus) {
				return $response->withRedirect('/utils/tasks?task=evalWeatherRadarChecks');
			}
		}
    });


	// Process file download
    $this->get('/download', function ($request, $response) {
    	$allPostPutVars = $request->getQueryParams();

		$refFile = $allPostPutVars['file'];
		$file = __DIR__.'/../html'.$refFile;

        $response = $response->withHeader('Content-Description', 'File Transfer')
       ->withHeader('Content-Type', 'application/octet-stream')
       ->withHeader('Content-Disposition', 'attachment;filename="'.basename($file).'"')
       ->withHeader('Expires', '0')
       ->withHeader('Cache-Control', 'must-revalidate')
       ->withHeader('Pragma', 'public')
       ->withHeader('Content-Length', filesize($file));

	    readfile($file);
	    return $response;
    });

    // Purge site all cache
    $this->get('/purge-cache', function ($request, $response) {
    	$allPostPutVars = $request->getQueryParams();

    	if ($allPostPutVars['ref']) {
    		$tmpLocation = './tmp/' . implode('/', array_slice(str_split($allPostPutVars['ref'], 2), 0, 3));
    	} else {
    		$tmpLocation = BASEPATH .'/tmp/';
    	}
		
		$cacheClear = Spire::purgeAllCache($tmpLocation);

		if ($allPostPutVars['reloc']) {
			return $response->withRedirect('/'.urldecode($allPostPutVars['reloc']));
		} else {
			return $response->withRedirect('/dashboard/main');
		}
    });

    // Purge old tests // Date(X) > 30 Days & send an email once a week
    $this->get('/purgeResults', function ($request, $response) {
    	$allPostPutVars = $request->getQueryParams();

    	if ($allPostPutVars['auto']) {
	    	$db = new DbHandler();
			
			$purgedResults = $db->purgeOldTestResults();
			$emailSubject = 'Spire DB Purge Maintenance';

			$emailContent .= '<table align="center" width="500" cellpadding="10" style="text-align: center; border: 1px solid;">';
			$emailContent .= '<tr><th colspan="2">DB Purge Maintenance</th></tr>';
			$emailContent .= '<tr bgcolor="#ddd"><th>Table</th><th>Records removed</th></tr>';
			$emailContent .= '<tr><td colspan="2">*Deleting DB data/records older than 30 Days.</td></tr>';


			foreach ($purgedResults as $key => $value) {
				$emailContent .= '<tr><td>'.$key.'</td><td>'.$value.'</td></tr>';
			}

			$emailContent .= '<tr><td></td><td></td></tr>';
			$emailContent .= '</table>';

			// Send email and log
			Spire::sendEmailNotification('deltrie.allen@nbcuni.com', $emailContent, $emailSubject);
			$this->logger->info("DB records purged: ". $purgedResults);

			// Purge cache
			// return $response->withRedirect('/utils/purgeResults?auto=y');
    	}

    	return $response->withRedirect('/dashboard/main');

    });

});

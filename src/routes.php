<?php
// Routes
// Notes:
// ' // === [section name] === '

// === Home ===
$app->get('/', function ($request, $response, $args) {

	// $this->logger->info("Spire homepage '/' route");

	$permissions = $request->getAttribute('spPermissions');

    if ($request->getAttribute('spAuth')) {
    	// return $this->renderer->render($response, 'home.php', [
    	//     'title' => 'OTS Spire Web App',
    	//     'page_name' => 'home',
    	//     'hideBreadcrumbs' => true,

    	//     //Auth Specific
    	//     'user' => $request->getAttribute('spAuth'),
	    //     'uAuth' => $permissions['auth'],
	    //     'uRole' => $permissions['role'],
	    //     'uAthMessage' => $permissions['uAthMessage']
    	// ]);
	    $uri = $request->getUri()->withPath($this->router->pathFor('dashboard'));
		return $response = $response->withRedirect($uri);
    } else {
	    $uri = $request->getUri()->withPath($this->router->pathFor('login-view'));
		return $response = $response->withRedirect($uri, 403);
    }

})->setName('home')->add( new SpireAuth() );


// === Dashboard ===
$app->group('/dashboard', function () use ($app) {
	$this->get('/main', function ($request, $response, $args) {

		$db = new DbHandler();
		$permissions = $request->getAttribute('spPermissions');

		// Today report data
		// Manifest
		$todayManifestTotalFailureReports = $db->getTestReportCount('api_manifest_audits', 'fail', 'today');

		// Nav
		$todayNavTotalFailureReports = $db->getTestReportCount('api_navigation_audits', 'fail', 'today');

		// Content
		$todayContentTotalFailureReports = $db->getTestReportCount('api_article_audits', 'fail', 'today');

	// echo '<style>.ts-sidebar {display: none;}</style>';
	// 	$man30Day = $db->getFailuresPer30Day('api_manifest_audits');
	// 	echo "---------------------------<br />";
	// 	$nav30Day = $db->getFailuresPer30Day('api_navigation_audits');
	// 	echo "---------------------------<br />";
	// 	$cont30Day = $db->getFailuresPer30Day('api_article_audits');

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
	        'todayManifestTotalFailureReports' => $todayManifestTotalFailureReports,
			'todayNavTotalFailureReports' => $todayNavTotalFailureReports,
			'todayContentTotalFailureReports' => $todayContentTotalFailureReports,
			'serverTimeStamp' => $current_date,
			'man30Day' => $man30Day,
			'nav30Day' => $nav30Day,
			'cont30Day' => $cont30Day,

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

		$__postVars = $request->getParsedBody();

	  	verifyRequiredParams(array('email', 'password'));

		// reading post params
		$email = $__postVars['email'];
		$uid = $__postVars['uid'];
		$password = $__postVars['password'];
		$new_password = $__postVars['new_password'];

		$formResponse = array();
		$uResponse = array();
		$db = new DbHandler();

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
	});
});


// === Reports ===
$app->group('/reports', function () {

	$this->get('/{view}', function ($request, $response, $args) {
		$db = new DbHandler();

		$permissions = $request->getAttribute('spPermissions');

		$testDir = 'test_results/'.$args['view'];

		// View path
		$__viewPath = $args['view']."/".$args['subView'];

		switch ($args['view']) {

		    case "main":
		        $mainView = true;
		        break;

		    case "overview":
		        $overView = true;
		        break;

		    case "api_article_audits":
		        $reportsView = true;
		        break;

		    case "api_navigation_audits":
		        $reportsView = true;
		        break;

	        case "api_manifest_audits":
	            $reportsView = true;
	            break;

            case "regression_tests":
                $regressionView = true;
                break;

		    default:
		        $testTypeName = 'none-existent';
		}

		if (! $mainView) {
			$allReports = $db->getAllTestResultData($args['view'], 'all', 'all');
			$todayReports = $db->getAllTestResultData($args['view'], 'all', 'today');
			$todayFailureReports = $db->getAllTestResultData($args['view'], 'fail', 'today');

			$yesterdayReports = $db->getAllTestResultData($args['view'], 'all', 'yesterday');
			$yesterdayFailureReports = $db->getAllTestResultData($args['view'], 'fail', 'yesterday');
			
			$yesterdayTotalWarnings = $db->getTestReportCount($args['view'], 'warning', 'yesterday');
			$yesterdayTotalErrors = $db->getTestReportCount($args['view'], 'fail', 'yesterday');

			$todayTotalWarnings = $db->getTestReportCount($args['view'], 'warning', 'today');
			$todayTotalErrors = $db->getTestReportCount($args['view'], 'fail', 'today');
			// var_dump($todayTotalErrors);
			
		}

        return $this->renderer->render($response, 'reports.php', [
            'title' => 'Reports',
            'page_name' => 'reports',
            'view' => $args['view'],
            'viewPath' => $args['view'],
            'mainView' => $mainView,
            'reportsView' => $reportsView,
            'singleView' => $singleView,
            'overView' => $overView,
            'regressionView' => $regressionView,
            'fileView' => $fileView,
            'reportClass' => true,
    		'allReports' => $allReports,
    		'todayReports' => $todayReports,
    		'todayFailureReports' => $todayFailureReports,
    		'yesterdayReports' => $yesterdayReports,
    		'yesterdayFailureReports' => $yesterdayFailureReports,
    		// 'yesterdayTotalWarningReports' => $yesterdayTotalWarningReports,
    		'todayTotalErrors' => $todayTotalErrors,
			'todayTotalWarnings' => $todayTotalWarnings,
			'yesterdayTotalErrors' => $yesterdayTotalErrors,
			'yesterdayTotalWarnings' => $yesterdayTotalWarnings,
			'regressionResults' => $regressionResults,
			'regressionTests' => $regressionTests,

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

    	$permissions = $request->getAttribute('spPermissions');

    	$allPostPutVars = $request->getQueryParams();
    	// Reporting Data
    	$allReports = $db->getAllTestResultData($args['view'], 'all', 'all');

		// View path
		$viewPath = $args['view']."/".$args['subView'];

		// Report View
		return $this->renderer->render($response, 'reports.php', [
		    'title' => ' All Reports',
		    'page_name' => 'reports',
		    'view' => 'all',
		    'viewPath' => $args['view'],
		    'fullPath' => $viewPath,
		    'allView' => true,
		    'reportClass' => true,
		    'allReports' => $allReports,

		    //Auth Specific
		    'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
		]);
    })->setName('report-subview')->add( new SpireAuth() );

    // Report View
    $this->get('/{view}/{subView}/{page}', function ($request, $response, $args) {
    	$db = new DbHandler();

    	$permissions = $request->getAttribute('spPermissions');

    	$allPostPutVars = $request->getQueryParams();
    	
    	// if ($args['view'] == 'regression_tests') {
    	// 	$currentRecord = $db->getTestDataById($args['page']);
    	// 	$recordViewType = $currentRecord['test_type'];
    	// 	$currentRecordResults = $currentRecord['results_data'];
    	// } else {
    	// 	$currentRecord = $db->getTestById($allPostPutVars['refID']);
    	// 	$currentRecordResults = $db->getCurrentTestResults($currentRecord['id'], $currentRecord['type'], $args['page']);
    	// 	$recordViewType = $currentRecord['type'];
    	// }

    	$currentRecord = $db->getTestDataById($args['page']);
    	$recordViewType = $currentRecord['test_type'];
    	$currentRecordResults = $currentRecord['results_data'];

		// View path
		$viewPath = $args['view']."/".$args['subView'];

		// Report View
		return $this->renderer->render($response, 'reports.php', [
		    'title' => 'Reports',
		    'page_name' => 'reports',
		    'view' => 'single',
		    'viewPath' => $args['view'],
		    'fullPath' => $viewPath,
		    'viewType' => $recordViewType,
		    'singleView' => true,
		    'reportClass' => true,
		    'reportID' => $currentRecord['id'],
		    'reportProperty' => $currentRecord['property'],
		    'reportData' => $currentRecordResults,
		    'fullReportData' => $currentRecord,

		    //Auth Specific
		    'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
		]);
    })->setName('report-subview')->add( new SpireAuth() );

});

// Scripting/Testing View
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

    	// Configure testing vars from POST config
	    	// Set stage flag
	    	if($allPostPutVars['enviroment'] == 'Stage') {
	    		$stageTesting = true;
	    	}

	    	// Set output flag
	    	if($allPostPutVars['output'] == 'console') {
	    		$__output = ' --output=console';
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
	    			$__tmpFile = './sites.txt';
	    		}
	    	}

	    	// Test all OTS sites
	    	if($allPostPutVars['brand_test'] == 'nbc') {
	    		shell_exec("rm ". $__tmpFile);
	    		if ($stageTesting) {
	    			$__tmpFile = './stage_sites-nbc.txt';
	    		} else {
	    			$__tmpFile = './sites-nbc.txt';
	    		}
	    	}

	    	// Test all TLM sites
	    	if($allPostPutVars['brand_test'] == 'telemundo') {
	    		shell_exec("rm ". $__tmpFile);
	    		if ($stageTesting) {
	    			$__tmpFile = './stage_sites-tsg.txt';
	    		} else {
	    			$__tmpFile = './sites-tsg.txt';
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
	    				$__data .= 'http://www.'.$__value.'.com';
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
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiCheck-manifest.js" --url="{}"'.$__output;
		} elseif ($__runScript == 'apiCheck-nav') {
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/apiCheck-nav.js" --url="{}"'.$__output;
		} elseif ($__runScript == 'regressionTest') {
		        $__runCommand = 'cat "' . $__tmpFile .'" | xargs -P1 -I{} casperjs test "'. BASEPATH .'/tests/regressionTest.js" --url="{}"'.$__output;
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


// === Help ===
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


// === Register ===
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

// === Admin ===
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

	// === Users Admin ===
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
			// var_dump($__postVars);
			// exit();

		 //  	verifyRequiredParams(array('email', 'password'));

			// // reading post params
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

	// === Stations Admin ===
	$app->group('/stations', function () use ($app) {
		$this->get('/main', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$db = new DbHandler();
			$stations = $db->getAllStations();

			return $this->renderer->render($response, 'admin-stations.php', [
		        'title' => 'Station Properties',
		        'page_name' => 'admin-stations',
		        'admin_stationsClass' => true,
		        'hideBreadcrumbs' => true,
		        'stationsView' => true,
		        'stations' => $stations,

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    // ]);
		    ]);
		})->setName('admin-users')->add( new SpireAuth() );


		$this->get('/update/{station_id}', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');
			$db = new DbHandler();
			// $users = $db->getAllUsers();

			$editingStation = $db->getStationById($args['station_id']);

			return $this->renderer->render($response, 'admin-stations.php', [
		        'title' => 'Station Settings',
		        'page_name' => 'admin-stations',
		        'admin_stationsClass' => true,
		        'hideBreadcrumbs' => false,
		        'stationEditView' => true,
		        'editingStation' => $editingStation[0],

		        //Auth Specific
		        'user' => $request->getAttribute('spAuth'),
		        'uAuth' => $permissions['auth'],
		        'uRole' => $permissions['role'],
		        'uAthMessage' => $permissions['uAthMessage']
		    ]);
		})->setName('admin-users')->add( new SpireAuth() );

		// == [POST] Update user information ==
		$this->post('/update/{station_id}', function ($request, $response, $args) {

			$permissions = $request->getAttribute('spPermissions');

			$__postVars = $request->getParsedBody();
			// var_dump($__postVars);
			// exit();

		 	//verifyRequiredParams(array('email', 'password'));

			// // reading post params
			$user_id = $__postVars['u_id'];
			$new_password = $__postVars['u_password'];
			$role = $__postVars['u_role'];
			$status = $__postVars['u_status'];
			$formResponse = array();
			$uResponse = array();
			$db = new DbHandler();

			// $editingUser = $db->getUserById($args['user_id']);

			// Update user information
			if ( $db->updateUser($user_id, $new_password, $role, $status) ) {
				$formResponse['error'] = false;
				$formResponse['message'] = 'User information updated';

			} elseif ( ! $db->updateUser($user_id, $new_password, $role, $status) ) {
				$formResponse['error'] = true;
				$formResponse['message'] = 'User information not updated. If page refresh, stahp';
			}

			return $this->renderer->render($response, 'admin.php', [
		        'title' => 'Station Settings',
		        'page_name' => 'admin-stations',
		        'admin_stationsClass' => true,
		        'hideBreadcrumbs' => false,
		        'stationEditView' => true,
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


// === Login ===
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

		var_dump($__postVars);
		

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

// === Logout ===
$app->get('/logout', function ($request, $response, $args) {
	$_SESSION['spUser'] = NULL;
	$uri = $request->getUri()->withPath($this->router->pathFor('login-view'));
	return $response = $response->withRedirect($uri, 403);
});

// === Utils ===
$app->group('/utils', function () {

	$this->get('/tasks', function ($request, $response, $args) {

		$db = new DbHandler();

		// Set necessary vars
		$utilReqParams = $request->getQueryParams();
		$randTestID = rand(0, 9999);

		$stationProperty = $utilReqParams['property'];

		$testType = $utilReqParams['testscript'];
		$testResultsFile = $utilReqParams['fileLoc'];

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

		///////////////////////////////////

		if ($createTestID) {
			// Create test ID
			$thisID = $db->createTestID($randTestID, $stationProperty, $testType, $testResultsFile);

			if ($thisID != NULL) {
				echo $thisID;
			} else {
				echo('che le derp');
			}
		}

		if ($uploadResultsFile) {
			// Updload results file

			echo "...importing csv to db<br />";

			// Check test type -- Needs refactoring
			if ($utilReqParams['testType'] == 'apiNav') {
				// $db->navigationAuditInsert($testResultsFile);
				// $thisupload = $db->navigationAuditInsert($testResultsFile);

				if ($db->navigationAuditInsert($testResultsFile)) {
					echo 'inserted';
					$this->logger->info("Nav Test results imported - ". $testResultsFile );
				} else {
					echo 'DB nav import failed';
					$this->logger->info("ERROR: DB nav import failed");
					Spire::sendEmailNotification('deltrie.allen@nbcuni.com', 'ERROR: DB nav import failed', 'Spire DB Import Error.');
				}
			}

			if ($utilReqParams['testType'] == 'apiArticle') {
				if ($db->articleAuditInsert($testResultsFile)) {
					echo 'Article test results imported';
					$this->logger->info("Article test results imported - ". $testResultsFile );
				} else {
					echo 'DB article import failed';
					$this->logger->info("ERROR: DB article import failed");
					Spire::sendEmailNotification('deltrie.allen@nbcuni.com', 'ERROR: DB article import failed', 'Spire DB Import Error.');
				}
			}

			if ($utilReqParams['testType'] == 'apiManifest') {
				if ($db->manifestAuditInsert($testResultsFile)) {
					echo 'inserted';
					$this->logger->info("Manifest test results imported - ". $testResultsFile );
				} else {
					echo 'DB manifest import failed';
					$this->logger->info("ERROR: DB manifest import failed");
					Spire::sendEmailNotification('deltrie.allen@nbcuni.com', 'ERROR: DB manifest import failed', 'Spire DB Import Error.');
				}
			}

		}

		if ($getDictionaryData) {
			$dData = $db->getManifestDictionaryData($stationProperty);
			// echo '<pre>';
			echo($dData[0]);
			// echo '</pre>';
		}


		// Force redirect
		// return $response->withRedirect('/dashboard/main');
    });

	// Manage test POST requests
    // $this->post('/manage_dictionary', function ($request, $response, $args) {
	$this->post('/{view}', function ($request, $response, $args) {
		$db = new DbHandler();

    	$utilPostParams = $request->getParsedBody();
    	
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
    		$results = $utilPostParams['testResults'];
    		$info = $utilPostParams['testInfo'];

    		$processManifestTestResults = $db->insertTestResults($testID, $testType, $station, $status, $testFailureCount, $results, $info);
    		
    		if ($processManifestTestResults){
    			$this->logger->info("Manifest test results logged: [testID=>". $testID .",station=>". $station .",testType=>". $testType .",testStatus=>". $status ."]");
    		}
    	}

    	if ($utilPostParams['taskType'] == 'api-notification') {
    		$db = new DbHandler();

    		$info = getdate();
    		$date = $info['mday'];
    		$month = $info['mon'];
    		$year = $info['year'];
    		$hour = $info['hours'];
    		$min = $info['minutes'];
    		$sec = $info['seconds'];

    		$current_date = "$month/$date//$year @ $hour:$min:$sec";

			// Build additional test result caches
			// Task will be hit every 20 min after the 4hr cron, pre-building db caches after job runs
			$todayManifestTotalFailureReports = $db->getTestReportCount('all', 'all', 'all');
			$todayManifestTotalFailureReports = $db->getTestReportCount('api_manifest_audits', 'all', 'all');
			$todayNavTotalFailureReports = $db->getTestReportCount('api_navigation_audits', 'all', 'all');
			$todayContentTotalFailureReports = $db->getTestReportCount('api_article_audits', 'all', 'all');

    		// Today report data
    		// Manifest
    		$todayManifestTotalFailureReports = $db->getTestReportCount('api_manifest_audits', 'fail', 'today');
    		$todayManifestTotalWarningReports = $db->getTestReportCount('api_manifest_audits', 'warning', 'today');

    		// Nav
    		$todayNavTotalFailureReports = $db->getTestReportCount('api_navigation_audits', 'fail', 'today');
    		$todayNavTotalWarningReports = $db->getTestReportCount('api_navigation_audits', 'warning', 'today');

    		// Content
    		$todayContentTotalFailureReports = $db->getTestReportCount('api_article_audits', 'fail', 'today');
    		$todayContentTotalWarningReports = $db->getTestReportCount('api_article_audits', 'warning', 'today');


    		// echo ($todayManifestTotalFailureReports, $todayNavTotalFailureReports, $todayContentTotalFailureReports);
    		$dashErrorTotals = array($todayManifestTotalFailureReports, $todayNavTotalFailureReports, $todayContentTotalFailureReports);

			if ( array_sum($dashErrorTotals) > 1 ) {
				$sendEmailNotification = true;
				$sendEmailNotificationType = 'Automation failures';
			}

			function setStatusColor($errorCount) {
				if ( $errorCount > 0) {
					$boxColor = "#cc0000";
				} else {
					$boxColor = "#93c54b";
				}
				return $boxColor;
			}

			// $emailRecipient = 'deltrie.allen@nbcuni.com';
			$emailRecipient = 'LIMQualityAssurance@nbcuni.com';

			$emailSubject = 'Automation Failures/Warnings';

    		$emailContent .= '<table align="center" width="500" cellpadding="10" style="text-align: center; border: 1px solid;">';
    		$emailContent .= '<tr><th colspan="3">Automation Error/Warnings</th></tr>';
    		$emailContent .= '<tr><td colspan="3"><a href="http://54.243.53.242/">Dashbaord</a></td></tr>';
    		$emailContent .= '<tr bgcolor="#ddd"><th>Manifest</th><th>Navigation</th><th>Content</th></tr>';
    		$emailContent .= '<tr style="color: #fff; text-align: center;"><td bgcolor="'.setStatusColor($todayManifestTotalFailureReports).'">'.$todayManifestTotalFailureReports.'</td>';
    		$emailContent .= '<td bgcolor="'.setStatusColor($todayNavTotalFailureReports).'">'.$todayNavTotalFailureReports.'</td>';
    		$emailContent .= '<td bgcolor="'.setStatusColor($todayContentTotalFailureReports).'">'.$todayContentTotalFailureReports.'</td></tr>';
    		$emailContent .= '<tr style="color: #000; text-align: center;"><td bgcolor="#ffd000">'.$todayManifestTotalWarningReports.'</td>';
    		$emailContent .= '<td bgcolor="#ffd000">'.$todayNavTotalWarningReports.'</td>';
    		$emailContent .= '<td bgcolor="#ffd000">'.$todayContentTotalWarningReports.'</td></tr>';
    		$emailContent .= '<tr bgcolor="#ddd"><td><a href="http://54.243.53.242/reports/api_manifest_audits">view reports</a></td><td><a href="http://54.243.53.242/reports/api_navigation_audits">view reports</a></td><td><a href="http://54.243.53.242/reports/api_article_audits">view reports</a></td></tr>';
    		$emailContent .= '<tr><td colspan="3"><p>The email will be sent every 4 hours following the cron, and is delayed 20 min to allow for all results to complete processing. </p></td></tr>';
    		$emailContent .= '<tr><td colspan="3"><p>*totals are at current UTC server time: '.$current_date.' </p></td></tr>';
    		$emailContent .= '</table>';

    		// echo $emailContent;

    	}

    	if ($utilPostParams['taskType'] == 'regression-notification') {
    		$db = new DbHandler();

    		$todayRegressionCronFailures = $db->getTestReportCount('regression_tests', 'fail', 'today');
    		// $emailRecipient = 'deltrie.allen@nbcuni.com';
    		$emailContent = 'LIMQualityAssurance@nbcuni.com';
    		$sendEmailNotification = true;
    		$emailSubject = 'Automation Regression '.$utilPostParams['taskRef'];
    		$emailContent .= 'Regression cron process: '.$utilPostParams['taskRef'].'ed';

    		if ($utilPostParams['regression-alert'] == 'end') {
    			$emailContent .= '<br /> Process completed. Total Errors: '. $todayRegressionCronFailures;
    			$emailContent .= '<br /> - <a href="http://54.243.53.242/reports/regression_tests">view reports</a>';
    		}
    	}

    	if ($sendEmailNotification) {
    		$this->logger->info("Alert notification email sent; type: ". $utilPostParams['taskType'] . ", process: " . $utilPostParams['taskRef'] . ", note: " . $utilPostParams['logNote']);
    		// Spire::sendEmailNotification($emailRecipient, $emailContent, $emailSubject);
    		// echo($emailRecipient."<br />".$emailContent."<br />".$emailSubject);
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

		$tmpLocation = BASEPATH .'/tmp/';
		
		$cacheClear = Spire::purgeAllCache($tmpLocation);

		return $response->withRedirect('/dashboard/main');
    });
    
    $this->get('/fake-data', function ($request, $response) {
    	echo '{  
   "metadata":{  
      "dateGenerated":"Mon Mar 20 11:13:55 PDT 2017"
   },
   "items":[  
      {  
         "navigationID":279291762,
         "title":"Home",
         "appTitle":"Home",
         "pageTitle":"Home",
         "trackingName":"home",
         "type":"home",
         "featureCategory":"",
         "location":"/apps/news-app/home/modules/",
         "sectionMapping":"/apps/news-app/home/modules/",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":279045121,
         "title":"News",
         "appTitle":"News",
         "pageTitle":"News",
         "trackingName":"news",
         "type":"section",
         "featureCategory":"",
         "location":"/apps/news-app/?location=/news",
         "sectionMapping":"/news",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":"",
         "items":[  
            {  
               "navigationID":279051571,
               "title":"Top News",
               "appTitle":"Top News",
               "pageTitle":"Top News",
               "sectionMapping":"/news/top-stories",
               "trackingName":"top news",
               "type":"subsection",
               "location":"/apps/news-app/?location=/news/top-stories",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":279052021,
               "title":"Local",
               "appTitle":"Local",
               "pageTitle":"Local",
               "sectionMapping":"/news/local/",
               "trackingName":"local",
               "type":"subsection",
               "location":"/apps/news-app/?location=/news/local/",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":384122421,
               "title":"Top Video",
               "appTitle":"Top Video",
               "pageTitle":"Top Video",
               "sectionMapping":"/home/top-videos/",
               "trackingName":"top video",
               "type":"subsection",
               "location":"/apps/news-app/?location=/home/top-videos/",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":279052431,
               "title":"US & World",
               "appTitle":"US & World",
               "pageTitle":"US & World",
               "sectionMapping":"/news/national-international/",
               "trackingName":"us & world",
               "type":"subsection",
               "location":"/apps/news-app/?location=/news/national-international/",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":280036812,
               "title":"Investigations",
               "appTitle":"Investigations",
               "pageTitle":"Investigations",
               "sectionMapping":"/apps/news-app/investigations/modules",
               "trackingName":"investigations",
               "type":"subsection",
               "location":"/apps/news-app/investigations/modules",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":311308251,
               "title":"Sports",
               "appTitle":"Sports",
               "pageTitle":"Sports",
               "sectionMapping":"/news/sports",
               "trackingName":"sports",
               "type":"subsection",
               "location":"/apps/news-app/?location=/news/sports",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":311210521,
               "title":"Recall Alert",
               "appTitle":"Recall Alert",
               "pageTitle":"Recall Alert",
               "sectionMapping":"/feature/recall-alert",
               "trackingName":"recall alert",
               "type":"subsection",
               "location":"/apps/news-app/?location=/feature/recall-alert",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":392923741,
               "title":"TV Listings",
               "appTitle":"TV Listings",
               "pageTitle":"TV Listings",
               "sectionMapping":"",
               "trackingName":"",
               "type":"link",
               "location":"http://www.nbcnewyork.com/contact-us/tv-listings/tv-listings-nyc.html",
               "phoneContact":"",
               "emailContact":""
            }
         ]
      },
      {  
         "navigationID":279047641,
         "title":"Weather",
         "appTitle":"Weather",
         "pageTitle":"Weather",
         "trackingName":"weather",
         "type":"weather-forcast",
         "featureCategory":"",
         "location":"/apps/news-app/weather/modules/",
         "sectionMapping":"/apps/news-app/weather/modules/",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":"",
         "items":[  
            {  
               "navigationID":279325042,
               "title":"Forecast",
               "appTitle":"Forecast",
               "pageTitle":"Forecast",
               "sectionMapping":"/apps/news-app/weather/modules",
               "trackingName":"forecast",
               "type":"weather-forcast",
               "location":"/apps/news-app/?location=/apps/news-app/weather/modules",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":279949142,
               "title":"Weather Alerts",
               "appTitle":"Weather Alerts",
               "pageTitle":"Weather Alerts",
               "sectionMapping":"",
               "trackingName":"weather alerts",
               "type":"weather-alerts",
               "location":"http://www.nbcnewyork.com/weather/severe-weather-alerts/?appenv=y&disableHeader=true&disableDownloadApp=true",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":279948952,
               "title":"School Closings",
               "appTitle":"School Closings",
               "pageTitle":"School Closings",
               "sectionMapping":"",
               "trackingName":"school closings",
               "type":"weather-school-closings",
               "location":"http://www.nbcnewyork.com/weather/school-closings/?appenv=y&disableHeader=true&disableDownloadApp=true",
               "phoneContact":"",
               "emailContact":""
            }
         ]
      },
      {  
         "navigationID":292319771,
         "title":"Watch Live TV Now",
         "appTitle":"Watch Live TV Now",
         "pageTitle":"Watch Live TV Now",
         "trackingName":"watch live tv now",
         "type":"link",
         "featureCategory":"",
         "location":"tve://",
         "sectionMapping":"",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":410936505,
         "title":"First 100 Days",
         "appTitle":"First 100 Days",
         "pageTitle":"First 100 Days",
         "trackingName":"first 100 days",
         "type":"FeaturePage2.0",
         "featureCategory":"",
         "location":"/apps/news-app/?location=/feature/president-trump/inauguration&feature2Content=404991195",
         "sectionMapping":"/feature/president-trump/inauguration",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":244736941,
         "title":"Traffic",
         "appTitle":"Traffic",
         "pageTitle":"Traffic",
         "trackingName":"traffic",
         "type":"link",
         "featureCategory":"",
         "location":"http://www.nbcnewyork.com/traffic/?appenv=y&disableHeader=true&disableDownloadApp=true",
         "sectionMapping":"",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":279048311,
         "title":"Entertainment",
         "appTitle":"Entertainment",
         "pageTitle":"Entertainment",
         "trackingName":"entertainment",
         "type":"section",
         "featureCategory":"",
         "location":"/apps/news-app/?location=/entertainment",
         "sectionMapping":"/entertainment",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":"",
         "items":[  
            {  
               "navigationID":279089341,
               "title":"Top Entertainment",
               "appTitle":"Top Entertainment",
               "pageTitle":"Top Entertainment",
               "sectionMapping":"/entertainment/top-stories",
               "trackingName":"top entertainment",
               "type":"subsection",
               "location":"/apps/news-app/?location=/entertainment/top-stories",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":413858423,
               "title":"New York Live",
               "appTitle":"New York Live",
               "pageTitle":"New York Live",
               "sectionMapping":"/feature/new-york-live",
               "trackingName":"new york live",
               "type":"subsection",
               "location":"/apps/news-app/?location=/feature/new-york-live",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":280038352,
               "title":"In The Wings",
               "appTitle":"In The Wings",
               "pageTitle":"In The Wings",
               "sectionMapping":"/feature/in-the-wings",
               "trackingName":"in the wings",
               "type":"subsection",
               "location":"/apps/news-app/?location=/feature/in-the-wings",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":279089371,
               "title":"The Scene",
               "appTitle":"The Scene",
               "pageTitle":"The Scene",
               "sectionMapping":"/entertainment/the-scene",
               "trackingName":"the scene",
               "type":"subsection",
               "location":"/apps/news-app/?location=/entertainment/the-scene",
               "phoneContact":"",
               "emailContact":""
            },
            {  
               "navigationID":279060011,
               "title":"Entertainment News",
               "appTitle":"Entertainment News",
               "pageTitle":"Entertainment News",
               "sectionMapping":"/entertainment/entertainment-news",
               "trackingName":"entertainment news",
               "type":"subsection",
               "location":"/apps/news-app/?location=/entertainment/entertainment-news",
               "phoneContact":"",
               "emailContact":""
            }
         ]
      },
      {  
         "navigationID":279047251,
         "title":"Investigations",
         "appTitle":"Investigations",
         "pageTitle":"Investigations",
         "trackingName":"investigations",
         "type":"section",
         "featureCategory":"",
         "location":"/apps/news-app/investigations/modules",
         "sectionMapping":"/apps/news-app/investigations/modules",
         "subNavigationPath":"",
         "phoneContact":"1-866-639-7244",
         "emailContact":"tips@nbcnewyork.com",
         "items":[  
            {  
               "navigationID":299722851,
               "title":"Top Investigations",
               "appTitle":"Top Investigations",
               "pageTitle":"Top Investigations",
               "sectionMapping":"/apps/news-app/investigations/modules",
               "trackingName":"top investigations",
               "type":"subsection",
               "location":"/apps/news-app/investigations/modules",
               "phoneContact":"1-866-639-7244",
               "emailContact":"tips@nbcnewyork.com"
            }
         ]
      },
      {  
         "navigationID":311308251,
         "title":"Sports",
         "appTitle":"Sports",
         "pageTitle":"Sports",
         "trackingName":"sports",
         "type":"section",
         "featureCategory":"",
         "location":"/apps/news-app/?location=/news/sports",
         "sectionMapping":"/news/sports",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":368047671,
         "title":"Better Get Baquero",
         "appTitle":"Better Get Baquero",
         "pageTitle":"Better Get Baquero",
         "trackingName":"better get baquero",
         "type":"FeaturePage2.0",
         "featureCategory":"Consumer",
         "location":"/apps/news-app/?location=/feature/better-get-baquero&feature2Content=365441091",
         "sectionMapping":"/feature/better-get-baquero",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":279488652,
         "title":"Submit Photos/Videos",
         "appTitle":"Submit Photos/Videos",
         "pageTitle":"Submit Photos/Videos",
         "trackingName":"submit photos/videos",
         "type":"submit-media",
         "featureCategory":"",
         "location":"/apps/news-app/submit-your-photos-videos",
         "sectionMapping":"/apps/news-app/submit-your-photos-videos",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":279488462,
         "title":"Contact Us",
         "appTitle":"Contact Us",
         "pageTitle":"Contact Us",
         "trackingName":"contact us",
         "type":"contact-us",
         "featureCategory":"",
         "location":"/apps/news-app/contact-us",
         "sectionMapping":"/apps/news-app/contact-us",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":415890733,
         "title":"NBC Live FAQ",
         "appTitle":"NBC Live FAQ",
         "pageTitle":"NBC Live FAQ",
         "trackingName":"",
         "type":"link",
         "featureCategory":"",
         "location":"http://www.nbcnewyork.com/on-air/about-us/NBC-Live-TV-FAQ-415882193.html",
         "sectionMapping":"",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      },
      {  
         "navigationID":362656271,
         "title":"App FAQ",
         "appTitle":"App FAQ",
         "pageTitle":"App FAQ",
         "trackingName":"",
         "type":"link",
         "featureCategory":"",
         "location":"http://bit.ly/1P8oFgw",
         "sectionMapping":"",
         "subNavigationPath":"",
         "phoneContact":"",
         "emailContact":""
      }
   ]
}';
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
			return $response->withRedirect('/utils/purgeResults?auto=y');
    	}

    	return $response->withRedirect('/dashboard/main');

    });

});

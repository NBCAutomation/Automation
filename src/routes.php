<?php
// Routes
// Notes:
// ' // === [section name] === '

// === Home ===
$app->get('/', function ($request, $response, $args) {
	
	$this->logger->info("Spire homepage '/' route");

	$permissions = $request->getAttribute('spPermissions');

    if ($request->getAttribute('spAuth')) {
    	return $this->renderer->render($response, 'home.php', [
    	    'title' => 'OTS Spire Web App',
    	    'page_name' => 'home',
    	    'hideBreadcrumbs' => true,

    	    //Auth Specific
    	    'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
    	]);	
    } else {
	    $uri = $request->getUri()->withPath($this->router->pathFor('login-view'));
		return $response = $response->withRedirect($uri, 403);
    }

})->setName('home')->add( new SpireAuth() );


// === Dashboard ===
$app->group('/dashboard', function () use ($app) {
	$this->get('/main', function ($request, $response, $args) {
		
		$permissions = $request->getAttribute('spPermissions');

		return $this->renderer->render($response, 'home.php', [
	        'title' => 'Dashboard',
	        'page_name' => 'home',
	        'dashClass' => true,
	        'hideBreadcrumbs' => true,
	        
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
	})->setName('dashboard')->add( new SpireAuth() );

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

		// $getReports = $db->getAllTests('20');
		$getReports = $db->getAllTestByType($args['view']);

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

		    default:
		        $testTypeName = 'none-existent';
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
            'fileView' => $fileView,
            'reportClass' => true,
    		'results' => $getReports,
    		
    		//Auth Specific
    		'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
        ]);
    })->setName('directory-reports-view')->add( new SpireAuth() );

    
    $this->get('/{view}/{subView}/{page}', function ($request, $response, $args) {
    	$db = new DbHandler();

    	$permissions = $request->getAttribute('spPermissions');


    	$allPostPutVars = $request->getQueryParams();
    	$currentRecord = $db->getTestById($args['page']);

    	$currentRecordResults = $db->getCurrentTestResults($currentRecord['id'], $currentRecord['type']);

		// View path
		$__viewPath = $args['view']."/".$args['subView'];

		// Report View
		return $this->renderer->render($response, 'reports.php', [
		    'title' => 'Reports',
		    'page_name' => 'reports',
		    'view' => 'single',
		    'viewPath' => $args['view'],
		    'viewType' => $currentRecord['type'],
		    'singleView' => true,
		    'reportClass' => true,
		    'reportID' => $currentRecord['id'],
		    'reportData' => $currentRecordResults,
		    
		    //Auth Specific
		    'user' => $request->getAttribute('spAuth'),
	        'uAuth' => $permissions['auth'],
	        'uRole' => $permissions['role'],
	        'uAthMessage' => $permissions['uAthMessage']
		]);
    })->setName('reports-view')->add( new SpireAuth() );

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
    	$permissions = $request->getAttribute('spPermissions');

    	// Temp File
    	$__tmpFile = './tmp/__tempSites_'. rand() .'.txt';
    	$__data = file_get_contents($__tmpFile);
    	// var_dump($__tmpFile);


    	$allPostPutVars = $request->getParsedBody();

    	foreach($allPostPutVars as $key => $param){
    		var_dump($key, $param);

    		if ($key == 'script') {
    			$__runScript = $param;
    		}

    		if ($key == 'output'){
    			$__output = ' --output=console';
    		}

	    	if ($key == 'brand_test' && $param == 'all') {
	    		shell_exec("rm ". $__tmpFile);
	    		$__tmpFile = './sites.txt';
	    	} elseif ($key == 'brand_test' && $param == 'nbc') {
	    		shell_exec("rm ". $__tmpFile);
	    		$__tmpFile = './sites-nbc.txt';
	    	} elseif ($key == 'brand_test' && $param == 'telemundo') {
	    		shell_exec("rm ". $__tmpFile);
	    		$__tmpFile = './sites-tsg.txt';
	    	} else {
	    		$writeTempFile = true;
	    		if ($key == 'test_site' && is_array($param)) {
					foreach ($param as $__key => $__value) {
						$__data .= 'http://www.'.$__value.'.com';
						$__data .= "\r\n";
					}
				}
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
			$__runCommand = 'cat ' . $__tmpFile .' | xargs -P1 -I{} '. BASEPATH .'/run.sh apiCheck-manifest --url="{}"'.$__output;
		} elseif ($__runScript == 'apiCheck-nav') {
			$__runCommand = 'cat ' . $__tmpFile .' | xargs -P1 -I{} '. BASEPATH .'/run.sh apiCheck-nav --url="{}"'.$__output;
		}

		sleep(1);

		$setThisEnv = getenv('PATH');

		if ($request->isPost()) {
	        return $this->renderer->render($response, 'scripts.php', [
	            'title' => 'Scripts & Tests',
		        'page_name' => 'scripts',
		        'view' => $args['view'],
		        'viewPath' => $args['view'],
		        'scriptRunView' => true,
		        'scriptClass' => true,
		        'setEnv' => putenv("PATH={$setThisEnv}:/usr/local/bin"),
		        // 'setEnv' => putenv("PATH={$setThisEnv}"),
				'execCmd' => $__runCommand,
				'delCmd' => $__delCMD
	        ]);
	    }
    })->setName('scripts-run');
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
		        'hideBreadcrumbs' => true,
		        'stationEditView' => true,
		        'editingStation' => $editingStation,
		        
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
		        'hideBreadcrumbs' => true,
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


	$this->post('/{view}', function ($request, $response, $args) {

		$__postVars = $request->getParsedBody();

	  	verifyRequiredParams(array('email', 'password'));
	  
		// reading post params
		$email = $__postVars['email'];
		$password = $__postVars['password'];
		$formResponse = array();
		$uResponse = array();
		$db = new DbHandler();

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
		
		if ($utilReqParams['task'] == 'generate'){
			$createTestID = true;
		}

		if ($utilReqParams['task'] == 'upload'){
			$uploadResultsFile = true;
		}

		if ($createTestID) {
			// Create test ID
			$thisID = $db->createTestID($randTestID, $stationProperty, $testType);

			if ($thisID != NULL) {
				echo $thisID;
			} else {
				echo('che le derp');
			}	
		} elseif ($uploadResultsFile) {
			// Updload results file
			$testResultsFile = $utilReqParams['fileLoc'];

			echo "...importing csv to db<br />";

			// Check test type -- Needs refactoring
			if ($utilReqParams['testType'] == 'apiNav') {
				$db->navigationAuditInsert($testResultsFile);
				// $thisupload = $db->navigationAuditInsert($testResultsFile);	
				if ($db->navigationAuditInsert($testResultsFile)) {
					echo 'inserted';
					$this->logger->info("Nav Test results imported");
				} else {
					echo 'fail insert';
					$this->logger->info("DB import failed");
				}
			}

			if ($utilReqParams['testType'] == 'apiArticle') {
				if ($db->articleAuditInsert($testResultsFile)) {
					echo 'Article test results imported';
					$this->logger->info("Article test results imported");
				} else {
					echo 'DB import failed';
					$this->logger->info("DB import failed");
				}
			}

			if ($utilReqParams['testType'] == 'apiManifest') {
				$db->manifestAuditInsert($testResultsFile);

				if ($db->manifestAuditInsert($testResultsFile)) {
					echo 'inserted';
					$this->logger->info("Manifest test results imported");
				} else {
					echo 'fail insert';
					$this->logger->info("DB import failed");
				}
			}

		} else {
			return $this->renderer->render($response, 'utils.php', [
			    'title' => 'Utils',
			    'page_name' => 'utils',
			    'mainView' => true,
			    'hideBreadcrumbs' => true
			]);	
		}

		//POST or PUT
		// $allPostPutVars = $request->getParsedBody();
		// foreach($allPostPutVars as $key => $param){
		//    //POST or PUT parameters list
		//    var_dump($key.' => '.$param);
		// }
    });

    $this->get('/download', function ($request, $response) {
    	$allPostPutVars = $request->getQueryParams();

		$file = $allPostPutVars['file'];
		$__tempFile = __DIR__.'/../html/tmp/'.$file;
		return mhndev\slimFileResponse\FileResponse::getResponse($response, $__tempFile);
    });
});
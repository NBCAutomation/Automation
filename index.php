<?php
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', TRUE);

use Slim\Views\PhpRenderer;
use Dflydev\FigCookies\FigResponseCookies;

define("BASEPATH", __DIR__);

require_once __DIR__.'/libraries/Base/dbHandler.php';
require_once __DIR__.'/libraries/Base/passHash.php';
require_once __DIR__.'/libraries/Base/utils.php';
require_once __DIR__.'/vendor/autoload.php';

// print_r(get_declared_classes());

// Get container
$container = new \Slim\Container;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$container = new \Slim\Container($configuration);

// Register component on container
$container['view'] = function ($container) {
    return new \Slim\Views\PhpRenderer('./views/');
};

$container['cache'] = function () {
    return new \Slim\HttpCache\CacheProvider();
};

$app = new \Slim\App($container);
// $app->add(new \Slim\HttpCache\Cache('public', 10800));



// ************
// Views
// ************

// Login
$app->get('/', function ($request, $response, $args) {
    return $this->view->render($response, 'login.php', [
        'title' => 'OTS Spire Web App',
        'page_name' => 'home'
    ]);
})->setName('login');

// Homepage
$app->get('/home', function ($request, $response, $args) {
    return $this->view->render($response, 'home.php', [
        'title' => 'OTS Spire Web App',
        'page_name' => 'home',
        'dashClass' => true
    ]);
})->setName('home');

// Reports View
$app->group('/reports', function () {

	$this->get('/{view}', function ($request, $response, $args) {
		$testDir = 'test_results/'.$args['view'];

		$files_array = Spire::dirToArray($testDir);

		// View path
		$__viewPath = $args['view']."/".$args['subView'];

        return $this->view->render($response, 'reports.php', [
            'title' => 'Reports',
            'page_name' => 'reports',
            'view' => $args['view'],
            'viewPath' => $args['view'],
            'mainView' => true,
            'reportClass' => true,
    		'results' => $files_array,
        ]);
    })->setName('directory-reports-view');

    
    $this->get('/{view}/{subView}/{page}', function ($request, $response, $args) {
    	
    	// Individual report url
    	$__report = __DIR__ . "/test_results/" . $args['view']."/".$args['subView']."/".$args['page'];
		$__reportData = Spire::readCSV($__report);

		// Report Directory location
		$__reportDir = __DIR__ . "/test_results/" . $args['view']."/".$args['subView'];
		$__repoDir = Spire::dirFilesToArray($__reportDir);

		// View path
		$__viewPath = $args['view']."/".$args['subView'];

    	if ($args['page'] != 'main') {
    		// Report View
    		return $this->view->render($response, 'reports.php', [
    		    'title' => 'Reports',
    		    'page_name' => 'reports',
    		    'view' => 'single',
    		    'viewPath' => $__viewPath.'/'.$args['page'],
		        'linkPath' => $__reportDir,
    		    'singleView' => true,
    		    'reportClass' => true,
    		    'reportData' => $__reportData
    		]);
    	} elseif ($args['page']) {
    		// Report Directory View

		    return $this->view->render($response, 'reports.php', [
		        'title' => 'Reports',
		        'page_name' => 'reports',
		        'view' => 'single',
		        'fileView' => true,
		        'reportClass' => true,
		        'viewPath' => $__viewPath,
		        'linkPath' => $__reportDir,
		        'results' => $__repoDir
		    ]);
    	}
    })->setName('reports-view');
});

// Scripting/Testing View
$app->group('/scripts', function () {

	$this->get('/{view}', function ($request, $response, $args) {
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

	        return $this->view->render($response, 'scripts.php', [
	            'title' => 'Scripts & Tests',
	            'page_name' => 'scripts',
	            'view' => $args['view'],
	            'viewPath' => $args['view'],
	            'scriptView' => true,
	            'scriptClass' => true,
	    		'results' => $files_array,
	    		'configureOutput' => $showOutput
	        ]);
	    } else {
	    	// View path
			$__viewPath = $args['view']."/".$args['subView'];

	        return $this->view->render($response, 'scripts.php', [
	            'title' => 'Scripts & Tests',
	            'page_name' => 'scripts',
	            'view' => $args['view'],
	            'viewPath' => $args['view'],
	            'mainView' => true,
	            'scriptClass' => true,
	    		'results' => $files_array,
	    		'configureOutput' => $showOutput
	        ]);
	    }
    })->setName('scripts-main-view');


    $this->post('/{view}', function ($request, $response, $args) {
    	// Temp File
    	$__tmpFile = './tmp/__tempSites_'. rand() .'.txt';
    	$__data = file_get_contents($__tmpFile);

    	$allPostPutVars = $request->getParsedBody();

    	foreach($allPostPutVars as $key => $param){

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
			$__runCommand = 'cat ' . $__tmpFile .' | xargs -P1 -I{} '. __DIR__ .'/run.sh apiCheck-manifest --url="{}"'.$__output;
		} elseif ($__runScript == 'apiCheck-nav') {
			$__runCommand = 'cat ' . $__tmpFile .' | xargs -P1 -I{} '. __DIR__ .'/run.sh apiCheck-nav --url="{}"'.$__output;
		}

		sleep(1);

		$setThisEnv = getenv('PATH');

		if ($request->isPost()) {
	        return $this->view->render($response, 'scripts.php', [
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

// Help
$app->get('/help', function ($request, $response, $args) {
    return $this->view->render($response, 'help.php', [
        'title' => 'Help',
        'page_name' => 'help'
    ]);
})->setName('help');



/**
*  User registration
*  url - /register
*  method - POST
*  params - name, email, password
*/
$app->group('/register', function () {

	$this->get('/{view}', function ($request, $response, $args) {

        return $this->view->render($response, 'register.php', [
            'title' => 'Register',
            'page_name' => 'register',
            'view' => $args['view'],
            'viewPath' => $args['view'],
            'mainView' => true,
            'hideBreadcrumbs' => true
        ]);
    })->setName('register-view');


	// $this->post('/{view}', function() use ($request, $response, $args, $app) {
	$this->post('/{view}', function ($request, $response, $args) {
		// var_dump($request->getParsedBody());

		$__postVars = $request->getParsedBody();

		// reading post params
		$name = $__postVars['name'];
		$email = $__postVars['email'];
		$password = $__postVars['password'];

		// check for required params
		verifyRequiredParams(array('name', 'email', 'password'));
		
		$formResponse = array();
		
		// validating email address
		validateEmail($email);
		$db = new DbHandler();
		$res = $db->createUser($name, $email, $password);

		if ($res) {
			if ($res == 'USER_CREATED_SUCCESSFULLY') {
				$formResponse["error"] = false;
				$formResponse["message"] = "You are successfully registered";
			} else if ($res == 'USER_CREATE_FAILED') {
				$formResponse["error"] = true;
				$formResponse["message"] = "An error occurred while registereing";
			} else if ($res == 'USER_ALREADY_EXISTED') {
				$formResponse["error"] = true;
				$formResponse["message"] = "This email has already been registered.";
			}

	        return $this->view->render($response, 'register.php', [
	            'title' => 'Register',
	            'page_name' => 'register',
	            'view' => $args['view'],
	            'viewPath' => $args['view'],
	            'mainView' => true,
	            'messages' => $formResponse["message"]
	        ]);
		} else {
			echo 'Failed creation response.';
		}
	});
});

/**
* User Login
* url - /login
* method - POST
* params - email, password
*/
$app->group('/login', function () {

	$this->get('/{view}', function ($request, $response, $args) {

        return $this->view->render($response, 'login.php', [
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
		$db = new DbHandler();

		// check for correct email and password
		if ($db->checkLogin($email, $password)) {
			// get the user by email
			$user = $db->getUserByEmail($email);

			return $this->view->render($response, 'login.php', [
			    'title' => 'Login',
			    'page_name' => 'login',
			    'view' => $args['view'],
			    'viewPath' => $args['view'],
			    'mainView' => true,
			    'user' => $user,
			    'hideBreadcrumbs' => true
			]);
		} else {
		  // user credentials are wrong
		  $formResponse['error'] = true;
		  $formResponse['message'] = 'Login failed. Incorrect credentials';
		}
	  
	  echoResponse(200, $formResponse);
	});
});

/**
* Creating new task in db
* method POST
* params - name
* url - /tasks/
*/
$app->post('/tasks', 'authenticate', function() use ($app){
  verifyRequiredParams(array('task'));
  $formResponse = array();
  $task = $app->request->post('task');
  global $user_id;
  $db = new DbHandler();
  // creating new task
  $task_id = $db->createTask($user_id, $task);
  if ($task_id != NULL) {
      $formResponse["error"] = false;
      $formResponse["message"] = "Task created successfully";
      $formResponse["task_id"] = $task_id;
  } else {
      $formResponse["error"] = true;
      $formResponse["message"] = "Failed to create task. Please try again";
  }
  echoResponse(201, $formResponse);
});
/**
* Listing all tasks of particular user
* method GET
* url /tasks
*/
$app->get('/tasks', 'authenticate', function(){
  global $user_id;
  $formResponse = array();
  $db = new DbHandler();
  // fetching all user tasks
  $result = $db->getAllUserTasks($user_id);
  $formResponse["error"] = false;
  $formResponse["tasks"] = array();
  // looping through result and preparing tasks array
  while ($task = $result->fetch_assoc()) {
      $tmp = array();
      $tmp["id"] = $task["id"];
      $tmp["task"] = $task["task"];
      $tmp["status"] = $task["status"];
      $tmp["createdAt"] = $task["created_at"];
      array_push($formResponse["tasks"], $tmp);
  }
  echoResponse(200, $formResponse);
});
/**
* Listing single task of particular user
* method GET
* url /tasks/:id
* Return 404 if task doesn't belong to user
*/
$app->get('/tasks/:task_id', 'authenticate', function($task_id){
  global $user_id;
  $formResponse = array();
  $db = new DbHandler();
  // fetch task
  $result = $db->getTask($task_id, $user_id);
  if ($result != NULL) {
      $formResponse["error"] = false;
      $formResponse["id"] = $result["id"];
      $formResponse["task"] = $result["task"];
      $formResponse["status"] = $result["status"];
      $formResponse["createdAt"] = $result["created_at"];
      echoResponse(200, $formResponse);
  } else {
      $formResponse["error"] = true;
      $formResponse["message"] = "The requested resource doesn't exists";
      echoResponse(404, $formResponse);
  }
});
/**
* Updating existing task
* method PUT
* params task, status
* url - /tasks/:id
*/
$app->put('/tasks/:task_id', 'authenticate', function($task_id) use($app) {
  verifyRequiredParams(array('task', 'status'));
  global $user_id;
  $task = $app->request->put('task');
  $status = $app->request->put('status');
  $db = new DbHandler();
  $formResponse = array();
  // updating task
  $result = $db->updateTask($user_id, $task_id, $task, $status);
  if ($result) {
      // task updated successfully
      $formResponse["error"] = false;
      $formResponse["message"] = "Task updated successfully";
  } else {
      // task failed to update
      $formResponse["error"] = true;
      $formResponse["message"] = "Task failed to update. Please try again!";
  }
  echoResponse(200, $formResponse);
});
/**
 * Deleting task. Users can delete only their tasks
 * method DELETE
 * url /tasks
 */
$app->delete('/tasks/:task_id', 'authenticate', function($task_id) use($app) {
    global $user_id;
    $db = new DbHandler();
    $formResponse = array();
    $result = $db->deleteTask($user_id, $task_id);
    if ($result) {
        // task deleted successfully
        $formResponse["error"] = false;
        $formResponse["message"] = "Task deleted succesfully";
    } else {
        // task failed to delete
        $formResponse["error"] = true;
        $formResponse["message"] = "Task failed to delete. Please try again!";
    }
    echoResponse(200, $formResponse);
});

// ==============================================




// Run app
$app->run();
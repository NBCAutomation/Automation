<?php
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', FALSE);

use Slim\Views\PhpRenderer;

define("BASEPATH", __DIR__);

require_once __DIR__.'/libraries/Base/dbHandler.php';
require_once __DIR__.'/libraries/Base/passHash.php';
require_once __DIR__.'/libraries/Base/utils.php';

require_once __DIR__.'/vendor/autoload.php';

// Get container
$container = new \Slim\Container;

// Register component on container
$container['view'] = function ($container) {
    return new \Slim\Views\PhpRenderer('./views/');
};

$container['cache'] = function () {
    return new \Slim\HttpCache\CacheProvider();
};

$app = new \Slim\App($container);
// $app->add(new \Slim\HttpCache\Cache('public', 10800));

function dirFilesToArray($dir) {

	$result = array(); 

	$cdir = scandir($dir);

	foreach ($cdir as $key => $value) {
		if ( !in_array($value,array(".","..")) ) {

			if ( is_dir($dir . DIRECTORY_SEPARATOR . $value) ) {
				$result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
			} else {
				$result[] = $value;
			}
		}
	}
	return $result;
}

function readCSV($__file) {
	$row = 1;
	$fails = 0;

	$__fileData;

	$__fileData .= "<table class=\"table table-bordered table-striped\">";

	if (($handle = fopen($__file, "r")) !== FALSE) {
	    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	        $num = count($data);
	        $row++;

	        $__fileData .= "<tr>";

	        for ($c = 0; $c < $num; $c++) {
	        	
	        	if (strpos($data[$c], 'Fail') !== false || strpos($data[$c], 'FAIL') !== false) {
	        		$fails++;
	        		$__class = 'class="test_fail" ';
	        	} else {
	        		$__class = '';
	        	}

	        	if (!empty($data[$c])) {
	        		if ($row < 5) {
	        			$__fileData .= "<td colspan=\"5\">" . $data[$c] . "</td>";
	        		} else {
	        			if ($row < 7) {
	        				$__fileData .= "<td>" . $data[$c] . "</td>";
		        		} else {
		        			$__fileData .= "<td ". $__class .">" . $data[$c] . "</td>";
		        		}
	        		}
	        	}
	        }
	        $__fileData .= "</tr>";
	    }
	    fclose($handle);
	}
	$__fileData .= "</table>";
	return $__fileData;
}

function dirToArray($dir) {

	$result = array(); 

	$cdir = scandir($dir);

	foreach ($cdir as $key => $value) {
		if ( !in_array($value,array(".","..")) ) {

			if ( is_dir($dir . DIRECTORY_SEPARATOR . $value) ) {
				$result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
			}
		}
	}
	return $result;
}

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

		$files_array = dirToArray($testDir);

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
		$__reportData = readCSV($__report);

		// Report Directory location
		$__reportDir = __DIR__ . "/test_results/" . $args['view']."/".$args['subView'];
		$__repoDir = dirFilesToArray($__reportDir);

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

		$files_array = dirToArray($testDir);

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

// ==============================================

$app->get('/test/:name', function ($name) {
    // echo "Hello, $name";
    return $this->view->render($response, 'home.php', [
        'title' => 'OTS Spire Web App',
        'page_name' => 'home',
        'dashClass' => true
    ]);
});

/**
*  User registration
*  url - /register
*  method - POST
*  params - name, email, password
*/

$app->post('/register', function() use ($app) {
  // check for required params
  verifyRequiredParams(array('name', 'email', 'password'));
  $response = array();
  // reading post params
  $name = $app->request->post('name');
  $email = $app->request->post('email');
  $password = $app->request->post('password');
  // validating email address
  validateEmail($email);
  $db = new DbHandler();
  $res = $db->createUser($name, $email, $password);
  if ($res == USER_CREATED_SUCCESSFULLY) {
      $response["error"] = false;
      $response["message"] = "You are successfully registered";
      echoResponse(201, $response);
  } else if ($res == USER_CREATE_FAILED) {
      $response["error"] = true;
      $response["message"] = "Oops! An error occurred while registereing";
      echoResponse(200, $response);
  } else if ($res == USER_ALREADY_EXISTED) {
      $response["error"] = true;
      $response["message"] = "Sorry, this email already existed";
      echoResponse(200, $response);
  }
});

/**
* User Login
* url - /login
* method - POST
* params - email, password
*/

$app->post('/login', function() use ($app) {
  verifyRequiredParams(array('email', 'password'));
  // reading post params
  $email = $app->request()->post('email');
  $password = $app->request()->post('password');
  $response = array();
  $db = new DbHandler();
  // check for correct email and password
  if ($db->checkLogin($email, $password)) {
      // get the user by email
      $user = $db->getUserByEmail($email);
      if ($user != NULL) {
          $response["error"] = false;
          $response['name'] = $user['name'];
          $response['email'] = $user['email'];
          $response['apiKey'] = $user['api_key'];
          $response['createdAt'] = $user['created_at'];
      } else {
          // unknown error occurred
          $response['error'] = true;
          $response['message'] = "An error occurred. Please try again";
      }
  } else {
      // user credentials are wrong
      $response['error'] = true;
      $response['message'] = 'Login failed. Incorrect credentials';
  }
  echoResponse(200, $response);
});
/**
* Creating new task in db
* method POST
* params - name
* url - /tasks/
*/
$app->post('/tasks', 'authenticate', function() use ($app){
  verifyRequiredParams(array('task'));
  $response = array();
  $task = $app->request->post('task');
  global $user_id;
  $db = new DbHandler();
  // creating new task
  $task_id = $db->createTask($user_id, $task);
  if ($task_id != NULL) {
      $response["error"] = false;
      $response["message"] = "Task created successfully";
      $response["task_id"] = $task_id;
  } else {
      $response["error"] = true;
      $response["message"] = "Failed to create task. Please try again";
  }
  echoResponse(201, $response);
});
/**
* Listing all tasks of particular user
* method GET
* url /tasks
*/
$app->get('/tasks', 'authenticate', function(){
  global $user_id;
  $response = array();
  $db = new DbHandler();
  // fetching all user tasks
  $result = $db->getAllUserTasks($user_id);
  $response["error"] = false;
  $response["tasks"] = array();
  // looping through result and preparing tasks array
  while ($task = $result->fetch_assoc()) {
      $tmp = array();
      $tmp["id"] = $task["id"];
      $tmp["task"] = $task["task"];
      $tmp["status"] = $task["status"];
      $tmp["createdAt"] = $task["created_at"];
      array_push($response["tasks"], $tmp);
  }
  echoResponse(200, $response);
});
/**
* Listing single task of particular user
* method GET
* url /tasks/:id
* Return 404 if task doesn't belong to user
*/
$app->get('/tasks/:task_id', 'authenticate', function($task_id){
  global $user_id;
  $response = array();
  $db = new DbHandler();
  // fetch task
  $result = $db->getTask($task_id, $user_id);
  if ($result != NULL) {
      $response["error"] = false;
      $response["id"] = $result["id"];
      $response["task"] = $result["task"];
      $response["status"] = $result["status"];
      $response["createdAt"] = $result["created_at"];
      echoResponse(200, $response);
  } else {
      $response["error"] = true;
      $response["message"] = "The requested resource doesn't exists";
      echoResponse(404, $response);
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
  $response = array();
  // updating task
  $result = $db->updateTask($user_id, $task_id, $task, $status);
  if ($result) {
      // task updated successfully
      $response["error"] = false;
      $response["message"] = "Task updated successfully";
  } else {
      // task failed to update
      $response["error"] = true;
      $response["message"] = "Task failed to update. Please try again!";
  }
  echoResponse(200, $response);
});
/**
 * Deleting task. Users can delete only their tasks
 * method DELETE
 * url /tasks
 */
$app->delete('/tasks/:task_id', 'authenticate', function($task_id) use($app) {
    global $user_id;
    $db = new DbHandler();
    $response = array();
    $result = $db->deleteTask($user_id, $task_id);
    if ($result) {
        // task deleted successfully
        $response["error"] = false;
        $response["message"] = "Task deleted succesfully";
    } else {
        // task failed to delete
        $response["error"] = true;
        $response["message"] = "Task failed to delete. Please try again!";
    }
    echoResponse(200, $response);
});

// ==============================================




// Run app
$app->run();
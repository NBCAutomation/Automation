<?php
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', FALSE);

use Slim\Views\PhpRenderer;

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

// Run app
$app->run();
<?php

use Slim\Views\PhpRenderer;

require_once __DIR__.'/vendor/autoload.php';

$app = new Slim\App();
$spire = new Spire();

// Get container
$container = $app->getContainer();

// Register component on container
$container['view'] = function ($container) {
    return new \Slim\Views\PhpRenderer('./views/');
};


// Register Twig View helper
// $container['view'] = function ($container) {
//     $view = new \Slim\Views\Twig('views',[
//     	'cache' => false
//     ]);

//     // Instantiate and add Slim specific extension
//     $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
//     $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));

//     return $view;
// };

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

	$__fileData;

	$__fileData .= "<table>";

	if (($handle = fopen($__file, "r")) !== FALSE) {
	    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	        $num = count($data);
	        // echo "<tr>";
	        // echo "<td colspan=\"5\"><p> $num fields in line $row: <br /></p></td>";
	        // echo "</tr>";
	        $row++;
	        $__fileData .= "<tr>";
	        for ($c = 0; $c < $num; $c++) {
	        	
	        	if (strpos($data[$c], 'Fail') !== false) {
	        		$__class = 'class="fail" ';
	        	} else {
	        		$__class = '';
	        	}

	            $__fileData .= "<td ". $__class .">" . $data[$c] . "</td>";
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
        'page_name' => 'home'
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
    		'results' => $files_array,
        ]);
    })->setName('user-password-reset');

    
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
    		    'reportData' => $__reportData
    		]);
    	} elseif ($args['page']) {
    		// Report Directory View

		    return $this->view->render($response, 'reports.php', [
		        'title' => 'Reports',
		        'page_name' => 'reports',
		        'view' => 'single',
		        'fileView' => true,
		        'viewPath' => $__viewPath,
		        'linkPath' => $__reportDir,
		        'results' => $__repoDir
		    ]);
    	}
    })->setName('reports-view');

	

  //   return $this->view->render($response, 'reports.php', [
  //       'title' => 'Reports',
  //       'page_name' => 'reports',
  //       'view' => $args['view'],
  //       'mainView' => true,
		// 'results' => $files_array,
  //   ]);
});


// ********* User Auth ************

// $app->post('/auth/', function ($request, $response, $args) {
// 	$db_conn = $spire->getConnection();
// 	$input = $app->request()->post();

// 	$sql = "SELECT * FROM `users` WHERE `user` = :user AND `pass` = :pass";

// 	$sql = $db_conn->prepare($sql);
// 	$sql->bindParam(':user', $input['user']);
// 	$sql->bindParam(':pass', $input['pass']);
// 	// $sql->execute();
// 	$result = $sql->execute();
// 	$rows = $sql->fetchAll();

// 	$n = count($rows);

// 	if ($n <= 0){
// 		$app->flash('error', 'Login credentials incorrect.');
// 		$app->response()->redirect('/admin/');
// 		// $redirect = '/admin/';
// 		// $app->response()->redirect($redirect);
// 	} else {
// 		$app->setEncryptedCookie('_sp_C','auth');

// 		$redirect = '/admin/main/';
// 		$app->response()->redirect($redirect);
// 	}

// });

// $app->get('/logout/', function() use ($app,  $billboard){
// 	$app->deleteCookie('BE_C');
// 	$redirect = '/admin/main/';
// 	$app->response()->redirect($redirect);
// });

// Run app
$app->run();
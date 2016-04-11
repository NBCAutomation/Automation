<?php

require_once __DIR__.'/vendor/autoload.php';

// Create Slim app
$app = new \Slim\App();

// Mobile detection
$detect = new Mobile_Detect();

if( $detect->isMobile() ){
	$mobility = '1';
}

// Fetch DI Container
$container = $app->getContainer();

// Register Twig View helper
$container['view'] = function ($c) {
    $view = new \Slim\Views\Twig('views');

    // Instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $c['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($c['router'], $basePath));

    return $view;
};

// Define named route
$app->get('/', function ($request, $response, $args, $mobility) {
    return $this->view->render($response, 'home.php', [
        'title' => 'OTS Spire Web App',
		'mobility' => $mobility
    ]);
})->setName('home');

$app->get('/reports', function ($request, $response, $args, $mobility) {

	$testDir = 'test_results';

	function dirToArray($dir) {
	   
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

	$files_array = dirToArray($testDir);

    return $this->view->render($response, 'reports.php', [
        'title' => 'Reports',
		'mobility' => $mobility,
		'results' => $results
    ]);
})->setName('reports');

// Run app
$app->run();
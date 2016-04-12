<?php

require_once __DIR__.'/vendor/autoload.php';

// Create Slim app
$app = new \Slim\App();

// // Mobile detection
// $detect = new Mobile_Detect();

// if( $detect->isMobile() ){
// 	$mobility = '1';
// }

// Fetch DI Container
$container = $app->getContainer();

// Register Twig View helper
$container['view'] = function ($container) {
    $view = new \Slim\Views\Twig('views',[
    	'cache' => false
    ]);

    // Instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));

    return $view;
};

// Homepage
$app->get('/', function ($request, $response, $args) {
    return $this->view->render($response, 'home.php', [
        'title' => 'OTS Spire Web App'
    ]);
})->setName('home');

// Reports View
$app->get('/reports/{view}', function ($request, $response, $args) {

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

	
	if (strpos($args['view'], 'reportID') !== false) {
		echo $args['view'];

		$__file = __DIR__ . "/test_results/api_manifest_audits/" . $args['view'];

		function readCSV($__file) {
			$row = 1;			
			echo "<table>";

			if (($handle = fopen($__file, "r")) !== FALSE) {
			    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			        $num = count($data);
			        // echo "<tr>";
			        // echo "<td colspan=\"5\"><p> $num fields in line $row: <br /></p></td>";
			        // echo "</tr>";
			        $row++;
			        echo "<tr>";
			        for ($c = 0; $c < $num; $c++) {
			            echo "<td>" . $data[$c] . "</td>";
			        }
			        echo "</tr>";
			    }
			    fclose($handle);
			}
			echo "</table>";
		}
	}

	$files_array = dirToArray($testDir);

    return $this->view->render($response, 'reports.php', [
        'title' => 'Reports',
        'page_name' => 'reports',
        'view' => $args['view'],
		'results' => $files_array,
    ]);
})->setName('reports');

// Run app
$app->run();
<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

define("BASEPATH", __DIR__);

require __DIR__ . '/../vendor/autoload.php';

session_start();
$sessTimeout = 3600;
// print_r(get_declared_classes());

// Instantiate the app
$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);

// App cache
$app->add(new \Slim\HttpCache\Cache('public', 86400));

$spire = new Spire();

// Set up dependencies
require __DIR__ . '/../src/dependencies.php';

// Register middleware
require __DIR__ . '/../src/middleware.php';

// Register routes
require __DIR__ . '/../src/routes.php';

// Misc Utils
require __DIR__ . '/../src/dbHandler.php';
require __DIR__ . '/../src/passHash.php';
require __DIR__ . '/../src/utils.php';

// Run app
$app->run();

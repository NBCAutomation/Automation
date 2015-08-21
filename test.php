<?php
	// $page = $_SERVER['PHP_SELF'];
	// $user_input = $_POST['user_input'];

	// putenv("PHANTOMJS_EXECUTABLE=/usr/local/bin/phantomjs");

    // echo "Running PhantomJS version: ";

    passthru('casperjs test dev_tests/test_file.js --url=http://telemundo51.com', $ret);

    die($ret);

    // $casperVar = 'PATH=$PATH:/usr/local/bin/phantomjs; --version 2>&1';  
    // echo exec($casperVar);
    // echo "<br />";
    // echo "Running CasperJS version: ";
    // echo exec('/usr/local/bin/casperjs --version');
?>
 

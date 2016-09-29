<?php
	if (gethostname() == 'ip-10-9-169-143') {
		/** Database config */
		define('DB_USERNAME', 'dbuser');
		define('DB_PASSWORD', 'dbuser');
		define('DB_HOST', '127.0.0.1');
		define('DB_NAME', 'ots_spire');		
	} else {
		/** Database config */
		define('DB_USERNAME', '__spireUser');  
		define('DB_PASSWORD', 'LTXaxWwnemXzzrcK');
		define('DB_HOST', 'localhost');
		define('DB_NAME', 'ots_spire');
	}

	define('USER_CREATED_SUCCESSFULLY', 0);
	define('USER_CREATE_FAILED', 1);  
	define('USER_ALREADY_EXISTED', 2);

	/** Debug modes */
	define('PHP_DEBUG_MODE', true);  
	define('SLIM_DEBUG', true); 
?>
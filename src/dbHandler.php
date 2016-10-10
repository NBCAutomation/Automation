<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

class DbHandler {

    // private $conn;

    function __construct() {
    //     $spire = new Spire();
        require_once dirname(__FILE__) . '/spire.php';

    // //     // opening db connection
    // //     $db = new DbConnect();
    // //     // $this->conn = $db->connect();
        
    // //     $db_con = $db->getConnection();
    //     $db_con = $spire->getConnection();
    }

    /* ------------- `users` table method ------------------ */

    /**
     * Creating new user
     * @param String $name User full name
     * @param String $email User login email id
     * @param String $password User login password
     */
    public function createUser($first_name, $last_name, $email, $password) {
        require_once 'passHash.php';
        $response = array();

        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // Generating password hash
            $password_hash = PassHash::hash($password);

            // Generating API key
            $api_key = $this->generateApiKey();

            // var_dump($first_name, $last_name, $email, $password);
            // exit();

            // insert query
            $stmt = $db_con->prepare("INSERT INTO users(first_name, last_name, email, password_hash, api_key, status, role) values(?, ?, ?, ?, ?, 1, 4)");
            $stmt->bind_param("sssss", $first_name, $last_name, $email, $password_hash, $api_key);

            $result = $stmt->execute();

            $stmt->close();

            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                $response = 'USER_CREATED_SUCCESSFULLY';
            } else {
                // Failed to create user
                $response = 'USER_CREATE_FAILED';
            }
        } else {
            // User with same email already existed in the db
            $response = 'USER_ALREADY_EXISTED';
        }

        return $response;
    }

    /**
     * Checking user login
     * @param String $email User login email id
     * @param String $password User login password
     * @return boolean User login status success/fail
     */
    public function checkLogin($email, $password) {

        $db_con = Spire::getConnection();

        // fetching user by email
        $stmt = $db_con->prepare("SELECT `password_hash` FROM `users` WHERE `email` = ?");
        $stmt->execute(array($email));
        
        $rows = $stmt->fetchAll();
        $totalRows = count($rows);

        $password_hash = $rows[0][0];

        // echo $password_hash;

        if ($totalRows > 0) {
            // Found user with the email
            // Now verify the password
            if (PassHash::check_password($password_hash, $password)) {
                // User password is correct
                return TRUE;
            } else {
                // user password is incorrect
                return FALSE;
            }
            $stmt->close();
        } else {
            $stmt->close();
            // user not existed with the email
            return FALSE;
        }
    }

    /**
     * Checking for duplicate user by email address
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($email) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT id from users WHERE email = ?");
        $stmt->execute(array($email));

        $rows = $stmt->fetchAll();
        $num_rows = count($rows);

        return $num_rows > 0;

        $stmt->close();
    }

    /**
     * Fetching user by email
     * @param String $email User email id
    */
    public function getUserByEmail($email) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT id, first_name, last_name, email, api_key, status, role, created_at FROM users WHERE email = ?");
        $stmt->execute(array($email));

        if ($stmt->execute()) {
            $userData = $stmt->fetch();

            $user = array();

            /* fetch values */
            // mysqli_stmt_fetch($stmt);

            /* set values */
            $user['id'] = $userData['id'];
            $user['first_name'] = $userData['first_name'];
            $user['last_name'] = $userData['last_name'];
            $user['email'] = $userData['email'];
            $user['api_key'] = $userData['api_key'];
            $user['role'] = $userData['role'];
            $user['created_at'] = $userData['created_at'];

            return $user;
            $stmt->close();
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user api key
     * @param String $user_id user id primary key in user table
     */
    public function getApiKeyById($user_id) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT api_key FROM users WHERE id = ?");
        $stmt->execute(array($user_id));

        if ($stmt->execute()) {
            $api_key = $stmt->fetch();

            return $api_key;
            $stmt->close();
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    public function getUserId($api_key) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT id FROM users WHERE api_key = ?");
        $stmt->execute(array($api_key));

        if ($stmt->execute()) {
            $user_id = $stmt->fetch();

            return $user_id;
            $stmt->close();
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */

    public function getUserRole($api_key) {
        $db_con = Spire::getConnection();
        $stmt = $db_con->prepare("SELECT role FROM users WHERE api_key = ?");
        $stmt->execute(array($api_key));

        if ($stmt->execute()) { 
            $stmt->bind_result($user_role);

            /* fetch values */
            mysqli_stmt_fetch($stmt);

            $stmt->close();
            return $user_role;
        } else {
            return NULL;
        }
    }


    public function getAllUsers() {
        $db_con = Spire::getConnection();

        // $stmt = $db_con->prepare("SELECT id, first_name, last_name, email, api_key, status, role FROM users");
        $stmt = $db_con->prepare("SELECT `users`.`id`, `users`.`first_name`, `users`.`last_name`, `users`.`email`, `users`.`api_key`, `user_roles`.`role_name`, `users`.`status` FROM `users` INNER JOIN `user_roles` ON `users`.`role` = `user_roles`.`role`");
        $stmt->execute();

        $users = array();
        $allUserData = $stmt->fetchAll();

        if ($stmt->execute()) {
                
            foreach( $allUserData as $key => $value ){
                $users[$key] = $value;
            }

            $usersArray[] = $users;

            return $usersArray;
            $stmt->close();
        } else {
            return NULL;
        }
    }


    public function getUserById($userID) {
        $db_con = Spire::getConnection();

        // $stmt = $db_con->prepare("SELECT id, first_name, last_name, email, api_key, status, role, created_at FROM users WHERE email = ?");
        $stmt = $db_con->prepare("SELECT `users`.`id`, `users`.`first_name`, `users`.`last_name`, `users`.`email`, `users`.`api_key`, `users`.`role`, `user_roles`.`role_name`, `users`.`status`, `users`.`created_at` FROM `users` INNER JOIN `user_roles` ON `users`.`role` = `user_roles`.`role` WHERE `users`.`id` = ?");
        $stmt->execute(array($userID));

        $user = array();

        if ($stmt->execute()) {
            // Get data
            $allUserData = $stmt->fetch();

            /* set values */
            $user['id'] = $allUserData['id'];
            $user['first_name'] = $allUserData['first_name'];
            $user['last_name'] = $allUserData['last_name'];
            $user['email'] = $allUserData['email'];
            $user['api_key'] = $allUserData['api_key'];
            $user['roleID'] = $allUserData['roleID'];
            $user['role'] = $allUserData['role'];
            $user['status'] = $allUserData['status'];
            $user['created_at'] = $allUserData['created_at'];

            return $user;
            $stmt->close();
        } else {
            return NULL;
        }
    }


    /**
     * Update User Password
    */
    public function updateUserPassword($user_id, $new_password) {
        $db_con = Spire::getConnection();

        require_once 'passHash.php';
        $password_hash = PassHash::hash($new_password);
        $stmt = $db_con->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $stmtStatus = $stmt->execute(array($password_hash, $user_id));

        return $stmtStatus;

        $stmt->close();
    }

    /**
     * Update User info
    */
    public function updateUser($user_id, $new_password, $role, $status) {
        $db_con = Spire::getConnection();
        // var_dump($user_id, $new_password, $role, $status);
        
        if ( strlen($new_password) > 0 ){
            require_once 'passHash.php';
            $password_hash = PassHash::hash($new_password);

            $stmt = $db_con->prepare("UPDATE users SET password_hash = ?, status = ?, role = ? WHERE id = ?");
            $stmtStatus = $stmt->execute(array($password_hash, $status, $role, $user_id));
        } else {
            $stmt = $db_con->prepare("UPDATE users SET status = ?, role = ? WHERE id = ?");
            $stmtStatus = $stmt->execute(array($status, $role, $user_id));

        }

        return $stmtStatus;

        $stmt->close();
    }

    /**
     * Validating user api key
     * If the api key is there in db, it is a valid key
     * @param String $api_key user api key
     * @return boolean
     */
    public function isValidApiKey($api_key) {
        $stmt = $db_con->prepare("SELECT id from users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $rows = $stmt->fetchAll();
        $num_rows = count($rows);
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }

    /* ------------- Scripting and Testing DB Queries ------------------ */

    /**
     * Creating Test ID
     */
    
    public function createTestID($testID, $stationProperty, $testType) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO tests(test_id, property, type) VALUES(?, ?, ?)");
        $stmtStatus = $stmt->execute(array($testID, $stationProperty, $testType));

        if ($stmtStatus) {
            // task row created
            // now assign the task to user
            $new_test_id = $db_con->lastInsertId();

            if ($new_test_id != NULL) {
                // task created successfully
                return $new_test_id;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }

        $stmt->close();
    }


    /**
     * Insert Test Results
     */
    public function navigationAuditInsert($resultsFile) {
        $db_con = Spire::getConnection();

        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA LOCAL INFILE '".$resultsFile."' INTO TABLE nav_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, link_name, link_url, status_code, status, info)";

        $stmt = $db_con->query($uploadQuery);

        // var_dump($db_con->query($uploadQuery));

        if ( !($stmt = $db_con->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $db_con->errno . ") " . $db_con->error;
            return 0;
        } else {
            return 1;
        }
    }

    public function articleAuditInsert($resultsFile) {
        $db_con = Spire::getConnection();

        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA LOCAL INFILE '".$resultsFile."' INTO TABLE article_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, endpoint, content_id, content_title, content_error, status)";

        if ( !($stmt = $db_con->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $db_con->errno . ") " . $db_con->error;
            return 0;
        } else {
            return 1;
        }
    }

    public function manifestAuditInsert($resultsFile) {
        $db_con = Spire::getConnection();

        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA LOCAL INFILE '".$resultsFile."' INTO TABLE manifest_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, apiVersion, expected_key, expected_value, live_key, live_value, status, info)";

        if ( !($stmt = $db_con->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $db_con->errno . ") " . $db_con->error;
            return 0;
        } else {
            return 1;
        }
    }

    /**
     * Reporting
     */
    
    public function getAllTests() {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT * FROM tests");
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;
                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }

    public function getAllRecentTests() {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT * FROM tests WHERE created >= NOW() - INTERVAL 12 HOUR GROUP BY type");
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;

                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }

    public function getAllRecentTests30Days() {
        $stmt = $db_con->prepare("SELECT * FROM tests WHERE created BETWEEN NOW() - INTERVAL 30 DAY AND NOW() GROUP BY type");
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;

                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }

    public function getAllTestsFromToday() {
        $stmt = $db_con->prepare("SELECT * FROM tests WHERE created >= NOW() - INTERVAL 6 HOUR GROUP BY type");
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;

                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }


    public function getTestById($testID) {
        $db_con = Spire::getConnection();
        
        $stmt = $db_con->prepare("SELECT id, test_id, property, type, created FROM tests WHERE id = ?");
        $stmt->execute(array($testID));

        $tests = array();
        $testData = $stmt->fetch();

        if ($stmt->execute()) {

            /* fetch values */
            
            $tests['id'] = $testData['id'];
            $tests['refId'] = $testData['refId'];
            $tests['property'] = $testData['property'];
            $tests['type'] = $testData['type'];
            $tests['created'] = $testData['created'];

            // var_dump($tests);

            return $tests;
            $stmt->close();
        } else {
            return NULL;
        }

    }

    public function getAllTestByType($testType) {
        
        switch ($testType) {
            
            case "api_manifest_audits":
                $testTypeName = 'apiCheck-manifest';
                break;

            case "api_navigation_audits":
                $testTypeName = 'apiCheck-nav';
                break;

            case "api_article_audits":
                $testTypeName = 'apiCheck-article';
                break;
            default:
                $testTypeName = 'none-existent';
        }

        $stmt = $db_con->prepare("SELECT * FROM tests WHERE type = ?");
        $stmt->bind_param("s", $testTypeName);
        
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;
                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }

    public function getCurrentTestsByTypeForToday($testType) {
        $db_con = Spire::getConnection();

        switch ($testType) {
            case "api_manifest_audits":
                $testTypeName = 'apiCheck-manifest';
                break;

            case "api_navigation_audits":
                $testTypeName = 'apiCheck-nav';
                break;

            case "api_article_audits":
                $testTypeName = 'apiCheck-article';
                break;
            default:
                $testTypeName = 'none-existent';
        }

        $stmt = $db_con->prepare("SELECT * FROM tests WHERE created >= NOW() - INTERVAL 6 HOUR AND type = ?");
        $testResults = $stmt->execute(array($testTypeName));
        
        $tests = array();
        $allTestData = $stmt->fetchAll();

        var_dump($allTestData);

        if ($testResults) {

            foreach( $allTestData as $key => $value ){
                $tests[$key] = $value;
            }

            $apiTestsArray[] = $tests;

            return $apiTestsArray;
            $stmt->close();
        } else {
            return NULL;
        }
    }


    public function getCurrentTestResults($testID, $testType) {
        $db_con = Spire::getConnection();

        switch ($testType) {
            case "api_manifest_audits":
                $testTableName = 'manifest_tests';
                $manifestBind = true;
                break;

            case "apiCheck-manifest":
                $testTableName = 'manifest_tests';
                $manifestBind = true;
                break;

            case "api_navigation_audits":
                $testTableName = 'nav_tests';
                $navBind = true;
                break;

            case "apiCheck-nav":
                $testTableName = 'nav_tests';
                $navBind = true;
                break;

            case "api_article_audits":
                $testTableName = 'article_tests';
                $articleBind = true;
                break;

            case "apiCheck-article":
                $testTableName = 'article_tests';
                $articleBind = true;
                break;

            default:
                $testTableName = 'none-existent';
        }


        $stmt = $db_con->prepare("SELECT * FROM ".$testTableName." WHERE test_id = ".$testID);
        
        $tests = array();

        if ($stmt->execute()) {

            if ($manifestBind) {
                $stmt->bind_result($test->id, $test->test_id, $test->api_version, $test->expected_key, $test->expected_value, $test->live_key, $test->live_value, $test->status, $test->info, $test->created);
            }
            
            if ($navBind) {
                $stmt->bind_result($test->id, $test->test_id, $test->link_name, $test->link_url, $test->status_code, $test->status , $test->info, $test->created);
            }

            if ($articleBind) {
                //articleBind
                $stmt->bind_result($test->id, $test->test_id, $test->endpoint, $test->content_id, $test->content_title, $test->content_error, $test->status, $test->created);
            }

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;
                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }


    public function checkForTestFailures($testID, $testResultsTable) {
        // var_dump($testID, $testResultsTable);
        
        switch ($testResultsTable) {
            
            case "api_manifest_audits":
                $testTableName = 'manifest_tests';
                break;

            case "apiCheck-manifest":
                $testTableName = 'manifest_tests';
                break;

            case "api_navigation_audits":
                $testTableName = 'nav_tests';
                break;

            case "apiCheck-nav":
                $testTableName = 'nav_tests';
                break;

            case "api_article_audits":
                $testTableName = 'article_tests';
                break;

            case "apiCheck-article":
                $testTableName = 'article_tests';
                break;

            default:
                $testTableName = 'none-existent';
        }

        $stmt = $db_con->prepare("SELECT status, COUNT(*) FROM ".$testTableName." WHERE test_id = ".$testID." AND status = 'Fail'");
        
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->status, $test->total);

            while (mysqli_stmt_fetch($stmt)){
                
                if ($test->total > 0) {
                    return 'fail';
                    echo 'fail';
                } else {
                    return 'pass';
                    echo 'pass';
                }
            }

            $stmt->close();
        } else {
            return NULL;
        }
    }

    public function checkForTestFailuresToday($testResultsTable) {
        $db_con = Spire::getConnection();
        
        switch ($testResultsTable) {
            
            case "api_manifest_audits":
                $testTableName = 'manifest_tests';
                break;

            case "apiCheck-manifest":
                $testTableName = 'manifest_tests';
                break;

            case "api_navigation_audits":
                $testTableName = 'nav_tests';
                break;

            case "apiCheck-nav":
                $testTableName = 'nav_tests';
                break;

            case "api_article_audits":
                $testTableName = 'article_tests';
                break;

            case "apiCheck-article":
                $testTableName = 'article_tests';
                break;

            default:
                $testTableName = 'none-existent';
        }

        // $stmt = $db_con->prepare("SELECT status, COUNT(*) FROM ".$testTableName." WHERE test_id = ".$testID." AND status = 'Fail'");
        $stmt = $db_con->prepare("SELECT status, COUNT(*) AS totalFailures FROM ".$testTableName." WHERE DATE(created) = CURDATE() AND status = 'Fail'");


        if ($stmt->execute()) {
            $errorCount = $stmt->fetchAll();
            
            if ($errorCount[0]['totalFailures'] > 0) {
                $totalErrors = $errorCount[0]['totalFailures'];
            } else {
                $totalErrors = '0';
            }

            // foreach ($errorCount[0] as $key => $value) {
            //     echo "key => ".$key." \ value => ".$value."\n";
            // }

            return $totalErrors;

            $stmt->close();
        } else {
            return NULL;
        }
    }

    public function checkForTestWarningsToday($testResultsTable) {
        $db_con = Spire::getConnection();
        
        switch ($testResultsTable) {
            
            case "api_manifest_audits":
                $testTableName = 'manifest_tests';
                break;

            case "apiCheck-manifest":
                $testTableName = 'manifest_tests';
                break;

            case "api_navigation_audits":
                $testTableName = 'nav_tests';
                break;

            case "apiCheck-nav":
                $testTableName = 'nav_tests';
                break;

            case "api_article_audits":
                $testTableName = 'article_tests';
                break;

            case "apiCheck-article":
                $testTableName = 'article_tests';
                break;

            default:
                $testTableName = 'none-existent';
        }

        // $stmt = $db_con->prepare("SELECT status, COUNT(*) FROM ".$testTableName." WHERE test_id = ".$testID." AND status = 'Fail'");
        $stmt = $db_con->prepare("SELECT status, COUNT(*) AS totalFailures FROM ".$testTableName." WHERE DATE(created) = CURDATE() AND status = 'Warn'");


        if ($stmt->execute()) {
            $errorCount = $stmt->fetchAll();
            
            if ($errorCount[0]['totalFailures'] > 0) {
                $totalErrors = $errorCount[0]['totalFailures'];
            } else {
                $totalErrors = '0';
            }

            // foreach ($errorCount[0] as $key => $value) {
            //     echo "key => ".$key." \ value => ".$value."\n";
            // }

            return $totalErrors;

            $stmt->close();
        } else {
            return NULL;
        }
    }


    public function allFailureReportsFromToday($testResultsTable) {
        $db_con = Spire::getConnection();

        switch ($testResultsTable) {
            
            case "api_manifest_audits":
                $testTableName = 'manifest_tests';
                break;

            case "apiCheck-manifest":
                $testTableName = 'manifest_tests';
                break;

            case "api_navigation_audits":
                $testTableName = 'nav_tests';
                break;

            case "apiCheck-nav":
                $testTableName = 'nav_tests';
                break;

            case "api_article_audits":
                $testTableName = 'article_tests';
                break;

            case "apiCheck-article":
                $testTableName = 'article_tests';
                break;

            default:
                $testTableName = 'none-existent';
        }

        $stmt = $db_con->prepare("SELECT * FROM ".$testTableName." WHERE DATE(created) = CURDATE() AND status = 'Fail'");
        $failureReports = array();

        if ($stmt->execute()) {
            $errorReports = $stmt->fetchAll();

            // var_dump($errorReports);

            foreach ($errorReports as $key => $val) {
                $currentTestInfo = $this->getTestById( $val['test_id'] );

                $failureReports['testInfoId'] = $currentTestInfo['id'];
                $failureReports['testInfoProperty'] = $currentTestInfo['property'];
                $failureReports['testInfoType'] = $currentTestInfo['type'];
                $failureReports['testInfoCreated'] = $currentTestInfo['created'];

                foreach ($val as $subKey => $value) {
                    // echo "subKey -> ".$subKey." | val -> ".$value."\n<br />";
                    if (! is_int($subKey)) {
                        $failureReports[$subKey] = $value;
                    }
                }
            }

            $allFailureReports[] = $failureReports;
            return $allFailureReports;

            $stmt->close();
        } else {
            return NULL;
        }

    }

    public function getAllStations() {
        $stmt = $db_con->prepare("SELECT * FROM stations");
        $stmt->execute();
        $stations = array();

        if ($stmt->execute()) {
            $stmt->bind_result($station->id, $station->call_letters, $station->brand, $station->shortname, $station->url, $station->group, $station->api_version);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $station as $key => $value ){
                    $stations[$key] = $value;
                }

                $stationsArray[] = $stations;
            }

            $stmt->close();
            return $stationsArray;
        } else {
            return NULL;
        }
    }

    public function getStationById($stationID) {
        $stmt = $db_con->prepare("SELECT * FROM stations WHERE id = ?");
        $stmt->bind_param("i", $stationID);

        $station = array();

        if ($stmt->execute()) {
            $stmt->bind_result($id, $call_letters, $brand, $shortname, $url, $group, $api_version);

            /* fetch values */
            mysqli_stmt_fetch($stmt);

            /* set values */
            $station['id'] = $id;
            $station['call_letters'] = $call_letters;
            $station['brand'] = $brand;
            $station['shortname'] = $shortname;
            $station['url'] = $url;
            $station['group'] = $group;
            $station['api_version'] = $api_version;

            $stmt->close();
            return $station;
        } else {
            return NULL;
        }
    }

}

?>
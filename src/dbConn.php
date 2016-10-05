<?php
class DbConnect {

    // private $conn;

    // function __construct(){ }

    // function connect(){
    //     include_once dirname(__FILE__) . '/spire_config.php';
    //     $this->conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
        
    //     if (mysqli_connect_errno()) {
    //         echo "Failed to connect to Mysql: " . mysqli_connect_error();
    //     }
        
    //     return $this->conn;
    // }

    // public function getConnection() {
    //     $dbhost="localhost";
    //     $dbuser="db135861_bec";
    //     $dbpass="B0U6X58X54GrRjC";
    //     $dbname="db135861_bec";
    //     $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    //     $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //     return $dbh;
    // }

    function getConnection() {
        $dbhost = "localhost";
        $dbuser = "__spireUser";
        $dbpass = "LTXaxWwnemXzzrcK";
        $dbname = "ots_spire";
        $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    }
}
?>
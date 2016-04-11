<?php
//Database/Model
class jollySalt {

	public function getGravatar( $email, $s = 250, $d = 'mm', $r = 'g', $img = false, $atts = array() ) {
	    $url = 'http://www.gravatar.com/avatar/';
	    $url .= md5( strtolower( trim( $email ) ) );
	    $url .= "?s=$s&d=$d&r=$r";
	    if ( $img ) {
	        $url = '<img src="' . $url . '"';
	        foreach ( $atts as $key => $val )
	            $url .= ' ' . $key . '="' . $val . '"';
	        $url .= ' />';
	    }
	    return $url;
	}

	public function getConnection() {
	    $dbhost = "localhost";
	    $dbuser = "jollySalt";
	    $dbpass = "7ZqB1ZTBXMF6Lmt";
	    $dbname = "jollySalt";
	    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    return $dbh;
	}
	
}
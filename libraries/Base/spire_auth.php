<?php
use Slim\Middleware;

// require_once dirname(__FILE__) . '/dbConn.php';

class SpireMiddleware {

	// public function ($request, $response, $next) {
	//     $response->getBody()->write('It is now ');
	//     $response = $next($request, $response);
	//     $response->getBody()->write('. Enjoy!');

	//     return $response;
	//  };


	public function __invoke($request, $response, $next) {
	// public function isAuth($email) {
		$headers = apache_request_headers();
  		$response = array();
  		
		// var_dump($headers);
		// $authKeys = $request->getHeader('Authorization');
		// var_dump($authKeys);
		// var_dump('testing this shit '. $email);
		// $app = $this->app;
		// $auth = $app->auth;

		// $response->getBody()->write('BEFORE');
  //       $response = $next($request, $response);
  //       $response->getBody()->write('AFTER');

  //       return $response;
		$db = new DbHandler();
		$user = $db->getUserByEmail($email);
		// $app->user = $user['api_key'];
		$this->auth = $user['api_key'];
		// $app->auth = true;
		// var_dump($this->auth);
		$auth = $this->auth;
		// var_dump($auth);
		
		$uri = $request->getUri()->withPath($this->router->pathFor('dashboard'));

		$response = $next($request->withAttribute("User_id",$user['api_key']), $response);

		
		return $response = $response->withRedirect($uri, 403);
	}

	// public function __invoke($request, $response, $next) {
	//     $authKeys = $request->getHeader('Authorization'); 
	//     $user = $db->getUserFromAuthKey($authKeys[0]);
	//     if (/*user is authorized, yada yada yada*/) { 
	//         $response = $next($request->withAttribute("User_id",$user['api_key']), $response); 
	//     } else { 
	//         // not authorized stuff goes here 
	//         return $response->withStatus(400); 
	//     } 
	     
	//     return $response; 
	// }

}
?>
<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);
// use Slim\Middleware;

// $app->add($container->get('auth'));

class SpireAuth {
    /**
     * Example middleware invokable class
     *
     * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
     * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
     * @param  callable                                 $next     Next middleware
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke($request, $response, $next) {
    	if ($_SESSION['spUser']) {
    	    $user = Spire::getUser( $_SESSION['spUser'] );
            $permissions = Spire::checkPermissions($user['role'], true);

            $request = $request->withAttribute('spAuth', $user);
    	    $request = $request->withAttribute('spPermissions', $permissions);
    	} else {
			// $uri = $request->getUri()->withPath($this->router->pathFor('login-view'));
			$response = $response->withRedirect('/login/main', 403);    		
    	}

        $response = $next($request, $response);

        return $response;
    }
}
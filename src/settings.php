<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production

        'determineRouteBeforeAppMiddleware' => true,
        
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'otsSpire',
            'path' => __DIR__ . '/../logs/app.log',
        ],
    ],
];

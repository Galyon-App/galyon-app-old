<?php

namespace Galyon\Config;

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->post('users/(:any)', 'User::$1');
    });
});

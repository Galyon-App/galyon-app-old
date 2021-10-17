<?php

namespace Galyon\Config;

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'address/(:any)', 'Address::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'banners/(:any)', 'Banner::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'category/(:any)', 'Category::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'cities/(:any)', 'City::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'images/(:any)', 'Image::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'offers/(:any)', 'Offer::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'orders/(:any)', 'Order::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'pages/(:any)', 'Page::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'popups/(:any)', 'Popup::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'products/(:any)', 'Product::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'reviews/(:any)', 'Reviews::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'settings/(:any)', 'Setting::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'stores/(:any)', 'Store::$1');
    });
});

$routes->group('galyon', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->group('v1', ['namespace' => 'Galyon\Controllers'], function ($routes) {
        $routes->match(['get', 'post'], 'users/(:any)', 'User::$1');
    });
});

$routes->group('uploads', ['namespace' => 'Galyon\Controllers'], function ($routes) {
    $routes->get('(:any)', 'Image::render/$1');
});
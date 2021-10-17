<?php

if (!function_exists('get_random_string')) {
    function get_random_string($length = 5, $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}

if (!function_exists('get_header_basic')) {
    function get_header_basic() {
        return isset($_SERVER['HTTP_BASIC']) ? $_SERVER['HTTP_BASIC']:false;
    }
}

if (!function_exists('get_header_auth')) {
    function get_header_auth() {
        return isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION']:false;
    }
}
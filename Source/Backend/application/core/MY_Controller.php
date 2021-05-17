<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Controller extends CI_Controller{

    public function __construct() {
      parent ::__construct();

      header('Access-Control-Allow-Origin: *');
      header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Basic");
      header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
      header('Content-Type: application/json');

      $method = $_SERVER['REQUEST_METHOD'];
      if ($method == "OPTIONS") {
          die();
      }
    }
}
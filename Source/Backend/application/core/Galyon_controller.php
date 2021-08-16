<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');

class Galyon_controller extends CI_Controller{

  function __construct() {
    parent ::__construct();

    //TODO: Finalized the header returned.
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Basic");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header('Content-Type: application/json');

    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == "OPTIONS") {
        die();
    }
  }

    
  /**
   * Check whether the current session is logged in or not.
   *
   * @return boolean
   */
  public function is_user_logged_in() {
    if($this->session->userdata('logged_in') === true) {
      return true;
    } else {
      return false;
    }
  }

    
  /**
   * Check whether the request and required fields is provided else return fields that is not found.
   *
   * @param  mixed $request
   * @param  mixed $fields
   * @return boolean
   */
  public function validate_request($request, $fields) {
    if(isset($request) && !empty($request)) {
        $keys = [];
        foreach($request as $key => $value) {
            array_push($keys, $key);
        }
        $data = array_diff($fields, $keys);

        if(isset($data) && !empty($data)){
          return array_values($data);
        } else {
          return [];
        }
    } else {
      return $fields;
    }
  }

    
  /**
   * Return a json response object to be echoed.
   *
   * @param  mixed $data
   * @param  mixed $success
   * @param  mixed $message
   * @param  mixed $failexit
   * @return object
   */
  public function json_response($data, $success = true, $message = "", $failexit = true) {
    if($success === true) {
      echo json_encode(
        array(
          "success" => true,
          "data" => $data
        )
      );
    } else {
      echo json_encode(
        array(
          "success" => false,
          "message" => $message
        )
      );
      if($failexit) {
        exit;
      }
    }
  }

  public function check_params($data, $array) {
    $items = array();
    foreach($data as $key => $value) {
        $items[] = $key;
    }
    return array_diff($items, $array);
  }
}
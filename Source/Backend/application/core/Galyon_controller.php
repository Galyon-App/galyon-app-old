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
   * Authorization checker and blocked if forbidden.
   *
   * @param  mixed $force_exit Exit if not authorized.
   * @return void | jwt token
   */
  public function is_authorized($failexit = TRUE) {
    $bearer = $this->input->get_request_header('Authorization');
    $token = str_replace("Bearer ", "", $bearer);
    $user = JWT::decode($token, $this->config->item('jwt_secret_phrase'));

    if($user == false) {
      $this->json_response(null, false, "Invalid access token!", $failexit);
      if(!$failexit) {
        return false;
      }
    } 

    $since = $user->expiry;
    $span = $this->config->item('jwt_expiration');
    $expiry = (int)$since + (int)$span;
    $now = strtotime(get_current_utc_time());
    if($now > $expiry) {
      $this->json_response(null, false, "You're tokenn is already expired!", $failexit);
    }
    
    $current = $this->Crud_model->get('users', 'status, verified_at', array( "uuid" => $user->uuid ), null, 'row' );

    if(!$current) {
      $this->json_response(null, false, "Encountered problem with the account!", $failexit);

    }

    if($current->status == "0") {
      $this->json_response(null, false, "You're account is deactivated!", $failexit);
    }
    
    if($current->verified_at == null) {
      $this->json_response(null, false, "You're account is not yet verified!", $failexit);
    }

    return $user;
  }

  /**
   * TODO: JWT Check whether the current session is logged in or not.
   * Check on database if jwt hash is valid and still session is on database.
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
      $response = json_encode(
        array(
          "success" => true,
          "data" => $data
        )
      );
      if($failexit) {
        echo $response;
        exit;
      } else {
        return $response;
      }
    } else {
      $response = array(
        "success" => false,
        "message" => $message
      );
      if($data != null) {
        $response['data'] = $data;
      }
      $response = json_encode($response);
      if($failexit) {
        echo $response;
        exit;
      } else {
        return $response;
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
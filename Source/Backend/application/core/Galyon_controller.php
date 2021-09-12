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
  public function is_authorized($failexit = TRUE, $roles_req = ["admin"], $role_special = ["admin"], $access_special = ["admin"]) {
    $bearer = $this->input->get_request_header('Authorization');
    $token = str_replace("Bearer ", "", $bearer);
    $user = JWT::decode($token, $this->config->item('jwt_secret_phrase'));

    if($user == false) {
      $reponse = $this->json_response(null, false, "Invalid access token!", $failexit);
      return null;
    }

    // $since = $user->expiry;
    // $span = $this->config->item('jwt_expiration');
    // $expiry = (int)$since + (int)$span;
    // $now = strtotime(get_current_utc_time());
    // if($now > $expiry) {
    //   $this->json_response(null, false, "You're tokenn is already expired!", $failexit);
    // }
    
    $current = $this->Crud_model->get('users', 'status, verified_at, type as role', array( "uuid" => $user->uuid ), null, 'row' );

    if(!$current) {
      $reponse = $this->json_response(null, false, "Encountered problem with the account!", $failexit);
      return null;
    }

    $user->{"success"} = false;
    $user->{"where"} = "status = '1'";

    if($current->verified_at == null) {
      $message = "You're account is not yet verified!";
      $this->json_response(null, false, $message, $failexit);
      $user->{"message"} = $message;
      return $user;
    }

    if($current->status == "0") {
      $message = "You're account is deactivated!";
      $this->json_response(null, false, $message, $failexit);
      $user->{"message"} = $message;
      return $user;
    }

    if($roles_req != null) {
      if(!in_array($current->role, $roles_req)) {
        $message = "You're not authorized for this action!";
        $this->json_response(null, false, $message, $failexit);
        $user->{"message"} = $message;
        return $user;
      }
    }
    
    if($role_special != null && $access_special != null) {
      if(is_array($role_special) && is_array($access_special)) {
        $basic = $this->input->get_request_header('Basic', TRUE);
        if(in_array($current->role, $role_special) && in_array($basic, $access_special)) {
          $user->where = null; 
        }
      }
    }

    $deleted = $this->input->post('deleted');
    $hasNot = !empty($deleted) && (boolean)$deleted == true ? "NOT" : "";
    if($user->where != null) {
      $user->where .= " AND deleted_at IS $hasNot NULL";
    } else {
      $user->where = "deleted_at IS $hasNot NULL";
    }

    $user->success = true;
    return $user;
  }

  /**
   * 
   * @param  string $where
   * @param  array $queries
   * @return string
   */
  public function compileWhereClause($where, $queries = []) {
    $where_clause = $where;
    foreach($queries as $query) {
      if($where_clause != null && $where_clause != "") {
        $where_clause .= " AND ";
      }
      $where_clause .= $query;
    }
    return $where_clause;
  }

  /**
   * Check if the query param is present on Basic header.
   * 
   * @param  mixed $query
   * @return boolean
   */
  public function is_basic_header($query) {
    $platform = $this->input->get_request_header('Basic', TRUE);
    if($platform && $platform == $query) {
      return true;
    }
    return false;
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
      $response = array(
          "success" => true,
          "data" => $data
        );
      if($failexit) {
        echo json_encode($response);
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
      if($failexit) {
        echo json_encode($response);
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
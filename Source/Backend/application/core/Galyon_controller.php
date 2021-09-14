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
  public function is_authorized($failexit = TRUE, $roles_req = ["admin"], $role_special = ["admin"], $access_special = []) {
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
      $user->{"message"} = $message;
      $this->json_response(null, false, $message, $failexit);
    }

    if($current->status == "0") {
      $message = "You're account is deactivated!";
      $user->{"message"} = $message;
      $this->json_response(null, false, $message, $failexit);
    }

    $roles_req = is_array($roles_req) ? $roles_req : [];
    if(!in_array($current->role, $roles_req)) {
      $message = "You're not authorized for this action!";
      $user->{"message"} = $message;
      $this->json_response(null, false, $message, $failexit);
    }
    
    $role_special = is_array($role_special) ? $role_special : [];
    $access_special = is_array($access_special) ? $access_special : [];
    $basic = $this->input->get_request_header('Basic', TRUE);
    if((in_array($current->role, $role_special) && in_array($basic, $access_special)) || in_array($basic, ["admin"])) {
      $user->where = null; 
    }

    if(!in_array($user->role, ["admin","operator"])) {
      $deleted = $this->input->post('deleted');
      $hasNot = !empty($deleted) && (boolean)$deleted == true ? "NOT" : "";
      if($user->where != null) {
        $user->where .= " AND deleted_at IS $hasNot NULL";
      } else {
        $user->where = "deleted_at IS $hasNot NULL";
      }
    }

    if($user->where == null) {
      $user->where = "id != '0'";
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
  public function compileWhereClause($where, $queries = [], $withLimit = false) {

    $initiated = false;
    $where_clause = $where;
    foreach($queries as $query) {
      if(!empty($where_clause) || $where_clause != null) {
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

  public function request_validation($request, $required = [], $optional = [], $wheres = [], $failexit = true) {
    $data = new stdClass;

    $request_keys = [];
    foreach($request as $key => $val) {
        array_push($request_keys, $key);
    }

    $notfound_keys = [];
    foreach($required as $key) {
        if(!in_array($key, $request_keys)) {
            array_push($notfound_keys, $key);
        }
    }

    $data->{"where"} = [];
    foreach($wheres as $where) {
      if(in_array($where, $request_keys)) {
        array_push($data->where, "$where = '$request[$where]'"); //Multiple validation =,!=,LIKE
      }
    }

    if(count($notfound_keys) > 0) {
        $data->{"success"} = false;
        $data->{"data"} = $notfound_keys;
        $this->json_response($notfound_keys, false, "Required fields cannot be empty.", $failexit);
    } else {
        $data->{"success"} = true;
        
        $params = array();
        foreach($request as $key => $val) {
            if(in_array($key, $required)) {
              $params[$key] = $this->Crud_model->sanitize_param($val);
            }
        }
        foreach($request as $key => $val) {
          if(in_array($key, $optional)) {
            $params[$key] = $this->Crud_model->sanitize_param($val);
          }
        }
        $data->{"data"} = $params;
    }
    return $data;
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

  public function send_mail($to_email, $subject, $content) {

    $email_config = Array(
      'charset' => 'utf-8',
      'mailtype' => 'html'
    );

    $email_config["protocol"] = "smtp";
    $email_config["smtp_host"] = $this->config->item('smtp_host');
    $email_config["smtp_port"] = $this->config->item('smtp_port');
    $email_config["smtp_user"] = $this->config->item('smtp_user');
    $email_config["smtp_pass"] = $this->config->item('smtp_pass');
    $email_config["smtp_crypto"] = $this->config->item('smtp_crypto');
    if ($email_config["smtp_crypto"] === "none") {
        $email_config["smtp_crypto"] = "";
    }

    $this->load->library('email', $email_config);
    $this->email->set_newline("\r\n");
    $this->email->set_crlf("\r\n");
    $this->email->from(
      $this->config->item('smtp_reply_email'), 
      $this->config->item('smtp_reply_name')
    );

    $this->email->to($to_email);
    $this->email->subject($subject);
    $this->email->message($content);

    if ($this->email->send()) {
      return array("success" => true, 'message' => "Email sent to recepient!");
    } else {
      return array("success" => false, 'message' => $this->email->print_debugger());
    }
  }
}
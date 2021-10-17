<?php

namespace Galyon\Controllers;

use App\Controllers\BaseController;
use Galyon\Libraries\Uuid;
use Galyon\Libraries\Jwt;
use Galyon\Models\CrudModel;

class AppCore extends BaseController
{
    public $uuid;
    public $jwt;

    public $Crud_model;

    public function __construct() { 
      $this->uuid = new Uuid();
      $encrypt = config('Encryption');
      $this->jwt = new Jwt( $encrypt->key );
      $this->Crud_model = new CrudModel();
    }

    /**
   * Authorization checker and blocked if forbidden.
   *
   * @param  mixed $force_exit Exit if not authorized.
   * @return void | jwt token
   */
  public function is_authorized($failexit = TRUE, $roles_req = [], $role_special = [], $access_special = []) {
    $bearer = get_header_auth();
    $token = str_replace("Bearer ", "", $bearer);
    log_message('info', $token);
    $user = $this->jwt->decode($token);

    if($user == false) {
      $user = (object)array();
      $user->{"success"} = false;
      $user->{"where"} = "status = '1'";
      $user->role = null;
      $reponse = $this->json_response(null, false, "Invalid access token!", $failexit);
      return $user;
    }

    $user->success = false;
    $user->where = "status = '1'";

    // $since = $user->expiry;
    // $span = $this->config->item('jwt_expiration');
    // $expiry = (int)$since + (int)$span;
    // $now = strtotime(get_current_utc_time());
    // if($now > $expiry) {
    //   $this->json_response(null, false, "You're tokenn is already expired!", $failexit);
    // }

    $current = $this->Crud_model->sql_get('users', 'status, verified_at, type as role', array( "uuid" => $user->uuid ), null, 'row' );

    if(!$current) {
      $message = "Encountered problem with the account!";
      $user->{"message"} = $message;
      $reponse = $this->json_response(null, false, $message, $failexit);
    }

    if( !isset($current->verified_at) ) {
      $message = "You're account is not yet verified!";
      $user->{"message"} = $message;
      $this->json_response(null, false, $message, $failexit);
    }

    if( isset($current->status) ) {
      if( $current->status == "0" ) {
        $message = "You're account is deactivated!";
        $user->{"message"} = $message;
        $this->json_response(null, false, $message, $failexit);
      }
    }

    if( isset($current->role) ) {
      $roles_req = is_array($roles_req) ? $roles_req : [];
      if(count($roles_req) && !in_array($current->role, $roles_req)) {
        $message = "You're not authorized for this action!";
        $user->{"message"} = $message;
        $this->json_response(null, false, $message, $failexit);
      }
      
      $role_special = is_array($role_special) ? $role_special : [];
      $access_special = is_array($access_special) ? $access_special : [];
      $basic = get_header_basic();
      if((in_array($current->role, $role_special) && in_array($basic, $access_special)) || in_array($basic, ["admin"])) {
        $user->where = null;
        if(isset($_POST['status'])) {
          $status = $this->request->getVar('status');
          $active = $status === "1" ? "1" : "0";
          $user->where = "status = '$active'";
        }
      }
    }

    if(!in_array($user->role, ["admin","operator"])) {
      $deleted = $this->request->getVar('deleted');
      $hasNot = !empty($deleted) && (boolean)$deleted == true ? "NOT" : "";
      if($user->where != null) {
        $user->where .= " AND deleted_at IS $hasNot NULL";
      } else {
        $user->where = "deleted_at IS $hasNot NULL";
      }
    }

    if($user->where == null || empty($user->where)) {
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
    $platform = get_header_basic();
    if($platform && $platform == $query) {
      return true;
    }
    return false;
  }

  /**
   * TODO: Jwt Check whether the current session is logged in or not.
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
    $data = (object)array();

    $request_keys = [];
    foreach($request as $key => $val) {
        array_push($request_keys, $key);
    }

    $notfound_keys = [];
    foreach($required as $key) {
      $vals = $this->request->getVar($key);
      if(empty($vals) || !in_array($key, $request_keys)) {
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
    //print_r($this->response); return;
    if($success === true) {
      $response = array(
          "success" => true,
          "data" => $data
        );
      if($failexit) {
        echo json_encode($response); exit;
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
        echo json_encode($response); exit;
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

    //TODO: Migrate to CodeIgniter 4 EMAIL
    return false;

    // $email_config = Array(
    //   'charset' => 'utf-8',
    //   'mailtype' => 'html'
    // );

    // $email_config["protocol"] = "smtp";
    // $email_config["smtp_host"] = $this->config->item('smtp_host');
    // $email_config["smtp_port"] = $this->config->item('smtp_port');
    // $email_config["smtp_user"] = $this->config->item('smtp_user');
    // $email_config["smtp_pass"] = $this->config->item('smtp_pass');
    // $email_config["smtp_crypto"] = $this->config->item('smtp_crypto');
    // if ($email_config["smtp_crypto"] === "none") {
    //     $email_config["smtp_crypto"] = "";
    // }

    // $this->load->library('email', $email_config);
    // $this->email->set_newline("\r\n");
    // $this->email->set_crlf("\r\n");
    // $this->email->from(
    //   $this->config->item('smtp_reply_email'), 
    //   $this->config->item('smtp_reply_name')
    // );

    // $this->email->to($to_email);
    // $this->email->subject($subject);
    // $this->email->message($content);

    // if ($this->email->send()) {
    //   return array("success" => true, 'message' => "Email sent to recepient!");
    // } else {
    //   return array("success" => false, 'message' => $this->email->print_debugger());
    // }
  }

  public function upload_image($name = null, $path = './uploads/') {
    if(!$path) {
      return false;
    }

    if( !is_dir($path) ) {
        mkdir($path);
    }

    $config['upload_path']          = $path;
    $config['allowed_types']        = 'gif|jpg|jpeg|png';
    $config['file_ext_tolower']     = TRUE;
    $config['encrypt_name']         = TRUE;
    $config['max_size']             = 8192; //8MB
    $config['max_width']            = 1920;
    $config['max_height']           = 1080;
    $config['min_width']            = 512;
    $config['min_height']           = 256;
    //$config['overwrite']          = TRUE;
    //$config['max_filename_increment'] = 100;

    $this->load->library('upload', $config);
    $this->upload->initialize($config);
    if (!$this->upload->do_upload($name))
    {
        $error = array('error' => $this->upload->display_errors());
        return $this->json_response($error, false, "Failed", false);
    }
    
    $data = $this->upload->data(); //Returns array of containing all of the data related to the file you uploaded.
    return $this->json_response($data, true, "Success", false);
  }

  public function process_image($file = null, $sizes = [256], $path = './uploads/', $maintain_ratio = TRUE) {
    if(!$file) {
      return false;
    }

    $subpath = "thumb/";
    if( !is_dir($path.$subpath) ) {
      mkdir($path.$subpath);
    }

    $this->load->library('image_lib');

    $errors = [];
    foreach($sizes as $size)
    { 
      $config['image_library']    = 'gd2';
      $config['upload_path']      = $path;
      $config['source_image']     = $path . $file;
      $config['new_image']        = $path . $subpath . $file;
      $config['thumb_marker']     = "";//"_".$size."x".$size;
      $config['allowed_types'] = 'gif|jpg|jpeg|png';
      $config['create_thumb']     = TRUE;
      $config['maintain_ratio']   = $maintain_ratio;
      $config['width']            = $size;
      $config['height']           = $size;   
      $config['quality']          = '70%';   

      // $config['max_size'] = '1000';
      // $config['max_width'] = '1920';
      // $config['max_height'] = '1280';   
      //thumb_marker=_thumb
      //rotation_angle=180 

      $this->image_lib->clear();
      $this->image_lib->initialize($config);
      if(!$this->image_lib->resize()) {
        array_push($errors, $this->image_lib->display_errors());
      }
    }

    return count($errors)>0 ? false:true;
  }

  public function checkIfOrderedResult() {
    $order_column = $this->request->getVar('order_column');
    $order_mode = $this->request->getVar('order_mode');
    if(isset($order_column) && isset($order_mode)) {
      return [$order_column, $order_mode];
    }
    return [];
  }
}

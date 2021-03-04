<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends CI_Controller{
    
    public $_statusOK = 200;
    public $_statusErr = 500;

    public $_OKmessage = 'Success';
    public $_Errmessage = 'Error';
    public $_ParamMessage = 'Invalid Field';
    public $_table_column_array = ['first_name','last_name','email','password','gender','fcm_token','type','lat','lng','cover','mobile','status','verified','others','date','stripe_key','country_code'];
    public $_table_column_edit = ['id','first_name','last_name','email','password','gender','fcm_token','type','lat','lng','cover','mobile','status','verified','others','date','stripe_key','country_code'];
    public $_table_login_array = ['email','password'];
    public $phonePasswordArray = ['cc','mobile','password'];
    public $required = ['id'];
    public $email_required_subscribe = ['email','timestamp'];
    
    public function __construct(){
		parent ::__construct();
        $this->load->library('session');
        $this->load->library('json');
		$this->load->database();
        $this->load->helper('url');
        $this->load->model('Users_model');
        $this->load->model('Lang_model');
        $this->load->model('Manage_model');
        $this->load->model('Settings_model');
        $this->load->model('General_model');
        $this->load->model('Popup_model');
        $this->load->model('Order_model');
        $this->load->model('Stores_model');
        $this->load->library('encryption');
        $this->load->library('email');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Basic");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == "OPTIONS") {
            die();
        }
    }
    
    public function getDefaultSettings(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $lang = $this->Lang_model->getDefault();
            $manage = $this->Manage_model->get_all();
            $popup = $this->Popup_model->get_all();
            $settings = $this->Settings_model->get_all();
            $general = $this->General_model->get_all();
            unset($settings[0]->creds);
            $obj;
            // $haveFile = file_exists('uploads/'.$lang[0]->file);
            $haveFile;
            if(is_array($lang) && count($lang)>0)
            {
               $haveFile = true;
            }else{
               $haveFile = false;
            }
            $langName;
            if($haveFile){
                $json = file_get_contents('uploads/'.$lang[0]->file);
                $fileName = $lang[0]->file;
                $obj  = json_decode($json);
            }else{
                $obj = false;
                $fileName = false;
            }
            
            $response  = array(
                'lang' => $obj,
                'manage' => $manage,
                'settings' => $settings,
                'file' =>$fileName,
                'general' => $general,
                'popup'=>$popup
                );
            echo $this->json->response($response,$this->_OKmessage,$this->_statusOK);
           
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function adminHome(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $users = $this->Users_model->get_all_users();
            $orders = $this->Order_model->getAdminTop();
            $stores = $this->Stores_model->get_all();
            $allorders = $this->Order_model->adminAllOrders();
            foreach($users as $keys){
                $keys->password = null;
            }
            $response  = array(
            'users' => $users,
            'orders' => $orders,
            'stores' => $stores,
            'allOrders' => $allorders
            );
            echo $this->json->response($response,$this->_OKmessage,$this->_statusOK);
           
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function getDefaultSettingsById(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $obj;
                $haveFile = file_exists('uploads/'.$_POST['id']);
                if($haveFile){
                    $json = file_get_contents('uploads/'.$_POST['id']);
                    $obj  = json_decode($json);
                }else{
                    $obj = false;
                }
                $manage = $this->Manage_model->get_all();
                $popup = $this->Popup_model->get_all();
                $settings = $this->Settings_model->get_all();
                $general = $this->General_model->get_all();
                unset($settings[0]->creds);
                $response  = array(
                    'lang' => $obj,
                    'manage' => $manage,
                    'settings' => $settings,
                    'general' => $general,
                    'popup'=>$popup
                );
                echo $this->json->response($response,$this->_OKmessage,$this->_statusOK);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }
    
    // get request
	public function index(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
             $data = $this->Users_model->get_all_users();
                foreach($data as $keys){
                    $keys->password = null;
                }
                if($data != null){
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function getUsers(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
             $data = $this->Users_model->getUsers();
                foreach($data as $keys){
                    $keys->password = null;
                }
                if($data != null){
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function sendEmail(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
      $this->Users_model->sendMails();
    }

    public function adminEmails(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
             $data = $this->Users_model->allEmails();
             $data2 = $this->Users_model->subEmailsSend();
                if($data != null){
                    $send = $this->Users_model->sendMails($data,$_POST['message'],$_POST['subject']);
                    echo $this->json->response($send,$this->_OKmessage,$this->_statusOK);
                }else{
                echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function login(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->_table_login_array);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->login($_POST);
                if($data != null){
                    unset($data->password);
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'invalid email/password.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function loginWithPhoneAndPassword(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->phonePasswordArray);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->LoginWithPhoneAndPassword($_POST);
                if($data != null){
                    unset($data->password);
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'invalid phone number /password.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }
    
    // get request
    public function get_by_id($id){
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            if(isset($id) && !empty($id)){
                $result = $this->Users_model->get_user_by_id($id);
                if($result != null){
                    echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
                }
            }else{
                echo $this->json->response('please add id into url.',$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function get_admin(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $result = $this->Users_model->get_admin();
            if($result != null){
                unset($result->password);
                unset($result->email);
                unset($result->stripe_key);
                unset($result->first_name);
                unset($result->mobile);
                echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
            }else{
                echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function check_params($data,$array_compare){
         $items = array();
          foreach($data as $key=>$value){
              $items[] = $key;
           }
           $result=array_diff($items,$array_compare);
           return $result;
    }

    // get request
    public function getById(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->getById($_POST['id']);
                if($result != null){
                    echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function getAdmins(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){ 
            $result = $this->Users_model->getAdmins();
            if($result != null){
                echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
            }else{
                echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function getChatsNames(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->getUsersNames($_POST['id']);
                if($result != null){
                    echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    // post request
    public function registerUser(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->_table_column_array);
            $param = $this->check_params($_POST,$this->_table_column_array);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->phoneExist($_POST['mobile'],$_POST['country_code']);
                if($data != null){
                    echo $this->json->response(['message'=>'Mobile Phone Already Register in Database'],$this->_Errmessage,$this->_statusErr);
                }else{
                    $result = $this->Users_model->email_exists($_POST['email']);
                    if($result != null){
                        echo $this->json->response(['message'=>'Email Already Register in Database'],$this->_Errmessage,$this->_statusErr);
                    }else{
                        $result = $this->Users_model->save_users($_POST);
                        if($result != null){
                            $id = $this->db->insert_id();
                            $data = $this->Users_model->get_user_by_id($id);
                            unset($data->password);
                            echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                        }else{
                            echo $this->json->response(['error'=>'Something Went Wrong.'],$this->_Errmessage,$this->_statusErr);
                        }
                    }
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function registerSubscriber(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->email_required_subscribe);
            $param = $this->check_params($_POST,$this->email_required_subscribe);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->email_exists_subscrier($_POST['email']);
                if($result != null){
                    echo $this->json->response(['message'=>'Email Already Register in Database'],$this->_Errmessage,$this->_statusErr);
                }else{
                    $result = $this->Users_model->save_users_subscribe($_POST);
                    if($result != null){
                        $id = $this->db->insert_id();
                        echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response(['error'=>'Something Went Wrong.'],$this->_Errmessage,$this->_statusErr);
                    }
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function edit_profile(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            $param = $this->check_params($_POST,$this->_table_column_edit);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->edit_users($_POST,$_POST['id']);
                
                if($result != null){
                    echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['error'=>'something went wrong.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function check_array_values($array,$table_array){
        if(isset($array) && !empty($array)){
            $keys = [];
            foreach($array as $key => $value){
                array_push($keys,$key);
            }
            $data = array_diff($table_array,$keys);
            if(isset($data) && !empty($data)){
                $result = [ 
                    'Error_message' => "your post request mising some data.",
                    'Missing_data' => array_values($data)
                ];
                return $result;
            }else{
                return [];
            }
        }else{
            $result = [
                'Error_message' => "your post request is empty.",
                'Missing_data' => $table_array
            ];
            return $result;
        }
    }

    public function upload_file(){
        $auth  = $this->input->get_request_header('Basic');
            if($auth && $auth == $this->config->item('encryption_key')){
                $this->_table_column_array = ['img','type'];
                $data = $this->check_array_values($_POST,$this->_table_column_array);
                if(isset($data) && !empty($data)){
                    echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
                }else{
                    define('UPLOAD_DIR', 'uploads/');
                    $img = $_POST['img'];
                    $img = str_replace('data:image/'.$_POST['type'].';base64,', '', $img);
                    $img = str_replace(' ', '+', $img);
                    $data = base64_decode($img);
                    $fileName = uniqid() . '.'.$_POST['type'];
                    $file = UPLOAD_DIR . $fileName;
                    $success = file_put_contents($file, $data);
                    $data = $success ? $fileName : null;
                    if($data != null){
                        echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response(['message'=>'Something wrong with your base64.'],$this->_Errmessage,$this->_statusErr);
                    }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function verify(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
       if(isset($_GET['uid']) && !empty($_GET['uid'])){
            $result = $this->Users_model->verify($_GET['uid']);
            if($result != null){
                $this->load->view('Verify');
            }else{
                echo 'Something went wrong';
            }
        } else {
            echo "App is empty";
        }
                
    }

    public function sendVerificationMail(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $input  = ['email','url'];
            $param = $this->check_array_values($_POST,$input);
            if(isset($param) && !empty($param)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
                }else if(count($param) >0){
                    echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
                }else{
                    $data = $this->Users_model->verificationLink($_POST['email'],$_POST['url']);
                    if($data != null && $data == TRUE){
                        echo $data;
                        // echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
                    }
                }
            }else{
                echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
        
    }

    public function contactResponse(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $input  = ['email'];
            $param = $this->check_array_values($_POST,$input);
            if(isset($param) && !empty($param)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
                }else if(count($param) >0){
                    echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
                }else{
                    $data = $this->Users_model->contactResponse($_POST['email']);
                    if($data != null && $data == TRUE){
                        echo $data;
                        // echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
                    }
                }
            }else{
                echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
        
    }

    public function replyToContact(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $input  = ['email','reply'];
            $param = $this->check_array_values($_POST,$input);
            if(isset($param) && !empty($param)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
                }else if(count($param) >0){
                    echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
                }else{
                    $data = $this->Users_model->replyToContact($_POST['email'],$_POST['reply']);
                    if($data != null && $data == TRUE){
                        echo $data;
                        // echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
                    }
                }
            }else{
                echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
        
    }

    public function update_password(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $this->_table_column_array = ['email','pwd'];
            $data = $this->check_array_values($_POST,$this->_table_column_array);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->update_password($_POST['pwd'],$_POST['email']);
                if($data != null){
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'Old password does not match with database.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function update_passwordDriver(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $this->_table_column_array = ['email','pwd'];
            $data = $this->check_array_values($_POST,$this->_table_column_array);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->update_passwordDriver($_POST['pwd'],$_POST['email']);
                if($data != null){
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'Old password does not match with database.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function upload_image(){
         $this->load->helper(array('file','directory'));
         $path="./uploads/";
            if( !is_dir($path) ) {
                mkdir($path);
            }
            $config['upload_path']          = $path;
            $config['allowed_types']        = '*';
            // $config['overwrite']=TRUE;

            // $config['max_size']             = 8000;
            // $config['max_width']            = 1024;
            // $config['max_height']           = 768;
            $this->load->library('upload', $config);
            $this->upload->initialize($config);
            if (!$this->upload->do_upload('userfile'))
            {
                $error = array('error' => $this->upload->display_errors());
                echo $this->json->response($error,$this->_Errmessage,$this->_statusErr);
            }
            else
            {
                // $data = array('upload_data' => $this->upload->data());
                $data = $this->upload->data(); //Returns array of containing all of the data related to the file you uploaded.
                $data['file_name'];
                echo $this->json->response($data['file_name'],$this->_OKmessage,$this->_statusOK);
            // $this->load->view('upload_success', $data);
            }
    }
    
    public function logs(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
       
    }

    public function sendOTP(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required = ['email'];
            $data = $this->check_array_values($_POST,$required);
            $param = $this->check_params($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->email_exists($_POST['email']);
                if($result != null){
                    $data = $this->Users_model->saveOTP($_POST['email']);
                    if($data != null){
                        $data['code'] = null;
                        echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response(['message'=>'Something went wrong'],$this->_Errmessage,$this->_statusErr);
                    }
                }else{
                    echo $this->json->response(['message'=>'Email not exist in Database'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function sendOTPDriver(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required = ['email'];
            $data = $this->check_array_values($_POST,$required);
            $param = $this->check_params($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->sendOTPDriver($_POST['email']);
                if($result != null){
                    $data = $this->Users_model->saveOTP($_POST['email']);
                    if($data != null){
                        $data['code'] = null;
                        echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                    }else{
                        echo $this->json->response(['message'=>'Something went wrong'],$this->_Errmessage,$this->_statusErr);
                    }
                }else{
                    echo $this->json->response(['message'=>'Email not exist in Database'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function verifyOTP(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required = ['id','otp'];
            $data = $this->check_array_values($_POST,$required);
            $param = $this->check_params($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->verifyOTP($_POST['id'],$_POST['otp']);
                if($data != null){
                    $this->Users_model->updateOTPStatus($data->id);
                    // $data['otp'] = null;
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'Something went wrong'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function getToken() {
        // if (substr( $this->client_id, 0, 5 ) === "test_") {
        $this->url = "https://test.instamojo.com/oauth2/token/";
        $this->env = "test";
        // }
        $curl = curl_init($this->url);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, rawurldecode(http_build_query(array(
            'client_id' => 'test',
            'client_secret' => 'test',
            'grant_type' => 'client_credentials'
        ))));
        $json = json_decode(curl_exec($curl));
        if(curl_error($curl))
        {
            echo 'error:' . curl_error($curl);
        }
        if (isset($json->error)) {
            return "Error: " . $json->error;
            throw new \Exception("Error: " . $json->error);
        }
        $this->token = $json;
        return $this->env . $json->access_token;
    }

    public function instamojoAppToken(){
        // echo $this->json->response($this->getToken(),$this->_OKmessage,$this->_statusOK);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.instamojo.com/oauth2/token/');     
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);

        $payload = Array(
            'grant_type' => 'client_credentials',
            'client_id' => '9FwT9vC7wl3Nqbg0hXZWrM0iR0O8Tp9T4xNVxRHJ',
            'client_secret' => '0Phr0pjMsljK90ilk546cg70a1IV2OLuXbucHris5jf2jtW1Cp238e794YVWe0VM1dy4sA9P5RI79pbKCo7XxsiPPOjX1MauOkWGODgJpX5FpZvLAzBBCSrHwAftbjUA'
        );

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
        $response = curl_exec($ch);
        curl_close($ch); 

        echo $response;
    }

     public function instamojoRequest(){
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $_POST['url']);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
                    array("X-Api-Key:".$_POST['key'],
                        "X-Auth-Token:".$_POST['token']));
        $payload = Array(
            'purpose' => 'Groceryee order',
            'amount' => $_POST['amount'],
            'phone' => $_POST['phone'],
            'buyer_name' => $_POST['name'],
            'redirect_url' => $_POST['redirect_url'],
            'send_email' => true,
            'send_sms' => true,
            'email' => $_POST['email'],
            'webhook'=>$_POST['webhook'],
            'allow_repeated_payments' => false
        );
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
        $response = curl_exec($ch);
        curl_close($ch); 

        // echo $response;
        echo $this->json->response($response,$this->_OKmessage,$this->_statusOK);
    }

    public function twilloMessage(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required = ['to','msg'];
            $data = $this->check_array_values($_POST,$required);
            $param = $this->check_params($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $settings = $this->Settings_model->get_all();
                if($settings != null){
                    $cred = json_decode($settings[0]->creds);
                    // echo $this->json->response($cred,$this->_OKmessage,$this->_statusOK);
                    $id = $cred->sid;
                    $token = $cred->token;
                    $url = "https://api.twilio.com/2010-04-01/Accounts/$id/SMS/Messages";
                    $from = $cred->from;
                    $to = $_POST['to']; // twilio trial verified number
                    $otp = $this->Users_model->random_number();
                    $body = $_POST['msg'].' '.$otp;
                    $data = array (
                        'From' => $from,
                        'To' => $to,
                        'Body' => $body,
                    );
                    $post = http_build_query($data);
                    $x = curl_init($url );
                    curl_setopt($x, CURLOPT_POST, true);
                    curl_setopt($x, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($x, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($x, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                    curl_setopt($x, CURLOPT_USERPWD, "$id:$token");
                    curl_setopt($x, CURLOPT_POSTFIELDS, $post);
                    $response = curl_exec($x);
                    curl_close($x);
                    $dataResponse = $this->Users_model->saveVerifyCode($otp,$_POST['to']);
                    if($dataResponse != null){
                        $dataResponse['code'] = null;
                        echo $this->json->response($dataResponse,$this->_OKmessage,$this->_statusOK); // live
                        // echo $this->json->response(['otp'=>$dataResponse,'twillo'=>$response],$this->_OKmessage,$this->_statusOK); // productions
                    }else{
                        echo $this->json->response(['message'=>'Something went wrong1'],$this->_Errmessage,$this->_statusErr);
                    }
                }else{
                    echo $this->json->response(['message'=>'Something went wrong2'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function checkMobileNumber(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required = ['mobile','cc'];
            $data = $this->check_array_values($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->checkMobileNumber($_POST);
                if($data != null){
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'invalid phone number'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function validatePhoneAndEmail(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required =['email','phone','cc'];
            $data = $this->check_array_values($_POST,$required);
            $param = $this->check_params($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $result = $this->Users_model->email_exists($_POST['email']);
                if($result != null){
                    echo $this->json->response(['message'=>'Email Already Register in Database'],$this->_Errmessage,$this->_statusErr);
                }else{
                   $data = $this->Users_model->phoneExist($_POST['phone'],$_POST['cc']);
                    if($data != null){
                        echo $this->json->response(['message'=>'Mobile Phone Already Register in Database'],$this->_Errmessage,$this->_statusErr);
                    }else{
                        echo $this->json->response(true,$this->_OKmessage,$this->_statusOK);
                    }
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function validatePhoneForReset(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required =['phone','cc'];
            $data = $this->check_array_values($_POST,$required);
            $param = $this->check_params($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param) >0 ){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->phoneExist($_POST['phone'],$_POST['cc']);
                if($data != null){
                    echo $this->json->response(true,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>'Mobile Phone is not register in Database'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }  
    }

    public function resetPasswordWithPhone(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Users_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $this->_table_column_array = ['phone','pwd'];
            $data = $this->check_array_values($_POST,$this->_table_column_array);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $data = $this->Users_model->resetPasswordWithPhone($_POST['pwd'],$_POST['phone']);
                if($data != null){
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['message'=>$this->db->last_query()],$this->_Errmessage,$this->_statusErr);
                    // echo $this->json->response(['message'=>'Old password does not match with database.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }
}

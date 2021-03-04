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

class Chats extends CI_Controller{
    
    public $_statusOK = 200;
    public $_statusErr = 500;

    public $_OKmessage = 'Success';
    public $_Errmessage = 'Error';
    public $_ParamMessage = 'Invalid Field';

    public $_table_column_array = ['room_id','uid','from_id','message','message_type','status','timestamp'];
    public $_table_column_edit = ['id','room_id','uid','from_id','message','message_type','status','timestamp'];
    public $required = ['id'];

    public function __construct(){
		parent ::__construct();
        $this->load->library('session');
        $this->load->library('json');
		$this->load->database();
        $this->load->helper('url');
        $this->load->model('Chats_model');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization,Basic");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == "OPTIONS") {
            die();
        }
    }
    
    public function index()
	{
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Chats_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->Chats_model->get_all();
            if($data != null){
                echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
            }else{
                echo $this->json->response($this->db->error(),$this->_Errmessage,$this->_statusErr);
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }
    
    // get request
    public function getById(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Chats_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $required = ['id','oid'];
            $data = $this->check_array_values($_POST,$required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $result = $this->Chats_model->getById($_POST['id'],$_POST['oid']);
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

    public function getByGroup(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
       $this->Chats_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $result = $this->Chats_model->getByGroup($_POST['id']);
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
 
    public function editList(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
        $this->Chats_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            $param = $this->check_params($_POST,$this->_table_column_edit);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            } else if(count($param) >0){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else {
                $result = $this->Chats_model->editList($_POST,$_POST['id']);

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

    public function check_params($data,$array_compare){
         $items = array();
          foreach($data as $key=>$value){
              $items[] = $key;
           }
           $result=array_diff($items,$array_compare);
           return $result;
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

    // post request
    public function save(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
        $this->Chats_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->_table_column_array);
            $param = $this->check_params($_POST,$this->_table_column_array);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else if(count($param)>0){
                echo $this->json->response(array_values($param),$this->_ParamMessage,$this->_statusErr);
            }else {
                $result = $this->Chats_model->saveList($_POST);
                if($result != null){
                    $id = $this->db->insert_id();
                    $data = $this->Chats_model->getByIdValue($id);
                    echo $this->json->response($data,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['error'=>'Something Went Wrong.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }

    public function deleteList(){
        $agent = $this->input->request_headers();
        $saveLogInfo = array(
            'url' => $this->uri->uri_string(),
            'agent' => json_encode($agent),
            'datetime' => date('Y-m-d h:i:s') 
        );
        $this->Chats_model->saveUserLogs($saveLogInfo);
        $auth  = $this->input->get_request_header('Basic');
        if($auth && $auth == $this->config->item('encryption_key')){
            $data = $this->check_array_values($_POST,$this->required);
            if(isset($data) && !empty($data)){
                echo $this->json->response($data,$this->_Errmessage,$this->_statusErr);
            }else{
                $result = $this->Chats_model->deleteList($_POST['id']);
                if($result != null){
                    echo $this->json->response($result,$this->_OKmessage,$this->_statusOK);
                }else{
                    echo $this->json->response(['error'=>'Something Went Wrong.'],$this->_Errmessage,$this->_statusErr);
                }
            }
        }else{
            echo $this->json->response('No Token Found',$this->_Errmessage,$this->_statusErr);
        }
    }
 
}

<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Users extends Galyon_controller {
    function __construct(){
		parent::__construct();
    }
    
    function login() {
        $uname = $this->input->post('uname');
        $pword = $this->input->post('pword');

        if(empty($uname) || empty($pword)) {
            $this->json_response("None", false, "Required fields empty!");
        }

        $user = $this->Crud_model->get('users', '*', array( "email" => $uname ) );
        if($user != null) {
            if(password_verify($pword, $user->password)){
                //Finalized
                $now = strtotime(get_my_local_time());
                $span = 43200; ////12hrs
                $expiry = (int)$now + (int)$span;

                $user_object = array(
                    'uuid' => $user->uuid,
                    'email' => $user->email,
                    'role' => $user->type,
                    'logged_in' => true,
                    'expiry' => $expiry
                );
                $token = JWT::encode($user_object, $this->config->item('encryption_key'));
                $this->json_response($token);
            } else {
                $this->json_response(null, false, "Invalid credential!");
            }
        } else {
            $this->json_response(null, false, "User not found!");
        }
    }
}
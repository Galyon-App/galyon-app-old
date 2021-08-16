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
                unset($user->password);
                $this->session->set_userdata(array(
                    'username' => $user->mobile,
                    'email' => $user->email,
                    'role' => $user->type,
                    'token' => session_id(),
                    'logged_in' => true
                ));
                $this->json_response($this->session->userdata()); //session_id()
            } else {
                $this->json_response(null, false, "Invalid credential!");
            }
            
        } else {
            $this->json_response(null, false, "User not found!");
        }
    }

    function verify() {
        $logged_in = $this->session->userdata('logged_in');
        $token = $this->session->userdata('token');

        if($token != $this->input->post('token')) {
            $this->json_response(null, false, "Session is invalid.");
        }
        if(!$logged_in) {
            $this->json_response(null, false, "You are not logged in.");
        }
        
        $this->json_response($this->session->userdata());
    }

    function logout() {
        $logged_in = $this->session->userdata('logged_in');
        $token = $this->session->userdata('token');

        if($token != $this->input->post('token')) {
            $this->json_response(null, false, "Session is invalid.");
        }
        if(!$logged_in) {
            $this->json_response(null, false, "You are not logged in.");
        }

        $this->session->sess_destroy();
        $this->json_response(null);
    }
}
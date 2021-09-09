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

    private $table_name = 'users';
    private $required = ['uuid'];
    private $public_column = ['uuid','username','email','phone','cover','first_name','last_name','gender','type','subscriber','status','verified_at','timestamp','updated_at', 'deleted_at'];

    function __construct(){
		parent::__construct();
    }
    
    function login() {
        $uname = $this->input->post('uname');
        $pword = $this->input->post('pword');

        if(empty($uname) || empty($pword)) {
            $this->json_response("None", false, "Required fields empty!");
        }

        $column = $this->public_column;
        $column[] = "password";

        $user = $this->Crud_model->get($this->table_name, $column, array( "email" => $uname ) );
        if($user != null) {
            if($user->status != "1") {
                $this->json_response(null, false, "Account is currently inactive!");
            }

            if($user->verified_at == null || empty($user->verified_at)) {
                $this->json_response(null, false, "You're account is not yet verified!");
                if($exit) {
                    exit;
                }
            }

            if(password_verify($pword, $user->password)){
                $user_object = array(
                    'uuid' => $user->uuid,
                    'email' => $user->email,
                    'role' => $user->type,
                    'status' => $user->status,
                    'logged_in' => true,
                    'expiry' => strtotime(get_current_utc_time())
                );
                $token = JWT::encode($user_object, $this->config->item('jwt_secret_phrase'));
                $this->json_response($token);
            } else {
                $this->json_response(null, false, "Invalid credential!");
            }
        } else {
            $this->json_response(null, false, "User not found!");
        }
    }

    function getByID() {
        //$user = $this->is_authorized();
        //Add more column if admin.

        $user_id = $this->input->post('uuid');
        $user = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $user_id ), null, 'row' );

        if($user) {
            $this->json_response($user);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function getAll() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            $basic  = $this->input->get_request_header('Basic');
            if($user->role === "admin" &&  $basic === "") {
                $where = null; 
            }
        }

        $search = $this->input->post('search');
        if(!empty($search)) {
            $searching = "(first_name LIKE '%$search%' OR last_name LIKE '%$search%')";
            if($where == null) {
                $where = $searching;
            } else {
                $where .= " AND ".$searching;
            }
        }

        $users = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($users) {
            $this->json_response($users);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $user_id = $this->input->post('uuid');
        $user = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $user_id ));

        if($user) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $user_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $user_id = $this->input->post('uuid');
        $user = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $user_id ));

        if($user) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $user_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function updateUserProfile() {
        $uuid = $this->input->post('uuid');

        $user = $this->is_authorized();
        if($user->role !== "admin" && $user->uuid != $uuid) {
            $this->json_response(null, false, "You are not authorized.");
        }

        $first_name = $this->input->post('first_name');
        $last_name = $this->input->post('last_name');
        $phone = $this->input->post('phone');
        $gender = $this->input->post('gender');

        if(empty($first_name) || empty($last_name) || empty($phone) || empty($gender) || empty($uuid)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $new_val = array( 
            "first_name" => $first_name,
            "last_name" => $last_name,
            "phone" => $phone,
            "gender" => $gender
        );

        $cover = $this->input->post('cover');
        if(!empty($cover)) {
            $new_val['cover'] = $cover;
        }

        $success = $this->Crud_model->update($this->table_name, $new_val, array( "uuid" => $uuid ));

        if($success) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }
    
}
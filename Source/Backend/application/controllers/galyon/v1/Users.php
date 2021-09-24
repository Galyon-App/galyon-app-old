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
    private $edit_column = ['uuid','username','email','phone','cover','first_name','last_name','gender','type','subscriber','status','timestamp'];
    private $public_column = ['uuid','username','email','phone','cover','first_name','last_name','gender','type','subscriber','status','activation_key','verified_at','timestamp','updated_at', 'deleted_at'];

    private $template = '<div style="background-color: #eeeeef; padding: 50px 0; ">
            <div style="max-width:640px; margin:0 auto; ">
                <div style="color: #fff; text-align: center; background-color: #EC008C; 
                    padding: 30px; border-top-left-radius: 3px; border-top-right-radius: 3px; margin: 0;">
                    <h1 style="text-align: center;">ACCOUNT ACTIVATION</h1>
                </div>
                <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                    <p style="color: rgb(85, 85, 85); font-size: 14px;"> Welcome {FULLNAME},<br><br></p>
                    <p style="color: rgb(85, 85, 85); font-size: 14px;">
                        Thank you for joining! We\'re happy that you are here. One more step and you\'re all set. Activate your account now just by setting your password with the activation key provided below.
                    </p>
                    <p style="color: rgb(85, 85, 85); font-size: 14px;">
                        Email Address: {EMAIL}
                    </p>
                    <p style="color: rgb(85, 85, 85); font-size: 14px;">
                        Activation Key: {KEY}
                    </p>
                    <hr>
                    <p style="color: rgb(85, 85, 85); font-size: 14px;">
                        Brilliant Skin Essentials is the gem in the beauty and cosmetics brand in the Philippines. With natural, safe and proven formulation offered by Brilliant Skin Essentials, it continuously creates accessible beauty products to fulfill the skin care needs of Filipinos.
                    </p>
                    
                    <p style="color: rgb(85, 85, 85);"><br></p>
                    <p style="color: rgb(85, 85, 85); font-size: 14px;">Brilliant Skin Essentials Inc.</p>
                    <p style="color: rgb(85, 85, 85); font-size: 14px;">brilliantskinessentials.ph</p>
                    <p style="color: rgb(85, 85, 85); font-size: 14px; text-align: center; margin-top: 40px;">Powered by: MailGuy &copy; <a href="https://bytescrafter.net">BytesCrafter</a></p>
                </div>
            </div>
        </div>';

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

    function registerUser() {
        $email = $this->input->post('email');
        $fullname = $this->input->post('first_name')." ".$this->input->post('last_name');
        $activation = get_random_string(5, "123456789ABCDEFGHJKLMNPQRSTUVWXYZ");

        $request = $this->request_validation($_POST, ["email","first_name","last_name","gender"], $this->edit_column);
        $request->data = array_merge(array(
            "uuid" => $this->uuid->v4(),
            "password" => password_hash($activation.get_current_utc_time(), PASSWORD_BCRYPT),
            "activation_key" => password_hash($activation, PASSWORD_BCRYPT),
            "timestamp" => get_current_utc_time() 
        ), $request->data);
        $inserted = $this->Crud_model->insert($this->table_name, $request->data);

        if($inserted) {
            $html_message = $this->template;
            $html_message = str_replace('{EMAIL}', $email, $html_message);
            $html_message = str_replace('{KEY}', $activation, $html_message);
            $html_message = str_replace('{FULLNAME}', $fullname, $html_message);

            $is_sent = $this->send_mail($email, "Account Activation", $html_message);
            if($is_sent["success"]) {
                $new_user = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
                unset($new_user->password);
                unset($new_user->activation_key);
                $this->json_response($new_user);
            } else {
                $this->json_response(null, false, "Failed sending email, contact us!");
            }
            $this->json_response();
        } else {
            $this->json_response(null, false, "Something went wrong during registration!");
        }
    }

    function resetPassword() {
        //TODO: 
    }

    function verifyAccount() {
        $request = $this->request_validation($_POST, ["uuid", "email", "activation_key"], $this->edit_column);
        $request->data = array_merge(array(
            "verified_at" => get_current_utc_time() //TODO: Temporary, should from admin.
        ), $request->data);

        $uuid = $request->data["uuid"];
        $email = $request->data["email"];
        $activation_key = $request->data["activation_key"];
        $request->data["activation_key"] = NULL;

        $user = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$uuid' AND email = '$email' AND activation_key IS NOT NULL", null, 'row' );
        if($user) {
            if(password_verify($activation_key, $user->activation_key)) {
                $update = $this->Crud_model->update(
                    $this->table_name, 
                    $request->data, 
                    array( "uuid" => $user->uuid ));
                if($update) {
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
                    $this->json_response(null, false, "Failed to verify account! Reset password");
                }
            } else {
                $this->json_response(null, false, "Verification key is incorrect!".$activation_key);
            }
        } else {
            $this->json_response(null, false, "No user verification was found!");
        }
    }

    function activateAccount() {
        $request = $this->request_validation($_POST, ["email", "activation_key", "password"], $this->edit_column);
        $request->data = array_merge(array(
            "verified_at" => get_current_utc_time() //TODO: Temporary, should from admin.
        ), $request->data);
        $request->data["password"] = password_hash($request->data["password"], PASSWORD_BCRYPT);
        $email = $request->data["email"];
        $activation_key = $request->data["activation_key"];
        $request->data["activation_key"] = NULL;

        $user = $this->Crud_model->get($this->table_name, $this->public_column, "email = '$email' AND activation_key IS NOT NULL", null, 'row' );
        
        if($user) {
            if(password_verify($activation_key, $user->activation_key)) {
                $update = $this->Crud_model->update(
                    $this->table_name, 
                    $request->data, 
                    array( "uuid" => $user->uuid ));
                if($update) {
                    //Send email here that the user account ius activated.
                    $this->json_response(null);
                } else {
                    $this->json_response(null, false, "Failed to activate account! Reset password");
                }
            } else {
                $this->json_response(null, false, "Activation key is incorrect!");
            }
        } else {
            $this->json_response(null, false, "No user activation was found!");
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
            if($user->role === "admin" &&  $basic == "admin") {
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
<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Popups extends Galyon_controller {

    private $table_name = 'popups';
    private $public_column = ['uuid','message','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getMostRecent() {
        $user = $this->is_authorized(false);

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $popup = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'row' );

        if($popup) {
            $this->json_response($popup);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    function getPopupByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $popup_id = $this->input->post('uuid');
        $where = "uuid = '$popup_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $popup = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'row' );

        if($popup) {
            $this->json_response($popup);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    function getAllPopups() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $popups = $this->Crud_model->get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($popups) {
            $this->json_response($popups);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    function createNewPopup() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $message = $this->input->post('message');

        if(empty($message)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "message" => $message, 
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editPopupCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->input->post('uuid');
        $message = $this->input->post('message');
        $status = $this->input->post('status');

        if(empty($uuid) || empty($message)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $popup = array( 
            "uuid" => $uuid, 
            "message" => $message, 
            "status" => $status, 
        );

        $updated = $this->Crud_model->update($this->table_name,  $popup, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $popup_id = $this->input->post('uuid');
        $popup = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $popup_id ));

        if($popup) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $popup_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $popup_id = $this->input->post('uuid');
        $popup = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $popup_id ));

        if($popup) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $popup_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    function deletePopupCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $popup_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $popup_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }
}
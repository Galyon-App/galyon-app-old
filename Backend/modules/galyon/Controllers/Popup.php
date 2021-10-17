<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Popup extends AppCore
{
    private $table_name = 'popups';
    private $public_column = ['uuid','message','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    public function getMostRecent() {
        $user = $this->is_authorized(false);

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $popup = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, null, 'row' );

        if($popup) {
            $this->json_response($popup);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    public function getPopupByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $popup_id = $this->request->getVar('uuid');
        $where = "uuid = '$popup_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $popup = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, null, 'row' );

        if($popup) {
            $this->json_response($popup);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    public function getAllPopups() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $popups = $this->Crud_model->sql_get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($popups) {
            $this->json_response($popups);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    public function createNewPopup() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $message = $this->request->getVar('message');

        if(empty($message)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "message" => $message,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function editPopupCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->request->getVar('uuid');
        $message = $this->request->getVar('message');
        $status = $this->request->getVar('status');

        if(empty($uuid) || empty($message)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $popup = array( 
            "uuid" => $uuid, 
            "message" => $message, 
            "status" => $status, 
        );

        $updated = $this->Crud_model->sql_update($this->table_name,  $popup, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    public function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $popup_id = $this->request->getVar('uuid');
        $popup = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), array( "uuid" => $popup_id ));

        if($popup) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $popup_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    public function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $popup_id = $this->request->getVar('uuid');
        $popup = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), array( "uuid" => $popup_id ));

        if($popup) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $popup_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }

    public function deletePopupCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $popup_id = $this->request->getVar('uuid');
        $is_deleted = $this->Crud_model->sql_delete($this->table_name, array( "uuid" => $popup_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No popup was found!");
        }
    }
}

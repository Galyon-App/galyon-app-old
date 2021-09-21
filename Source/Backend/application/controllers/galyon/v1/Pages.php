<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Pages extends Galyon_controller {

    private $table_name = 'pages';
    private $public_column = ['ukey','name','content','status','timestamp','updated_at','deleted_at'];
    private $required = ['ukey'];

    function __construct(){
		parent::__construct();
    }

    function getPageByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $pages_id = $this->input->post('ukey');
        $where = "ukey = '$pages_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $pages = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'row' );

        if($pages) {
            $this->json_response($pages);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    function getAllPages() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $pagess = $this->Crud_model->get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($pagess) {
            $this->json_response($pagess);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    function createNewPage() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $ukey = $this->input->post('ukey');
        $name = $this->input->post('name');
        $content = $this->input->post('content');

        if(empty($ukey) || empty($name) || empty($content)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "ukey" => $ukey, 
            "name" => $name, 
            "content" => $content,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editPageCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $ukey = $this->input->post('ukey');
        $name = $this->input->post('name');
        $content = $this->input->post('content');

        if(empty($ukey) || empty($name) || empty($content)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $pages = array( 
            "name" => $name, 
            "content" => $content, 
        );
        $updated = $this->Crud_model->update($this->table_name, $pages, "ukey = '$ukey'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "ukey" => $ukey ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $pages_id = $this->input->post('ukey');
        $pages = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "ukey" => $pages_id ));

        if($pages) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "ukey" => $pages_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $pages_id = $this->input->post('ukey');
        $pages = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "ukey" => $pages_id ));

        if($pages) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "ukey" => $pages_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    function deletePageCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $pages_id = $this->input->post('ukey');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "ukey" => $pages_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }
}
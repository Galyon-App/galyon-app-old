<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Banners extends Galyon_controller {

    private $table_name = 'banners';
    private $public_column = ['uuid','cover','message','link','type','position','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getBannerByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $banner_id = $this->input->post('uuid');
        $where = "uuid = '$banner_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $banner = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'row' );

        if($banner) {
            $this->json_response($banner);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    function getAllBanners() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $banners = $this->Crud_model->get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($banners) {
            $this->json_response($banners);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    function createNewBanner() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $position = $this->input->post('position');
        $link = $this->input->post('link');
        $type = $this->input->post('type');
        $message = $this->input->post('message');
        $cover = $this->input->post('cover');

        if(empty($position) || empty($type) || empty($link) || empty($cover)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "position" => $position, 
            "link" => $link, 
            "type" => $type,
            "message" => $message, 
            "cover" => $cover,
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editBannerCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->input->post('uuid');
        $position = $this->input->post('position');
        $link = $this->input->post('link');
        $type = $this->input->post('type');
        $message = $this->input->post('message');
        $cover = $this->input->post('cover');

        if(empty($uuid) || empty($position) || empty($type || empty($link)) ) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $banner = array( 
            "position" => $position, 
            "link" => $link, 
            "type" => $type,
            "message" => $message, 
        );

        if(!empty($cover)) {
            //upload and update database.
            $banner['cover'] = $cover;
        }

        $updated = $this->Crud_model->update($this->table_name,  $banner, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $banner_id = $this->input->post('uuid');
        $banner = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $banner_id ));

        if($banner) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $banner_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $banner_id = $this->input->post('uuid');
        $banner = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $banner_id ));

        if($banner) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $banner_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    function deleteBannerCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $banner_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $banner_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }
}
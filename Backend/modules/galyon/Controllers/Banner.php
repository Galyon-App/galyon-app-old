<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Banner extends AppCore
{
    private $table_name = 'banners';
    private $public_column = ['uuid','cover','message','link','type','position','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    public function getBannerByID() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $banner_id = $this->request->getVar('uuid');
        if(empty($banner_id)) {
            $this->json_response(null, false, "Required field cannot be empty");
        }
        if($where == null) {
            $where = "uuid = '$banner_id'";
        } else {
            $where .= " AND uuid = '$banner_id'";
        }
        
        $banner = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, null, 'row' );

        if($banner) {
            $this->json_response($banner);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    public function getAllBanners() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $position = $this->request->getVar('position');
        if(!empty($position)) {
            if($where == null) {
                $where = "position = '$position'";
            } else {
                $where .= " AND position = '$position'";
            }
        }

        $banners = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($banners) {
            $this->json_response($banners);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    public function createNewBanner() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $position = $this->request->getVar('position');
        $link = $this->request->getVar('link');
        $type = $this->request->getVar('type');
        $message = $this->request->getVar('message');
        $cover = $this->request->getVar('cover');

        if(empty($cover)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "position" => $position, 
            "link" => $link, 
            "type" => $type,
            "message" => $message, 
            "cover" => $cover,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function editBannerCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->request->getVar('uuid');
        $position = $this->request->getVar('position');
        $link = $this->request->getVar('link');
        $type = $this->request->getVar('type');
        $message = $this->request->getVar('message');
        $cover = $this->request->getVar('cover');

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

        $updated = $this->Crud_model->sql_update($this->table_name,  $banner, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    public function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $banner_id = $this->request->getVar('uuid');
        $banner = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), array( "uuid" => $banner_id ));

        if($banner) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $banner_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    public function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $banner_id = $this->request->getVar('uuid');
        $banner = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), array( "uuid" => $banner_id ));

        if($banner) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $banner_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No banner was found!");
        }
    }

    public function deleteBannerCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $banner_id = $this->request->getVar('uuid');
        $is_deleted = $this->Crud_model->sql_delete($this->table_name, array( "uuid" => $banner_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }
}

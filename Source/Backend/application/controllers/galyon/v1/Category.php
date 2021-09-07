<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Category extends Galyon_controller {

    private $table_name = 'category';
    private $public_column = ['uuid','parent_id','store_id','name','cover','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getCategoryByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $category_id = $this->input->post('uuid');
        $where = "uuid = '$category_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $category = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'row' );

        if($category) {
            $this->json_response($category);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    protected function getCategoryMeta($categories) {
        foreach($categories as $category) {
            if(!empty($category->parent_id)) {
                $current = $this->Crud_model->get($this->table_name, 'name', "uuid = '$category->parent_id'", NULL, 'row' );
                $category->{"parent"} = $current->name;
            } else {
                $category->{"parent"} = null;
            }
            if(!empty($category->store_id)) {
                $current = $this->Crud_model->get('stores', 'name', "uuid = '$category->store_id'", NULL, 'row' );
                $category->{"store"} = $current->name;
            } else {
                $category->{"store"} = null;
            }
        }
        return $categories;
    }

    function getParentCategorys() {
        $user = $this->is_authorized(false);
        $where = "parent_id IS NULL AND status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $categorys = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function getChildCategorys() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $parent_id = $this->input->post('parent_id');
        if($where != null) {
            $where .= " AND parent_id = '$parent_id'";
        } else {
            $where = "parent_id IS NOT NULL";
        }

        $categorys = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function getAllCategorys() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $categorys = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function createNewCategory() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $name = $this->input->post('name');
        $cover = $this->input->post('cover');
        $parent = $this->input->post('parent');

        if(empty($name) || empty($cover)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "name" => $name,
            "parent_id" => $parent, 
            "cover" => $cover, 
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editCategoryCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->input->post('uuid');
        $name = $this->input->post('name');
        $cover = $this->input->post('cover');
        $parent = $this->input->post('parent');

        if(empty($uuid) || empty($name)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        if($parent == 'null') {
            $parent = null;
        }

        $category = array( 
            "name" => $name,
            "parent_id" => $parent != 'null' ? $parent : null, 
        );

        if(!empty($cover)) {
            //upload and update database.
            $category['cover'] = $cover;
        }

        $updated = $this->Crud_model->update($this->table_name,  $category, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $category_id = $this->input->post('uuid');
        $category = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $category_id ));

        if($category) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $category_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $category_id = $this->input->post('uuid');
        $category = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $category_id ));

        if($category) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $category_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function deleteCategoryCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $category_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $category_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }
}
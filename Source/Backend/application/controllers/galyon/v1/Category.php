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
        $auth = $this->is_authorized();

        $category_id = $this->input->post('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }
        
        $category = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["uuid = '$category_id'"]), NULL, 'row' );

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
                $category->{"parent"} = $current ? $current->name : null;
            } else {
                $category->{"parent"} = null;
            }
            if(!empty($category->store_id)) {
                $current = $this->Crud_model->get('stores', 'name', "uuid = '$category->store_id'", NULL, 'row' );
                $category->{"store"} = $current ? $current->name : null;
            } else {
                $category->{"store"} = null;
            }
        }
        return $categories;
    }

    function getParentCategorys() {
        $auth = $this->is_authorized();

        $categorys = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["parent_id IS NULL"]), NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function getChildCategorys() {
        $auth = $this->is_authorized();

        $parent_id = $this->input->post('parent_id');
        if(!empty($parent_id)) {
            $parent_id = "parent_id = '$parent_id'";
        } else {
            $parent_id = "parent_id IS NOT NULL";
        }
        
        $categorys = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [$parent_id]), NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function getAllCategorys() {
        $auth = $this->is_authorized();

        $categorys = $this->Crud_model->get($this->table_name, $this->public_column, $auth->where, NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    function createNewCategory() {
        $auth = $this->is_authorized(true, ["admin"]);

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
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editCategoryCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);

        $uuid = $this->input->post('uuid');
        $name = $this->input->post('name');
        $cover = $this->input->post('cover');
        $parent = $this->input->post('parent');

        if(empty($uuid) || empty($name)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $updates = array( 
            "name" => $name,
            "parent_id" => empty($parent) ? null : $parent, 
        );

        if(!empty($cover)) {
            $updates['cover'] = $cover;
        }

        $updated = $this->Crud_model->update($this->table_name, $updates, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$uuid'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }

    function activate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $category_id = $this->input->post('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->update($this->table_name, array( "status" => "1" ), "uuid = '$category_id'");

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$category_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }

    function deactivate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $category_id = $this->input->post('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->update($this->table_name, array( "status" => "0" ), "uuid = '$category_id'");

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$category_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }

    function deleteCategoryCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);

        $category_id = $this->input->post('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$category_id'" );

        if($is_deleted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$category_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }
}
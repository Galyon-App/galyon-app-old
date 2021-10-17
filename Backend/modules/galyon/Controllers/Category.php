<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Category extends AppCore
{
    private $table_name = 'category';
    private $public_column = ['uuid','parent_id','store_id','name','cover','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    public function getCategoryByID() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, ["uuid"], [], ["uuid"]); 
        
        $category = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where), NULL, 'row' );

        if($category) {
            $this->json_response($category);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    protected function getCategoryMeta($categories) {
        foreach($categories as $category) {
            if(!empty($category->parent_id)) {
                $current = $this->Crud_model->sql_get($this->table_name, 'name', "uuid = '$category->parent_id'", NULL, 'row' );
                $category->{"parent"} = $current ? $current->name : null;
            } else {
                $category->{"parent"} = null;
            }
            if(!empty($category->store_id)) {
                $current = $this->Crud_model->sql_get('stores', 'name', "uuid = '$category->store_id'", NULL, 'row' );
                $category->{"store"} = $current ? $current->name : null;
            } else {
                $category->{"store"} = null;
            }
        }
        return $categories;
    }

    public function getParentCategorys() {
        $auth = $this->is_authorized(false);

        $categorys = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["parent_id IS NULL"], true), NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    public function getChildCategorys() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, ["parent_id"], [], ["parent_id"]); 
        
        $categorys = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where, true), NULL, 'result' );
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    public function getAllCategorys() {
        $auth = $this->is_authorized(false);

        $categorys = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [], true), NULL, 'result', null, $this->checkIfOrderedResult());
        if($categorys) {
            $categorys = $this->getCategoryMeta($categorys);
            $this->json_response($categorys);
        } else {
            $this->json_response(null, false, "No category was found!");
        }
    }

    public function createNewCategory() {
        $auth = $this->is_authorized(true, ["admin"]);

        $name = $this->request->getVar('name');
        $cover = $this->request->getVar('cover');
        $parent = $this->request->getVar('parent');

        if(empty($name) || empty($cover)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "name" => $name,
            "parent_id" => $parent, 
            "cover" => $cover,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function editCategoryCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);

        $uuid = $this->request->getVar('uuid');
        $name = $this->request->getVar('name');
        $cover = $this->request->getVar('cover');
        $parent = $this->request->getVar('parent');

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

        $updated = $this->Crud_model->sql_update($this->table_name, $updates, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$uuid'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }

    public function activate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $category_id = $this->request->getVar('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), "uuid = '$category_id'");

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$category_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }

    public function deactivate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $category_id = $this->request->getVar('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), "uuid = '$category_id'");

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$category_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }

    public function deleteCategoryCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);

        $category_id = $this->request->getVar('uuid');
        if(empty($category_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->sql_update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$category_id'" );

        if($is_deleted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$category_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No category or changes was found!");
        }
    }
}

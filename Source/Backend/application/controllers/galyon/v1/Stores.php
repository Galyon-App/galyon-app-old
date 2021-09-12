<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Stores extends Galyon_controller {

    private $table_name = 'stores';
    private $edit_column = ['owner','city_id','name','descriptions','phone','email','cover','images','commission','open_time','close_time','isClosed','is_featured','status'];
    private $public_column = ['uuid','owner','city_id','name','descriptions','phone','email','cover','images','commission','open_time','close_time','isClosed','is_featured','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getStoreById() {
        $auth = $this->is_authorized(false);

        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $store = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["uuid = '$uuid'"]), NULL, 'row' );
        if($store) {
            $store = $this->getStoreMeta($store, true);
            $this->json_response($store);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    //Temporary
    function getStoreByIds() {
        $uuids = $this->input->post('uuids');
        if(empty($uuids)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }
        $where = "";
        $store_ids = explode(',',$uuids);
        foreach($store_ids as $stid) {
            if($where != "") {
                $where .= " OR ";
            }
            $where .= "uuid = '$stid'";
        }

        $stores = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    function getAllStores() {
        $auth = $this->is_authorized(false);

        $limit_start = (int)$this->input->post('limit_start');
        $limit_length = $this->input->post('limit_length');
        $limit_length = $limit_length ? (int)$limit_length : 10;

        $stores = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [" LIMIT $limit_start, $limit_length "], false), NULL, 'result' );
        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    function getStoresByCategory() {
        $auth = $this->is_authorized(false);
        
        $city_id = $this->input->post('city_id');
        $subcategory_id = $this->input->post('subcategory_id');
        if(empty($city_id) || empty($subcategory_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $limit_start = $this->input->post('limit_start');
        $limit_length = $this->input->post('limit_length');
        $limit_length = $limit_length ? (int)$limit_length : 10;
        $params = array($city_id, $subcategory_id, (int)$limit_start, $limit_length);

        $start_query = "
            SELECT DISTINCT(`products`.`store_id`) 
        ";
        foreach($this->public_column as $column) {
            $start_query .= ", `$this->table_name`.`$column`";
        }
        $end_query = "
            FROM `$this->table_name` INNER JOIN `products` ON 
                `$this->table_name`.`uuid` = `products`.`store_id` 
            WHERE 
                `$this->table_name`.status=1 AND 
                `$this->table_name`.`deleted_at` IS NULL AND 
                `$this->table_name`.`city_id`=? AND 
                `products`.`subcategory_id`=? 
            LIMIT ?, ?
        ";
        $stores = $this->Crud_model->custom($start_query.$end_query, $params, 'result');

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response($stores, false, "No store associated to the subcategory!");
        }
    }
    
    function getStoreByOwner() {
        $auth = $this->is_authorized(false);

        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $stores = $this->Crud_model->get($this->table_name, $this->$public_column, 
            $this->compileWhereClause($auth->where, [" owner = '$uuid'"]), null, 'row' );

        if($stores) {
            $stores = $this->getStoreMeta($stores, true);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    }

    function getStoreByCity() {
        $auth = $this->is_authorized(false);

        $city_id = $this->input->post('uuid');
        if(empty($city_id)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $stores = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [" city_id = '$city_id'"]), null, 'result' );

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this city!");
        }
    }

    function getStoreFeatured() {
        $auth = $this->is_authorized(false);

        $stores = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [" is_featured = '1'"]), null, 'result' );

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this city!");
        }
    }

    protected function getStoreMetaItem($store) {
        unset($store->id);
    
        $address = $this->Crud_model->get('address', '*', array( "store_id" => $store->uuid ), null, 'row' );
        $store->address = null;
        if($address){
            $store->address = $address->house.", ".$address->address;
        }

        $owner = $this->Crud_model->get('users', 'first_name, last_name', array( "uuid" => $store->owner ), null, 'row' );
        $store->owner_name = "-";
        if($owner){
            $store->owner_name = $owner->first_name .' '. $owner->last_name;
        }

        $city = $this->Crud_model->get('cities', 'name', array( "uuid" => $store->city_id ), null, 'row' );
        $store->city_name = "-";
        if($city){
            $store->city_name = $city->name;
        }
        
        $store->ratings = '-';

        return $store;
    }

    protected function getStoreMeta($stores, $single = false) {
        if($single) {
            $stores = $this->getStoreMetaItem($stores);
        } else {
            foreach($stores as $store) {
                $store = $this->getStoreMetaItem($store);
            }
        }
        return $stores;
    }

    function activate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $store_id = $this->input->post('uuid');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->update($this->table_name, array( "status" => "1" ), "uuid = '$store_id'");

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$store_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }

    function deactivate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $store_id = $this->input->post('uuid');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->update($this->table_name, array( "status" => "0" ), "uuid = '$store_id'");

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$store_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }

    function createNewStore() {
        $auth = $this->is_authorized(true, ["admin"]);
        $request = $this->request_validation($_POST, ["name", "cover"], $this->edit_column);
        $request->data = array_merge(array(
            "uuid" => $this->uuid->v4(),
            "parent_id" => $this->Crud_model->sanitize_param($this->input->post("parent"))
        ), $request->data);

        $inserted = $this->Crud_model->insert($this->table_name, $request->data);

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editStoreCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);
        $request = $this->request_validation($_POST, ["uuid", "name"], $this->edit_column);

        $update = $this->Crud_model->update($this->table_name, $request->data, array( "uuid" => $request->data['uuid'] ));
        if($update) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $request->data['uuid'] ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }

    function deleteStoreCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);

        $store_id = $this->input->post('uuid');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$store_id'" );

        if($is_deleted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$store_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }
}
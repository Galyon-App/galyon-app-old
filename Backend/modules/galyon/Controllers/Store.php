<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Store extends AppCore
{
    private $table_name = 'stores';
    private $edit_column = ['owner','city_id','name','descriptions','phone','email','cover','images','commission','open_time','close_time','isClosed','is_featured','status','timestamp'];
    private $public_column = ['uuid','owner','city_id','name','descriptions','phone','email','cover','images','commission','open_time','close_time','isClosed','is_featured','pending_update','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    protected function is_owner_of_store($user_id, $store_id) {
        $params = array(
            $user_id, 
            $store_id
        );

        $query = " SELECT `uuid` 
        FROM `stores` 
        WHERE `owner` = ? AND `uuid` = ?
        ";

        return $this->Crud_model->sql_custom($query, $params, 'row');
    }

    public function getStoreById() {
        $auth = $this->is_authorized(false);

        $uuid = $this->request->getVar('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $store = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["uuid = '$uuid'"]), NULL, 'row' );
        if($store) {
            $store = $this->getStoreMetaItem($store, true);
            $this->json_response($store);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    //Temporary
    public function getStoreByIds() {
        $uuids = $this->request->getVar('uuids');
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

        $stores = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    public function getAllStores() {
        $auth = $this->is_authorized(false);

        $filter_term = $this->request->getVar('filter_term');
        $city_id = $this->request->getVar('city_id');
        $limit_start = (int)$this->request->getVar('limit_start');
        $limit_length = (int)$this->request->getVar('limit_length');
        $limit_length = $limit_length ? $limit_length : 10;

        $order_by = [];
        $order_column = $this->request->getVar('order_column');
        $order_mode = $this->request->getVar('order_mode');
        if(isset($order_column) && isset($order_mode)) {
            $order_by = [$order_column, $order_mode];
        }

        if(empty($city_id)) {
            $params = array(
                $limit_start,
                $limit_length
            );
        } else {
            $params = array(
                $city_id, 
                $limit_start,
                $limit_length
            );
        }
        
        $query = " SELECT `id` ";
        foreach($this->public_column as $column) {
            $query .= ",`$column` ";
        }
        $query .= " FROM `stores` ";
        $query .= " WHERE deleted_at IS NULL ";
        $query .= empty($city_id) ? "" : " AND `city_id` = ? ";
        $query .= $auth->role == "user" || $auth->role == "store" ? " AND `status`='1' AND deleted_at IS NULL":"";
        $query .= empty($filter_term) ? "" : " AND name LIKE '%".$filter_term."%' ";
        $query .= count($order_by) == 2 ? " ORDER BY $order_by[0] $order_by[1]" : "";
        $query .= " LIMIT ?, ?";   

        $stores = $this->Crud_model->sql_custom($query, $params, 'result');
        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store is found!");
        }
    }

    public function getStoresByCategory() {
        $auth = $this->is_authorized(false);
        
        $city_id = $this->request->getVar('city_id');
        $subcategory_id = $this->request->getVar('subcategory_id');
        if(empty($city_id) || empty($subcategory_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $limit_start = $this->request->getVar('limit_start');
        $limit_length = $this->request->getVar('limit_length');
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
        $stores = $this->Crud_model->sql_custom($start_query.$end_query, $params, 'result');

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response($stores, false, "No store associated to the subcategory!");
        }
    }
    
    public function getStoreByOwner() {
        $auth = $this->is_authorized(false);

        $uuid = $this->request->getVar('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $stores = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [" owner = '$uuid'"]), null, 'result' );

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    }

    public function getStoreByCity() {
        $auth = $this->is_authorized(false);

        $city_id = $this->request->getVar('uuid');
        if(empty($city_id)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $stores = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [" city_id = '$city_id'"]), null, 'result' );

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this city!");
        }
    }

    public function getStoreFeatured() {
        $auth = $this->is_authorized(false);

        $where = [" is_featured = '1'"];
        $city_id = $this->request->getVar('city_id');
        if(!empty($city_id)) {
            $where[] = "city_id = '$city_id'";
        }

        $stores = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $where), null, 'result' );

        if($stores) {
            $stores = $this->getStoreMeta($stores);
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this city!");
        }
    }

    protected function getStoreMetaItem($store, $with_pending = false) {
        unset($store->id);

        // $links = $this->Crud_model->sql_get('stores_links', '*', array( "store_id" => $store->uuid ), null, 'row' );
        // $store->shopee = $links ? $links->shopee: "";
        // $store->lazada = $links ? $links->lazada: "";
        // $store->facebook = $links ? $links->facebook: "";
        // $store->instagram = $links ? $links->instagram: "";
        // $store->tiktok = $links ? $links->tiktok: "";
        // $store->youtube = $links ? $links->youtube: "";
    
        $address = $this->Crud_model->sql_get('address', '*', array( "store_id" => $store->uuid ), null, 'row', [], ["id","DESC"] );
        $store->address = null;
        if($address){
            $store->address = $address->house?$address->house.", ".$address->address:$address->address;
        }

        $owner = $this->Crud_model->sql_get('users', 'first_name, last_name', array( "uuid" => $store->owner ), null, 'row' );
        $store->owner_name = "-";
        if($owner){
            $store->owner_name = $owner->first_name .' '. $owner->last_name;
        }

        $city = $this->Crud_model->sql_get('cities', 'name', array( "uuid" => $store->city_id ), null, 'row' );
        $store->city_name = "-";
        if($city){
            $store->city_name = $city->name;
        }
        
        $store->ratings = '-';

        if($with_pending) {
            $store->pending_update = $store->pending_update ? unserialize($store->pending_update) : null;
        }

        return $store;
    }

    protected function getStoreMeta($stores) {
        if($stores) {
            foreach($stores as $store) {
                $store = $this->getStoreMetaItem($store);
            }
        }
        return $stores;
    }

    public function activate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $store_id = $this->request->getVar('uuid');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), "uuid = '$store_id'");

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$store_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }

    public function deactivate() {
        $auth = $this->is_authorized(true, ["admin"]);

        $store_id = $this->request->getVar('uuid');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $updated = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), "uuid = '$store_id' AND status = '1'");

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$store_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }

    public function decidePending() {
        $auth = $this->is_authorized(true, ["admin","operator"]);
        $request = $this->request_validation($_POST, ["uuid", "action"], $this->edit_column);
        $store_id = $request->data['uuid'];

        $action = in_array($request->data['action'], ["approve","reject"]) ? true: false;
        if(!$action) {
            $this->json_response(null, false, "Action is not valid"); 
        }
        $action = $request->data['action'];
        
        $existing = $this->Crud_model->sql_get(
            $this->table_name, 
            ["pending_update"], 
            "uuid = '$store_id' AND pending_update IS NOT NULL", 
            null, 'row' );

        if(!$existing) {
            $this->json_response(null, false, "No existing request was found"); 
        }

        $changes = array();
        if($action == "approve") {
            $changes = unserialize($existing->pending_update);
        }
        $changes['pending_update'] = NULL;

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $request->data['uuid'] ));
        if($update) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $request->data['uuid'] ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Something went wrong saving changes!");
        }
    }

    public function createNewStore() {
        $auth = $this->is_authorized(true, ["admin","operator"]);
        $request = $this->request_validation($_POST, ["name", "open_time", "close_time"], $this->edit_column);
        $request->data = array_merge(array(
            "uuid" => $this->uuid->v4(),
            "timestamp" => get_current_utc_time() 
        ), $request->data);
        
        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, $request->data);
        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Failed creator new store!");
        }
    }

    public function editStoreCurrent() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "name", "open_time", "close_time"], $this->edit_column);
        $store_id = $request->data['uuid'];
        
        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->public_column, 
            "uuid = '$store_id'", 
            null, 'row' );
        $changes = array_diff($_POST, (array)$previous);

        if(!$changes) {
            $this->json_response(null, false, "No changes was found"); 
        }

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_store($auth->uuid, $request->data['uuid']);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }

            $update = $this->Crud_model->sql_update(
                $this->table_name, 
                array("pending_update"=>serialize($changes)), 
                "uuid = '$store_id' AND pending_update IS NULL");
            if($update) {
                $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $request->data['uuid'] ), null, 'row' );
                $this->json_response($current);
            } else {
                $this->json_response(null, false, "Existing store detail updates on process!");
            }
        }

        $update = $this->Crud_model->sql_update($this->table_name, $request->data, array( "uuid" => $request->data['uuid'] ));
        if($update) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $request->data['uuid'] ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Something went wrong saving changes!");
        }
    }

    public function deleteStoreCurrent() {
        $auth = $this->is_authorized(true, ["admin"]);

        $store_id = $this->request->getVar('uuid');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->sql_update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$store_id'  AND deleted_at IS NULL" );

        if($is_deleted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$store_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store or changes was found!");
        }
    }
}

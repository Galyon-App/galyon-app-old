<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Products extends Galyon_controller {

    private $table_name = 'products';
    private $edit_column = ['store_id','name','description','cover','images','orig_price','sell_price','discount_type','discount','category_id','subcategory_id','have_gram','gram','have_kg','kg','have_pcs','pcs','have_liter','liter','have_ml','ml','features','disclaimer','in_stock','is_featured','in_home','is_single','type_of','variations','status'];
    private $public_column = ['uuid','store_id','name','description','cover','images','orig_price','sell_price','discount_type','discount','category_id','subcategory_id','have_gram','gram','have_kg','kg','have_pcs','pcs','have_liter','liter','have_ml','ml','features','disclaimer','in_stock','is_featured','in_home','is_single','type_of','variations','verified_at','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    protected function is_owner_of_product($user_id, $product_id) {
        $params = array(
            $user_id, 
            $product_id
        );

        $query = " SELECT `stores`.`uuid` 
        FROM `stores` INNER JOIN `$this->table_name` 
            ON `stores`.`uuid` = `$this->table_name`.`store_id` 
        WHERE `stores`.`owner` = ?
            AND `$this->table_name`.`uuid` = ?
        ";

        return $this->Crud_model->custom($query, $params, 'row');
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

        return $this->Crud_model->custom($query, $params, 'row');
    }

    protected function getProductMetaItem($product) {
        unset($product->id);
    
        if(isset($product->store_id) && $product->store_id != null && $product->store_id != '') {
            $store = $this->Crud_model->get('stores', 'name', "uuid = '$product->store_id'", NULL, 'row' );
            if($store) {
                $product->{"store_name"} = $store->name;
            } else {
                $product->{"store_name"} = null;
            }
        } else {
            $product->{"store_name"} = null;
        }

        return $product;
    }

    protected function getProductMeta($products, $single = false) {
        if($single) {
            $products = $this->getProductMetaItem($products);
        } else {
            foreach($products as $product) {
                $product = $this->getProductMetaItem($product);
            }
        }
        return $products;
    }

    function getProductById() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, ["uuid"], []); 
        $product_id = $request->data['uuid'];       
        $query = $this->compileWhereClause($auth->where, ["uuid = '$product_id'"]);

        $product = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($query, [$this->get_limit_params()], false), NULL, 'row' );
        
        if($product) {
            $product = $this->getProductMetaItem($product);
            $this->json_response($product);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function getAllProducts() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, [], ["store_id"]); 

        if(isset($request->data['store_id'])) {
            $store_id = $request->data['store_id'];
            $auth->where = $this->compileWhereClause($auth->where, ["store_id = '$store_id'"]);
        }

        $products = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, [$this->get_limit_params()], false), NULL, 'result' );
        
        if($products) {
            $products = $this->getProductMeta($products);
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }
    
    function getProductsByStore() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, ["uuid"], []); 
        $store_id = $request->data['uuid'];       
        $query = $this->compileWhereClause($auth->where, ["store_id = '$store_id'"]);

        $products = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($query, [$this->get_limit_params()], false), NULL, 'result' );
        
        if($products) {
            $products = $this->getProductMeta($products);
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function getFeaturedProduct() {
        $auth = $this->is_authorized(false);
        $query = $this->compileWhereClause($auth->where, ["is_featured = '1'"]);

        $products = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($query, [$this->get_limit_params()], false), NULL, 'result' );
        
        if($products) {
            $products = $this->getProductMeta($products);
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function activate() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);

        $request = $this->request_validation($_POST, ["uuid"], $this->edit_column);
        $product_id = $request->data['uuid'];
        
        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $product = $this->Crud_model->update($this->table_name, array( "status" => "1" ), "uuid = '$product_id' AND status = '0'");

        if($product) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $product_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    }

    function deactivate() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);

        $request = $this->request_validation($_POST, ["uuid"], $this->edit_column);
        $product_id = $request->data['uuid'];

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $updated = $this->Crud_model->update($this->table_name, array( "status" => "0" ), "uuid = '$product_id' AND status = '1'");

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$product_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    }

    function createProductToStore() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["name"], $this->edit_column);
        $request->data = array_merge(array(
            "uuid" => $this->uuid->v4(),
            "store_id" => $this->Crud_model->sanitize_param($this->input->post("store_id"))
        ), $request->data);

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_store($auth->uuid, $request->data['store_id']);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $inserted = $this->Crud_model->insert($this->table_name, $request->data);

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Failed creator new product!");
        }
    } 

    function editProductToStore() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "name"], $this->edit_column);
        $product_id = $request->data['uuid'];

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $update = $this->Crud_model->update($this->table_name, $request->data, array( "uuid" => $product_id ));
        if($update) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $product_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    } 

    function deleteProductToStore() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);

        $request = $this->request_validation($_POST, ["uuid"], []); //product id.
        $product_id = $request->data['uuid'];
        
        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$product_id' AND deleted_at IS NULL" );

        if($is_deleted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$product_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    }
}
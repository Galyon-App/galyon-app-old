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
    private $public_column = ['uuid','store_id','name','description','cover','images','orig_price','sell_price','discount_type','discount','category_id','subcategory_id','have_gram','gram','have_kg','kg','have_pcs','pcs','have_liter','liter','have_ml','ml','features','disclaimer','in_stock','is_featured','in_home','is_single','type_of','variations','verified_at','status','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getProductById() {
        $user = $this->is_authorized();
        
        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        //TODO: Filter by search using the post key of search.
        $where = "uuid = '$uuid'";
        if($user) {
            if($user->role !== "admin") {
                $where .= " AND status = '1' AND verified_at IS NULL AND deleted_at IS NULL"; 
            }
        }

        $product = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'row' );
        if($product) {
            if(isset($product->store_id)) {
                $store = $this->Crud_model->get('stores', 'name', "uuid = '$product->store_id'", NULL, 'row' );
                if($store) {
                    $product->{"store_name"} = $store->name;
                } else {
                    $product->{"store_name"} = null;
                }
            } else {
                $product->{"store_name"} = null;
            }
            $this->json_response($product);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function getAllProducts() {
        $user = $this->is_authorized();
        
        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where .= "status = '1' AND verified_at IS NULL AND deleted_at IS NULL"; 
            }
        }

        $products = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($products) {
            foreach($products as $product) {
                if(isset($product->store_id)) {
                    $store = $this->Crud_model->get('stores', 'name', "uuid = '$product->store_id'", NULL, 'row' );
                    if($store) {
                        $product->{"store_name"} = $store->name;
                    } else {
                        $product->{"store_name"} = null;
                    }
                } else {
                    $product->{"store_name"} = null;
                }
            }
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }
    
    function getProductsByStore() {
        //Force exit if not by default.
        $this->is_authorized();

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $store_uuid = $this->input->post('uuid');
        $products = $this->Crud_model->get($this->table_name, $this->public_column, array( "store_id" => $store_uuid ), null, 'result' );

        if($products) {
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    }

    function getProductByCategory() {
        
    }

    function getFeaturedProduct() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            $basic  = $this->input->get_request_header('Basic');
            if($user->role === "admin" &&  $basic === "") {
                $where = null; 
            }
        }
        if($where == null) {
            $where = " is_featured = '1'";
        } else {
            $where .= " AND is_featured = '1'";
        }

        $products = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($products) {
            foreach($products as $product) {
                if(isset($product->store_id)) {
                    $store = $this->Crud_model->get('stores', 'name', "uuid = '$product->store_id'", NULL, 'row' );
                    if($store) {
                        $product->{"store_name"} = $store->name;
                    } else {
                        $product->{"store_name"} = null;
                    }
                } else {
                    $product->{"store_name"} = null;
                }
            }
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $product_id = $this->input->post('uuid');
        $product = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $product_id ));

        if($product) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $product_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $product_id = $this->input->post('uuid');
        $product = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $product_id ));

        if($product) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $product_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    function createProductToStore() {

    } 

    function editProductToStore() {
        $user = $this->is_authorized();
        if($user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        //$first_name = $this->input->post('first_name');
        //TODO: Check if param is meet.
        // if(empty($first_name) || empty($last_name) || empty($phone) || empty($gender) || empty($uuid)) {
        //     $this->json_response(null, false, "Required fields cannot be empty!");
        // }
        $new_val = $_POST; //TODO: Temp

        $success = $this->Crud_model->update($this->table_name, $new_val, array( "uuid" => $uuid ));

        if($success) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    } 

    function deleteProductToStore() {
        //Force exit if not by default.
        $this->is_authorized();

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $product_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $product_id ) );

        if($products) {
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    } 
}
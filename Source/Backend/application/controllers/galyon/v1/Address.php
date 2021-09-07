<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Address extends Galyon_controller {

    private $table_name = 'address';
    private $public_column = ['uuid','uid','store_id','type','address','house','landmark','zipcode','lat','lng','status','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getByUser() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $user_id = $this->input->post('uuid');
        if($where != null) {
            $where .= " AND uid = '$user_id'";
        } else {
            $where = "uid = '$user_id'";
        }

        $addresses = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'result' );

        if($addresses) {
            $this->json_response($addresses);
        } else {
            $this->json_response(null, false, "No user address was found!");
        }
    }
    
    function getByStore() {
        $user = $this->is_authorized();

        $store = $this->Crud_model->get('stores', '*', array( "owner" => $user->uuid ), null, 'row' );
        if(!$store) {
            $this->json_response(null, false, "No store is currently assigned!");
            exit;
        }

        $order_list = $this->Crud_model->get('orders', '*', array( "store_id" => $store->uuid ), null, 'result' );

        if($order_list) {
            foreach($order_list as $cur_order) {
                $order_details = unserialize($cur_order->items);

                //Add more product meta foreach order item.
                foreach($order_details as $cur_items) {
                    $cur_product = $this->Crud_model->get('products', '*', array( "uuid" => $cur_items['pid'] ), null, 'row' );
                    if($cur_product) {
                        $cur_items['name'] = $cur_product->name;
                    }
                    $cur_items['name'] = $cur_items['pid'];
                    print_r(json_encode($cur_items));
                }
                
                
                $cur_order->items = $order_details;
            }
            
            //$this->json_response($order_list);
        } else {
            $this->json_response(null, false, "No order found yet!");
        }
    }

    function getByID() {
        //Get the authorization header.
        $bearer = $this->input->get_request_header('Authorization');
        $token = str_replace("Bearer ", "", $bearer);
        $user = JWT::decode($token, $this->config->item('encryption_key'));

        if($user == false) {
            $this->json_response(null, false, "Invalid access token!");
            exit;
        }

        $store = $this->Crud_model->get('stores', '*', array( "owner" => $user->uuid ), null, 'row' );
        if(!$store) {
            $this->json_response(null, false, "No store is currently assigned!");
            exit;
        }

        $order_id = $this->input->post('uuid');
        $order = $this->Crud_model->get('orders', '*', array( "store_id" => $store->uuid, "uuid" => $order_id ), null, 'row' );

        if($order) {
            //Orders
            $cur_orders = unserialize($order->orders);
            foreach($cur_orders as $current) {
                $product = $this->Crud_model->get('products', '*', array( "uuid" => $current->pid ), null, 'row' );
                if($product) {
                    //$fields[$key] = $product;
                }
            }
            //$order->orders = array();

            //Address
            $address = $this->Crud_model->get('address', '*', array( "uuid" => $order->address_id ), null, 'row' );
            $order->address = $address;
            //Extra
            $order->extra = unserialize($order->extra);

            $this->json_response($order);
        } else {
            $this->json_response(null, false, "No order found yet!");
        }
    }

    function createNewAddress() {

    }

    function editAddresssCurrent() {

    }

    function deleteAddressCurrent() {
        $cur_user = $this->is_authorized();

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $address_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $address_id ) );

        if($is_deleted) {
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    }
}
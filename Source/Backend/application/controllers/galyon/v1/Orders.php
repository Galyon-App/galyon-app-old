<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Orders extends Galyon_controller {

    function __construct(){
		parent::__construct();
        //$this->load->helper();
    }

    function getByUser() {
        
    }

    function getByDriver() {
        
    }

    function getByOperator() {
        
    }
    
    function getByStore() {
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

    function createNewOrder() {

    }

    function editOrderCurrent() {

    }

    function deleteOrderCurrent() {

    }
}
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
    private $public_column = ['uuid','owner','city_id','name','descriptions','phone','email','cover','images','commission','open_time','close_time','isClosed','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getAllStores() {
        $user = $this->is_authorized(false);
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1'"; 
            }
        }

        $stores = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($stores) {
            foreach($stores as $store) {
                $address = $this->Crud_model->get('address', '*', array( "store_id" => $store->uuid ), null, 'row' );
                $store->address = "None";
                if($address){
                    $store->address = $address->house.", ".$address->address;
                }
                
                $store->ratings = 'None';
            }
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }
    
    function getStoreByOwner() {
        //Get the authorization header.
        $bearer = $this->input->get_request_header('Authorization');
        $token = str_replace("Bearer ", "", $bearer);
        $user = JWT::decode($token, $this->config->item('encryption_key'));

        if($user == false) {
            $this->json_response(null, false, "Invalid access token!");
            exit;
        }

        $user_uuid = $this->input->post('uuid');
        $stores = $this->Crud_model->get('stores', '*', array( "owner" => $user_uuid ), null, 'row' );
        foreach($stores as $store) {
            unset($store->id);
            unset($store->owner);
            unset($store->status);
            unset($store->updated_at);
        }

        if($stores) {
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    }

    function getStoreByCity() {

    }

    function getStoreFeatured() {

    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $city_id = $this->input->post('uuid');
        $store = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $city_id ));

        if($store) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $city_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $city_id = $this->input->post('uuid');
        $store = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $city_id ));

        if($store) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $city_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    function createNewStore() {

    }

    function editStoreCurrent() {

    }

    function deleteStoreCurrent() {

    }
}
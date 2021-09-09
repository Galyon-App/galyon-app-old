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

    function getStoreById() {
        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $store = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$uuid'", NULL, 'row' );
        if($store) {
            $address = $this->Crud_model->get('address', '*', array( "store_id" => $store->uuid ), null, 'row' );
            $store->address = "-";
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

            $this->json_response($store);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    function getAllStores() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            $basic  = $this->input->get_request_header('Basic');
            if($user->role === "admin" &&  $basic === "") {
                $where = null; 
            }
        }

        $stores = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($stores) {
            foreach($stores as $store) {
                $address = $this->Crud_model->get('address', '*', array( "store_id" => $store->uuid ), null, 'row' );
                $store->address = "-";
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
        $city_id = $this->input->post('uuid');
        $stores = $this->Crud_model->get($this->table_name, $this->public_column, array( "city_id" => $city_id ), null, 'result' );

        if($stores) {
            $this->json_response($stores);
        } else {
            $this->json_response(null, false, "No store associated to this city!");
        }
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
            $this->json_response(null, false, "No store was found!");
        }
    }

    function deleteStoreCurrent() {

    }
}
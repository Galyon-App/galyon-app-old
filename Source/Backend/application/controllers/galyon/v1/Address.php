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
        $auth = $this->is_authorized();

        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $addresses = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["uid = '$uuid'", "store_id IS NULL"]), null, 'result' );

        if($addresses) {
            $this->json_response($addresses);
        } else {
            $this->json_response(null, false, "No user address was found!");
        }
    }
    
    function getByStore() {
        $auth = $this->is_authorized();

        $store_id = $this->input->post('store_id');
        if(empty($store_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $addresses = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["store_id = '$store_id'", "uid IS NULL"]), null, 'result' );

        if($addresses) {
            $this->json_response($addresses);
        } else {
            $this->json_response(null, false, "No store address was found!");
        }
    }

    function getByID() {
        $auth = $this->is_authorized();

        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $address = $this->Crud_model->get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["uuid = '$uuid'"]), null, 'row' );
            
        if(!$address) {
            $this->json_response($where, false, "No address is currently assigned!");
        }

        $this->json_response($address);
    }

    function createNewAddress() {
        $user = $this->is_authorized();

        $uid = $this->input->post('uid');
        $store_id = $this->input->post('store_id');
        $type = $this->input->post('type');
        $address = $this->input->post($this->table_name);
        $house = $this->input->post('house');
        $landmark = $this->input->post('landmark');
        $zipcode = $this->input->post('zipcode');
        $lat = $this->input->post('lat');
        $lng = $this->input->post('lng');

        if(empty($type) || empty($address) || empty($house) || empty($lat) || empty($lng)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "uid" => $user->uuid ? $user->uuid : $uid, //TODO
            "store_id" => !empty($store_id) ? $store_id : NULL,
            "type" => $type, 
            "address" => $address, 
            "house" => $house,
            "landmark" => $landmark, 
            "zipcode" => $zipcode,
            "lat" => $lat,
            "lng" => $lng, 
            "status" => "1",
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Address was not saved!");
        }
    }

    function editAddresssCurrent() {
        $auth = $this->is_authorized(false);
        if(!$auth && !isset($auth->uuid)) {
            $this->json_response($found, false, "You're not authorized!");
        }

        $address = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$auth->uuid'", null, 'row' );
        if($address) {
            if($auth->role != "admin" && $auth->uuid != $address->uid) {
                $this->json_response($where, false, "You do not own this address!");
            }
            //TODO: Also check if this address is from store then check if this user is an owner of this store.
        }

        $uuid = $this->input->post('uuid');
        $uid = $this->input->post('uid');
        $store_id = $this->input->post('store_id');
        $type = $this->input->post('type');
        $address = $this->input->post($this->table_name);
        $house = $this->input->post('house');
        $landmark = $this->input->post('landmark');
        $zipcode = $this->input->post('zipcode');
        $lat = $this->input->post('lat');
        $lng = $this->input->post('lng');

        if(empty($uuid) || empty($type) || empty($address) || empty($house) || empty($lat) || empty($lng)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $latest =  array( 
            "uid" => $uid,
            "store_id" => !empty($store_id) ? $store_id : NULL,
            "type" => $type, 
            "address" => $address, 
            "house" => $house,
            "landmark" => $landmark, 
            "zipcode" => $zipcode,
            "lat" => $lat,
            "lng" => $lng,
        );

        $updated = $this->Crud_model->update($this->table_name, $latest, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Failed to update the address.");
        }
    }

    function deleteAddressCurrent() {
        $auth = $this->is_authorized(false);
        if(!$auth && !isset($auth->uuid)) {
            $this->json_response($found, false, "You're not authorized!");
        }

        $address = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$auth->uuid'", null, 'row' );
        if($address) {
            if($auth->role != "admin" && $auth->uuid != $address->uid) {
                $this->json_response($where, false, "You do not own this address!");
            }
            //TODO: Also check if this address is from store then check if this user is an owner of this store.
        }

        $address_id = $this->input->post('uuid');
        if(empty($address_id)) {
            $this->json_response(null, false, "Required fields cannot be empty!");
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$address_id'" );

        if($is_deleted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$address_id'", null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No address or changes was found!");
        }
    }
}
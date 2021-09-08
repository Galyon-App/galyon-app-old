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
        $is_mobile = $this->is_basic_header('mobile');
        $where = null;
        if($is_mobile) {
            $where .= "status = '1' AND deleted_at IS NULL";
        } else {
            if($user) {
                if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                    $where = null; 
                }
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
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $store_id = $this->input->post('store_id');
        if($where != null) {
            $where .= " AND store_id = '$store_id'";
        } else {
            $where = "store_id = '$store_id'";
        }

        //TODO: important
    }

    function getByID() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            if($user->role === "admin") { //TODO: and if this category is owned by a store or operator.
                $where = null; 
            }
        }

        $user_id = $this->input->post('user_id');
        if($where != null) {
            $where .= " AND owner = '$user_id'";
        } else {
            $where = "owner = '$user_id'";
        }

        $store = $this->Crud_model->get('stores', '*', $where, null, 'row' );
        if(!$store) {
            $this->json_response(null, false, "No store is currently assigned!");
            exit;
        }

        //TODO: Important
    }

    function createNewAddress() {

    }

    function editAddresssCurrent() {

    }

    function deleteAddressCurrent() {
        $user = $this->is_authorized();
        if($user) {
            $owner = $this->Crud_model->get($this->table_name, 'id', "uid = '$user->uuid'", null, 'row' );
            if($user->role !== "admin" && !$owner) {
                $this->json_response($found, false, "You're not authorized!");
            }
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $address_id = $this->input->post('uuid');
        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$address_id'" );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No store associated to this account!");
        }
    }
}
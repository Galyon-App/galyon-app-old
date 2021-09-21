<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Offers extends Galyon_controller {

    private $table_name = 'offers';
    private $public_column = ['uuid','name','descriptions','image','type','off','min','upto','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getOfferByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $offer_id = $this->input->post('uuid');
        $where = "uuid = '$offer_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL";
            }
        }
        
        $offer = $this->Crud_model->get($this->table_name, $this->public_column, $where, null, 'row' );

        if($offer) {
            $this->json_response($offer);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    function getAllOffers() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $offers = $this->Crud_model->get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($offers) {
            $this->json_response($offers);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    function createNewOffer() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $name = $this->input->post('name');
        $descriptions = $this->input->post('descriptions');
        $type = $this->input->post('type');
        $off = $this->input->post('off');
        $min = $this->input->post('min');
        $upto = $this->input->post('upto');
        $expired_at = $this->input->post('expired_at');
        $image = $this->input->post('image');

        if(empty($name) || empty($min) || empty($type) || empty($off) || empty($upto) || empty($image) || empty($expired_at)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "name" => $name, 
            "descriptions" => $descriptions, 
            "type" => $type,
            "off" => $off, 
            "min" => $min,
            "upto" => $upto, 
            "image" => $image, 
            "expired_at" => $expired_at,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editOfferCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->input->post('uuid');
        $name = $this->input->post('name');
        $descriptions = $this->input->post('descriptions');
        $type = $this->input->post('type');
        $off = $this->input->post('off');
        $min = $this->input->post('min');
        $upto = $this->input->post('upto');
        $expired_at = $this->input->post('expired_at');
        $image = $this->input->post('image');

        if(empty($uuid) || empty($name) || empty($type) || empty($off) || empty($min) || empty($upto || empty($expired_at)) ) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $offer = array( 
            "name" => $name, 
            "descriptions" => $descriptions, 
            "type" => $type,
            "off" => $off, 
            "min" => $min,
            "upto" => $upto, 
            "expired_at" => $expired_at,
        );

        if(!empty($cover)) {
            //upload and update database.
            $offer['image'] = $image;
        }

        $updated = $this->Crud_model->update($this->table_name,  $offer, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No offer was found!".$uuid);
        }
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $offer_id = $this->input->post('uuid');
        $offer = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $offer_id ));

        if($offer) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $offer_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $offer_id = $this->input->post('uuid');
        $offer = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $offer_id ));

        if($offer) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $offer_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    function deleteOfferCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $offer_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $offer_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }
}
<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Offer extends AppCore
{
    private $table_name = 'offers';
    private $public_column = ['uuid','name','descriptions','image','type','off','min','upto','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    public function getOfferByID() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $offer_id = $this->request->getVar('uuid');
        $where = "uuid = '$offer_id'";
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL";
            }
        }
        
        $offer = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, null, 'row' );

        if($offer) {
            $this->json_response($offer);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    public function getAllOffers() {
        $user = $this->is_authorized();

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $offers = $this->Crud_model->sql_get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($offers) {
            $this->json_response($offers);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    public function createNewOffer() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $name = $this->request->getVar('name');
        $descriptions = $this->request->getVar('descriptions');
        $type = $this->request->getVar('type');
        $off = $this->request->getVar('off');
        $min = $this->request->getVar('min');
        $upto = $this->request->getVar('upto');
        $expired_at = $this->request->getVar('expired_at');
        $image = $this->request->getVar('image');

        if(empty($name) || empty($min) || empty($type) || empty($off) || empty($upto) || empty($image) || empty($expired_at)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, array( 
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
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function editOfferCurrent() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $uuid = $this->request->getVar('uuid');
        $name = $this->request->getVar('name');
        $descriptions = $this->request->getVar('descriptions');
        $type = $this->request->getVar('type');
        $off = $this->request->getVar('off');
        $min = $this->request->getVar('min');
        $upto = $this->request->getVar('upto');
        $expired_at = $this->request->getVar('expired_at');
        $image = $this->request->getVar('image');

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

        $updated = $this->Crud_model->sql_update($this->table_name,  $offer, "uuid = '$uuid'" );

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $uuid ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No offer was found!".$uuid);
        }
    }

    public function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $offer_id = $this->request->getVar('uuid');
        $offer = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), array( "uuid" => $offer_id ));

        if($offer) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $offer_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    public function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $offer_id = $this->request->getVar('uuid');
        $offer = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), array( "uuid" => $offer_id ));

        if($offer) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $offer_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }

    public function deleteOfferCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $offer_id = $this->request->getVar('uuid');
        $is_deleted = $this->Crud_model->sql_delete($this->table_name, array( "uuid" => $offer_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No offer was found!");
        }
    }
}

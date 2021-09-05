<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Reviews extends Galyon_controller {

    private $table_name = 'rating';
    private $public_column = ['id', 'uid','did','pid','sid','rate','msg','way','status','timestamp','updated_at'];

    function __construct(){
		parent::__construct();
    }

    function getByUid() {
        $user_id = $this->input->post('uuid');
        $users = $this->Crud_model->get($this->table_name, $this->public_column, array( "status" => "1", "uid" => $user_id ), null, 'result' );

        if($users) {
            foreach($users as $user) {
                if($user->sid != null) {
                    $user->title = "Store";
                } else if($user->pid != null) {
                    $user->title = "Product";
                } else if($user->did != null) {
                    $user->title = "Driver";
                }
            }
            $this->json_response($users);
        } else {
            $this->json_response(null, false, "No user review was found!");
        }
    }

    function getBySid() {
        $store_id = $this->input->post('uuid');
        $store = $this->Crud_model->get($this->table_name, $this->public_column, array( "sid" => $store_id ), null, 'result' );

        if($store) {
            $this->json_response($store);
        } else {
            $this->json_response(null, false, "No store review was found!");
        }
    }

    function getByDid() {
        $driver_id = $this->input->post('uuid');
        $driver = $this->Crud_model->get($this->table_name, $this->public_column, array( "sid" => $driver_id ), null, 'result' );

        if($driver) {
            $this->json_response($driver);
        } else {
            $this->json_response(null, false, "No driver review was found!");
        }
    }
}
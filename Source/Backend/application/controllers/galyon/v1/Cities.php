<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Cities extends Galyon_controller {

    private $table_name = 'cities';
    private $public_column = ['uuid','name','lat','lng','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    function getCityById() {
        $uuid = $this->input->post('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $cities = $this->Crud_model->get($this->table_name, $this->public_column, "uuid = '$uuid'", NULL, 'row' );
        if($cities) {
            $this->json_response($cities);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }

    function getAllCities() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            $basic  = $this->input->get_request_header('Basic');
            if($user->role === "admin" &&  $basic === "") {
                $where = null; 
            }
        }

        $cities = $this->Crud_model->get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($cities) {
            $this->json_response($cities);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }

    function createNewCity() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $name = $this->input->post('name');
        $lat = $this->input->post('lat');
        $lng = $this->input->post('lng');

        if(empty($name) || empty($lat) || empty($lng) ) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "name" => $name, 
            "lat" => $lat, 
            "lng" => $lng,
        ));

        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    function editCityCurrent() {
        //Not important!
    }

    function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $city_id = $this->input->post('uuid');
        $city = $this->Crud_model->update($this->table_name, array( "status" => "1" ), array( "uuid" => $city_id ));

        if($city) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $city_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No city was found!");
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
        $city = $this->Crud_model->update($this->table_name, array( "status" => "0" ), array( "uuid" => $city_id ));

        if($city) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, array( "uuid" => $city_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }

    function deleteCityCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $city_id = $this->input->post('uuid');
        $is_deleted = $this->Crud_model->delete($this->table_name, array( "uuid" => $city_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }
}
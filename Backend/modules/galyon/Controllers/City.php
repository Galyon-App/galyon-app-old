<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class City extends AppCore
{
    private $table_name = 'cities';
    private $public_column = ['uuid','name','lat','lng','province','country','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    public function getCityById() {
        $uuid = $this->request->getVar('uuid');
        if(empty($uuid)) {
            $this->json_response(null, false, "Required field cannot be empty!");
        }

        $cities = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$uuid'", NULL, 'row' );
        if($cities) {
            $this->json_response($cities);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }

    public function searchCity() {
        $user = $this->is_authorized(false);
        $where = "status = '1' AND deleted_at IS NULL";
        if($user) {
            $basic = get_header_basic();
            if($user->role === "admin" &&  $basic == "admin") {
                $where = null; 
            }
        }

        $search = $this->request->getVar('search');
        if(!empty($search)) {
            $searching = "(name LIKE '%$search%' OR province LIKE '%$search%' OR country LIKE '%$search%')";
            if($where == null) {
                $where = $searching;
            } else {
                $where .= " AND ".$searching;
            }
        }

        $cities = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, NULL, 'result' );
        if($cities) {
            $this->json_response($cities);
        } else {
            $this->json_response(null, false, "No store was found!");
        }
    }

    public function getAllCities() {
        $auth = $this->is_authorized(false);

        $no_term = empty($this->request->getVar('filter_term'));
        $filter_term = "%".$this->request->getVar('filter_term')."%";
        $limit_start = (int)$this->request->getVar('limit_start');
        $limit_length = (int)$this->request->getVar('limit_length');
        $limit_length = $limit_length ? $limit_length : 10;

        $order_by = [];
        $order_column = $this->request->getVar('order_column');
        $order_mode = $this->request->getVar('order_mode');
        if(isset($order_column) && isset($order_mode)) {
            $order_by = [$order_column, $order_mode];
        }

        if($no_term) {
            $params = array(
                $limit_start,
                $limit_length
            );
        } else {
            $params = array(
                $filter_term, 
                $limit_start,
                $limit_length
            );
        }
        
        $query = " SELECT `uuid`,`name`,`province`,`country`,`lat`,`lng`,`status`,`timestamp`,`updated_at`,`deleted_at`    
        FROM `cities` 
        WHERE deleted_at IS NULL 
        ";
        $query .= $no_term ? "" : " AND `name` LIKE ? ";
        $query .= count($order_by) == 2 ? " ORDER BY $order_by[0] $order_by[1]" : "";
        $query .= " LIMIT ?, ?";

        $cities = $this->Crud_model->sql_custom($query, $params, 'result');
        $this->json_response($cities);
    }

    public function createNewCity() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $name = $this->request->getVar('name');
        $province = $this->request->getVar('province');
        $country = $this->request->getVar('country');
        $lat = $this->request->getVar('lat');
        $lng = $this->request->getVar('lng');

        if(empty($name) || empty($lat) || empty($lng) ) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, array( 
            "uuid" => $this->uuid->v4(), 
            "name" => $name, 
            "province" => $province, 
            "country" => $country, 
            "lat" => $lat, 
            "lng" => $lng,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function editCityCurrent() {
        //Not important!
    }

    public function activate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $city_id = $this->request->getVar('uuid');
        $city = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), array( "uuid" => $city_id ));

        if($city) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $city_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }

    public function deactivate() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $city_id = $this->request->getVar('uuid');
        $city = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), array( "uuid" => $city_id ));

        if($city) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $city_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }

    public function deleteCityCurrent() {
        $cur_user = $this->is_authorized();
        if($cur_user->role !== "admin") {
            $this->json_response(null, false, "You are not authorized.");
        }

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $city_id = $this->request->getVar('uuid');
        $is_deleted = $this->Crud_model->sql_delete($this->table_name, array( "uuid" => $city_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }
}

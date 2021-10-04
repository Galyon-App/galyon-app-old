<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Maintainance extends Galyon_controller
{
    function __construct() {
        parent::__construct();
        //TODO: Access only admin.
    }

    public function execute() {
        //Execute all fixing here.
        $store_uuid = $this->generate_store_uuid();
        $store_city_and_address = $this->fix_all_store_city_and_address();
        $product_uuid = $this->generate_product_uuid();
        $generated_thumb = $this->generate_thumbnail();

        //TODO: save utc datetime on setting as last check and fix.
        $this->json_response(array(
            "store_uuid" => $store_uuid,
            "store_city_and_address" => $store_city_and_address,
            "product_uuid" => $product_uuid,
            "generated_thumb" => $generated_thumb,
        ));
    }

    protected function generate_store_uuid() {
        $current_table = "stores";
        $rows = $this->Crud_model->get_table_rows_without_uuid($current_table);

        if($rows && is_array($rows)) {
            foreach($rows as $row) {
                $uuid = $this->uuid->v4();
                $this->Crud_model->set_table_rows_with_uuid($row->id, $uuid, $current_table);
            }
            return count($rows);
        }

        return 0;
    }

    protected function fix_all_store_city_and_address() {
        $stores = $this->Crud_model->get_stores_without_city();

        if($stores && is_array($stores)) {
            $success = 0;
            foreach($stores as $store) {
                $coords = isset($store->city_id) ? explode(":", $store->city_id) : null;
                if($coords) {
                    $this->fix_store_city_id($store->uuid, $coords[0], $coords[1]);
                    $success += 1;
                }
            }
            return $success;
        }

        return 0;
    }

    protected function fix_store_city_id($store_id, $lat, $lng) {
        $raw_data = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$lng&sensor=false&region=ph&key=AIzaSyACzCWr1IagoMb1lJuu798DrUCMVM5utpM");
        $obj_data = json_decode($raw_data);
        $components = $obj_data->results[0]->address_components;
        $coords = $obj_data->results[0]->geometry->location;

        $city_name = '';
        $state_name = '';
        $country_name = '';
        $address_name =  $obj_data->results[0]->formatted_address;

        foreach($components as $component) {
            if(isset($component->types)) {
                if(in_array("locality", $component->types)) {
                    $city_name = $component->long_name;
                }
                if(in_array("administrative_area_level_2", $component->types)) {
                    $city_name .= ", ".$component->long_name;
                }
                if(in_array("administrative_area_level_1", $component->types)) {
                    $state_name = $component->long_name;
                }
                if(in_array("country", $component->types)) {
                    $country_name = $component->long_name;
                }
            }
        }

        $city = $this->Crud_model->check_if_city_exist($city_name);
        $city_id = $city != false && isset($city->id) ? $city->id : 0;

        if($city == false) {
            $lat = isset($coords->lat) ? $coords->lat : '';
            $lng = isset($coords->lng) ? $coords->lng : '';
            $city_id = $this->Crud_model->insert_new_city($city_name, $lat, $lng, $state_name, $country_name);
        }

        //Create new address for this store if not present.
        $store_address = $this->Crud_model->get("stores", "*", "id = '$city_id'", null, 'row' );
        $this->Crud_model->insert_store_address($store_address->uuid, $address_name, $lat, $lng);

        $current = $this->Crud_model->get("cities", "*", "id = '$city_id'", null, 'row' );
        if($current) {
            $updated = $this->Crud_model->update("stores", array( 
                "city_id" => $current->uuid,
            ), "uuid = '$store_id'");
            if($updated) {
                return true;
            }
        }

        return false;
    }

    protected function generate_product_uuid() {
        $current_table = "products";
        $rows = $this->Crud_model->get_table_rows_without_uuid($current_table);

        if($rows && is_array($rows)) {
            foreach($rows as $row) {
                $uuid = $this->uuid->v4();
                $this->Crud_model->set_table_rows_with_uuid($row->id, $uuid, $current_table);
            }
            return count($rows);
        }

        return 0;
    }

    public function generate_thumbnail() {
        $lists = [];
        $directory = "uploads";
        //$jfif = glob($directory . "/*.jfif");

        $jpgs = glob($directory . "/*.jpg");
        foreach($jpgs as $image) {
            $filename = str_replace("uploads/", "", $image);
            if(!file_exists("./uploads/thumb/".$filename)) {
                array_push($lists, $filename);
                $this->process_image($filename);
            }
            
        }

        $jpegs = glob($directory . "/*.jpeg");
        foreach($jpegs as $image) {
            $filename = str_replace("uploads/", "", $image);
            if(!file_exists("./uploads/thumb/".$filename)) {
                array_push($lists, $filename);
                $this->process_image($filename);
            }
        }

        $pngs = glob($directory . "/*.png");
        foreach($pngs as $image) {
            $filename = str_replace("uploads/", "", $image);
            if(!file_exists("./uploads/thumb/".$filename)) {
                array_push($lists, $filename);
                $this->process_image($filename);
            }
        }
        return count($lists);
    }












    protected function update_categories_uuid() {
        $categories = $this->Crud_model->get_categories_without_uid();

        foreach($categories as $category) {
            $uuid = $this->uuid->v4();
            $this->Crud_model->set_category_parent_and_uuid($category, $uuid);
        }

        return count($categories);
    }    

    protected function update_cities_uuid() {
        $cities = $this->Crud_model->get_cities_without_uuid();

        foreach($cities as $city) {
            $uuid = $this->uuid->v4();
            $this->Crud_model->set_city_uuid($city->id, $uuid);
        }

        return count($cities);
    }

    protected function update_addresses_uuid() {
        $addresses = $this->Crud_model->get_address_without_owner_and_uuid();

        foreach($addresses as $address) {
            $uuid = $this->uuid->v4();
            $this->Crud_model->set_address_uuid($address, $uuid);
        }

        return count($addresses);
    }

    protected function update_orders_uuid() {
        $orders = $this->Crud_model->get_orders_with_uid();

        foreach($orders as $order) {
            $uuid = $this->uuid->v4();
            $this->Crud_model->set_order_foreign_and_uuid($order, $uuid);
        }

        return count($orders);
    }
    
    protected function update_products_uuid() {
        $pruducts = $this->Crud_model->get_products_with_sid();

        foreach($pruducts as $pruduct) {
            //$uuid = $this->uuid->v4();
            //$this->Crud_model->set_pruduct_store_and_uuid($pruduct->store_id, $uuid);
            //$this->Crud_model->set_pruduct_store_and_uuid($pruduct->id, $uuid);
        }

        return count($pruducts);
    }

    protected function update_products_category() {
        $pruducts = $this->Crud_model->get_products_with_category();

        foreach($pruducts as $pruduct) {
            $this->Crud_model->set_product_category_uuid($pruduct->uuid, $pruduct->category_id, $pruduct->subcategory_id);
        }

        return count($pruducts);
    }
    

    protected function update_store_owner_uuid() {
        $stores = $this->Crud_model->get_stores_with_uid();

        foreach($stores as $store) {
            $uuid = $this->uuid->v4();
            $this->Crud_model->set_store_owner_and_uuid($store->owner, $uuid);
        }

        return count($stores);
    }

    protected function add_uuidto_users() {
        $users = $this->Crud_model->get_users_without_uuid();

        foreach($users as $user) {
            $uuid = $this->uuid->v4();
            $this->Crud_model->set_user_uuid($user->id, $uuid);
        }

        return count($users);
    }
}
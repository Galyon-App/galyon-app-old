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
        // $user_uuid = $this->add_uuidto_users();
        // $store_uuid = $this->update_store_owner_uuid();
        // $products_uuid = $this->update_products_uuid();
        // $orders_uuid = $this->update_orders_uuid(); 
        // $addresses_uuid = $this->update_addresses_uuid();
        // $cities_uuid = $this->update_cities_uuid();
        // $categories_uuid = $this->update_categories_uuid();

        //$product_category = $this->update_products_category();

        //TODO: save utc datetime on setting as last check and fix.
        $this->json_response(array(
            "store_uuid" => $store_uuid,

            //"user_uuid" => $user_uuid,
            //"store_uuid" => $store_uuid,
            // "products_uuid" => $products_uuid,
            // "orders_uuid" => $orders_uuid,
            // "addresses_uuid" => $addresses_uuid,
            // "cities_uuid" => $cities_uuid,
            // "categories_uuid" => $categories_uuid,

            //"product_categories" => $product_category

        ));
    }

    protected function generate_store_uuid() {
        $stores = $this->Crud_model->get_stores_without_uuid();

        if($stores && is_array($stores)) {
            foreach($stores as $store) {
                $uuid = $this->uuid->v4();
                $this->Crud_model->set_store_with_uuid($store->id, $uuid);
            }
            return count($stores);
        }

        return 0;
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
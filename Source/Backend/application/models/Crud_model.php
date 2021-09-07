<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

require_once APPPATH.'/core/Galyon_model.php';

class Crud_model extends Galyon_model {

	function __construct(){
		parent::__construct();
  }

  function get_users_without_uuid() {
    return $this->get('users', 'id', array( "uuid" => null ), array( "uuid" => '' ), 'result' );
  }

  function set_user_uuid($user_id, $new_uuid) {
    return $this->update('users', array( "uuid" => $new_uuid), array( "id" => $user_id ) );
  }

  function get_stores_with_uid() {
    return $this->get('stores', 'owner', 'CHAR_LENGTH(owner) < 36', array('owner'=>null), 'result' );
  }

  function set_store_owner_and_uuid($uid, $uuid) {
    $user = $this->get('users', 'uuid', array( "id" => $uid) );
    if($user) {
      return $this->update('stores', array("uuid" => $uuid, "owner" => $user->uuid), array( "owner" => $uid ) );
    } else {
      return true;
    }
  }

  function get_products_with_category() {
    return $this->get('products', 'uuid, category_id, subcategory_id', null, null, 'result' );
  }

  function set_product_category_uuid($pid, $catid, $subcatid) {
    $cat = $this->get('category', 'uuid', "id = '$catid'", null, 'row' );
    $subcat = $this->get('category', 'uuid', "id = '$subcatid'", null, 'row' );

    $success = $this->update('products', array(
      "category_id" => $cat->uuid, 
      "subcategory_id" => $subcat->uuid
    ), array( "uuid" => $pid ) );

    if($success) {
      return true;
    } else {
      return true;
    }
  }

  function get_products_with_sid() {
    //return $this->get('products', 'store_id', 'CHAR_LENGTH(store_id) < 36', array('store_id'=>null), 'result' );
    return $this->get('products', 'id, uuid', null, null, 'result' );
  }

  function set_pruduct_store_and_uuid($uid, $uuid) {
    // $store = $this->get('stores', 'uuid', array( "id" => $uid) );
    // if($store) {
    //   return $this->update('products', array("uuid" => $uuid, "store_id" => $store->uuid), array( "store_id" => $uid ) );
    // } else {
    //   return true;
    // }
    $success = $this->update('products', array("uuid" => $uuid), array( "id" => $uid ) );
    if($success) {
      return true;
    } else {
      return true;
    }
  }

  function get_orders_with_uid() {
    return $this->get('orders', 'id, uid, store_id, driver_id', 'CHAR_LENGTH(uuid) < 36', array('uuid'=>null), 'result' );
  }

  function set_order_foreign_and_uuid($order, $uuid) {    
    $driver = $this->get('users', 'uuid', array( "id" => $order->driver_id, "type" => "driver") );
    if($driver) {
      $this->update('orders', array("driver_id" => $driver->uuid), array( "id" => $order->id ) );
    }
    
    $user = $this->get('users', 'uuid', array( "id" => $order->uid) );
    $user = $user ? array("uid" => $user->uuid) : NULL;
    $this->update('orders', $user, array( "id" => $order->id ) );

    $store = $this->get('stores', 'uuid', array( "id" => $order->store_id) );
    $store = $store ? array("store_id" => $store->uuid) : NULL;
    $this->update('orders', $store, array( "id" => $order->id ) );

    return $this->update('orders', array("uuid" => $uuid), array( "id" => $order->id ) );
  }

  function get_cities_without_uuid() {
    return $this->get('cities', 'id', array( "uuid" => null ), array( "uuid" => '' ), 'result' );
  }

  function set_city_uuid($city_id, $new_uuid) {
    return $this->update('cities', array( "uuid" => $new_uuid), array( "id" => $city_id ) );
  }

  function get_address_without_owner_and_uuid() {
    return $this->get('address', 'id, uid, store_id', array( "uuid" => null ), array( "uuid" => '' ), 'result' );
  }

  function set_address_uuid($address, $new_uuid) {
    $user = $this->get('users', 'uuid', array( "id" => $address->uid) ) 
      ? $this->get('users', 'uuid', array( "id" => $address->uid) ) : NULL;
    $store = $this->get('stores', 'uuid', array( "id" => $address->store_id) ) 
      ? $this->get('stores', 'uuid', array( "id" => $address->store_id) ) : NULL;
    return $this->update('address', array( "uuid" => $new_uuid, "uid" => $user->uuid, "store_id" => $store->uuid), array( "id" => $address->id ) );
  }

  function get_categories_without_uid() {
    return $this->get('category', 'id, parent_id', 'CHAR_LENGTH(uuid) < 36', array('uuid'=>null), 'result' );
  }

  function set_category_parent_and_uuid($category, $uuid) {
    $parent = $this->get('category', 'uuid', array( "id" => $category->parent_id) );
    if($parent) {
      return $this->update('category', array("uuid" => $uuid, "parent_id" => $parent->uuid), array( "id" => $category->id ) );
    } else {
      return $this->update('category', array("uuid" => $uuid), array( "id" => $category->id ) );
    }
  }
}
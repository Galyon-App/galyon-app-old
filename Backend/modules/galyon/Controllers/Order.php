<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Order extends AppCore
{
    private $table_name = 'orders';
    private $edit_column = ['uid','address_id','store_id','driver_id','progress','matrix','items','factor','coupon','total','delivery','discount','tax','grand_total','paid_method','pay_key','stage','status','timestamp'];
    private $public_column = ['uuid','uid','address_id','store_id','driver_id','progress','matrix','items','factor','coupon','total','delivery','discount','tax','grand_total','paid_method','pay_key','stage','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    protected function is_owner_of_store($user_id, $store_id) {
        $params = array(
            $user_id, 
            $store_id
        );

        $query = " SELECT `uuid` 
        FROM `stores` 
        WHERE `owner` = ? AND `uuid` = ?
        ";

        return $this->Crud_model->sql_custom($query, $params, 'row');
    }

    protected function getOrderMetaItem($order) {
        if($this->request->getVar("has_user_name") == "1") {
            $user = $this->Crud_model->sql_get("users", ['cover','first_name','last_name'], array("uuid" => $order->uid), NULL, 'row' );
            if($user) {
                $order->user_cover = $user->cover;
                $order->user_name = $user->first_name." ".$user->last_name ;
            } else {
                $order->user_cover = null;
                $order->user_name = "Guest";
            }
        }
        if($this->request->getVar("has_store_name") == "1" && isset($order->store_id) && !empty($order->store_id)) {
            $store = $this->Crud_model->sql_get("stores", ['cover','name'], array("uuid" => $order->store_id), NULL, 'row' );
            if($store) {
                $order->store_cover = $store->cover;
                $order->store_name = $store->name;
            }
        }
        if($this->request->getVar("has_address_name") == "1" && isset($order->address_id) && !empty($order->address_id)) {
            $address = $this->Crud_model->sql_get("address", ['house','address'], array("uuid" => $order->address_id), NULL, 'row' );
            if($address) {
                $order->address_name = $address->house.", ".$address->address;
            }
        }
        if($order->progress && $order->progress != null && !empty($order->progress)) {
            $order->progress = json_decode($order->progress);
        }
        if($order->matrix && $order->matrix != null && !empty($order->matrix)) {
            $order->matrix = json_decode($order->matrix);
        }
        if($order->items && $order->items != null && !empty($order->items)) {
            $order->items = json_decode($order->items);
        }
        if($order->factor && $order->factor != null && !empty($order->factor)) {
            $order->factor = json_decode($order->factor);

            if(isset($order->factor->delivered)) {
                $order->delivery = 0;
            }
        }
        return $order;
    }

    protected function getOrderMeta($orders) {
        foreach($orders as $order) {
            $order = $this->getOrderMetaItem($order);
        }
    }

    public function getOrdersById() {
        $auth = $this->is_authorized(true);
        $request = $this->request_validation($_POST, ["uuid"], $this->public_column, ["uuid"]);

        //TODO: Check if Admin or Operator or Owner of store or User owned the order.

        $order = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where, true), NULL, 'row' );
        if($order) {
            $order = $this->getOrderMetaItem($order);
            $this->json_response($order);
        } else {
            $this->json_response(null, false, "No orders was found!");
        }
    }

    public function getOrdersByUser() {
        $auth = $this->is_authorized(true);
        $request = $this->request_validation($_POST, ["uid"], $this->public_column, ["uid"]);

        //TODO: Check if Admin or Operator or Owner of store or User owned the order.

        $orders = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where, true), NULL, 'result', [], ["id", "DESC"]);
        if($orders) {
            $order = $this->getOrderMeta($orders);
            $this->json_response($orders);
        } else {
            $this->json_response(null, false, "No orders was found!");
        }
    }

    public function getOrdersByStore() {
        $auth = $this->is_authorized(true);
        $request = $this->request_validation($_POST, [], $this->public_column, ["store_id"]);

        //TODO: Check if Admin or Operator or Owner of store.

        $orders = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where, true), NULL, 'result' );
        if($orders) {
            $stoordersres = $this->getOrderMeta($orders);
            $this->json_response($orders);
        } else {
            $this->json_response(null, false, "No orders was found!");
        }
    }

    public function getOrdersRecently() {
        $auth = $this->is_authorized(true);
        $request = $this->request_validation($_POST, [], $this->public_column,["store_id"]);

        //TODO: Check if Admin or Operator.

        $orders = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where, true), NULL, 'result', null, ["timestamp","ASC"]);
        if($orders) {
            $stoordersres = $this->getOrderMeta($orders);
            $this->json_response($orders);
        } else {
            $this->json_response(null, false, "No orders was found!");
        }
    }

    public function getByDriver() {
        
    }

    public function getByOperator() {
        
    }
    
    public function getByID() {
        $auth = $this->is_authorized(true);

        $store = $this->Crud_model->sql_get('stores', '*', array( "owner" => $user->uuid ), null, 'row' );
        if(!$store) {
            $this->json_response(null, false, "No store is currently assigned!");
            exit;
        }

        $order_id = $this->request->getVar('uuid');
        $order = $this->Crud_model->sql_get('orders', '*', array( "store_id" => $store->uuid, "uuid" => $order_id ), null, 'row' );

        if($order) {
            //Orders
            $cur_orders = unserialize($order->orders);
            foreach($cur_orders as $current) {
                $product = $this->Crud_model->sql_get('products', '*', array( "uuid" => $current->pid ), null, 'row' );
                if($product) {
                    //$fields[$key] = $product;
                }
            }
            //$order->orders = array();

            //Address
            $address = $this->Crud_model->sql_get('address', '*', array( "uuid" => $order->address_id ), null, 'row' );
            $order->address = $address;
            //Extra
            $order->extra = unserialize($order->extra);

            $this->json_response($order);
        } else {
            $this->json_response(null, false, "No order found yet!");
        }
    }

    public function deliverOrder() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "store_id"], $this->edit_column);
        $order_id = $request->data['uuid'];

        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->edit_column, 
            "uuid = '$order_id'", 
            null, 'row' );

        $progress = json_decode($previous->progress);
        array_push($progress, array(
            "status" => 1,
            "current" => $progress[0]->latest,
            "latest" => "delivered",
            "timestamp" => get_current_utc_time()
        ));
        $changes = array(
            "progress" => json_encode($progress),
            "stage" => "delivered"
        );

        if($auth->role == "operator") {
            //TODO: Add check if operator and this order belongs to this operation.
        } else if($auth->role == "store") {
            //TODO: Check if owner of the said store.
            //TODO: Check if current user is an owner of the store involved!
        }

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $order_id ));
        if($update) {
            $this->json_response($changes);
        } else {
            $this->json_response(null, false, "No order or changes was found!");
        }
    }

    public function shipOrder() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "store_id"], $this->edit_column);
        $order_id = $request->data['uuid'];

        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->edit_column, 
            "uuid = '$order_id'", 
            null, 'row' );

        $progress = json_decode($previous->progress);
        array_push($progress, array(
            "status" => 1,
            "current" => $progress[0]->latest,
            "latest" => "shipping",
            "timestamp" => get_current_utc_time()
        ));
        $changes = array(
            "progress" => json_encode($progress),
            "stage" => "shipping"
        );

        if($auth->role == "operator") {
            //TODO: Add check if operator and this order belongs to this operation.
        } else if($auth->role == "store") {
            //TODO: Check if owner of the said store.
            //TODO: Check if current user is an owner of the store involved!
        }

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $order_id ));
        if($update) {
            $this->json_response($changes);
        } else {
            $this->json_response(null, false, "No order or changes was found!");
        }
    }

    public function acceptOrder() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "store_id"], $this->edit_column);
        $order_id = $request->data['uuid'];

        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->edit_column, 
            "uuid = '$order_id'", 
            null, 'row' );

        $progress = json_decode($previous->progress);
        array_push($progress, array(
            "status" => 1,
            "current" => $progress[0]->latest,
            "latest" => "ongoing",
            "timestamp" => get_current_utc_time()
        ));
        $changes = array(
            "progress" => json_encode($progress),
            "stage" => "ongoing"
        );

        if($auth->role == "operator") {
            //TODO: Add check if operator and this order belongs to this operation.
        } else if($auth->role == "store") {
            //TODO: Check if owner of the said store.
            //TODO: Check if current user is an owner of the store involved!
        }

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $order_id ));
        if($update) {
            $this->json_response($changes);
        } else {
            $this->json_response(null, false, "No order or changes was found!");
        }
    }

    public function rejectOrder() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "store_id"], $this->edit_column);
        $order_id = $request->data['uuid'];

        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->edit_column, 
            "uuid = '$order_id'", 
            null, 'row' );

        $progress = json_decode($previous->progress);
        array_push($progress, array(
            "status" => 1,
            "current" => $progress[0]->latest,
            "latest" => "rejected",
            "timestamp" => get_current_utc_time()
        ));
        $changes = array(
            "progress" => json_encode($progress),
            "stage" => "rejected"
        );

        if($auth->role == "operator") {
            //TODO: Add check if operator and this order belongs to this operation.
        } else if($auth->role == "store") {
            //TODO: Check if owner of the said store.
            //TODO: Check if current user is an owner of the store involved!
        }

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $order_id ));
        if($update) {
            $this->json_response($changes);
        } else {
            $this->json_response(null, false, "No order or changes was found!");
        }
    }

    public function cancelOrder() {
        $auth = $this->is_authorized(true, ["admin","operator","store","user"]);
        $request = $this->request_validation($_POST, ["uuid", "store_id"], $this->edit_column);
        $order_id = $request->data['uuid'];

        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->edit_column, 
            "uuid = '$order_id'", 
            null, 'row' );

        if($auth->uuid != $previous->uid && !$this->is_owner_of_store($auth->uuid, $request->data['store_id'])) {
            $this->json_response(null, false, "You dont have the permission to execute such action!");
        }

        if($previous->stage == "cancelled") {
            $this->json_response(null, false, "The order is already cancelled!");
        }

        $progress = json_decode($previous->progress);
        array_push($progress, array(
            "status" => 1,
            "current" => $progress[0]->latest,
            "latest" => "cancelled",
            "timestamp" => get_current_utc_time()
        ));
        $changes = array(
            "progress" => json_encode($progress),
            "stage" => "cancelled"
        );

        if($auth->role == "operator") {
            //TODO: Add check if operator and this order belongs to this operation.
        } else if($auth->role == "store") {
            //TODO: Check if owner of the said store.
        }

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $order_id ));
        if($update) {
            $this->json_response($changes);
        } else {
            $this->json_response(null, false, "No order or changes was found!");
        }
    }

    public function createNewOrder() {
        $auth = $this->is_authorized(true);
        $request = $this->request_validation($_POST, ["uid","store_id"], $this->edit_column);
        $request->data = array_merge(array(
            "uuid" => $this->uuid->v4(),
            "store_id" => $this->Crud_model->sanitize_param($this->request->getVar("store_id")),
            "timestamp" => get_current_utc_time()
        ), $request->data);

        $factor = json_decode($request->data['factor']);

        if($this->is_owner_of_store($auth->uuid, $request->data['store_id'])) {
            $request->data['progress'] = json_encode([array(
                "status" => 1,
                "current" => "created",
                "latest" => "delivered",
                "timestamp" => get_current_utc_time()
            )]);
            $request->data['stage'] = "delivered";
        } else {
            if($factor->delivered && empty($request->data['matrix'])) {
                $request->data['progress'] = json_encode([array(
                    "status" => 1,
                    "current" => "created",
                    "latest" => "draft",
                    "timestamp" => get_current_utc_time()
                )]);
                $request->data['stage'] = "draft";
            } else {
                $request->data['progress'] = json_encode([array(
                    "status" => 1,
                    "current" => "created",
                    "latest" => "created",
                    "timestamp" => get_current_utc_time()
                )]);            
            } 
        }
               

        //Start the computation.
        $total = 0;
        $delivery = 0;
        $discount = 0;
        $tax = 0;
        $grand = 0;

        $items = json_decode($request->data['items']);
        foreach($items as $item) {
            //Product price with discount
            $idiscount = $item->discount_type == "percent" ? 
                ($item->price * ((int)$item->discount/100)) : (int)$item->discount;
            $total += ($item->price - $idiscount)*$item->quantity;

            //Product variant with price and discount
            foreach($item->variations as $option) {
                $vdiscount = ($option->price * ((int)$option->discount/100));
                $total += ($option->price - $vdiscount)*$item->quantity;
            }
        }

        //Process coupon discount
        if($request->data['coupon']) {
            $coupon = json_decode($request->data['coupon']);
            $discount = $coupon->type == "percent" ? ($total * ((int)$coupon->off/100)) : (int)$coupon->off;

            if($discount > (int)$coupon->min) {
                if($discount > (int)$coupon->upto) {
                    $discount = $coupon->upto;
                }
            }
        }

        //Prepare billing statement
        if($request->data['factor']) {
            $factor = json_decode($request->data['factor']);
            $tax = ($total-$discount) * ($factor->tax/100);
            if($factor->ship_mode == "fixed") {
                $delivery = $factor->ship_base + $factor->ship_price;
            } else {
                $delivery = $factor->ship_base + ($factor->ship_price * ((int)$factor->distance/1000)); //per km
            }
            if($total > (int)$factor->min_order) {
                if($total > (int)$factor->free_delivery) {
                    $delivery = 0;
                }
            }
        }
        $grand = ($total - $discount) + $tax + $delivery;
        $request->data['total'] = $total;
        $request->data['discount'] = $discount;
        $request->data['tax'] = $tax;
        $request->data['delivery'] = $delivery;
        $request->data['grand_total'] = $grand;

        $inserted = $this->Crud_model->sql_insert($this->table_name, $request->data);

        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            //$current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Failed submition of order!");
        }
    }

    public function editOrderCurrent() {

    }

    public function deleteOrderCurrent() {

    }
}

<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Product extends AppCore
{
    private $table_name = 'products';
    private $edit_column = ['store_id','name','description','cover','images','orig_price','sell_price','discount_type','discount','category_id','subcategory_id','have_gram','gram','have_kg','kg','have_pcs','pcs','have_liter','liter','have_ml','ml','features','disclaimer','in_stock','is_featured','in_home','is_single','type_of','variations','pending_update','status','timestamp'];
    private $public_column = ['uuid','template','store_id','name','description','cover','images','orig_price','sell_price','discount_type','discount','category_id','subcategory_id','have_gram','gram','have_kg','kg','have_pcs','pcs','have_liter','liter','have_ml','ml','features','disclaimer','in_stock','is_featured','in_home','is_single','type_of','variations','pending_update','verified_at','status','timestamp','updated_at','deleted_at'];
    private $required = ['uuid'];

    function __construct(){
		parent::__construct();
    }

    protected function is_owner_of_product($user_id, $product_id) {
        $params = array(
            $user_id, 
            $product_id
        );

        $query = " SELECT `stores`.`uuid` 
        FROM `stores` INNER JOIN `$this->table_name` 
            ON `stores`.`uuid` = `$this->table_name`.`store_id` 
        WHERE `stores`.`owner` = ?
            AND `$this->table_name`.`uuid` = ?
        ";

        return $this->Crud_model->sql_custom($query, $params, 'row');
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

    protected function getProductMetaItem($product, $with_pending = false) {
        $auth = $this->is_authorized(false);

        unset($product->id);
    
        if(isset($product->store_id) && $product->store_id != null && $product->store_id != '') {
            $store = $this->Crud_model->sql_get('stores', 'name', "uuid = '$product->store_id'", NULL, 'row' );
            if($store) {
                $product->{"store_name"} = $store->name;
            } else {
                $product->{"store_name"} = null;
            }
        } else {
            $product->{"store_name"} = null;
        }

        if(isset($product->template) && $product->template != null && $product->template != '') {
            $template = $this->Crud_model->sql_get('products', 'uuid, name', "uuid = '$product->template'", NULL, 'row' );
            if($store) {
                $product->{"template_id"} = $template->uuid;
                $product->{"template_name"} = $template->name;
            }
        }

        if($with_pending) {
            $product->pending_update = $product->pending_update ? unserialize($product->pending_update) : null;
            if($product->pending_update && isset($product->pending_update["category_id"])) {
                $category_id = $product->pending_update["category_id"];
                $category = $this->Crud_model->sql_get("category", ["name","uuid"], $this->compileWhereClause($auth->where, ["uuid = '$category_id'"]), NULL, 'row' );
                if($category) {
                    $product->pending_update["category_name"] = $category->name;
                }
            }
            if($product->pending_update && isset($product->pending_update["subcategory_id"])) {
                $subcategory_id = $product->pending_update["subcategory_id"];
                $subcategory = $this->Crud_model->sql_get("category", ["name","uuid"], $this->compileWhereClause($auth->where, ["uuid = '$subcategory_id'"]), NULL, 'row' );
                if($subcategory) {
                    $product->pending_update["subcategory_name"] = $subcategory->name;
                }
            }
        }

        $query = "SELECT FORMAT(AVG(rate), 1) as 'avg', COUNT(rate) as 'total' FROM `rating` WHERE `pid`=?";
        $rating = $this->Crud_model->sql_custom($query, array($product->uuid), 'row');
        if($rating) {
            $product->{"a_test"} = json_encode($rating);
            $product->{"avg_rating"} = $rating->avg;
            $product->{"total_rating"} = $rating->total;;
        }

        return $product;
    }

    protected function getProductMeta($products, $single = false) {
        if($single) {
            $products = $this->getProductMetaItem($products);
        } else {
            foreach($products as $product) {
                $product = $this->getProductMetaItem($product);
            }
        }
        return $products;
    }

    public function getProductById() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, ["uuid"], [], ["uuid"]); 

        $product = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, $request->where), NULL, 'row' );
        
        if($product) {
            $product = $this->getProductMetaItem($product, true);
            $this->json_response($product);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    public function getSearchProducts() {
        $auth = $this->is_authorized(false);

        $filter_term = "%".$this->request->getVar('filter_term')."%";
        $limit_start = (int)$this->request->getVar('limit_start');
        $limit_length = (int)$this->request->getVar('limit_length');
        $limit_length = $limit_length ? $limit_length : 10;

        $params = array(
            $filter_term, 
            $limit_start,
            $limit_length
        );

        $query = " SELECT `uuid`,`name`,`cover` 
        FROM `products` 
        WHERE status = '1' AND deleted_at IS NULL AND `name` LIKE ? LIMIT ?, ?
        ";

        $products = $this->Crud_model->sql_custom($query, $params, 'result');
        $products = $this->getProductMeta($products);
        $this->json_response($products);
    }

    public function getAllProducts() {
        $auth = $this->is_authorized(false);

        $filter_term = $this->request->getVar('filter_term');
        $limit_start = (int)$this->request->getVar('limit_start');
        $limit_length = (int)$this->request->getVar('limit_length');
        $limit_length = $limit_length ? $limit_length : 10;
        $params = array( $limit_start, $limit_length );

        $order_by = [];
        $order_column = $this->request->getVar('order_column');
        $order_mode = $this->request->getVar('order_mode');
        if(isset($order_column) && isset($order_mode)) {
            $order_by = [$order_column, $order_mode];
        }

        $query = " SELECT `id` ";
        foreach($this->public_column as $column) {
            $query .= ",`$column` ";
        }
        $query .= " FROM `products` ";
        $query .= " WHERE deleted_at IS NULL ";

        $store_id = $this->request->getVar('store_id');
        $store_query = empty($store_id) ? "":"AND `store_id`='$store_id'";
        $includes = $this->request->getVar('includes');
        $store_query = empty($store_query) ? "AND `store_id` IS NOT NULL" : $store_query ;

        $query .= $includes == 'template' ? "AND `template` IS NULL AND `store_id` IS NULL":"$store_query";
        $query .= $auth->role == "user" || $auth->role == "store" ? " AND `status`='1' ":"";
        $query .= empty($filter_term) ? "" : " AND name LIKE '%".$filter_term."%' ";
        $query .= count($order_by) == 2 ? " ORDER BY $order_by[0] $order_by[1]" : "";
        $query .= " LIMIT ?, ?";   

        $products = $this->Crud_model->sql_custom($query, $params, 'result');
        if($products) {
            $products = $this->getProductMeta($products);
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No store products found!");
        }
    }
    
    public function getProductsByStore() {
        $auth = $this->is_authorized(false);
        $request = $this->request_validation($_POST, ["uuid"], []); 
        $store_id = $request->data['uuid'];       

        $products = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["store_id = '$store_id'"], true), NULL, 'result' );
        
        if($products) {
            $products = $this->getProductMeta($products);
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    public function getFeaturedProduct() {
        $auth = $this->is_authorized(false);

        $products = $this->Crud_model->sql_get($this->table_name, $this->public_column, 
            $this->compileWhereClause($auth->where, ["is_featured = '1'"], true), NULL, 'result' );
        
        if($products) {
            $products = $this->getProductMeta($products);
            $this->json_response($products);
        } else {
            $this->json_response(null, false, "No product was found!");
        }
    }

    public function activate() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);

        $request = $this->request_validation($_POST, ["uuid"], $this->edit_column);
        $product_id = $request->data['uuid'];
        
        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $product = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), "uuid = '$product_id' AND status = '0'");

        if($product) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $product_id ), null, 'row' );
            $current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    }

    public function deactivate() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);

        $request = $this->request_validation($_POST, ["uuid"], $this->edit_column);
        $product_id = $request->data['uuid'];

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $updated = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), "uuid = '$product_id' AND status = '1'");

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$product_id'", null, 'row' );
            $current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    }

    public function decidePending() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "action"], $this->edit_column);
        $product_id = $request->data['uuid'];

        $action = in_array($request->data['action'], ["approve","reject","clear"]) ? true: false;
        if(!$action) {
            $this->json_response(null, false, "Action is not valid"); 
        }
        $action = $request->data['action'];
        
        $existing = $this->Crud_model->sql_get(
            $this->table_name, 
            ["pending_update"], 
            "uuid = '$product_id' AND pending_update IS NOT NULL", 
            null, 'row' );

        if(!$existing) {
            $this->json_response(null, false, "No existing request was found"); 
        }

        $changes = array();
        if($action == "approve" && $auth->role == "admin" && $auth->role == "operator") {
            $changes = unserialize($existing->pending_update);
        }
        $changes['pending_update'] = NULL;

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $request->data['uuid'] ));
        if($update) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $request->data['uuid'] ), null, 'row' );
            $current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Something went wrong saving changes!");
        }
    }

    public function createProductToStore() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["name", "category_id", "subcategory_id"], $this->public_column);
            
        if(isset($_POST['orig_price'])) {
            $_POST['orig_price'] = number_format((float)$_POST['orig_price'], 2, '.', '');
        }
        if(isset($_POST['sell_price'])) {
            $_POST['sell_price'] = number_format((float)$_POST['sell_price'], 2, '.', '');
        }

        if(isset($_POST['kg'])) {
            $_POST['kg'] = number_format((float)$_POST['kg'], 2, '.', '');
        }
        if(isset($_POST['gram'])) {
            $_POST['gram'] = number_format((float)$_POST['gram'], 2, '.', '');
        }
        if(isset($_POST['liter'])) {
            $_POST['liter'] = number_format((float)$_POST['liter'], 2, '.', '');
        }
        if(isset($_POST['ml'])) {
            $_POST['ml'] = number_format((float)$_POST['ml'], 2, '.', '');
        }
        if(isset($_POST['pcs'])) {
            $_POST['pcs'] = number_format((float)$_POST['pcs'], 2, '.', '');
        }
        $request->data['uuid'] = $this->uuid->v4();

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_store_owner = $this->is_owner_of_store($auth->uuid, $store_id);
            if(!$is_store_owner) {
                $this->json_response(null, false, "You do not owned this store!"); 
            }
            $request->data['status'] = "0";
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, $request->data);
        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Failed creator new product!");
        }
    } 

    public function editProductToStore() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);
        $request = $this->request_validation($_POST, ["uuid", "name", "category_id", "subcategory_id"], $this->edit_column);
        $product_id = $request->data['uuid'];

        $previous = $this->Crud_model->sql_get(
            $this->table_name, 
            $this->edit_column, 
            "uuid = '$product_id'", 
            null, 'row' );
            
        if(isset($_POST['orig_price'])) {
            $_POST['orig_price'] = number_format((float)$_POST['orig_price'], 2, '.', '');
        }
        if(isset($_POST['sell_price'])) {
            $_POST['sell_price'] = number_format((float)$_POST['sell_price'], 2, '.', '');
        }

        if(isset($_POST['kg'])) {
            $_POST['kg'] = number_format((float)$_POST['kg'], 2, '.', '');
        }
        if(isset($_POST['gram'])) {
            $_POST['gram'] = number_format((float)$_POST['gram'], 2, '.', '');
        }
        if(isset($_POST['liter'])) {
            $_POST['liter'] = number_format((float)$_POST['liter'], 2, '.', '');
        }
        if(isset($_POST['ml'])) {
            $_POST['ml'] = number_format((float)$_POST['ml'], 2, '.', '');
        }
        if(isset($_POST['pcs'])) {
            $_POST['pcs'] = number_format((float)$_POST['pcs'], 2, '.', '');
        }
        
        $latest = $_POST; 
        unset($latest['uuid']);
        //$pending = (array)unserialize($previous->pending_update);
        $previous = (array)$previous;
        $changes = array_diff_assoc($latest, $previous); //array_merge(array_diff_assoc($latest, $previous), array_diff_assoc($changes, $pending)); 

        if(!$changes) {
            $this->json_response(null, false, "No changes was found"); 
        }

        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_product_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_product_owner) {
                $this->json_response(null, false, "You do not owned this product!"); 
            }

            $is_store_owner = $this->is_owner_of_store($auth->uuid, $store_id);
            if(!$is_store_owner) {
                $this->json_response(null, false, "You do not owned this store!"); 
            }

            $previous = $this->Crud_model->sql_get($this->table_name, ["pending_update"], "uuid = '$product_id' AND pending_update IS NOT NULL", null, 'row' );
            if($previous) {
                $changes = array_merge((array)unserialize($previous->pending_update), $changes);
            }
            
            //TODO: Decide whether to let store update while pending.
            $update = $this->Crud_model->sql_update(
                $this->table_name, 
                array("pending_update"=>serialize($changes)), 
                "uuid = '$product_id'"); //AND pending_update IS NULL
            if($update) {
                $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $request->data['uuid'] ), null, 'row' );
                $current = $this->getProductMetaItem($current);
                $this->json_response($current);
            } else {
                $this->json_response(null, false, "Existing product detail updates on process!");
            }
        }

        $update = $this->Crud_model->sql_update($this->table_name, $changes, array( "uuid" => $product_id ));
        if($update) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "uuid" => $product_id ), null, 'row' );
            $current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    } 

    public function deleteProductToStore() {
        $auth = $this->is_authorized(true, ["admin","operator","store"]);

        $request = $this->request_validation($_POST, ["uuid"], []); //product id.
        $product_id = $request->data['uuid'];
        
        if($auth->role == "operator") {
            //TODO: Add check if operator and this product belongs to this operation.
        } else if($auth->role == "store") {
            $is_owner = $this->is_owner_of_product($auth->uuid, $product_id);
            if(!$is_owner) {
                $this->json_response(null, false, "You are not authorized for this actions!"); 
            }
        }

        $deleted_at = get_current_utc_time();
        $is_deleted = $this->Crud_model->sql_update($this->table_name, array('deleted_at' => $deleted_at), "uuid = '$product_id' AND deleted_at IS NULL" );

        if($is_deleted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, "uuid = '$product_id'", null, 'row' );
            $current = $this->getProductMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No product or changes was found!");
        }
    }
}

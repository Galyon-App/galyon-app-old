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

    protected function getReviewMetaItem($review, $with_pending = false) {
        unset($review->id);
    
        $users = $this->Crud_model->get('users', 'first_name, last_name, cover', "uuid = '$review->uid'", NULL, 'row' );
        if($users) {
            $review->{"fname"} = $users->first_name .' '. $users->last_name;
            $review->{"cover"} = $users->cover;
        } else {
            $review->{"fname"} = null;
            $review->{"cover"} = null;
        }

        //TODO: Check if user or store the get the respective metas.
        if(isset($review->pid) && $review->pid != null && $review->pid != '') {
            
        } else {
            
        }

        return $review;
    }

    protected function getReviewMeta($reviews, $single = false) {
        if($single) {
            $reviews = $this->getReviewMetaItem($reviews);
        } else {
            foreach($reviews as $review) {
                $review = $this->getReviewMetaItem($review);
            }
        }
        return $reviews;
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

    function getByPid() {
        $product_id = $this->input->post('uuid');
        $product = $this->Crud_model->get($this->table_name, $this->public_column, array( "pid" => $product_id ), null, 'result' );

        if($product) {
            $product = $this->getReviewMeta($product);
            $this->json_response($product);
        } else {
            $this->json_response(null, false, "No product review was found!");
        }
    }

    function getBySid() {
        $store_id = $this->input->post('uuid');
        $store = $this->Crud_model->get($this->table_name, $this->public_column, array( "sid" => $store_id ), null, 'result' );

        if($store) {
            $product = $this->getReviewMeta($product);
            $this->json_response($store);
        } else {
            $this->json_response(null, false, "No store review was found!");
        }
    }

    function getByDid() {
        $driver_id = $this->input->post('uuid');
        $driver = $this->Crud_model->get($this->table_name, $this->public_column, array( "did" => $driver_id ), null, 'result' );

        if($driver) {
            $product = $this->getReviewMeta($product);
            $this->json_response($driver);
        } else {
            $this->json_response(null, false, "No driver review was found!");
        }
    }

    function createProductReview() {
        $auth = $this->is_authorized();
        $request = $this->request_validation($_POST, ["pid", "rate"], $this->public_column);
        $request->data['uid'] = $auth->uuid;
        $request->data['timestamp'] = get_current_utc_time();

        $inserted = $this->Crud_model->insert($this->table_name, $request->data);
        if($inserted) {
            $current = $this->Crud_model->get($this->table_name, $this->public_column, "id = '$inserted'", null, 'row' );
            $current = $this->getReviewMetaItem($current);
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "Failed submission of review!");
        }
    }

    function editReview() {
        
    }

    function deleteReview() {
        
    }
}
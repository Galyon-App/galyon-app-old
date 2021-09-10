<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Settings extends Galyon_controller {

    private $table_name = 'settings';
    private $general_rows = ['phone', 'email','address','city','province','zipcode','country','minimum_order','free_delivery','tax','shipping','shippingPrice'];
    private $setting_rows = ['currencySymbol', 'currencySide','appDirection','logo','delivery','reset_pwd','user_login','store_login','driver_login','web_login'];
    private $payment_methods = ['cod', 'gcash', 'paypal', 'paymongo', 'stripe'];
    private $featured_categories_key = "featured_categories";

    function __construct(){
		parent::__construct();
    }
    
    function default() {
        $settings = $this->Crud_model->get($this->table_name, 'opt_key, opt_val', null, null, 'result' );

        $def_setting = new stdClass;
        foreach($settings as $setting) {
            $def_setting->{$setting->opt_key} = $setting->opt_val;
        }

        if($settings && $def_setting) {
            $this->json_response($def_setting);
        } else {
            $this->json_response(null, false, "No settings was found!");
        }
    }

    function updatePayMethod($action = '') {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        if($action == 'activate' || $action == 'deactivate') {
            $code = $this->input->post('code');
            $status = $this->input->post('status');
            
            if(empty($code)) {
                $this->json_response(null, false, "Required fields cannot be empty.");
            }
            $code .= "_enable";

            $success = $this->Crud_model->update($this->table_name, array('opt_val'=>$status), "guard = 'payment' AND opt_key = '$code'" );
            if($success) {
                $this->json_response(array("status"=>$status));
            } else {
                $this->json_response(null, false, "Nothing to save."); 
            }
        } else if($action == 'update') {
            $code = $this->input->post('code');
            $data = $this->input->post('data');
            if(empty($code)) {
                $this->json_response(null, false, "Required fields cannot be empty.");
            }
            $code .= "_data";

            $success = $this->Crud_model->update($this->table_name, array('opt_val'=>$data), "guard = 'payment' AND opt_key = '$code'" );
            if($success) {
                $this->json_response(null);
            } else {
                $this->json_response(null, false, "Nothing to save.");
            }
        } else {
            $this->json_response(null, false, "Invalid actions sent.");
        }
    }

    protected function getPayMethodName($code) {
        if($code == "paypal") {
            return 'Paypal SME';
        } else if($code == "gcash") {
            return 'Globe GCash';
        } else if($code == "paymongo") {
            return 'PayMongo PH';
        } else if($code == "stripe") {
            return 'Stripe Online';
        } else { //cod
            return 'Cash on Delivery';
        }
    }

    function getTargetPaymentMethod($code = '') {
        $options = $this->Crud_model->get($this->table_name, 'opt_key, opt_val', array( "guard" => 'payment' ), null, 'result' );
        $option_array = new stdClass;
        foreach($options as $option) {
            $option_array->{$option->opt_key} = $option->opt_val;
        }

        if(in_array($code, $this->payment_methods)) {
            $enable = $code."_enable";
            $data = $code."_data";
            $this->json_response(array(
                    "code" => $code,
                    "name" => $this->getPayMethodName($code),
                    "status" => $option_array->{$enable},
                    "data" => $option_array->{$data}
                ));
        } else {
            $this->json_response(null, false, "Paymenth is not yet implemented.");
        }
    }

    function getPaymentMethods() {
        $options = $this->Crud_model->get($this->table_name, 'opt_key, opt_val', array( "guard" => 'payment' ), null, 'result' );
        $option_array = new stdClass;
        foreach($options as $option) {
            $option_array->{$option->opt_key} = $option->opt_val;
        }

        $this->json_response([
            array(
                "code" => "cod",
                "name" => "Cash on Delivery",
                "status" => $option_array->cod_enable,
                "data" => $option_array->cod_data
            ), 
            array(
                "code" => "paypal",
                "name" => "Paypal",
                "status" => $option_array->paypal_enable,
                "data" => $option_array->paypal_data
            ),
            array(
                "code" => "gcash",
                "name" => "GCash",
                "status" => $option_array->gcash_enable,
                "data" => $option_array->gcash_data
            ),
             array(
                "code" => "paymongo",
                "name" => "PayMongo",
                "status" => $option_array->paymongo_enable,
                "data" => $option_array->paymongo_data
            ),
             array(
                "code" => "stripe",
                "name" => "Stripe",
                "status" => $option_array->stripe_enable,
                "data" => $option_array->stripe_data
            )
        ]);
    }

    function getGroupOptions($group_name = '', $returnOnly = false) {
        $options = $this->Crud_model->get($this->table_name, 'opt_key, opt_val', array( "guard" => $group_name ), null, 'result' );
        $option_array = new stdClass;
        foreach($options as $option) {
            $option_array->{$option->opt_key} = $option->opt_val;
        }

        if($returnOnly) {
            return $option_array;
        } else {
            $this->json_response($option_array);
        }
    }

    function saveGroupOptions($group_name = '') {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $updated = array();
        if($group_name == "setting") {
            $allowed_row = $this->setting_rows;
        } else {
            $allowed_row = $this->general_rows;
        }
        foreach($allowed_row as $row_key){
            $new_val = $this->input->post($row_key);
            if(empty($new_val)) {
                $this->json_response(null, false, "Required field($row_key) cannot be empty.");
            }
            $success = $this->Crud_model->update($this->table_name, array('opt_val'=>$new_val), "guard = '$group_name' AND opt_key = '$row_key'" );
            if($success) {
                $updated[] = $row_key;
            }
        }
        
        if(count($updated) > 0) {
            return $this->json_response(implode(",", $updated));
        }
        
        $this->json_response(null, false, "Nothing to update.");
    }

    protected function getInitObject() {
        $lang_file = 'en.json';
        $lang_json  = json_decode(file_get_contents(APPPATH.'/language/english/'.$lang_file));
        $popups = $this->Crud_model->get('popups', 'uuid, message, timestamp', array( "shown" => "1", "status" => "1" ), null, 'result' );

        return array(
            'file' => $lang_file,
            'lang' => $lang_json,
            'popup'=> $popups,
            'manage' => $this->getGroupOptions('app', true),
            'settings' => $this->getGroupOptions('setting', true),
            'general' => $this->getGroupOptions('general', true),
            'payment' => $this->getGroupOptions('payment', true),
        );
    }

    function initialize($param = NULL) {
        $settings = $this->Crud_model->get($this->table_name, 'opt_key, opt_val', array( "guard" => "setup" ), null, 'result' );
        if($param == NULL) {
            $setup_setting = $this->getInitObject();
        } else if($param == 'verify') {
            foreach($settings as $setting) {
                $setup_setting[$setting->opt_key] = $setting->opt_val;
            }
        }

        if($settings) {
            $this->json_response($setup_setting);
        } else {
            $this->json_response(null, false, "Backend not yet setup!");
        }
    }

    function getForApp() {
        $settings = $this->Crud_model->get($this->table_name, 'opt_key, opt_val', array( "guard" => "app" ), null, 'result' );

        $app_setting = new stdClass;
        foreach($settings as $setting) {
            $app_setting->{$setting->opt_key} = $setting->opt_val;
        }

        if($settings && $app_setting) {
            $this->json_response($app_setting);
        } else {
            $this->json_response(null, false, "No settings was found!");
        }
    }

    function getMaintainanceStatus() {
        $enabled = $this->Crud_model->get($this->table_name, 'opt_val', array( "guard" => "app", "opt_key" => "app_close" ), null, 'row' );
        $message = $this->Crud_model->get($this->table_name, 'opt_val', array( "guard" => "app", "opt_key" => "app_close_message" ), null, 'row' );

        if($enabled && $message) {
            $this->json_response(array(
                "enabled" => $enabled->opt_val,
                "message" => $message->opt_val,
            ));
        } else {
            $this->json_response(null, false, "No settings was found!");
        }
    }

    function setMaintainanceStatus() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }

        $enabled = $this->input->post('enabled');
        $message = $this->input->post('message');

        if(empty($message)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $success_enabled = $this->Crud_model->update($this->table_name, array('opt_val'=>$enabled), "opt_key = 'app_close'" );
        $success_message = $this->Crud_model->update($this->table_name, array('opt_val'=>$message), "opt_key = 'app_close_message'" );

        if($success_enabled || $success_message) {
            $this->json_response('abc');
        } else {
            $this->json_response(null, false, "Nothing to save!");
        }
    }

    function getFeaturedCategories() {
        $featured_categories = $this->Crud_model->get($this->table_name, 'opt_val', array( "guard" => "publish", "opt_key" => $this->featured_categories_key ), null, 'row' );

        if(!$featured_categories) {
            $this->json_response(null, false, "Featured categories cannot be retrieved.");
        }

        $this->json_response(json_decode($featured_categories->opt_val));//json_decode(stripslashes($featured_categories)));
    }

    function setFeaturedCategories() {
        $user = $this->is_authorized();
        if($user) {
            if($user->role !== "admin") {
                $this->json_response(null, false, "You are not authorized.");
            }
        }
        
        $featured_categories = $this->input->post($this->featured_categories_key);

        if(empty($featured_categories)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $featured_categories = json_decode($featured_categories);
        if(!is_array($featured_categories)) {
            $this->json_response(null, false, "Required field cannot be non-array.");
        }

        foreach($featured_categories as $category) {
            if(isset($category->uuid) && isset($category->name)) {
                $new_featureds[] = array(
                    "uuid" => $category->uuid,
                    "name" => $category->name,
                );
            }
        }
        $new_val = json_encode($new_featureds);

        $success = $this->Crud_model->update($this->table_name, array('opt_val'=>$new_val), "guard = 'publish' AND opt_key = '$this->featured_categories_key'" );

        if(!$success) {
            $this->json_response(null, false, "Failed saving changes.");
        }

        $this->json_response(null);
    }
}
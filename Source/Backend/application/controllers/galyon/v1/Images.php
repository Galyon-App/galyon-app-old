<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Images extends Galyon_controller {

    function __construct(){
		parent::__construct();
    }

    public function upload() {
        $auth = $this->is_authorized(); //Make sure that user is logged in.

        $upload = $this->upload_image('image');
        if($upload) {
            $resize = $this->process_image($upload['data']['file_name']);
            if($resize) {
                $this->json_response(array(
                    "file"=>$upload['data']['file_name']
                ), true, "Success");
            } else {
                $this->json_response($upload, false, "Failed to Resize");
            }   
        } else {
            $this->json_response($upload, false, "Failed to upload");
        }        
    }
}
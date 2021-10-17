<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Image extends AppCore
{
    function __construct(){
		parent::__construct();
    }
    
    public function get() {
        //Get the authorization header.
        $bearer = get_header_auth();
        $token = str_replace("Bearer ", "", $bearer);
        $user = $this->jwt->decode($token);

        if($user == false) {
            $this->json_response(null, false, "Invalid access token!");
            exit;
        }

        $user_id = $this->request->getVar('uuid');
        $user = $this->Crud_model->sql_get('users', '*', array( "uuid" => $user_id ), null, 'row' );

        if($user) {
            $this->json_response($user);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function render($imageName)
    {
        if(($image = file_get_contents(WRITEPATH.'uploads/'.$imageName)) === FALSE)
            show_404();

        $type = explode(".", $imageName);
        $mimeType = "image/".$type[1];

        $this->response
            ->setStatusCode(200)
            ->setContentType($mimeType)
            ->setBody($image)
            ->send();
    }
}

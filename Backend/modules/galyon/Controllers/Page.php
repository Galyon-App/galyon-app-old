<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Page extends AppCore
{
    private $table_name = 'pages';
    private $public_column = ['ukey','name','content','status','timestamp','updated_at','deleted_at'];
    private $required = ['ukey'];

    function __construct(){
		parent::__construct();
    }

    public function getPageByID() {
        $user = $this->is_authorized(false);

        //TODO: Filter by search using the post key of search.
        $pages_id = $this->request->getVar('ukey');
        $where = "ukey = '$pages_id'";
        if($user) {
            if($user->role !== "admin") {
                $where .= "AND status = '1' AND deleted_at IS NULL"; 
            }
        }
        
        $page = $this->Crud_model->sql_get($this->table_name, $this->public_column, $where, null, 'row' );
        if($page) {
            $this->json_response($page);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    public function getAllPages() {
        $user = $this->is_authorized(false);

        //TODO: Filter by search using the post key of search.
        $where = null;
        if($user) {
            if($user->role !== "admin") {
                $where = "status = '1' AND deleted_at IS NULL"; 
            }
        }

        $pagess = $this->Crud_model->sql_get($this->table_name, $this->public_column, NULL, NULL, 'result' );
        if($pagess) {
            $this->json_response($pagess);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    public function createNewPage() {
        $user = $this->is_authorized(true, ['admin']);

        $ukey = $this->request->getVar('ukey');
        $name = $this->request->getVar('name');
        $content = $this->request->getVar('content');

        if(empty($ukey) || empty($name) || empty($content)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $inserted = $this->Crud_model->sql_insert($this->table_name, array( 
            "ukey" => $ukey, 
            "name" => $name, 
            "content" => $content,
            "timestamp" => get_current_utc_time() 
        ));

        if($inserted) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "id" => $inserted ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No user was found!");
        }
    }

    public function editPageCurrent() {
        $user = $this->is_authorized(true, ['admin']);

        $ukey = $this->request->getVar('ukey');
        $name = $this->request->getVar('name');
        $content = $this->request->getVar('content');

        if(empty($ukey) || empty($name) || empty($content)) {
            $this->json_response(null, false, "Required fields cannot be empty.");
        }

        $pages = array( 
            "name" => $name, 
            "content" => $content, 
        );
        $updated = $this->Crud_model->sql_update($this->table_name, $pages, "ukey = '$ukey'" );

        if($updated) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "ukey" => $ukey ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    public function activate() {
        $user = $this->is_authorized(true, ['admin']);

        $pages_id = $this->request->getVar('ukey');
        $pages = $this->Crud_model->sql_update($this->table_name, array( "status" => "1" ), array( "ukey" => $pages_id ));

        if($pages) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "ukey" => $pages_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    public function deactivate() {
        $user = $this->is_authorized(true, ['admin']);

        $pages_id = $this->request->getVar('ukey');
        $pages = $this->Crud_model->sql_update($this->table_name, array( "status" => "0" ), array( "ukey" => $pages_id ));

        if($pages) {
            $current = $this->Crud_model->sql_get($this->table_name, $this->public_column, array( "ukey" => $pages_id ), null, 'row' );
            $this->json_response($current);
        } else {
            $this->json_response(null, false, "No pages was found!");
        }
    }

    public function deletePageCurrent() {
        $cur_user = $this->is_authorized(true, ['admin']);

        $found = $this->validate_request($_POST, $this->required);
        if(count($found)) {
            $this->json_response($found, false, "Required fields cannot be empty!");
        }

        $pages_id = $this->request->getVar('ukey');
        $is_deleted = $this->Crud_model->sql_delete($this->table_name, array( "ukey" => $pages_id ) );

        if($is_deleted) {
            $this->json_response(null);
        } else {
            $this->json_response(null, false, "No city was found!");
        }
    }
}

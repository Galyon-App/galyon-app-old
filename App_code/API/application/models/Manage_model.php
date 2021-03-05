<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/
require_once APPPATH.'/core/Main_model.php';
class Manage_model extends Main_model
{
    public $table_name = "manage";
	public function __construct(){
		parent::__construct();
        $this->load->library('upload','encrypt');
        $this->load->helper('string');
        
    }

    public function getById($id){
        $where = 'id = '.$id;
        $data = $this->get($this->table_name,$where,'results');
        return $data;
    }

    public function saveList($data){
        return $this->insert($this->table_name,$data);
    }

    public function editList($data,$id){
        $where = "id = ".$id;
        return $this->update($this->table_name,$data,$where);
    }


    public function deleteList($id){
        $where = "id =".$id;
        return $this->delete($this->table_name,$where);
    }

    public function getByIdValue($id){
        $where = 'id = '.$id;
        $data = $this->get($this->table_name,$where);
        return $data;
    }

    public function get_all(){
        $data = $this->get($this->table_name);
        return $data;
    }

    public function saveUserLogs($data){
        $data = $this->saveLogs($data);
        return $data;
    }
}

<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
require_once APPPATH.'/core/Main_model.php';
class Images_model extends Main_model
{
    public $table_name = "images";
	public function __construct(){
		parent::__construct();
        $this->load->library('upload','encrypt');
        $this->load->helper('string');
        
    }

    public function getById($id){
        $where = 'user_id = '.$id;
        $data = $this->get($this->table_name,$where,'results');
        return $data;
    }

    public function saveList($data){
        $values = [
            'user_id' => $data['user_id'],
            'title' => $data['title'],
            'description' => $data['description'],
            'img' => $data['img']
        ];
        return $this->insert($this->table_name,$values);
    }

    public function editList($data,$id){
        $values = [
            'title' => $data['title'],
            'description' => $data['description'],
            'img' => $data['img']
        ];
        $where = "id = ".$id;
        return $this->update($this->table_name,$values,$where);
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

    public function saveUserLogs($data){
        $data = $this->saveLogs($data);
        return $data;
    }
}
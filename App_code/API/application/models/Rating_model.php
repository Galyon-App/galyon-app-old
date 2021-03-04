<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
require_once APPPATH.'/core/Main_model.php';
class Rating_model extends Main_model
{
    public $table_name = "rating";
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

    public function getFromIDs($id,$que){
        $this->db->select('rat.uid as uid,rat.pid as pid,rat.did as did,rat.msg as msg,rat.way as way,rat.status as status,rat.timestamp as timestamp, user.first_name as fname,user.last_name as lname,user.cover as cover');
        $this->db->from("rating as rat");
        $this->db->join('users as user','rat.uid = user.id');
        $this->db->where($que);
        $data = $this->db->get()->result();
        return $data;
    }

    public function getFromCount($que){
        $this->db->select('*')->from($this->table_name)->where($que); 
        $q = $this->db->get(); 
        return $q->num_rows();
    }

    public function getWhereIds($que){
        $sql = "SELECT group_concat(`rate` separator ',') as `rate` FROM `rating` where ".$que;
        $query = $this->db->query($sql);
        $array1 = $query->row_array();
        return $array1['rate'];
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

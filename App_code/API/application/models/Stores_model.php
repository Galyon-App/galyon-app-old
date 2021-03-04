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
class Stores_model extends Main_model
{
    public $table_name = "store";
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

    public function getByCity($id){
        $where = 'cid = '.$id." AND status = 1 ";
        $data = $this->get($this->table_name,$where,'results');
        return $data;
    }

    public function getByUid($id){
        $where = 'uid = '.$id;
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

     public function editByUid($data,$id){
        $where = "uid = ".$id;
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

    public function getStoresData($ids){
        $this->db->select('store.uid as uid, store.cover as cover, store.lat as lat,store.lng as lng,store.name as name,user.fcm_token as token,store.status as status,store.address as address,user.email as email,store.mobile as mobile');
        $this->db->from("store as store");
        $this->db->join('users as user','store.uid = user.id');
        $storeIds = explode(',',$ids);
        $this->db->where_in('uid',$storeIds);
        $data = $this->db->get()->result();
        return $data;
    }

    public function getStoresIds($id){
        $sql = "SELECT group_concat(`uid` separator ',') as `uid` FROM `store` where cid = ".$id;
        $query = $this->db->query($sql);
        $array1 = $query->row_array();
        return $array1['uid'];
    }

     public function getUsersNames($ids){
        $this->db->select('*');
        $this->db->from($this->table_name);
        $uid = explode(',',$ids);
        $this->db->where_in('uid',$uid);
        return $this->db->get()->result();
    }
}

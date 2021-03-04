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
class Order_model extends Main_model
{
    public $table_name = "orders";
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

    public function getByUid($id){
        $where = 'uid = '.$id;
        $this->db->select('*')->from($this->table_name);
        $this->db->where($where);
        $this->db->order_by("id", "desc");
        return $this->db->get()->result();
    }

     public function getByStoreId($id){
        $this->db->select('*')->from($this->table_name);
        $this->db->where("FIND_IN_SET(".$id.",store_id) >", 0);
        $this->db->order_by("id", "desc");
        return $this->db->get()->result();
    }

    public function getByStoreWithNames($id){
        $this->db->select('order.uid as uid,order.address as address,order.assignee as assignee,order.coupon_code as coupon_code,order.date_time as date_time,order.delivery_charge as delivery_charge,order.discount as discount,order.driver_id as driver_id,order.grand_total as grand_total,order.id as id,order.notes as notes,order.order_to as order_to,order.orders as orders,order.paid_method as paid_method,order.pay_key as pay_key,order.status as status,order.store_id as store_id,order.tax as tax,order.total as total,user.cover as cover,user.first_name as first_name,user.last_name as last_name');
        $this->db->from("orders as order");
        $this->db->join('users as user','order.uid = user.id');
        $this->db->where("FIND_IN_SET(".$id.",store_id) >", 0);
        $this->db->order_by("id", "desc");
        // $this->db->limit(10);
        $data = $this->db->get()->result();
        return $data;
    }

    public function getByDriverId($id){
        $where = 'driver_id = '.$id;
        $this->db->select('*')->from($this->table_name);
        // $this->db->where($where);
        $this->db->where("FIND_IN_SET(".$id.",driver_id) >", 0);
        $this->db->order_by("id", "desc");
        return $this->db->get()->result();
    }

    public function driverStats($data){
        $this->db->select('*')->from($this->table_name);
        $this->db->where('date_time >=', $data['start']);
        $this->db->where('date_time <=', $data['end']);
        $where = 'driver_id = '.$data['did'];
        $this->db->where($where);
        $this->db->order_by("id", "desc");
        return $this->db->get()->result();
    }

    public function storeStats($data){
        $this->db->select('*')->from($this->table_name);
        $this->db->where('date_time >=', $data['start']);
        $this->db->where('date_time <=', $data['end']);
        $where = 'store_id = '.$data['sid'];
        $this->db->where($where);
        $this->db->order_by("id", "desc");
        return $this->db->get()->result();
    }

    public function getAdminTop(){
        $this->db->select('order.uid as uid,order.address as address,order.assignee as assignee,order.coupon_code as coupon_code,order.date_time as date_time,order.delivery_charge as delivery_charge,order.discount as discount,order.driver_id as driver_id,order.grand_total as grand_total,order.id as id,order.notes as notes,order.order_to as order_to,order.orders as orders,order.paid_method as paid_method,order.pay_key as pay_key,order.status as status,order.store_id as store_id,order.tax as tax,order.total as total,user.cover as cover,user.first_name as first_name,user.last_name as last_name');
        $this->db->from("orders as order");
        $this->db->join('users as user','order.uid = user.id');
        $this->db->order_by("id", "desc");
        $this->db->limit(10);
        $data = $this->db->get()->result();
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
        $this->db->select('order.uid as uid,order.address as address,order.assignee as assignee,order.coupon_code as coupon_code,order.date_time as date_time,order.delivery_charge as delivery_charge,order.discount as discount,order.driver_id as driver_id,order.grand_total as grand_total,order.id as id,order.notes as notes,order.order_to as order_to,order.orders as orders,order.paid_method as paid_method,order.pay_key as pay_key,order.status as status,order.store_id as store_id,order.tax as tax,order.total as total,user.cover as cover,user.first_name as first_name,user.last_name as last_name');
        $this->db->from("orders as order");
        $this->db->join('users as user','order.uid = user.id');
        $this->db->order_by("id", "desc");
        $data = $this->db->get()->result();
        return $data;
    }

    public function adminAllOrders(){
        $this->db->select('*')->from($this->table_name);
        $this->db->order_by("id", "desc");
        return $this->db->get()->result();
        return $data;
    }

    public function saveUserLogs($data){
        $data = $this->saveLogs($data);
        return $data;
    }
}

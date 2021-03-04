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
class Product_model extends Main_model
{
    public $table_name = "products";
	public function __construct(){
		parent::__construct();
        $this->load->library('upload','encrypt');
        $this->load->helper('string');

    }

    public function getById($id){
        // $where = 'id = '.$id;
        // $data = $this->get($this->table_name,$where,'results');
        // return $data;
        $this->db->select('p.id as id,p.store_id as store_id,p.cover as cover,p.name as name,p.images as images,p.original_price as original_price,p.sell_price as sell_price,p.discount as discount,p.kind as kind,p.cate_id as cate_id,p.sub_cate_id as sub_cate_id,p.in_home as in_home,p.is_single as is_single,p.have_gram as have_gram,p.gram as gram,p.have_kg as have_kg,p.kg as kg,p.have_pcs as have_pcs,p.pcs as pcs,p.have_liter as have_liter,p.liter as liter,p.have_ml as have_ml,p.ml as ml,p.descriptions as descriptions,p.key_features as key_features,p.disclaimer as disclaimer,p.exp_date as exp_date,p.type_of as type_of,p.in_stoke as in_stoke,p.rating as rating,p.total_rating as total_rating,p.status as status,p.in_offer as in_offer,s.name as s_name,p.variations as variations,p.size as size');
        $this->db->from("products as p");
        $this->db->join('store as s','p.store_id = s.uid');
        $where = 'p.id = '.$id;
        $this->db->where($where);
        $data = $this->db->get()->result();
        return $data;
    }

    public function getByStoreId($id,$limit){
        $where = 'store_id = '.$id;
        $this->db->select('*');
        $this->db->from($this->table_name);
        $this->db->where($where);
        $this->db->limit($limit);
        return $this->db->get()->result();
    }

    public function inOffers($ids){
        $where = 'in_offer = 1';
        $this->db->select('*');
        $this->db->from($this->table_name);
        $this->db->where($where);
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        return $this->db->get()->result();
    }

    public function getSearchItems($query,$ids){
        $this->db->select('*');
        $this->db->from($this->table_name);
        $this->db->like('name',$query);
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        return $this->db->get()->result();
    }

    public function getByCid($id,$ids){
        $where = 'cate_id = '.$id;
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $data = $this->get($this->table_name,$where,'results');
        return $data;
    }

    public function getByCSID($id,$ids,$sid,$limit){
        $where = 'cate_id = '.$id.' AND sub_cate_id = '.$sid;
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $this->db->limit($limit);
        $data = $this->get($this->table_name,$where,'results');
        return $data;
    }

    public function getBySid($id,$limit,$ids){
        $where = 'sub_cate_id = '.$id;
        $this->db->select('*');
        $this->db->from($this->table_name);
        $this->db->where($where);
        $this->db->limit($limit);
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        return $this->db->get()->result();
    }

    public function getFavs($ids){
        $this->db->select('*');
        $this->db->from($this->table_name);
        $prodIds = explode(',',$ids);
        $this->db->where_in('id',$prodIds);
        $data = $this->db->get()->result();
        return $data;
    }
    
     public function getRelated($id,$limit,$ids){
        $where = 'sub_cate_id = '.$id;
        $this->db->select('*');
        $this->db->from($this->table_name);
        $this->db->where($where);
        $this->db->limit($limit);
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        return $this->db->get()->result();
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

    public function getTopRated($ids){
        $this->db->select("*");
        $this->db->from($this->table_name);
        $this->db->order_by("rating", "DESC");
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $where = "status = 1 ";
        $this->db->where($where);
        $this->db->limit(15);
        return $this->db->get()->result();
    }

    public function getTopRatedAll($ids,$limit){
        $this->db->select("*");
        $this->db->from($this->table_name);
        $this->db->order_by("rating", "DESC");
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $where = "status = 1 ";
        $this->db->where($where);
        $this->db->limit($limit);
        return $this->db->get()->result();
    }

    public function getOffersList($ids,$limit){
        $this->db->select("*");
        $this->db->from($this->table_name);
        $this->db->order_by("rating", "DESC");
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $where = "status = 1 AND in_offer = 1";
        $this->db->where($where);
        $this->db->limit($limit);
        return $this->db->get()->result();
    }

    public function getProductByStores($ids,$limit){
        $this->db->select("*");
        $this->db->from($this->table_name);
        $where = "status = 1 AND store_id = ".$ids;
        $this->db->where($where);
        $this->db->limit($limit);
        return $this->db->get()->result();
    }
    
    public function getHome($ids){
        $this->db->select("*");
        $this->db->from($this->table_name);
        $this->db->order_by("rating", "DESC");
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $where = "status = 1 AND in_home = 1";
        $this->db->where($where);
        $this->db->limit(15);
        return $this->db->get()->result();
    }
    public function getProductWithCity($ids){
        $this->db->select("*");
        $this->db->from($this->table_name);
        $this->db->order_by("rating", "DESC");
        $storeIds = explode(',',$ids);
        $this->db->where_in('store_id',$storeIds);
        $where = "status = 1";
        $this->db->where($where);
        return $this->db->get()->result();
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

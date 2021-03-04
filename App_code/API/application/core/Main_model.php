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
class Main_model extends CI_Model
{
	public function __construct(){
		parent::__construct();
		$this->load->library('upload');
		$this->load->library('email');
	}

	public function get($table_name,$where = NULL,$result = 'row'){
		if($where == NULL){
			$this->db->select('*');
			$this->db->from($table_name);
			return $this->db->get()->result();	
		}else{
			$this->db->select('*');
			$this->db->from($table_name);
			$this->db->where($where);
			if($result == 'row'){
				return $this->db->get()->row();
			}else{
				return $this->db->get()->result();
			}
		}
	}

	public function insert($table_name,$values){
		$this->db->insert($table_name,$values);
		if($this->db->affected_rows() == '1'){
			return $this->db->insert_id();
		}else{
			return false;
		}
	}

	public function saveLogs($values){
		$this->db->insert('logs',$values);
		if($this->db->affected_rows() == '1'){
			return $this->db->insert_id();
		}else{
			return false;
		}
	}

	public function update($table_name,$values,$where){
		$this->db->where($where);
		$this->db->update($table_name,$values);
		if($this->db->affected_rows() == '1'){
			return true;
		}else{
			return false;
		}
	}

	public function delete($table_name,$where){
		$this->db->where($where);
		$this->db->delete($table_name);
		if($this->db->affected_rows() == '1'){
			return true;
		}else{
			return false;
		}
	}

	public function send_push($message,$device_id){
		$content      = array(
			 "en" => $message
		 );
		 $hashes_array = array();
		 array_push($hashes_array, array(
			 "id" => "like-button",
			 "text" => "Like",
			 "icon" => "http://i.imgur.com/N8SN8ZS.png",
			 "url" => "https://yoursite.com"
		 ));
		 array_push($hashes_array, array(
			 "id" => "like-button-2",
			 "text" => "Like2",
			 "icon" => "http://i.imgur.com/N8SN8ZS.png",
			 "url" => "https://yoursite.com"
		 ));
		 $fields = array(
			 'app_id' => "dd7ccde5-b7a0-48b2-a05a-ca56ec1b511c",
			 'include_player_ids' => array(
				 $device_id
			 ),
			 'data' => array(
				 "foo" => "bar"
			 ),
			 'contents' => $content,
			 'web_buttons' => $hashes_array
		 );
		 
		 $fields = json_encode($fields);
		//  print("\nJSON sent:\n");
		//  print($fields);
		 
		 $ch = curl_init();
		 curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
		 curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			 'Content-Type: application/json; charset=utf-8',
			 'Authorization: Basic ODBlZWQ2ZGMtYTQxMS00NmYwLTkzZDItODdmNjcwZWZiYzEy'
		 ));
		 curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		 curl_setopt($ch, CURLOPT_HEADER, FALSE);
		 curl_setopt($ch, CURLOPT_POST, TRUE);
		 curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		 
		 $response = curl_exec($ch);
		 curl_close($ch);

		$return["allresponses"] = $response;
        $return = json_encode($return);
        return $return;
 	}

	public function sendEmail($subject,$to,$message,$type){
		$this->email->from('info@initappz.com', $subject);
		$custom ='';
		if($type == 'admin_register'){
			$custom = 'Login';
		}else if($type == 'login'){
			$custom = 'Login alert';
		}else{
			$custom = 'Alert';
		}
        $this->email->to($to);
		$this->email->subject($subject);
		$this->email->set_mailtype("html");
        $this->email->message($custom);
        $this->email->send();
    }

	// advance get data slection
	/*
	@param $table_name : choose table name from database;
	@param $where : where condition of database query;
	@param $field_name : field name that get only data;
	*/
	public function get_by($table_name,$where = NULL,$field_name,$result = 'row'){
		$this->db->select($field_name);
		$this->db->from($table_name);
		if($where != NULL){
			$this->db->where($where);
			if($result == 'row'){
				return $this->db->get()->row();	
			}else{
				return $this->db->get()->result();
			}
		}else{
			return $this->db->get()->result();
		}
	}

	// File upload Function
	public function upload_file($file,$single = false){

		if(!$single && $file && count($file['document_file']['name']) > 0){
			$fileCount = count($file['document_file']['name']);
			$uploadData = [];
			for($i = 0; $i < $fileCount; $i++){
				$_FILES['document_file']['name'] = $file['document_file']['name'][$i];
				$_FILES['document_file']['type'] = $file['document_file']['type'][$i];
				$_FILES['document_file']['tmp_name'] = $file['document_file']['tmp_name'][$i];
				$_FILES['document_file']['error'] = $file['document_file']['error'][$i];
				$_FILES['document_file']['size'] = $file['document_file']['size'][$i];
				
				$config['upload_path']          = './uploads/';
				$config['allowed_types']        = 'gif|jpg|png|pdf|doc|jpeg';
				$config['max_size']             = 1000000;
				$config['max_width']            = 1024;
				$config['max_height']           = 7680;

				$this->load->library('upload', $config);
				$this->upload->initialize($config);
				if($this->upload->do_upload('document_file')){
					$fileData = $this->upload->data();
					$uploadData[$i] = $fileData;
				}else{
					return array('error' => $this->upload->display_errors());
				}
			}
			return $uploadData;
		}else{
			
			$config['upload_path']          = './uploads/';
			$config['allowed_types']        = 'gif|jpg|png|pdf|doc|jpeg';
			$config['max_size']             = 1000000;
			$config['max_width']            = 1024;
			$config['max_height']           = 7680;
			$this->load->library('upload', $config);
			$this->upload->initialize($config);
			if($this->upload->do_upload('document_file')){
				return $this->upload->data();
			}else{
				return array('error' => $this->upload->display_errors());
			}
		}
	}
}

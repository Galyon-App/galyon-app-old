<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

class Galyon_model extends CI_Model
{
	function __construct() {
		parent::__construct();
	}

	public function sanitize_param($params) {
		//TODO: VERY IMPORTANT
		return $params;
	}
	
	/**
	 * Get a row based on where condition and if row or result.
	 *
	 * @param  mixed $table
	 * @param  mixed $where
	 * @param  mixed $result
	 * @return object
	 */
	public function get($table, $field = "*", $where = NULL, $whereOr = NULL, $result = 'row') {
		if($where == NULL) {
			$this->db->select($field);
			$this->db->from($table);
			return $this->db->get()->result();	
		} else {
			$this->db->select($field);
			$this->db->from($table);
			$this->db->where($where);
			if($whereOr != NULL) {
				$this->db->or_where($whereOr);
			}
			if($result == 'row') {
				return $this->db->get()->row();
			} else {
				$limit_start = $this->input->post('limit_start');
				$limit_length = $this->input->post('limit_length');
				$limit_length = $limit_length ? (int)$limit_length : 10;
				$this->db->limit($limit_length, $limit_start);
				return $this->db->get()->result();
			}
		}
	}
	
	/**
	 * Get random row from a table with a declarable limit count.
	 *
	 * @param  mixed $table
	 * @param  mixed $column
	 * @param  mixed $limit
	 * @return boolean
	 */
	public function get_random($table, $column = "id", $limit = 1) {
		$this->db->select('*');
		$this->db->from($table);
		$this->db->order_by($column, 'RANDOM');
		$this->db->limit($limit);
		return $this->db->get()->result();
	}
	
	/**
	 * Insert a new row in a table.
	 *
	 * @param  mixed $table
	 * @param  mixed $values
	 * @return boolean
	 */
	public function insert($table, $values) {
		$this->db->insert($table, $values);
		if($this->db->affected_rows() == '1') {
			return $this->db->insert_id();
		} else {
			return false;
		}
	}
	
	/**
	 * Update a specific row in a table.
	 *
	 * @param  mixed $table
	 * @param  mixed $values
	 * @param  mixed $where
	 * @return boolean
	 */
	public function update($table, $values, $where) {
		$this->db->where($where);
		$this->db->update($table, $values);
		if($this->db->affected_rows() == '1') {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Delete a specific row in a table.
	 *
	 * @param  mixed $table
	 * @param  mixed $where
	 * @return boolean
	 */
	public function delete($table, $where) {
		$this->db->where($where);
		$this->db->delete($table);
		if($this->db->affected_rows() == '1') {
			return true;
		} else {
			return false;
		}
	}

	public function custom($sql_query, $params = array(), $result = 'row') {
		// $sql = "SELECT * FROM some_table WHERE id = ? AND status = ? AND author = ?";
		// $this->db->query($sql, array(3, 'live', 'Rick'));
		
		$active_query = $this->db->query($sql_query, $params);
		if( !$active_query  ) {
			return $this->db->error();
		}

		if($this->db->affected_rows() > 0) {
			if($result == 'row') {
				return $active_query->row();
			} else {
				return $active_query->result();
			}
		} else {
			return false;
		}
	}
}
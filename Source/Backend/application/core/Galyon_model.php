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
	
	/**
	 * Get a row based on where condition and if row or result.
	 *
	 * @param  mixed $table
	 * @param  mixed $where
	 * @param  mixed $result
	 * @return object
	 */
	public function get($table, $field = "*", $where = NULL, $result = 'row') {
		if($where == NULL) {
			$this->db->select($field);
			$this->db->from($table);
			return $this->db->get()->result();	
		} else {
			$this->db->select($field);
			$this->db->from($table);
			$this->db->where($where);
			if($result == 'row') {
				return $this->db->get()->row();
			} else {
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
}
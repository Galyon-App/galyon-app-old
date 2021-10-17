<?php

namespace Galyon\Models;

use CodeIgniter\Model;

class AppModel extends Model
{
	protected $dbgroup;
	protected $mysql;
	public $db;

    function __construct($table = null, $dbgroup = 'default') {
		$this->dbgroup = $dbgroup;
        $this->mysql = db_connect($this->dbgroup);
		
		//TODO: Finalized this.
        // $this->db->query("SET sql_mode = ''");
        // $this->table = $this->db->getPrefix() . $table;
    }

    /**
	 * TEMP: Get a row based on where condition and if row or result.
	 *
	 * @param  mixed $table
	 * @param  mixed $where
	 * @param  mixed $result
	 * @return object
	 */
	public function sql_get($table, $field = "*", $where = NULL, $whereOr = NULL, $result = 'row', $limits = null, $order = []) {
		$this->db = $this->mysql->table($table);

		$this->db->select($field);
		if(count($order) == 2) {
			$this->db->order_by($order[0],$order[1]);
		}

		if($where != NULL) {
			$this->db->where($where);

			if($whereOr != NULL) {
				$this->db->or_where($whereOr);
			}
		}		

		if($where == NULL) {
			$result = "result";
		}

		// $limit_start = $this->request->getVar('limit_start');
		// $limit_length = $this->request->getVar('limit_length');
		// $limit_length = $limit_length ? (int)$limit_length : 10;
		// $limit_length = $limits != null && (int)$limits > 0 ? $limits : $limit_length;
		// $this->db->limit($limit_length, $limit_start);

		return $result == "row" ? $this->db->get()->getRow() : $this->db->get()->getResult();
	}
	
	/**
	 * TEMP: Get random row from a table with a declarable limit count.
	 *
	 * @param  mixed $table
	 * @param  mixed $column
	 * @param  mixed $limit
	 * @return boolean
	 */
	public function sql_get_random($table, $column = "id", $limit = 1) {
		$this->db = $this->mysql->table($table);

		$this->db->select('*');
		$this->db->order_by($column, 'RANDOM');
		$this->db->limit($limit);
		return $this->db->get()->result();
	}
	
	/**
	 * TEMP: Insert a new row in a table.
	 *
	 * @param  mixed $table
	 * @param  mixed $values
	 * @return boolean
	 */
	public function sql_insert($table, $values) {
		$this->db = $this->mysql->table($table);
		$this->db->insert($values);
		if($this->db->affected_rows() == '1') {
			return $this->db->insert_id();
		} else {
			return false;
		}
	}
	
	/**
	 * TEMP: Update a specific row in a table.
	 *
	 * @param  mixed $table
	 * @param  mixed $values
	 * @param  mixed $where
	 * @return boolean
	 */
	public function sql_update($table, $values, $where) {
		$this->db = $this->mysql->table($table);
		$this->db->where($where);
		$this->db->update($values);
		if($this->db->affected_rows() == '1') {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * TEMP: Delete a specific row in a table.
	 *
	 * @param  mixed $table
	 * @param  mixed $where
	 * @return boolean
	 */
	public function sql_delete($table, $where) {
		$this->db = $this->mysql->table($table);
		$this->db->where($where);
		$this->db->delete();
		if($this->db->affected_rows() == '1') {
			return true;
		} else {
			return false;
		}
	}

    /**
     * TEMP: Execute a custom sql query.
     */
	public function sql_custom($sql_query, $params = array(), $result = 'row') {
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

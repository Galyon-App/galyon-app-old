<?php

namespace Galyon\Models;

use CodeIgniter\Model;

class AppModel extends Model
{
	protected $request;
	protected $dbgroup;
	protected $mysql;
	public $db;

    function __construct($table = null, $dbgroup = 'default') {
		$this->request = \Config\Services::request();
		$this->dbgroup = $dbgroup;
        $this->mysql = db_connect($this->dbgroup);
		
		//TODO: Finalized this.
        // $this->db->query("SET sql_mode = ''");
        // $this->table = $this->db->getPrefix() . $table;
    }

	public function sanitize_param($params) {
		//TODO: VERY IMPORTANT
		return $params;
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
			$this->db->orderBy($order[0],$order[1]);
		}

		if($where != NULL) {
			$this->db->where($where);

			if($whereOr != NULL) {
				$this->db->orWhere($whereOr);
			}
		}		

		if($where == NULL) {
			$result = "result";
		}

		$limit_start = $this->request->getVar('limit_start');
		$limit_length = $this->request->getVar('limit_length');
		$limit_length = $limit_length ? (int)$limit_length : 10;
		$limit_length = $limits != null && (int)$limits > 0 ? $limits : $limit_length;
		$this->db->limit($limit_length, $limit_start);

		$results = $this->db->get();

		return $result == "row" ? $results->getRow() : $results->getResult();
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
		$this->db->orderBy($column, 'RANDOM');
		$this->db->limit($limit);
		return $this->db->get()->getResult();
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
		if($this->db->affectedRows() == '1') {
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
		if($this->db->update($values)) {
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
		if( $this->db->delete() ) {
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
		$this->db = $this->mysql;

		$active_query = $this->db->query($sql_query, $params);
		if( !$active_query  ) {
			return false;
		}

		if($this->db->affectedRows() == 0) {
			return false;
		}

		return $result == "row" ? $active_query->getRow() : $active_query->getResult();
	}
}

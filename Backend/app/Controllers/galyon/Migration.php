<?php

/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'/core/Galyon_controller.php';

class Migration extends Galyon_controller
{
    function __construct() {
        parent::__construct();
        //TODO: Access only admin.

        $this->load->library('migration');
        $this->config->load('migration');
        $this->reinit_migrate_verion($this->get_latest_version());
    }

    protected function reinit_migrate_verion($version) {
        $new_config = array(
            "migration_enabled" => $this->config->item('migration_enabled'),
            "migration_type" => $this->config->item('migration_type'),
            "migration_table" => $this->config->item('migration_table'),
            "migration_auto_latest" => $this->config->item('migration_auto_latest'),
            "migration_version" => $version,
            "migration_path" => $this->config->item('migration_path'),
        );
        $this->migration = new CI_Migration($new_config);
    }

    //Latest version on file.
    protected function get_latest_version() 
    {
        $migrations = $this->migration->find_migrations();
        $latest_ver = array_key_last($migrations);
        return (int)$latest_ver;
    }

    //Current version on database.
    protected function get_current_version() 
    {
        $table = $this->config->item('migration_table');
        $row = $this->db->select('version')->get($table)->row();
		$current_ver = $row ? $row->version : '0';
        return (int)$current_ver;
    }

    protected function is_migration_sync()
    {
        return $this->get_current_version() === $this->get_latest_version() ? true : false;
    }

    public function index()
    {
        $this->json_response(array(
            "versions" => $this->migration->find_migrations(),
            "current" => $this->get_current_version(),
            "latest" => $this->get_latest_version()
        ));
    }

    public function update()
    {
        $target_version = (int)$this->input->post('version');
        
        if($target_version === 0) {
            echo json_encode( array( "success" => false, "message" => "Database target version invalid." ) );
            return;
        }

        if($target_version > $this->get_latest_version()) {
            echo json_encode( array( "success" => false, "message" => "Database target version is not yet released." ) );
            return;
        }

        if($target_version == $this->get_current_version()) {
            echo json_encode( array( "success" => true, "message" => "Database version is still up to date.") );
        } else if($target_version > $this->get_current_version()) {
            $this->migrate($target_version);
        } else {
            $this->rollback($target_version);
        }
    }

    protected function migrate($target = null)
    {
        if($this->is_migration_sync()) {
            echo json_encode( array( "success" => false, "message" => "Database version is still the latest." ) );
            return;
        }

        //Dynamically update or use latest version.
        $cur_target = $target == null ? $this->get_latest_version() : (int)$target;
        $this->reinit_migrate_verion($cur_target);

        //TODO: Check if there is any database error then rollback. For now return status of 500

        $prev_ver = $this->get_current_version();
        if ($this->migration->current() === FALSE) {
            $this->rollback($prev_ver);
            //echo json_encode( array( "success" => false, "message" => $this->migration->error_string() ) );
            return;
        }

        echo json_encode( array( "success" => true, "message" => "Database migration successfull.", "current" => $target ) );
    }

    protected function rollback($version) 
    {
        $target = (int)$version;

        if($target === 0) {
            echo json_encode( array( "success" => false, "message" => "Target database version is invalid." ) );
            return;
        }

        if($target == $this->get_current_version()) {
            echo json_encode( array( "success" => false, "message" => "Target database version is same as the target." ) );
            return;
        }

        if($target > $this->get_latest_version()) {
            echo json_encode( array( "success" => false, "message" => "Target database version is greater than the current." ) );
            return;
        }

        $this->migration->version($target);
        
        echo json_encode( array( "success" => true, "message" => "Database rollback successfull.", "current" => $target ) );
    }
}
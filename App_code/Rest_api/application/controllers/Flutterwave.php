<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ defined('BASEPATH') OR exit('No direct script access allowed');
class Flutterwave extends CI_Controller
{
    function  __construct() {
        parent::__construct();
        $this->load->helper('url');

    }
     
    function index(){
        $data = array(
            'key' => $_GET['key'],
            'amount' => $_GET['amount'],
            'email' => $_GET['email'],
            'phone' => $_GET['phone'],
            'name' => $_GET['name'],
            'code'=>$_GET['code'],
            'callback' => base_url().'flutterwave/success?id=',
            'error' => base_url().'flutterwave/closed',
            'logo'=>$_GET['logo']
        );
        $this->load->view('Flutterwave/flutterwave',$data);
    }

    function success(){
        $this->load->view('Flutterwave/success');
    }
    function closed(){
        $this->load->view('Flutterwave/closed');
    }
    
}
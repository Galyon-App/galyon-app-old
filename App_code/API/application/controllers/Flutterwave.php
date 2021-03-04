<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
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
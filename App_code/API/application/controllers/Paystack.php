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
class Paystack extends CI_Controller
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
            'firstname'=>$_GET['firstname'],
            'lastname'=>$_GET['lastname'],
            'ref'=>$_GET['ref'],
            'callback' => base_url().'paystack/success?id=',
            'onClose' =>base_url().'paystack/close',
        );
        $this->load->view('Paystack/pay',$data);
    }

    function success(){
        $this->load->view('Paystack/success');
    }
    function close(){
        $this->load->view('Paystack/close');
    }
}
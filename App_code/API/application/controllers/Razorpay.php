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
class Razorpay extends CI_Controller
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
            'logo'=> $_GET['logo'],
            'callback' => base_url().'razorpay/success?id='
        );
        $this->load->view('RazorPay/razorpay',$data);
    }

    function success(){
        $this->load->view('RazorPay/success');
    }
    
}
<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
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
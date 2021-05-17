<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ defined('BASEPATH') OR exit('No direct script access allowed');
class Razorpay extends MY_Controller
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
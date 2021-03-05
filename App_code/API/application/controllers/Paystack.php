<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
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
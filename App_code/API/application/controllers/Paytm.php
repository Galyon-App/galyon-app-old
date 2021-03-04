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
require_once(APPPATH."libraries/paytm/config_paytm.php");
require_once(APPPATH."libraries/paytm/encdec_paytm.php");

class Paytm extends CI_Controller
{
    public $_statusOK = 200;
    public $_statusErr = 500;
    public $_OKmessage = 'Success';
    public $_Errmessage = 'Error';
    public $redirectWebURL = 'http://localhost:4200/';
    function  __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('url');
        $this->load->library('json');
        header("Pragma: no-cache");
        header("Cache-Control: no-cache");
        header("Expires: 0");
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization,Basic");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == "OPTIONS") {
            die();
        }
    }
     
    function index(){
        echo base_url();
    }
     
    public function pay(){
        $checkSum = "";
		$paramList = array();
		$ORDER_ID = $_GET["ORDER_ID"];
		$CUST_ID = $_GET["CUST_ID"];
		$INDUSTRY_TYPE_ID = $_GET["INDUSTRY_TYPE_ID"];
		$CHANNEL_ID = $_GET["CHANNEL_ID"];
		$TXN_AMOUNT = $_GET["TXN_AMOUNT"];
		$paramList["MID"] = PAYTM_MERCHANT_MID;
		$paramList["ORDER_ID"] = $ORDER_ID;
		$paramList["CUST_ID"] = $CUST_ID;
		$paramList["INDUSTRY_TYPE_ID"] = $INDUSTRY_TYPE_ID;
		$paramList["CHANNEL_ID"] = $CHANNEL_ID;
		$paramList["TXN_AMOUNT"] = $TXN_AMOUNT;
		$paramList["WEBSITE"] = PAYTM_MERCHANT_WEBSITE;
		$paramList["CALLBACK_URL"] = base_url().'paytm/actionByUser';
		$checkSum = getChecksumFromArray($paramList,PAYTM_MERCHANT_KEY);
        $paramList["CHECKSUMHASH"]=$checkSum;	
		$this->load->view('paytm/pgRedirect',['paramList'=>$paramList]);
    }

    public function payFromWeb(){
        $checkSum = "";
		$paramList = array();
		$ORDER_ID = $_GET["ORDER_ID"];
		$CUST_ID = $_GET["CUST_ID"];
		$INDUSTRY_TYPE_ID = $_GET["INDUSTRY_TYPE_ID"];
		$CHANNEL_ID = $_GET["CHANNEL_ID"];
		$TXN_AMOUNT = $_GET["TXN_AMOUNT"];
		$paramList["MID"] = PAYTM_MERCHANT_MID;
		$paramList["ORDER_ID"] = $ORDER_ID;
		$paramList["CUST_ID"] = $CUST_ID;
		$paramList["INDUSTRY_TYPE_ID"] = $INDUSTRY_TYPE_ID;
		$paramList["CHANNEL_ID"] = $CHANNEL_ID;
		$paramList["TXN_AMOUNT"] = $TXN_AMOUNT;
		$paramList["WEBSITE"] = PAYTM_MERCHANT_WEBSITE;
        $paramList["CALLBACK_URL"] = base_url().'paytm/webSuccess';
		// $paramList["CALLBACK_URL"] =$_GET['callback'];
		$checkSum = getChecksumFromArray($paramList,PAYTM_MERCHANT_KEY);
        $paramList["CHECKSUMHASH"]=$checkSum;	
		$this->load->view('paytm/pgRedirect',['paramList'=>$paramList]);
    }

    public function paytmChecksum(){
        $checkSum = "";
		$paramList = array();
		$ORDER_ID = $_POST["ORDER_ID"];
		$CUST_ID = $_POST["CUST_ID"];
		$INDUSTRY_TYPE_ID = $_POST["INDUSTRY_TYPE_ID"];
		$CHANNEL_ID = $_POST["CHANNEL_ID"];
		$TXN_AMOUNT = $_POST["TXN_AMOUNT"];
		$paramList["MID"] = PAYTM_MERCHANT_MID;
		$paramList["ORDER_ID"] = $ORDER_ID;
		$paramList["CUST_ID"] = $CUST_ID;
		$paramList["INDUSTRY_TYPE_ID"] = $INDUSTRY_TYPE_ID;
		$paramList["CHANNEL_ID"] = $CHANNEL_ID;
		$paramList["TXN_AMOUNT"] = $TXN_AMOUNT;
		$paramList["WEBSITE"] = PAYTM_MERCHANT_WEBSITE;
        // $paramList["CALLBACK_URL"] = base_url().'paytm/webSuccess';
		$paramList["CALLBACK_URL"] =$_POST['CALLBACK_URL'];
		$checkSum = getChecksumFromArray($paramList,PAYTM_MERCHANT_KEY);
        $paramList["CHECKSUMHASH"]=$checkSum;	

        // echo $checkSum;
        echo $this->json->response($checkSum,$this->_OKmessage,$this->_statusOK);
    }

    function actionByUser(){        
        $paytmChecksum = "";
        $paramList = array();
        $isValidChecksum = "FALSE";
        $paramList = $_POST;
        $paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg
        $isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.
        if($isValidChecksum == "TRUE") {
            if ($_POST["STATUS"] == "TXN_SUCCESS") {
                redirect(base_url().'paytm/success', 'refresh');
            }
            else {
                echo "<b>Transaction status is failure</b>" . "<br/>";
            }
        }
        else {
            echo "<b>Checksum mismatched.</b>";
        }
     }

     function webSuccess(){        
        $paytmChecksum = "";
        $paramList = array();
        $isValidChecksum = "FALSE";
        $paramList = $_POST;
        $paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg
        $isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.
        if($isValidChecksum == "TRUE") {
            if ($_POST["STATUS"] == "TXN_SUCCESS") {
                redirect($this->redirectWebURL.'paytmcallback?status=success', 'refresh');
                // $data['callback'] = $this->redirectWebURL.'paytmcallback?status=success';
                // $this->load->view('paytm/websuccess',$data);
            }
            else {
                redirect($this->redirectWebURL.'paytmcallback?status=failure', 'refresh');
                // $data['callback'] = $this->redirectWebURL.'paytmcallback?status=failure';
                // $this->load->view('paytm/websuccess',$data);
            }
        }
        else {
            echo "<b>Checksum mismatched.</b>";
        }
     }
 
}
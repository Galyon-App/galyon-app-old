<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/

class Json {

	function response($response = array(),$message = null,$status = null) {
		
		//header("Content-Type: application/json");
		
		if($message && $message != null && $status && $status != null){
			if(isset($response) && !empty($response)) {
		
				$response = [
					'data' => $response,
					'message' => $message,
					'status' => $status
				];
			}
			else {
			
				$response['status'] = 0;
				$response['message'] = 'undefind json';
			}
		}else{
			$response['status'] = 0;
			$response['message'] = 'undefind json';
		}

		return json_encode($response);
	}
}
?>
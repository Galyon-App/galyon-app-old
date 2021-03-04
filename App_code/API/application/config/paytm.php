<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/ defined('EXTPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Extension Meta
|--------------------------------------------------------------------------
|
| The extension meta data that tells TastyIgniter that an extension is a valid module, payment or widget,
| only array element name and version are STRONGLY required
|
| 'name'        => The name of your extension
| 'version'     => The current version number of the extension, such as 1.0 or 1.0.3.
| 'type'        => The type of your extension, could be module, payment or widget
| 'title'       => The title of your extension, a readable name
| 'author'      => The name of the extension author. More than one author may be listed, separated by comma.
| 'description' => A short description of the extension. Keep this description to fewer than 128 characters.
| 'settings'    => Whether to enable/disable extension admin settings page.
|
*/
$config['extension_meta'] = array(
	'name'        => 'paytm',
	'version'     => '1.0',
	'type'        => 'payment',
	'title'       => 'Paytm',
	'author'      => 'initappz',
	'description' => 'This extension will allow you to accept Paytm payment method during checkout.',
	'settings'    => TRUE,
);

/*
|--------------------------------------------------------------------------
| Extension Permission (Optional)
|--------------------------------------------------------------------------
|
| The extension permission rule that will be saved then assigned to the current staff group
| installing the extension
|
| 'name'        => The name of the permission e.g Module.ModuleName or Payment.ModuleName
| 'action'      => The extension permitted action array (access, manage, add, delete)
| 'description' => A short description of the permission. Keep this description
|               to fewer than 128 characters.
|
*/
$config['extension_permission'] = array(
	'name'        => 'Payment.Paytm',
	'action'      => array('manage'),
	'description' => 'Ability to manage paytm payment',
);
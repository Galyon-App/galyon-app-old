<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div style="border:1px solid #990000;padding-left:20px;margin:0 0 10px 0;">

<h4>A PHP Error was encountered</h4>

<p>Severity: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $severity; ?></p>
<p>Message:  <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $message; ?></p>
<p>Filename: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $filepath; ?></p>
<p>Line Number: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $line; ?></p>

<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ if (defined('SHOW_DEBUG_BACKTRACE') && SHOW_DEBUG_BACKTRACE === TRUE): ?>

	<p>Backtrace:</p>
	<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ foreach (debug_backtrace() as $error): ?>

		<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ if (isset($error['file']) && strpos($error['file'], realpath(BASEPATH)) !== 0): ?>

			<p style="margin-left:10px">
			File: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $error['file'] ?><br />
			Line: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $error['line'] ?><br />
			Function: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ echo $error['function'] ?>
			</p>

		<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ endif ?>

	<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ endforeach ?>

<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : TindaApp
  Created : 01-Sep-2020
*/ endif ?>

</div>
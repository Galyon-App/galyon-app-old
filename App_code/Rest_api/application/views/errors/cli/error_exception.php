<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ defined('BASEPATH') OR exit('No direct script access allowed'); ?>

An uncaught Exception was encountered

Type:        <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo get_class($exception), "\n"; ?>
Message:     <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $message, "\n"; ?>
Filename:    <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $exception->getFile(), "\n"; ?>
Line Number: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $exception->getLine(); ?>

<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ if (defined('SHOW_DEBUG_BACKTRACE') && SHOW_DEBUG_BACKTRACE === TRUE): ?>

Backtrace:
<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/	foreach ($exception->getTrace() as $error): ?>
<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/		if (isset($error['file']) && strpos($error['file'], realpath(BASEPATH)) !== 0): ?>
	File: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $error['file'], "\n"; ?>
	Line: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $error['line'], "\n"; ?>
	Function: <?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $error['function'], "\n\n"; ?>
<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/		endif ?>
<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/	endforeach ?>

<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ endif ?>

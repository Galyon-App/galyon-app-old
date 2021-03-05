<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay with PayStack</title>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <script type="text/javascript">
        function initpayStack(){
                let handler = PaystackPop.setup({
                key: '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $key; ?>',
                email: '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $email; ?>',
                amount: '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $amount; ?>',
                firstname: '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $firstname; ?>',
                lastname: '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $lastname; ?>',
                ref: '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $ref; ?>', 
                onClose: function(){
                    window.location.href = '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $onClose; ?>'
                },
                callback: function(response){
                    window.location.href = '<?php
/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/ echo $callback; ?>'+response.reference;
                }
            });
            handler.openIframe();
        }
        window.onload = initpayStack;
    </script>
</head>
<body>
    
</body>
</html>
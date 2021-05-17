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
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $key; ?>',
                email: '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $email; ?>',
                amount: '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $amount; ?>',
                firstname: '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $firstname; ?>',
                lastname: '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $lastname; ?>',
                ref: '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $ref; ?>', 
                onClose: function(){
                    window.location.href = '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/ echo $onClose; ?>'
                },
                callback: function(response){
                    window.location.href = '<?php
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
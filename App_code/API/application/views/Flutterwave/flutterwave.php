<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay with Flutterwave</title>
    <script src="https://checkout.flutterwave.com/v3.js"></script>
    <script type="text/javascript">
        function flutterWave(){
            FlutterwaveCheckout({
                public_key: '<?php echo $key; ?>',
                tx_ref: '' + Math.floor((Math.random() * 1000000000) + 1),
                amount: '<?php echo $amount; ?>',
                currency:'<?php echo $code; ?>' ,
                payment_options: "card, mobilemoneyghana, ussd",
                redirect_url: 
                    '<?php echo $callback; ?>',
                customer: {
                    email:'<?php echo $email; ?>',
                    phone_number: '<?php echo $phone; ?>',
                    name: '<?php echo $name; ?>',
                },
                callback: function (data) {
                    console.log(data);
                },
                onclose: function() {
                    // close modal
                    console.log('closed');
                    window.location.href = '<?php echo $error; ?>';
                },
                customizations: {
                    title: "Groceryee Orders",
                    description: "Payment for items in cart",
                    logo: '<?php echo $logo; ?>',
                },
                });
        }
    window.onload = flutterWave;
    </script>
</head>
<body>
    
</body>
</html>
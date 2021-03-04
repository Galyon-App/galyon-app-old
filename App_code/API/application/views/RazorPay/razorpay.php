<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay with RazorPay</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script type="text/javascript">
        function initRazor(){
            var options = {
            "key": '<?php echo $key; ?>',
            "amount": '<?php echo $amount; ?>',
            "name": "Groceryee",
            "description": "Grocery Payment",
            "image": '<?php echo $logo; ?>',
            "handler": function (response) {
                console.log(response);
                if(response && response.razorpay_payment_id){
                    window.location.href = '<?php echo $callback; ?>'+response.razorpay_payment_id;
                }
            },
            "prefill": {
                "email":'<?php echo $email; ?>',// customer email
            },
            "theme": {
                "color": "#45C261" // screen color
            }
        };
            console.log(options);
            var propay = new Razorpay(options);
            propay.open();
        }
    window.onload = initRazor;
    </script>
</head>
<body>
    
</body>
</html>
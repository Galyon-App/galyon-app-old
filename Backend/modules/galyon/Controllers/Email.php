<?php

namespace Galyon\Controllers;

use Galyon\Controllers\AppCore;

class Email extends AppCore
{
    function __construct(){
		parent::__construct();
    }

    public function send($subject = "", $body = "", $recepients = [], $ccs = [], $bccs = [])
    {
        $email = \Config\Services::email();
        //$email->setFrom('your@example.com', 'Your Name');

        foreach($recepients as $recepient) {
            $email->setTo($recepient);
        }
        foreach($ccs as $cc) {
            $email->setCC($cc);
        }
        foreach($bccs as $bcc) {
            $email->setBCC($bcc);
        }

        $email->setSubject($subject);
        $email->setMessage($body);

        return $email->send() ? true : $email->printDebugger(['headers']);
    }
}

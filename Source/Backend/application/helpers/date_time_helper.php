<?php

/**
 * get current users local time
 * 
 * @param string $format
 * @return local date
 */
if (!function_exists('get_my_local_time')) {

    function get_my_local_time($format = "Y-m-d H:i:s") {
        return date($format, strtotime(get_current_utc_time()) + get_timezone_offset());
    }

}

/**
 * get current utc time
 * 
 * @param string $format
 * @return utc date
 */
if (!function_exists('get_current_utc_time')) {

    function get_current_utc_time($format = "Y-m-d H:i:s") {
        $d = DateTime::createFromFormat("Y-m-d H:i:s", date("Y-m-d H:i:s"));
        $d->setTimeZone(new DateTimeZone("UTC"));
        return $d->format($format);
    }

}

/**
 * get user's time zone offset 
 * 
 * @return active users timezone
 */
if (!function_exists('get_timezone_offset')) {

    function get_timezone_offset() {
        $timeZone = new DateTimeZone('Asia/Manila');
        $dateTime = new DateTime("now", $timeZone);
        return $timeZone->getOffset($dateTime);
    }

}
<?php
    //this file contain all the generated information that related to security,i.e nonce,cookie,token
    function nonce_generator(){
        /*This function called when user/admin login*/
        //generate random 32 byte string,then convert the hex
        return bin2hex(random_bytes(32));
    }

    function hashed_nonce_generator($origin_nonce){
        $origin_nonce=$origin_nonce."salt_that_hidden_to_anyone";
        return hash('sha256', $origin_nonce);
    }

    function hashed_pw_generator($origin_pw){
        $origin_pw=$origin_pw."salt_that_hidden_to_anyone";
        return hash('sha256',$origin_pw);
    }
    //that should specific for admin,should create another for general user login
    function cookie_generator(){
        $token = hash('sha256', 'secret');

        // Set the cookie properties
        $cookie_name = 'auth';
        $cookie_value = $token;
        $cookie_expiration = time() + (60 * 60 * 24 * 2); // Set expiration to 2 days from now
        $cookie_path = '/';
        $cookie_httponly = true;

        // Set the cookie using the setcookie() function

        //the domain must match the domain of axios,i.e. either 52.192.59.69 || s47.ie.cuhk.edu.hk
        setcookie($cookie_name, $cookie_value, $cookie_expiration, 
        $cookie_path, '52.192.59.69', false, $cookie_httponly);
        setcookie($cookie_name, $cookie_value, $cookie_expiration, 
        $cookie_path, 's47.ierg4210.ie.cuhk.edu.hk', false, $cookie_httponly);

    }

    //
?>
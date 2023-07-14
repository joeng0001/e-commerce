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
    function cookie_generator($email,$hashed_password,$new_salt){
        //$token = hash('sha256', 'secret');
        session_start();
        // Set the cookie properties
        $cookie_name = 'auth';
        //$cookie_val = $token;
        $cookie_exp = time() + (60 * 60 * 24 * 2); // Set expiration to 2 days from now
        $cookie_path = '/';
        $cookie_httponly = true;
        $token=array(
            'em'=>$email,
            'exp'=>$cookie_exp,
            'k'=>hash_hmac('sha256',$cookie_exp.$hashed_password,$new_salt)
        );
        $_SESSION['auth']=$token;
        $cookie_val = json_encode($token);


        // Set the cookie using the setcookie() function

        //the domain must match the domain of axios,i.e. either 52.192.59.69 || s47.ie.cuhk.edu.hk
        setcookie($cookie_name, $cookie_val, $cookie_exp, 
        $cookie_path, 'secure.s47.ierg4210.ie.cuhk.edu.hk', true, $cookie_httponly);

    }

    function salt_generator(){
        return strval(bin2hex(random_bytes(16)));
    }
?>
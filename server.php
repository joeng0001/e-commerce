<?php
    //the axios request url

    // Set the Access-Control-Allow-Origin header
    $allowedOrigin = [
    'http://52.192.59.69',
    'http://localhost:3000' ,
    'http://s47.ierg4210.ie.cuhk.edu.hk',
    'https://secure.s47.ierg4210.ie.cuhk.edu.hk',
    'https://s47.ierg4210.ie.cuhk.edu.hk',
    'http:localhost:80'
    ];
    if(in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigin)){
        header('Access-Control-Allow-Origin:'. $_SERVER['HTTP_ORIGIN']);
    }
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods:POST, GET'); 
    header('Access-Control-Allow-Headers:x-requested-with,content-type');  
    include_once './server/router.php';
    
?>
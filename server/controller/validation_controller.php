<?php
    function number_only($content){
		//function to check whether $content is number only,return false if not,else true
        return preg_match("/^\d+$/", $content);
    }
	function letter_space_only($content){
        return preg_match("/^[a-zA-Z ]*$/",$content);
    }
    function integer_double_only($content){
        return preg_match("/^-?[0-9]+([.,][0-9]+)?$/",$content);
    }
    function letter_only($content){
        return preg_match("/^[A-Za-z]+$/",$content);
    }
    function letter_number_space_only($content){
        return preg_match("/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/",$content);
    }
    function email_only($content){
        return preg_match("/^[\w\-\/][\w\'\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$/",$content);
    }
    function letter_number_underScore_8to20digit_only($content){
        return preg_match("/^[a-zA-Z\d_]{8,20}$/",$content);
    }
    function time_only($content){
        return preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/',$content);
    }

?>
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
?>
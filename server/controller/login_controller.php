<?php
    require_once __DIR__ . '../../security_generator.php';
    function login(){
		try{
            if(!(email_only($_POST['email'])&&letter_number_underScore_8to20digit_only($_POST['pw']))){
                throw new Exception("format incorrect");
            }
            $hashed_pw=hashed_pw_generator($_POST['pw']);
            $db=new PDO('sqlite:../cart.db');
            $q = $db->query("SELECT userid,is_admin FROM user WHERE email= ? and password = ? and is_active = 1");
            $q->execute([$_POST['email'],$hashed_pw]);
			$res=$q->fetch(PDO::FETCH_ASSOC);
            //match found->valid
            if ($res) {
                //everytime user login,generate a new nonce for them
                $nonce=nonce_generator();
                $hashed_nonce=hashed_nonce_generator($nonce);
                $new_salt=salt_generator();
                $q = $db->prepare("UPDATE user SET nonce = ?,salt=? WHERE userid = ?");
                $q->execute([$hashed_nonce,$new_salt,$res['userid']]);
                $http_res->userid=$res['userid'];
                //save the nonce to the response
                $http_res->nonce=$nonce;
                //and generate a cookie for admin
                if($res['is_admin']==1){
                    cookie_generator($_POST['email'],$hashed_pw,$new_salt);
                    $http_res->hashed_pw=$hashed_pw;
                    $http_res->isAdmin=true;
                }else{
                    $http_res->isAdmin=false;
                }
                // get the paypal client id
                $jsonData = file_get_contents('../secret.json');
                $data = json_decode($jsonData);
                $client_id=$data->client_id;
                $http_res->client_id=$client_id;
                //upon success login,rotate session id
                session_regenerate_id(true);
                echo json_encode($http_res);
            } else {
                throw new Exception("fail to login");
            }
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
	}

    function signup(){
        
        try{
             if(!(email_only($_POST['email'])&&letter_number_underScore_8to20digit_only($_POST['pw']))){
                throw new Exception("format incorrect");
            }
            $db=new PDO('sqlite:../cart.db');
            $q = $db->prepare("insert into user (email,password,is_active,is_admin) values(?,?,?,?)");
            $hashed_password=hashed_pw_generator($_POST['pw']);
            $q->execute([$_POST['email'],$hashed_password,1,0]);
            echo json_encode("success");
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
    }

    function change_pw(){
        try{
            if(!(email_only($_POST['email'])&&letter_number_underScore_8to20digit_only($_POST['originPw'])&&
            letter_number_underScore_8to20digit_only($_POST['newPw'])&&letter_number_underScore_8to20digit_only($_POST['newSecondPw']))){
                throw new Exception("format incorrect");
            }
            if($_POST['originPw']===$_POST['newPw']||$_POST['originPw']===$_POST['newSecondPw']){
                 throw new Exception("new password cann't be same as old password");
            }
            if($_POST['newPw']!==$_POST['newSecondPw']){
                throw new Exception("2 password not match");
            }
            $hashed_pw=hashed_pw_generator($_POST['originPw']);
            $db=new PDO('sqlite:../cart.db');
            $q = $db->query("SELECT userid FROM user WHERE email= ? and password = ?");
            $q->execute([$_POST['email'],$hashed_pw]);
			$res=$q->fetch(PDO::FETCH_ASSOC);
            //match found->valid
            if ($res) {
                $hashed_new_pw=hashed_pw_generator($_POST['newPw']);
                $q = $db->prepare("UPDATE user SET password = ? WHERE userid = ?");
                $q->execute([$hashed_new_pw,$res['userid']]);
                echo json_encode("success");
            } else {
                throw new Exception("fail to change password");
            }
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
    }

    function logout(){
        setcookie("auth", "", time() - 3600, "/", "secure.s47.ierg4210.ie.cuhk.edu.hk", true, true);
    }
?>
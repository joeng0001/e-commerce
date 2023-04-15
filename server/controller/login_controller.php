<?php
    require_once __DIR__ . '../../security_generator.php';
    function login(){
		try{
            //1 validate info compare with database
            //2 get the nonce and send back
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
                $q = $db->prepare("UPDATE user SET nonce = ? WHERE userid = ?");
                $q->execute([$hashed_nonce,$res['userid']]);
                $http_res->userid=$res['userid'];
                //save the nonce to the response
                $http_res->nonce=$nonce;
                //and generate a cookie for admin
                if($res['is_admin']==1){
                    cookie_generator();
                    $http_res->isAdmin=true;
                }else{
                    $http_res->isAdmin=false;
                }
               
                echo json_encode($http_res);
            } else {
                throw new Exception("fail to login");
            }
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
	}

    function register(){
        
        try{
            $db=new PDO('sqlite:../cart.db');
            $q = $db->prepare("insert into user (email,password,is_active,is_admin) values(?,?,?,?)");
            $hashed_password=hashed_pw_generator($_POST['pw']);
            $q->execute([$_POST['email'],$hashed_password,1,0]);

            //!need to create a column for nonce in nonces table



            echo json_encode($_POST);
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
    }
?>
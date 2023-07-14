<?php
    require_once __DIR__ . '/security_generator.php';
    function nonce_middleware($callback){
        //perform user validation
        try{

            if(!number_only($_POST['userid'])||!letter_number_space_only($_POST['nonce'])){
                throw new Exception("Fail to pass checking");
            }
            //nonce checking
            $db=new PDO('sqlite:../cart.db');
            $q = $db->query("SELECT nonce FROM user WHERE userid= ?");
            $q->execute([$_POST['userid']]);
			$db_res=$q->fetch(PDO::FETCH_ASSOC);
            $nonce_in_db=$db_res['nonce'];
            $hashed_nonce=hashed_nonce_generator($_POST['nonce']);
            if($nonce_in_db===$hashed_nonce){
                $callback($db);
            }else{
                throw new Exception("Fail to pass checking");
            }

        }catch(Exception $e){
            http_response_code(500);
            echo json_encode($e->getMessage());
        }	
	}

    function cookie_and_nonce_middleware($callback){
        
        try{
            if(!number_only($_POST['userid'])||!letter_number_space_only($_POST['nonce'])){
                throw new Exception("Fail to pass checking");
            }
            //nonce checking
            $db=new PDO('sqlite:../cart.db');
            $q = $db->query("SELECT nonce FROM user WHERE userid= ?");
            $q->execute([$_POST['userid']]);
			$db_res=$q->fetch(PDO::FETCH_ASSOC);
            $nonce_in_db=$db_res['nonce'];
            $hashed_nonce=hashed_nonce_generator($_POST['nonce']);
            //cookie checking
            session_start();
            if(empty($_SESSION['auth'])){
                throw new Exception("Server error,try login again");
            }
            if(!empty($_COOKIE['auth'])){
                if($t=json_decode(stripslashes($_COOKIE['auth']),true)){
                    if(time()>$t['exp'])
                        throw new Exception("cookie expired");
                    $q=$db->prepare('SELECT * FROM user where email=?');
                    $q->execute(array($t['em']));
                    if($r=$q->fetch()){
                        $realk=hash_hmac('sha256',$t['exp'].$r['password'],$r['salt']);
                        if($realk!=$t['k']){
                            throw new Exception("Fail to pass checking");
                        }
                    }
                }
            }
            if($nonce_in_db===$hashed_nonce){
                //echo json_encode("you pass checking");
                $callback($db);
            }else{
                throw new Exception($_POST['nonce']);
                //throw new Exception("Fail to pass checking");
            }
        }catch (Exception $e){
            http_response_code(500);
            echo json_encode($e->getMessage());
        }
    }
?>
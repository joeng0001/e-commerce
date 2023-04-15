<?php
    require_once __DIR__ . '/security_generator.php';
    function middleware($callback){
        //perform user validation
        try{
            $db=new PDO('sqlite:../cart.db');
            $q = $db->query("SELECT nonce FROM user WHERE userid= ?");
            $q->execute([$_POST['userid']]);
			$db_res=$q->fetch(PDO::FETCH_ASSOC);
            $nonce_in_db=$db_res['nonce'];
            $hashed_nonce=hashed_nonce_generator($_POST['nonce']);

            
            //echo json_encode($hashed_nonce);
            if($nonce_in_db===$hashed_nonce){
                //echo json_encode("you pass checking");
                $callback($db);
            }else{
                throw new Exception($_POST['nonce']);
                //throw new Exception("Fail to pass checking");
            }

        }catch(Exception $e){
            http_response_code(500);
            echo json_encode($e->getMessage());
        }	
	}
?>
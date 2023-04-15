<?php
	function homeList_getList(){
		try{	
			$db=new PDO('sqlite:../cart.db');
			$db->query('PRAGMA foreign_keys = ON;');
			$q=$db->query('select * from listAtHomePage');
			$rows=$q->fetchAll(PDO::FETCH_ASSOC);
			$res=$rows;
			echo json_encode($res);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
?>

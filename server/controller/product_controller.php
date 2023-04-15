<?php
	function product_getList(){
		try{
			$db=new PDO('sqlite:../cart.db');
			$db->query('PRAGMA foreign_keys = ON;');
			$q=$db->query('select * from products');
			$rows=$q->fetchAll(PDO::FETCH_ASSOC);
			$res=$rows;
			echo json_encode($res);
		}catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function product_insertToList($db){
		try{
			$msg="";
			//perform checking in the post data
			if(!(number_only($_POST['CID'])&&letter_only($_POST['subCategory'])&&letter_only($_POST['name'])&&
				integer_double_only($_POST['price'])&&integer_double_only($_POST['prevPrice'])&&number_only($_POST['inventory'])&&
				letter_only($_POST['comeFrom'])&&letter_number_space_only($_POST['description'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			//perfomr checking in the file size
			if($_FILES["file"]["name"]&&$_FILES["file"]["size"]>5242880){
				throw new Exception('image size too big,pls upload below 5MB');
			}
			//checking the file type
			if($_FILES["file"]["name"]){
				$path = pathinfo($_FILES['file']['name']);
				$type = $path['extension'];
				if(!($type=="jpg"||$type=="gif"||$type=="png")){
					throw new Exception('image format not correct!');
				}
			}
			//$db=new PDO('sqlite:../cart.db');
			$sql = "INSERT INTO products (CID,subCategory,name,price,prevPrice,inventory,comeFrom,description) VALUES (?,?,?,?,?,?,?,?)";
			$q= $db->prepare($sql);
			$q->execute([$_POST['CID'],$_POST['subCategory'],$_POST['name'],$_POST['price'],$_POST['prevPrice'],$_POST['inventory'],$_POST['comeFrom'],$_POST['description']]);
			$msg=$msg."success insert to db";
			if($_FILES["file"]["name"]){
				$path = pathinfo($_FILES['file']['name']);
				//$type = $path['extension'];
				$file_name=$db->lastInsertId();
				move_uploaded_file($_FILES['file']['tmp_name'], "/var/www/html/server/image/".$file_name);
				$msg=$msg.',success upload image';
			}else{
				$msg=$msg.',fail to upload image';
			}
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function product_updateToList($db){
		try{
			$msg="";
			if(!(number_only($_POST['CID'])&&letter_only($_POST['subCategory'])&&letter_only($_POST['name'])&&
				integer_double_only($_POST['price'])&&integer_double_only($_POST['prevPrice'])&&number_only($_POST['inventory'])&&
				letter_only($_POST['comeFrom'])&&letter_number_space_only($_POST['description'])&&number_only($_POST['PID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			if($_FILES["file"]["name"]&&$_FILES["file"]["size"]>5242880){
				throw new Exception('image size too big,pls upload below 5MB');
			}
			if($_FILES["file"]["name"]){
				$path = pathinfo($_FILES['file']['name']);
				$type = $path['extension'];
				if(!($type=="jpg"||$type=="gif"||$type=="png")){
					throw new Exception('image format not correct!');
				}
			}
			//$db=new PDO('sqlite:../cart.db');
			$sql = "UPDATE products SET CID=?,subCategory=?,name=?,price=?,prevPrice=?,comeFrom=?,inventory=?,description=? WHERE PID=?";
			$q= $db->prepare($sql);
			$q->execute([$_POST['CID'],$_POST['subCategory'],$_POST['name'],$_POST['price'],$_POST['prevPrice'],$_POST['comeFrom'],$_POST['inventory']
						,$_POST['description'],$_POST['PID']]);
			$delete_status=unlink('/var/www/html/server/image/'.$_POST['PID']);    
			if(($delete_status||!file_exists('/var/www/html/server/image/'.$_POST['PID'])) && $_FILES["file"]["name"]){
				//if the file remove successfully or the file not even exist
				$path = pathinfo($_FILES['file']['name']);
				$file_name=$_POST['PID'];
				move_uploaded_file($_FILES['file']['tmp_name'], "/var/www/html/server/image/".$file_name);
				$msg=$msg.',success update image';
			}else{
				$msg=$msg.',fail to update image';
			}  
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function product_deleteFromList($db){
		try{
			if(!number_only($_POST['PID'])){
				throw new Exception('Format not correct,pls retry');
			}
			$msg="";
			//$db=new PDO('sqlite:../cart.db');
			$sql = "DELETE FROM products where PID = ?";
			$q= $db->prepare($sql);
			$q->execute([$_POST['PID']]);
			$msg=$msg."delete from db success";
			$delete_status=unlink('/var/www/html/server/image/'.$_POST['PID']);    
			if($delete_status){  
				$msg=$msg.", image delete success";   
			}else{  
				$msg=$msg.", image delete failed";    
			}  
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
?>

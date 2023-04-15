<?php
	function category_getList(){
		try{
			$db=new PDO('sqlite:../cart.db');
			$q=$db->query('select * from categories');
			$rows=$q->fetchAll(PDO::FETCH_ASSOC);
			$res=$rows;
			echo json_encode($res);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function category_insertToList($db){
		try{
			$msg="";
			if(!(letter_only($_POST['category'])&&letter_only($_POST['subCategory'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			//$db=new PDO('sqlite:../cart.db');
			$sql = "INSERT INTO categories (NAME, subCategories) VALUES (?,?)";
			$q= $db->prepare($sql);
			$q->execute([$_POST['category'],$_POST['subCategory']]);
			$msg="success insert category";
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}		
	}
	function category_insertSubCateToList($db){
		try{
			if(!(letter_only($_POST['category'])&&letter_only($_POST['subCategory'])&&number_only($_POST['CID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			$msg="";
			//$db=new PDO('sqlite:../cart.db');
			$q = $db->query("select subCategories from categories where NAME = ? AND CID = ?");
  			$q->execute([$_POST['category'],$_POST['CID']]);
			$res=$q->fetch(PDO::FETCH_ASSOC);

			$newSubCate=$res['subCategories'].",".$_POST['subCategory'];
			
			$sql = "UPDATE categories SET subCategories = ? WHERE NAME = ? AND CID = ?";
			$q= $db->prepare($sql);
			$q->execute([$newSubCate,$_POST['category'],$_POST['CID']]);
			$msg="success insert subCategory";
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function category_updateToList($db){
		try{
			if(!(letter_only($_POST['newCategory'])&&letter_only($_POST['originCategory'])&&number_only($_POST['CID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			$msg="";
			//$db=new PDO('sqlite:../cart.db');
			$sql = "UPDATE categories SET NAME = ? WHERE NAME = ? AND CID = ?";
			$q= $db->prepare($sql);
			$q->execute([$_POST['newCategory'],$_POST['originCategory'],$_POST['CID']]);
			$msg="success update category";
			//product store category by CID->no need to update
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function category_updateIconToList($db){
		try{
			if(!(letter_only($_POST['category'])&&letter_only($_POST['newIcon'])&&number_only($_POST['CID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			$msg="";
			//$db=new PDO('sqlite:../cart.db');
			$sql = "UPDATE categories SET NavListIcon = ? WHERE NAME = ? AND CID = ?";
			$q= $db->prepare($sql);
			$q->execute([$_POST['newIcon'],$_POST['category'],$_POST['CID']]);
			$msg="success update Icon";
			echo json_encode($msg);
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function category_updateSubCateToList($db){
		try{
			if(!(letter_only($_POST['newSubCategory'])&&letter_only($_POST['originSubCategory'])&&number_only($_POST['CID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			$msg="";
			//update product record that belongs to that subCategory
			//$db=new PDO('sqlite:../cart.db');
			$sql = "UPDATE products SET subCategory = ? WHERE CID = ? and subcategory = ?";
			$q= $db->prepare($sql);
			$q->execute([$_POST['newSubCategory'],$_POST['CID'],$_POST['originSubCategory']]);
			$msg=$msg."success update product";
			//select the subCategory string,reform to array,update,reform back to string
			$q=$db->query('select subCategories from categories where CID=?');
			$q->execute([$_POST['CID']]);
			$subCateString=$q->fetch(PDO::FETCH_ASSOC);
			$subCateArray=explode(",",$subCateString['subCategories']);
			for($i=0;$i<count($subCateArray);$i++){
				if($subCateArray[$i]==$_POST['originSubCategory']){
					$subCateArray[$i]=$_POST['newSubCategory'];
				}
			}
			$subCateString=$subCateArray[0];
			for($i=1;$i<count($subCateArray);$i++){
				$subCateString=$subCateString.",".$subCateArray[$i];
			}

			//update the new subCate string to 
			$sql = "UPDATE categories SET subCategories = ? WHERE CID =? ";
			$q= $db->prepare($sql);
			$q->execute([$subCateString,$_POST['CID']]);
			$msg=$msg." success update categtory";
			echo json_encode("success");
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function category_deleteSubCateFromList($db){
		try{
			if(!(letter_space_only($_POST['subCategory'])&&number_only($_POST['CID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			$msg="";
			//$db=new PDO('sqlite:../cart.db');
			
			$q=$db->query('select PID from products where CID=? and subCategory = ?');
			$q->execute([$_POST['CID'],$_POST['subCategory']]);
			$product=$q->fetchAll(PDO::FETCH_ASSOC);

			if($product){
				//if product found throw exception for not to delete the subCategory
				throw new Exception('Can not delete a subCategory before all its item deleted.');
			}
			//select out the origin subCate string
			$q=$db->query('select subCategories from categories where CID=?');
			$q->execute([$_POST['CID']]);
			$subCateString=$q->fetch(PDO::FETCH_ASSOC);
			//turn the string to array
			$subCateArray=explode(",",$subCateString['subCategories']);
			if(count($subCateArray)<=1){
				//cannot delete all subCategory
				throw new Exception('At least one subCategory is needed.');
			}
			for($i=0;$i<count($subCateArray);$i++){
				if($subCateArray[$i]==$_POST['subCategory']){
					$subCateArray[$i]="";
				}
			}
			$subCateString=$subCateArray[0];
			for($i=1;$i<count($subCateArray);$i++){
				if($subCateArray[$i]==""){
					continue;
				}
				$subCateString=$subCateString.",".$subCateArray[$i];
			}

			//update the new subCate string to 
			$sql = "UPDATE categories SET subCategories = ? WHERE CID =? ";
			$q= $db->prepare($sql);
			$q->execute([$subCateString,$_POST['CID']]);
			$msg="success delete subCategory";
			echo json_encode($msg);
			
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
	function category_deleteFromList($db){
		try{
			if(!(number_only($_POST['CID'])))
				{
					throw new Exception('Format not correct,pls retry');
				}
			$msg="";
			//$db=new PDO('sqlite:../cart.db');
			
			$q=$db->query('select PID from products where CID=? ');
			$q->execute([$_POST['CID']]);
			$product=$q->fetchAll(PDO::FETCH_ASSOC);

			if($product){
				//if product found throw exception, not to delete the Category
				throw new Exception('Can not delete a Category before all its item deleted.');
			}
			//update the new subCate string to 
			$sql = "DELETE FROM categories WHERE CID =? ";
			$q= $db->prepare($sql);
			$q->execute([$_POST['CID']]);
			$msg="success delete category";
			echo json_encode($msg);
			
		}
		catch(Exception $e){
			http_response_code(500);
			echo json_encode($e->getMessage());
		}
	}
?>

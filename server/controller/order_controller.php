<?php

    function gen_digest($array)
    {
        $digest = hash("sha256", implode(";", $array));
        return $digest;
    }

    function gen_uuid()
    {
        $data = random_bytes(16);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    function order_parser($order,$item_index){
        $order_in_obj->country_code=$order->payer->address->country_code;
        $order_in_obj->email_address=$order->payer->email_address;
        $order_in_obj->name=$order->payer->name->given_name.$order->payer->name->surname;
        $order_in_obj->currency=$order->purchase_units[0]->amount->currency_code;
        $order_in_obj->amount=$order->purchase_units[0]->amount->value;
        $order_in_obj->item_name=$order->purchase_units[0]->items[$item_index]->name;
        $order_in_obj->item_price=$order->purchase_units[0]->items[$item_index]->unit_amount->value;
        $order_in_obj->item_quantity=$order->purchase_units[0]->items[$item_index]->quantity;
        $order_in_obj->payment_time=$order->create_time;
        $order_in_obj->payment_id=$order->id;
        $order_in_obj->status=$order->purchase_units[0]->payments->captures[0]->status;
        $order_in_obj->PID=json_decode($order->purchase_units[0]->items[$item_index]->description)->PID;
        return $order_in_obj;
    }

    function item_constructor($item,$cartList){
        $item_obj->name=$item['name'];
        $item_obj->unit_amount->currency_code="HKD";
        $item_obj->unit_amount->value=$item['price'];
        $pid->PID=$item['PID'];
        $item_obj->description=json_encode($pid);
        $key = array_search($item['PID'], array_column($cartList, 'PID'));
         if($key!==false){
            $founded_obj=$cartList[$key];
            $item_obj->quantity=$founded_obj->orderNum;
         }
         //if the order number > number of inventory,reject it
         if($item_obj->quantity>$item['inventory']){
            throw new Exception("Sorry!We dont have enough item provided");
         }
        return $item_obj;
    }
                            
    //function for constructing purchase unit in json
    function create_order($db){
        try{
            //extract the info of items base on the PID
            $cartList=json_decode($_POST['cartList']);
            //perform simple checking withe the post data
            foreach($cartList as $order){
                if(!number_only($order->PID)||!number_only($order->orderNum)||$order->orderNum>99||$order->orderNum<1){
                    throw new Exception("Incorrect Information");
                }
            }
            //extract the PID arraay
            $PIDArray = array_column($cartList, 'PID');
            $placeholders = rtrim(str_repeat('?,', count($PIDArray)), ',');
            //extract all the product belongs to the PID array
            $sql = "SELECT * FROM products WHERE PID IN ($placeholders)";
            $stmt = $db->prepare($sql);
            $stmt->execute($PIDArray);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //hand write a draft for purchase unit
            $order =json_decode('
                {
                    "purchase_units": [
                        {
                            "amount": {
                                "currency_code": "HKD",
                                "value": 0,
                                "breakdown": {
                                    "item_total": {
                                        "currency_code": "HKD",
                                        "value": 0
                                    }
                                }
                            },
                            "items": [
                            
                            ]
                        }
                    ]
                }
                ');
            //for each item,add up it's price to amount,and push it to the purchase unit
            foreach ($res as $item){
                $item_in_obj=item_constructor($item,$cartList);
                $order->purchase_units[0]->amount->value+=$item['price']*$item_in_obj->quantity;
                $order->purchase_units[0]->amount->breakdown->item_total->value+=$item['price']*$item_in_obj->quantity;
                array_push($order->purchase_units[0]->items, $item_in_obj);
            }

            //obtain the merchant email from secret.json
            $jsonData = file_get_contents('../secret.json');
            $data = json_decode($jsonData, true);
            $merchant_email=$data->merchant_email;

            //generate the digest
            $order->purchase_units[0]->custom_id = gen_digest(array(
                $order->purchase_units[0]->amount->currency_code,
                $order->purchase_units[0]->items,
                $order->purchase_units[0]->amount->value,
                $merchant_email,
                bin2hex(random_bytes(32)) 
            ));
            //generate uuid
            $order->purchase_units[0]->invoice_id = gen_uuid();
            echo json_encode($order);
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }

    }


    function save_order($db){
         try{
            $data=json_decode($_POST['data']);
            $insert_q = $db->prepare("insert into order_history(address,email,name,currency,amount,item_name,item_price,item_quantity,payment_time,payment_id,payment_status,userid,PID) 
                values (?,?,?,?,?,?,?,?,?,?,?,?,?)");
            //$update_q=$db->prepare("update products set inventory = inventory - ? where PID = ?");
            for ($i = 0; $i < count($data->purchase_units[0]->items); $i++){
                //extract data to a simple object
                $order=order_parser($data,$i);
                //perform simple validation
                if(
                    !letter_only($order->country_code)||
                    !email_only($order->email_address)||
                    !letter_space_only($order->name)||
                    !letter_only($order->currency)||
                    !integer_double_only($order->amount)||
                    !letter_space_only($order->item_name)||
                    !integer_double_only( $order->item_price)||
                    !number_only($order->item_quantity)||
                    !time_only($order->payment_time)||
                    !letter_number_space_only($order->payment_id)||
                    !letter_only($order->status)||
                    !number_only($_POST['userid'])||
                    !number_only($order->PID)
                ){
                    throw new Exception('Incorrect information');
                }
                //insert to db
                $insert_q->execute([
                    $order->country_code,
                    $order->email_address,
                    $order->name,
                    $order->currency,
                    $order->amount,
                    $order->item_name,
                    $order->item_price,
                    $order->item_quantity,
                    $order->payment_time,
                    $order->payment_id,
                    $order->status,
                    $_POST['userid'],
                    $order->PID
                ]
                );
                // $update_q->execute([
                //      $order->item_quantity,
                //      $order->PID
                // ]);
                
            }
            echo json_encode( $data);
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
    }


    function get_order_for_client($db){
         try{
            //extract order history according to userid
            if(!number_only($_POST['userid'])){
                throw new Exception('Incorrect information');
            }
            //select data from order_history table
            //use payment time as identifier,at most 5 payment time is allow with descending -> the most recent 5 order
            $q = $db->query("SELECT address,email,name,currency,amount,item_name,item_price,item_quantity,payment_time,payment_status
                    FROM order_history
                    WHERE payment_time IN (
                        SELECT DISTINCT payment_time
                        FROM order_history
                        ORDER BY payment_time DESC
                        LIMIT 5
                    )
                    AND userid = ? 
                    ORDER BY payment_time DESC;");
            $q->execute([$_POST['userid']]);
            $res=$q->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($res);
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
    }

    function get_order_for_admin($db){
        try{
            //extract all the order history data
            $q = $db->query("SELECT address,email,name,currency,amount,item_name,item_price,item_quantity,payment_time,payment_status FROM order_history");
            $q->execute();
            $res=$q->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($res);
        }catch(Exception $e){
            http_response_code(500);
			echo json_encode($e->getMessage());
        }
    }

?>
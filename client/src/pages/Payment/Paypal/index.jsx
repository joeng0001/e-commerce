import { PayPalScriptProvider,PayPalButtons } from '@paypal/react-paypal-js';
import axios_service from '../../../axios_service';
import { useNavigate } from 'react-router-dom';
import { ClearCart } from '../../../redux/action/cart_action';
import { useState } from 'react';
import store from '../../../redux/store';
import secret from '../../../secret.json';
import SnackBar from '../../../components/SnackBar'

export default function Paypal_payment() {
    const navigate=useNavigate();
    const[openSnackBar,setOpenSnackBar]=useState(false);//control snack bar
    const[snackBarMessage,setSnackBarMessage]=useState("");//message display in  snack bar
    const[snackBarSeverity,setSnackBarSeverity]=useState(true); //type of snack bar,true for success,false for error
    const closeSnackBar=()=>{
        setOpenSnackBar(false)
    }
    const createOrder = async(data, actions) => {
        //if the cart list is empty or have not login,reject
        if(store.getState().CartReducer.cartList===0||!store.getState().SecurityReducer.loginStatus){
            setSnackBarSeverity(false)
            setSnackBarMessage("Seems your cart still empty or you haven't login")
            setOpenSnackBar(true)
        }


        //obtain the cartlist with PID and quantity only
        let cartList=store.getState().CartReducer.cartList
        let filtered_cartList=cartList.map(({PID,orderNum})=>{
            return {PID,orderNum}
        })
        //construct the formand submit to server
        let form=new FormData();
        let purchase_units;
        form.append('cartList',JSON.stringify(filtered_cartList))
        form.append('userid',store.getState().SecurityReducer.userid);
        //get the purchase unit from server side
        await axios_service.create_order(form)
            .then((purchase_units_from_res)=>{
                purchase_units=purchase_units_from_res.data;
            })
            .catch(e=>{
                setSnackBarSeverity(false)
                setSnackBarMessage(e.response?.data)
                setOpenSnackBar(true)
            })
        return actions.order.create(purchase_units)
            .then((orderID) => {
                return orderID;
            })
            .catch(e=>{
                setSnackBarSeverity(false)
                setSnackBarMessage(e.response?.data)
                setOpenSnackBar(true)
            });
     }   

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async(order_detail)=> {
            //send the whole string or the order the server
            let form=new FormData();
            form.append('data',JSON.stringify(order_detail));
            form.append('userid',store.getState().SecurityReducer.userid);

            await axios_service.save_order(form)
                .then(res=>{
                    setSnackBarSeverity(true)
                    setSnackBarMessage("Purchase success")
                    setOpenSnackBar(true)
                    //empty the cart and redirect to home page
                    store.dispatch(ClearCart({}))
                    navigate('/home');
                })
                .catch(e=>{
                    setSnackBarSeverity(false)
                    setSnackBarMessage(e.response?.data)
                    setOpenSnackBar(true)
                })
                
        });
    };


 

  return (
    <>
        <PayPalScriptProvider options={{ "client-id": secret.client_id,"currency":"HKD"}}>
            <div>
                    <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        
                    />
            </div>
        </PayPalScriptProvider>
         <SnackBar openSnackBar={openSnackBar} closeSnackBar={closeSnackBar} severity={snackBarSeverity} message={snackBarMessage}/>
    </>
    );
  }
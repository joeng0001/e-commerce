import './index.css'
import CartTable from '../../components/Header/CartTable';
import { Outlet } from 'react-router-dom';
import store from '../../redux/store';
import { useState } from 'react';
import {BsPaypal} from 'react-icons/bs'
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SnackBar from '../../components/SnackBar'
export default function Login() {
    const [forceUpdate, setForceUpdate] = useState(false);
    const[openSnackBar,setOpenSnackBar]=useState(false);//control snack bar
    const[snackBarMessage,setSnackBarMessage]=useState("");//message display in  snack bar
    const[snackBarSeverity,setSnackBarSeverity]=useState(true); //type of snack bar,true for success,false for error
    const navigate=useNavigate();
    store.subscribe(()=>{
    //update this component when ever CartTable change->related to store
        setForceUpdate(!forceUpdate)
    })
    const navigateToPaypal=()=>{
        //if the cart is empty,reject
         if(store.getState().CartReducer.cartList?.length===0){
            setSnackBarSeverity(false)
            setSnackBarMessage("Your Cart is empty")
            setOpenSnackBar(true)
            return
        }
        navigate('paypal')
    }
    const closeSnackBar=()=>{
        setOpenSnackBar(false)
    }
  return (
   
    <div>
        <CartTable/>
        <IconButton aria-label="PayPal" color="primary" onClick={navigateToPaypal}>
            <BsPaypal /><span>Paypal</span>
        </IconButton>
        <div>Click to prompt PayPal</div>
        <Outlet/>
         <SnackBar openSnackBar={openSnackBar} closeSnackBar={closeSnackBar} severity={snackBarSeverity} message={snackBarMessage}/>
    </div>
    
    );
}
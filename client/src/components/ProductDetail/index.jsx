import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import {AiOutlineStar,AiFillStar,AiOutlineShoppingCart,AiOutlineCar} from 'react-icons/ai'
import {BsFillCartCheckFill,BsCalendar3} from 'react-icons/bs'
import './index.css'
import store from '../../redux/store';
import {AddToFavour,RemoveFromFavour} from '../../redux/action/favour_action'
import {OpenCartDrawer,DirectSetNumToCart} from '../../redux/action/cart_action'
import imageURL from '../../imageURL';

export default function ProductDetail(props) {
  //dialog to show product detail
  const [product_cnt, setproduct_cnt] = React.useState(1);//store number of item selected by client
  const numberSelector=Array.from(Array(100).keys()).slice(1) //create a selection list,number 1-100
  const addToFavour=()=>{
    //remove unrelated property from prop->remain detail of product
    let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.open
    delete props_obj.openDialog
    delete props_obj.closeDialog
    store.dispatch(AddToFavour(props_obj))
  }
  const removeFromFavour=()=>{
    //remove item by PID
    store.dispatch(RemoveFromFavour({PID:props.PID}))
  }
  const addToCart=()=>{
    //get item number that already added to store
    let currentNum=store.getState().CartReducer.cartList.find((obj)=>{
      return obj.PID===props.PID
    })?.orderNum
    //if exist in cart,add it as total number,else set number as the current selected number
    const totalNum=currentNum?product_cnt+currentNum*1:product_cnt;
     let props_obj=JSON.parse(JSON.stringify(props));
    //remove unrelated props property,remain is detail of the product
    delete props_obj.open
    delete props_obj.openDialog
    delete props_obj.closeDialog
    //save to store with setting orderNum property
    store.dispatch(DirectSetNumToCart({...props_obj,orderNum:totalNum}))
    //reset current state of item number after add to store
    setproduct_cnt(1);
  }
  const addOneCount=()=>{
    //if already in cart,open cart drawer to modify orderNum
    if(store.getState().CartReducer.cartList.findIndex((obj)=>{return obj.PID===props.PID})>-1){
      openCart();
      return
    }
    //else add  one the the product count
    setproduct_cnt(product_cnt+1);
  }
  const minusOneCount=()=>{
    //minus one from the product count
    setproduct_cnt(product_cnt-1);
  }
  const openCart=()=>{
    //close current dialog and open the cart drawer
    props.closeDialog()
    store.dispatch(OpenCartDrawer(true))
  }
  const ItemNumChangeHandler =(event)=>{
    //if already in cart,open cart drawer to modify orderNum
    if(store.getState().CartReducer.cartList.findIndex((obj)=>{return obj.PID===props.PID})>-1){
      openCart();
      return
    }
    setproduct_cnt(event.target.value);
  }
  const closeHandler=()=>{
    //close dialog and reset product count state
    props.closeDialog()
    setproduct_cnt(1)
  }
  return (
        <Dialog
          open={props.open}
          onClose={closeHandler}
          maxWidth='lg'
          fullWidth={true}
          scroll="body"
        >
          <DialogTitle ><div className="ProductDetail_dialogTitle">{props.name}</div></DialogTitle>
          <DialogContent className="ProductDetail_centent">
            <img
              className="ProductDetail_img"
              src={`${imageURL}/${props.PID}`}
              alt="match not found"  
            />
            <DialogContent className="ProductDetail_rightContainer">
              <br/>
               <div>
               <span className="ProductDetail_prevPrice">${props.prevPrice} </span> 
               <span className={
                props.inventory>100?"ProductDetail_moreThan100"
                :props.inventory<3?"ProductDetail_lessThan3"
                :"ProductDetail_between3To100"}>
                  {props.inventory<3?<span>Only <span className="ProductDetail_inventoryHighlight">{parseInt(props.inventory,10)}</span> left!</span>
                  :<span >Current Stock: {props.inventory}</span>}
                </span>
              </div>
              <div className="ProductDetail_priceLabel">Price	&nbsp;
                <span className="ProductDetail_priceNo">
                  ${props.price} Now!
                </span>
              </div>
              <br/>
              <div className="ProductDetail_counter">
                <button className="ProductDetail_counterButton" onClick={minusOneCount} disabled={product_cnt<=1}>-</button>
                  <span className="ProductDetail_counterValue"> 
                    <TextField 
                        value={product_cnt}
                        select
                        onChange={(event)=>ItemNumChangeHandler(event)}
                    >
                    {numberSelector.map((item) => (
                       <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                  </span>
                <button className="ProductDetail_counterButton"onClick={addOneCount} disabled={product_cnt>=99}>+</button>
                 <span className="ProductDetail_InCartMsg">
                  {store.getState().CartReducer.cartList.findIndex((obj)=>{return obj.PID===props.PID;})>-1?
                    <span><span className="ProductDetail_InCartCnt">{store.getState().CartReducer.cartList.find((obj)=>{
                      return obj.PID===props.PID;
                    })?.orderNum}</span> in cart</span>
                    :
                    <span></span> 
                  }

                </span>
              </div>
              <br/>
             <div className="ProductDetail_descriptionContainer">
                <div className="ProductDetail_description">
                  {props.description}
                </div> 
              </div>
              <br/>
              <div>
                <AiOutlineCar size={28}/> Shipping now has 10% off!
              </div> 
               <div >
                <BsCalendar3 size={28}/> arrived in 7 days Promise
              </div> 
            </DialogContent >      
          </DialogContent>
          <DialogActions>
            <Button  onClick={closeHandler} className="ProductDetail_uiBackBtn">Back</Button>
             { 
              store.getState().FavourReducer.favourList.find(item => item.PID===props.PID)?(
                  <Button variant="outlined" onClick={removeFromFavour} size="large" color="secondary">
                    <AiFillStar size={28}/>
                    In Favour
                  </Button>
              ):(
                <Button variant="outlined" onClick={addToFavour} size="large" color="secondary">
                  <AiOutlineStar size={28}/>
                  Add To Favour
                </Button>
              )
            }
            { 
              store.getState().CartReducer.cartList.find(item => item.PID===props.PID)?(
                  <Button variant="outlined" onClick={openCart} size="large" color="success" className="ProductDetail_uiCartBtn">
                    <BsFillCartCheckFill size={28}/>
                    Added In Cart
                  </Button>
              ):(
                <Button variant="outlined" onClick={addToCart} size="large" color="secondary" className="ProductDetail_uiCartBtn">
                  <AiOutlineShoppingCart/>
                  Add to Cart
                </Button>
              )
            }
          </DialogActions>
        </Dialog>
  );
}
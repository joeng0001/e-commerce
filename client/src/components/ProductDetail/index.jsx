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

export default function ProductDetail(props) {
  const [product_cnt, setproduct_cnt] = React.useState(1);
  const numberSelector=Array.from(Array(100).keys()).slice(1) 
  const addToFavour=()=>{
    let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.open
    delete props_obj.openDialog
    delete props_obj.closeDialog
    //props_obj is now all the detail of an obj->detail of product
    store.dispatch(AddToFavour(props_obj))
  }
  const removeFromFavour=()=>{
    let obj={
      id:props.id
    }
    store.dispatch(RemoveFromFavour(obj))
  }
  const addToCart=()=>{
    let currentNum=store.getState().CartReducer.cartList.find((obj)=>{
      return obj.id===props.id
    })?.number
    const totalNum=currentNum?product_cnt+currentNum*1:product_cnt;
     let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.open
    delete props_obj.openDialog
    delete props_obj.closeDialog
    store.dispatch(DirectSetNumToCart({...props_obj,number:totalNum}))
    setproduct_cnt(1);//reset the number after add to store
  }
  const addOneCount=()=>{
    if(store.getState().CartReducer.cartList.findIndex((obj)=>{return obj.id===props.id})>-1){
      //if already in cart,do not add item in dialog but directly in cart list
      openCart();
      return
    }
    setproduct_cnt(product_cnt+1);
  }
  const minusOneCount=()=>{
    setproduct_cnt(product_cnt-1);
  }
  const openCart=()=>{
    props.closeDialog()
    store.dispatch(OpenCartDrawer(true))
  }
  const ItemNumChangeHandler =(event)=>{
    if(store.getState().CartReducer.cartList.findIndex((obj)=>{return obj.id===props.id})>-1){
      //if already in cart,do not add item in dialog but directly in cart list
      openCart();
      return
    }
    setproduct_cnt(event.target.value);
  }
  const closeHandler=()=>{
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
              src={`../../../productPhoto/${props.type}/${props.subType}/${props.name}.jpg`}
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
                  {props.inventory<3?<span>Only <span className="ProductDetail_inventoryHighlight">{props.inventory}</span> left!</span>
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
                  {store.getState().CartReducer.cartList.findIndex((obj)=>{return obj.id===props.id;})>-1?
                    <span><span className="ProductDetail_InCartCnt">{store.getState().CartReducer.cartList.find((obj)=>{
                      return obj.id===props.id;
                    })?.number}</span> in cart</span>
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
              store.getState().FavourReducer.favourList.find(item => item.id===props.id)?(
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
              store.getState().CartReducer.cartList.find(item => item.id===props.id)?(
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
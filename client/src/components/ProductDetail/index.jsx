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
import {AddOneToCart,OpenCartDrawer,DirectSetNumToCart} from '../../redux/action/cart_action'

export default function ProductDetail(props) {
  const [product_cnt, setproduct_cnt] = React.useState(1);
  const numberSelector=Array.from(Array(100).keys()).slice(1) 
  const handleClickOpen = () => {
    props.OpenDialogByCompareID(props.id)
  };

  const handleClose = () => {
     props.OpenDialogByCompareID(null)
  };
  
  const addToFavour=()=>{
    let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.OpenDialogByCompareID;
    delete props_obj.open;
    //props_obj is now all the detail of an obj->detail of product
    store.dispatch(AddToFavour(props_obj))
  }
  const removeFromFavour=()=>{
     let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.OpenDialogByCompareID;
    delete props_obj.open;
    store.dispatch(RemoveFromFavour(props_obj))

  }
  const addOneToCart=()=>{
     let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.OpenDialogByCompareID;
    delete props_obj.open;
    store.dispatch(AddOneToCart(props_obj))
    setproduct_cnt(1);//reset the number after add to store
  }

  const addToCart=()=>{
    let currentNum=store.getState().CartReducer.cartList.find((obj)=>{
      return obj.id===props.id
    })?.number
    const totalNum=currentNum?product_cnt+currentNum*1:product_cnt;
     let props_obj=JSON.parse(JSON.stringify(props));
    delete props_obj.OpenDialogByCompareID;
    delete props_obj.open;
    store.dispatch(DirectSetNumToCart({...props_obj,number:totalNum}))
    setproduct_cnt(1);//reset the number after add to store
  }
  const addOneCount=()=>{
    setproduct_cnt(product_cnt+1);
  }
  const minusOneCount=()=>{
    setproduct_cnt(product_cnt-1);
  }

  const openCart=(condition)=>{
    props.OpenDialogByCompareID(null)
    store.dispatch(OpenCartDrawer(condition))
  }
  const ItemNumChangeHandler =(event)=>{
    setproduct_cnt(event.target.value);
  }
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} size="median">
          Detail
      </Button>
      &nbsp;&nbsp;&nbsp;
      { 
        store.getState().FavourReducer.favourList.find(item => item.id===props.id)?(
            <Button variant="outlined" onClick={removeFromFavour} size="median" color="secondary">
              <AiFillStar size={28}/>
            </Button>
        ):(
          <Button variant="outlined" onClick={addToFavour} size="median" color="secondary">
            <AiOutlineStar size={28}/>
          </Button>
        )
      }
      &nbsp;&nbsp;&nbsp;
      { 
         store.getState().CartReducer.cartList.find(item => item.id===props.id)?(
            <Button variant="outlined" onClick={()=>openCart(true)} size="median" color="success" >
              <BsFillCartCheckFill size={28}/>
            </Button>
        ):(
          <Button variant="outlined" onClick={addOneToCart} size="median" color="secondary" >
            <AiOutlineShoppingCart size={28}/>
          </Button>
        )
      }
        <Dialog
          open={props.open}
          onClose={handleClose}
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
            <Button  onClick={handleClose} className="ProductDetail_uiBackBtn">Back</Button>
             { 
              store.getState().FavourReducer.favourList.find(item => item.id===props.id)?(
                  <Button variant="outlined" onClick={RemoveFromFavour} size="large" color="secondary">
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
                  <Button variant="outlined" onClick={()=>openCart(true)} size="large" color="success" className="ProductDetail_uiCartBtn">
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
      
    </div>
  );
}
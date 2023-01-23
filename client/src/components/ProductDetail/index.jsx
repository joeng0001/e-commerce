import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {AiOutlineStar,AiFillStar,AiOutlineShoppingCart,AiOutlineCar} from 'react-icons/ai'
import {BsFillCartCheckFill,BsCalendar3} from 'react-icons/bs'
import './index.css'


export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);
  const [inFavour, setinFavour] = React.useState(false);
  const [inCart, setinCart] = React.useState(false);
  const [product_cnt, setproduct_cnt] = React.useState(1);
  //there will be a list store all the item in favourite,display different icon
  //i.e. like vuex->redux
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const addToFavour=()=>{
    setinFavour(!inFavour)
  }
  const addToCart=()=>{
    setinCart(!inCart)
    setproduct_cnt(1);
  }
  const addOneCount=()=>{
    setproduct_cnt(product_cnt+1);
  }
  const minusOneCount=()=>{
    setproduct_cnt(product_cnt-1);
  }
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} size="median">
          Detail
      </Button>
      &nbsp;&nbsp;&nbsp;
      { 
        inFavour?(
            <Button variant="outlined" onClick={addToFavour} size="median" color="secondary">
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
        inCart?(
            <Button variant="outlined" onClick={addToCart} size="median" color="success" >
              <BsFillCartCheckFill size={28}/>
            </Button>
        ):(
          <Button variant="outlined" onClick={addToCart} size="median" color="secondary" >
            <AiOutlineShoppingCart size={28}/>
          </Button>
        )
      }
        <Dialog
          open={open}
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
            <DialogContentText >
              <br/>
               <div className="ProductDetail_prevPrice">
                  ${props.prevPrice} 
              </div>
              <div className="ProductDetail_priceLabel">Price	&nbsp;
                <span className="ProductDetail_priceNo">
                  ${props.price} Now!
                </span>
              </div>
              <br/>
              <div className="ProductDetail_counter">
                <button className="ProductDetail_counterButton" onClick={minusOneCount} disabled={product_cnt<=1}>-</button>
                  <span className="ProductDetail_counterValue">{product_cnt}</span>
                <button className="ProductDetail_counterButton"onClick={addOneCount} disabled={product_cnt>=99}>+</button>
                 <span className="ProductDetail_InCartMsg">
                    <span className="ProductDetail_InCartCnt">X</span> item already in your cart
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
              <div>To Be Added </div>
            </DialogContentText>
            
          </DialogContent>
          <DialogActions>
            <Button  onClick={handleClose} className="ProductDetail_uiBackBtn">Back</Button>
             { 
              inFavour?(
                  <Button variant="outlined" onClick={addToFavour} size="large" color="secondary">
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
              inCart?(
                  <Button variant="outlined" onClick={addToCart} size="large" color="success" className="ProductDetail_uiCartBtn">
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
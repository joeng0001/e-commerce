import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {AiOutlineStar,AiFillStar,AiOutlineShoppingCart} from 'react-icons/ai'
import {BsFillCartCheckFill} from 'react-icons/bs'
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
              In favour
            </Button>
        ):(
          <Button variant="outlined" onClick={addToFavour} size="median" color="secondary">
            <AiOutlineStar size={28}/>
            Add favour
          </Button>
        )
      }

        <Dialog
          open={open}
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          maxWidth='lg'
        >
          <DialogTitle>{props.name}</DialogTitle>
          <DialogContent className="ProductDetail_centent">
            <img
              className="ProductDetail_img"
              src={`../../../productPhoto/${props.type}/${props.subType}/${props.name}.jpg`}
              alt="match not found"  
            />
            <DialogContentText >
              this is showing detail of product
              <br/>
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
                
              </div>
              
            </DialogContentText>
            
          </DialogContent>
          <DialogActions>
            <Button  onClick={handleClose} className="ProductDetail_uiBackBtn">Back</Button>
            
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
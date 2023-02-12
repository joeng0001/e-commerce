
import './index.css'
import {Component} from 'react'
import ProductDetail from '../ProductDetail'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


import {AiOutlineStar,AiFillStar,AiOutlineShoppingCart} from 'react-icons/ai'
import {BsFillCartCheckFill} from 'react-icons/bs'
import Button from '@mui/material/Button';
import store from '../../redux/store'
import {AddToFavour,RemoveFromFavour} from '../../redux/action/favour_action'
import {AddOneToCart,OpenCartDrawer} from '../../redux/action/cart_action'


export default class ProductList extends Component {
  
  state={dialogOpen:false,dialogItem:null}
  setDialogItem=(item)=>{
    this.setState({dialogItem:item})
  }
  closeDialog=()=>{
     this.setState({dialogOpen:false})
  }
  openDialog=(item)=>{
    this.setState({dialogItem:item})
    this.setState({dialogOpen:true})
  }
  addToFavour=(obj)=>{
    let newObj={...obj}
    newObj.type=this.props.type
    newObj.subType=this.props.subType
    console.log(newObj)
    store.dispatch(AddToFavour(newObj))
  }
  removeFromFavour=(obj)=>{
    store.dispatch(RemoveFromFavour(obj))
  }
  openCart=()=>{
    this.closeDialog()
    store.dispatch(OpenCartDrawer(true))
  }
  addOneToCart=(item)=>{
    let newitem={...item}
    newitem.type=this.props.type
    newitem.subType=this.props.subType
    store.dispatch(AddOneToCart({...newitem,orderNum:1}))
  }
  render(){
    const {type,subType,list}=this.props;
     return(
        <div className="ProductList_wrapper">
          <div className="ProductList_tableless">
            {
              list?.map((obj)=>{
                return (
                  <Card key={obj.PID} className="ProductList_card">
                    <CardMedia
                      className="ProductList_image"
                      image={`../../../productPhoto/${type}/${subType}/${obj.name}.jpg`}
                      onClick={()=>this.openDialog(obj)}
                    />
                    <CardContent>
                      <div>
                          <span className="ProductList_card_itemName" onClick={()=>this.openDialog(obj)}>
                            {obj.name } 
                          </span>
                          &nbsp;&nbsp;&nbsp;
                          <span className="ProductList_card_itemComeFrom">
                            {obj.comeFrom}
                          </span>
                      </div>
                      <div className="ProductList_card_itemPrice">
                        ${obj.price} Now! <span className="ProductList_card_itemPrevPrice">${obj.prevPrice}</span>
                      </div>
                      
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" onClick={()=>this.openDialog(obj)} size="median">
                        Detail
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    { 
                      store.getState().FavourReducer.favourList.find(item => item.PID===obj.PID)?(
                          <Button variant="outlined" onClick={()=>this.removeFromFavour(obj)} size="median" color="secondary">
                            <AiFillStar size={28}/>
                          </Button>
                      ):(
                        <Button variant="outlined" onClick={()=>this.addToFavour(obj)} size="median" color="secondary">
                          <AiOutlineStar size={28}/>
                        </Button>
                      )
                    }
                    &nbsp;&nbsp;&nbsp;
                    { 
                      store.getState().CartReducer.cartList.find(item => item.PID===obj.PID)?(
                          <Button variant="outlined" onClick={this.openCart} size="median" color="success" >
                            <BsFillCartCheckFill size={28}/>
                          </Button>
                      ):(
                        <Button variant="outlined" onClick={()=>this.addOneToCart(obj)} size="median" color="secondary" >
                          <AiOutlineShoppingCart size={28}/>
                        </Button>
                      )
                    }
                        
                    </CardActions>
                  </Card>

              )})
            }
            <ProductDetail {...this.state.dialogItem} type={type} subType={subType} open={this.state.dialogOpen} 
            openDialog={this.openDialog} closeDialog={this.closeDialog} />
          </div>
        </div>      
      );
  }

}

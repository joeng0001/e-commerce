import { Link, NavLink } from "react-router-dom";
import {Component} from 'react'
import Banner from './Banner'
import Navigation from './Navigation'
import {AiFillStar,AiOutlineShoppingCart,AiOutlineArrowRight} from 'react-icons/ai'
import {MdAttachMoney} from  'react-icons/md'
import CartTable from './CartTable'
import FavourTable from './FavourTable'
import Drawer from '@mui/material/Drawer';
import store from '../../redux/store'
import {OpenCartDrawer} from '../../redux/action/cart_action'
import {OpenFavourDrawer} from '../../redux/action/favour_action'
import {GiSeaDragon} from 'react-icons/gi'
import './index.css'
import axios_service from "../../axios_service";
export default class Header extends Component {
  state={direction:"right",login:false}
  openCartDrawer=()=>{
    store.dispatch(OpenCartDrawer(true))
  }
  closeCartDrawer=()=>{
     store.dispatch(OpenCartDrawer(false))
  }
  openFavourDrawer=()=>{
    store.dispatch(OpenFavourDrawer(true))
  }
  closeFavourDrawer=()=>{
     store.dispatch(OpenFavourDrawer(false))
  }
  simple_login_verify=()=>{
    var acc = prompt('account');
    var pw  = prompt('password');
    let form=new FormData();
    form.append('acc',acc)
    form.append('pw',pw)
    axios_service.login(form)
    .then(res=>{
      this.setState({login:true})
    })
    .catch(e=>{
      //console.log(e.response.data)
      return 
    })
  }
  render(){
    const initialValue = 0;
    const price = store.getState().CartReducer.cartList.reduce(
      (accumulator, item) => accumulator + item.price*item.orderNum*1,
      initialValue
    );
    
    return (
        <div className="Header_wrapper">
          <header className="Header_linkWrapper">
            <Link to="/" className="Header_link" id="home"><GiSeaDragon/>Home</Link>
            {this.state.login?
              <NavLink to={`/adminTable/?cid=${store.getState().CategoryReducer.CIDList[0].CID}`} className="Header_link" >Admin</NavLink>:
              <button  className="Header_link" onClick={this.simple_login_verify}>Login</button>       
            }
            <button  className="Header_link" onClick={this.openFavourDrawer}><AiFillStar/>Favourite</button>
            <button  className="Header_link" onMouseEnter={this.openCartDrawer}><AiOutlineShoppingCart/>Shopping List</button>

             {/*drawer of favour */}
            <Drawer
              anchor={this.state.direction}
              open={store.getState().FavourReducer.open}
              onClose={this.closeFavourDrawer}
            >
              <div>
               <span><AiFillStar/> </span>
                <span>({store.getState().FavourReducer.favourList.length})</span>
              </div>
               <FavourTable/>
            </Drawer>


            {/*drawer of cart */}
            <Drawer 
              anchor={this.state.direction}
              open={store.getState().CartReducer.open}
              onClose={this.closeCartDrawer}
            >
              <div>
               <span><AiOutlineShoppingCart/>({store.getState().CartReducer.cartList.length})</span>
                <span><MdAttachMoney/>{price}</span>
                <button className="Header_checkOutBtn">Check Out<AiOutlineArrowRight/></button>
              </div>
               <CartTable/>
            </Drawer>

           

          </header>
          <Banner/>
          <Navigation/>
        </div>
    );
  }

}


import { Link } from "react-router-dom";
import {Component} from 'react'
import {AiFillHome} from "react-icons/ai"
import Banner from './Banner'
import Navigation from './Navigation'
import {AiFillStar,AiOutlineShoppingCart,AiOutlineArrowRight} from 'react-icons/ai'
import CartTable from './CartTable'
import FavourTable from './FavourTable'
import Drawer from '@mui/material/Drawer';
import store from '../../redux/store'
import {OpenCartDrawer} from '../../redux/action/cart_action'
import {OpenFavourDrawer} from '../../redux/action/favour_action'
import './index.css'
export default class Header extends Component {
  state={direction:"right"}
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
  render(){
    return (
        <div className="Header_wrapper">
          <header className="Header_linkWrapper">
            <Link to="/" className="Header_link" id="home"><AiFillHome/>Home</Link>
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
               <span><AiOutlineShoppingCart/> </span>
                <span>({store.getState().CartReducer.cartList.length})</span>
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


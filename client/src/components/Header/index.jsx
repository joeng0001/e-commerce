import { Link, NavLink } from "react-router-dom";
import {Component} from 'react'
import Banner from './Banner'
import Navigation from './Navigation'
import {AiFillStar,AiOutlineShoppingCart,AiOutlineArrowRight,AiOutlineFieldTime} from 'react-icons/ai'
import {MdAttachMoney,MdOutlineManageAccounts,MdOutlinePersonOutline} from  'react-icons/md'
import CartTable from './CartTable'
import FavourTable from './FavourTable'
import {Drawer,Button} from '@mui/material';
import store from '../../redux/store'
import {OpenCartDrawer} from '../../redux/action/cart_action'
import {OpenFavourDrawer} from '../../redux/action/favour_action'
import {Logout} from '../../redux/action/security_action'
import {GiSeaDragon} from 'react-icons/gi'
import {GrUserManager} from 'react-icons/gr'
import {CiLogin,CiLogout} from 'react-icons/ci'
import OrderHistory from "../OrderHistory";
import './index.css'
import axios_service from "../../axios_service";
export default class Header extends Component {
  state={direction:"right",openOrderHistory:false}
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
  openOrderHistory=()=>{
    this.setState({openOrderHistory:true})
  }
  closeOrderHistory =()=>{
    this.setState({openOrderHistory:false})
  }
  LogOut=()=>{
    axios_service.logout()
    .then((res)=>{
      store.dispatch(Logout(true))
    })
    .catch((e)=>{
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
            {/*only display the check order history button after login*/}
            {store.getState().SecurityReducer.loginStatus?
              (
                <button className="Header_link" onClick={this.openOrderHistory}>
                  <AiOutlineFieldTime/>
                  Recent Order 
                </button>
              )
              :
              (<></>)
            }

            {/*if login display the user name,else display the default name*/}
            {store.getState().SecurityReducer.loginStatus?
              (
                store.getState().SecurityReducer.isAdmin?
                <NavLink to={`/admintable/?cid=${store.getState().CategoryReducer.CIDList[0].CID}`} className="Header_link" >
                  <MdOutlineManageAccounts/>
                  Admin
                </NavLink>:
                <button className="Header_link">
                  <GrUserManager/>
                  {store.getState().SecurityReducer.userName}
                </button>
              )
              :
              <NavLink to={"/login"} className="Header_link" >
                <Button variant="outlined" startIcon={<MdOutlinePersonOutline />}>
                  {store.getState().SecurityReducer.userName}
                </Button>
              </NavLink>
            }

            {/*display the login/logout button */}
             {store.getState().SecurityReducer.loginStatus?
              <button  className="Header_link" onClick={this.LogOut}><CiLogout/>LogOut</button>
              :
              <button className="Header_link">
                <NavLink to={'/login'} className="Header_link" >
                  <CiLogin/>Login
                </NavLink>
              </button>
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

                {/*only display the check out button if there are item in the cart */}
                {
                  store.getState().CartReducer?.cartList?.length>0?
                    <button className="Header_checkOutBtn">
                      <NavLink to={
                        store.getState().SecurityReducer.loginStatus?"/payment":"/login"}>
                          Check Out<AiOutlineArrowRight/>
                      </NavLink>
                    </button>
                    :
                    <></>
                }
              </div>
               <CartTable/>
            </Drawer>

           {/*Order history dialog */}
            <OrderHistory open={this.state.openOrderHistory} closeDialog={this.closeOrderHistory}/>

          </header>
          <Banner/>
          <Navigation/>
        </div>
    );
  }

}


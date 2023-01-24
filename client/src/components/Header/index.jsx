import { Link } from "react-router-dom";
import {Component} from 'react'
import {AiFillHome} from "react-icons/ai"
import Banner from './Banner'
import Navigation from './Navigation'
import {AiFillStar,AiOutlineShoppingCart} from 'react-icons/ai'
import CartTable from './CartTable'
import Drawer from '@mui/material/Drawer';
import './index.css'
export default class Header extends Component {
  state={direction:"right",condition:false}
  openDrawer=()=>{
    this.setState({condition:true})
  }
  closeDrawer=()=>{
    this.setState({condition:false})
  }
  render(){
    return (
        <div className="Header_wrapper">
          <header className="Header_linkWrapper">
            <Link to="/" className="Header_link" id="home"><AiFillHome/>Home</Link>
            <Link to="/favourite" className="Header_link"><AiFillStar/>Favourite</Link>
            <button  className="Header_link" onClick={this.openDrawer}><AiOutlineShoppingCart/>Shopping List</button>
            <Drawer
              anchor={this.state.direction}
              open={this.state.condition}
              onClose={this.closeDrawer}
            >
              there is content of the drawer mmmm
               <CartTable/>
            </Drawer>
          </header>
          <Banner/>
          <Navigation/>
        </div>
    );
  }

}


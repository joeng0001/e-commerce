import { Link } from "react-router-dom";
import {Component} from 'react'
import {AiFillHome} from "react-icons/ai"
import Banner from './Banner'
import Navigation from './Navigation'
import {AiFillStar,AiOutlineShoppingCart} from 'react-icons/ai'
import './index.css'
export default class Header extends Component {
  render(){
      return (
          <div className="Header_wrapper">
            <header className="Header_linkWrapper">
              <Link to="/" className="Header_link" id="home"><AiFillHome/>Home</Link>
              <Link to="/favourite" className="Header_link"><AiFillStar/>Favourite</Link>
              <Link to="/shopping_list" className="Header_link"><AiOutlineShoppingCart/>Shopping List</Link>
            </header>
            <Banner/>
            <Navigation/>
          </div>
      );
  }

}


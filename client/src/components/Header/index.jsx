import { Link } from "react-router-dom";
import {Component} from 'react'
import {AiFillHome} from "react-icons/ai"

import './index.css'
export default class Header extends Component {
  render(){
      return (
            <header className="Header_wrapper">
              <Link to="/" className="Header_link" id="home"><AiFillHome/>Home</Link>
              <Link to="/favourite" className="Header_link">Favourite</Link>
              <Link to="/shopping_list" className="Header_link">Shopping List</Link>
            </header>
      );
  }

}


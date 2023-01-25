import { NavLink } from "react-router-dom";
import {Component} from 'react'
import {MdFastfood,MdToys,MdOutlineAddBox} from 'react-icons/md'
import './index.css'
export default class Navigation extends Component {
  scrollToTop=()=>{
    window.scrollTo(0, 0)
  }
  
  render(){
      return (
          <div className="Navigation_wrapper">
            <NavLink to="/subNavigation/food/new" className="Navigation_link" onClick={this.scrollToTop}><MdFastfood/>Food</NavLink>
            <NavLink to="/subNavigation/toys/new" className="Navigation_link" onClick={this.scrollToTop}><MdToys/>Toys</NavLink>
            <NavLink to="/subNavigation/others/new" className="Navigation_link" onClick={this.scrollToTop}><MdOutlineAddBox/>Others</NavLink>
          </div>
      );
  }

}

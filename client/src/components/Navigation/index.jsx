import { NavLink } from "react-router-dom";
import {Component} from 'react'
import {MdFastfood,MdToys,MdOutlineAddBox} from 'react-icons/md'
import './index.css'
export default class Navigation extends Component {
  render(){
      return (
          <div className="Navigation_wrapper">
            <NavLink to="/subNavigation/food" className="Navigation_link"><MdFastfood/>Food</NavLink>
            <NavLink to="/subNavigation/toys" className="Navigation_link"><MdToys/>Toys</NavLink>
            <NavLink to="/subNavigation/others" className="Navigation_link"><MdOutlineAddBox/>Others</NavLink>
          </div>
      );
  }

}

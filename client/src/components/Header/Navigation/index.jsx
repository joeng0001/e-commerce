import { NavLink } from "react-router-dom";
import {Component} from 'react'
import {MdFastfood,MdToys,MdOutlineAddBox} from 'react-icons/md'
import './index.css'
import store from "../../../redux/store";
import * as Icons from "react-icons/md";
export default class Navigation extends Component {
  scrollToTop=()=>{
    window.scrollTo(0, 0)
  }
  getIcon=({name})=>{
    const Icon = Icons[name];
    if (!Icon) {
      return <Icons.MdFastfood/>;
    }
    return <Icon />;
  }
  render(){
      return (
          <div className="Navigation_wrapper">
            {
              Object.keys(store.getState().CategoryReducer.categoryList).map((cate)=>{
                return (
                  <NavLink to={`/subNavigation/${cate}/new`} className="Navigation_link" onClick={this.scrollToTop}>
                    {                 
                        <this.getIcon name={store.getState().CategoryReducer.iconList[cate]} />
                    }
                  {cate}</NavLink>
                )
              })
            }
            {/* <NavLink to="/subNavigation/food/new" className="Navigation_link" onClick={this.scrollToTop}><MdFastfood/>Food</NavLink>
            <NavLink to="/subNavigation/toys/new" className="Navigation_link" onClick={this.scrollToTop}><MdToys/>Toys</NavLink>
            <NavLink to="/subNavigation/others/new" className="Navigation_link" onClick={this.scrollToTop}><MdOutlineAddBox/>Others</NavLink> */}
          </div>
      );
  }

}

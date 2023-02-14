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
                  <NavLink to={`/subNavigation/${cate}/new`} className="Navigation_link" onClick={this.scrollToTop} key={cate}>
                    {                 
                        <this.getIcon name={store.getState().CategoryReducer.iconList[cate]} />
                    }
                  {cate}</NavLink>
                )
              })
            }
             <NavLink to={`/adminTable`} className="Navigation_link" >Admin</NavLink>
          </div>
      );
  }

}

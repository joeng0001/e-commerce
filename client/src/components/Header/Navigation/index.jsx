import { NavLink } from "react-router-dom";
import {Component} from 'react'
import './index.css'
import store from "../../../redux/store";
import * as Icons from "react-icons/md";
export default class Navigation extends Component {
  scrollToTop=()=>{
    window.scrollTo(0, 0)
  }
  getIcon=({name})=>{
    //set icon base on the name that store in db
    const Icon = Icons[name];
    if (!Icon) {
      return <Icons.MdFastfood/>;
    }
    return <Icon />;
  }
  render(){
    //component of Category link bar
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
            
          </div>
      );
  }

}

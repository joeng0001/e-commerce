import './index.css'
import {useState} from 'react'
import HomeProductList from '../../components/HomeProductList'
import {FaArrowAltCircleRight} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import store from '../../redux/store'
export default function Home() {
  const list_to_display=store.getState().HomeListReducer.homeList;
  //whenever store data change,rerender whole APP by update state
  const [forceUpdate, setForceUpdate] = useState(false);
  store.subscribe(()=>{
    setForceUpdate(!forceUpdate)
  })

  const scrollToTop=()=>{
    window.scrollTo(0, 0)
  }
  
  return (
    <div className="Home_wrapper">
      <div className="Home_imageWrapper">
        <img
          src='../../../home_img.jpg'
          alt="match not found"  
          className="Home_image"
        /> 
        </div>
        <br/>
        <div className="Home_listContainer">
          {list_to_display?.map((obj)=>{
              return (
                <HomeProductList key={obj.name} {...obj}/>
              )
            })
          }
        </div>
      <br/>
        <div className="Home_linkWrapper">
          <NavLink to="/subNavigation/food/new" onClick={scrollToTop}>
              <button className="Home_viewMore" >
                View More<FaArrowAltCircleRight size={30}/>
              </button>
          </NavLink>
        </div>
    </div>

   

  );
}
//Home page should contain navigation,and the product list
import './index.css'
import {list_to_display_at_home} from '../../sampleData'
import HomeProductList from '../../components/HomeProductList'
import {FaArrowAltCircleRight} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
function Home() {
  const list_to_display=list_to_display_at_home;
  const scrollToTop=()=>{
    window.scrollTo(0, 0)
  }
  return (
    <div className="Home_wrapper">
      <div className="Home_imageWrapper">
        <img
          src='../../../home_img.jpg'
          alt="match not found"  
          className="Home_welcomeMsg"
        /> 
        </div>
        <br/>
          <div className="Home_listContainer">
            {list_to_display.map((obj)=>{
                return (
                  <HomeProductList {...obj}/>
                )
              })
            }
          </div>
        <br/>
        <div className="Home_linkWrapper">
          <NavLink to="/subNavigation/food" onClick={scrollToTop}>
              <button className="Home_viewMore" >
                View More<FaArrowAltCircleRight size={30}/>
              </button>
          </NavLink>
        </div>
    </div>

   

  );
}

export default Home;
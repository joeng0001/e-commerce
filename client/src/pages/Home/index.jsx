//Home page should contain navigation,and the product list
import './index.css'
import ProductList from '../../components/ProductList'
import {list_to_display_at_home} from '../../sampleData'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HomeProductList from '../../components/HomeProductList'
import {useState,createRef} from 'react'
function Home() {
  const list_to_display=list_to_display_at_home;
  console.log()
  const [value, setValue] = useState(0);
  const [subtype, setSubtype] = useState("new");
  const handleListChange = (event)=> {
    setSubtype(event.target.textContent)
  };
  const handleTabChange=(event,newValue)=>{
    setValue(newValue)
  }
  return (
    <div className="Home_wrapper">
          <div className="Home_imageWrapper">
            <img
              src='../../../welcome_msg.jpg'
              alt="match not found"  
              className="Home_welcomeMsg"
            /> 
            </div>
            <br/>
              
            <div className="list_container">

              {list_to_display.map((obj)=>{
                  return (
                    <HomeProductList {...obj}/>
                  )
                })
              }
            </div>
         
    </div>
   

  );
}

export default Home;
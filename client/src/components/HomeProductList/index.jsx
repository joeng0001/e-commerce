import './index.css'
import ProductList from '../../components/ProductList'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState} from 'react'
function HomeProductList(props) {
  const [value, setValue] = useState(0);
  const [subtype, setSubtype] = useState("new");
  
  const handleListChange = (event)=> {
    setSubtype(event.target.textContent)
  };
  const handleTabChange=(event,newValue)=>{
    setValue(newValue)
  }

  return (
    <div className="Home_listItem" >
            <Tabs value={value} onChange={handleTabChange}  aria-label="basic tabs example"
            scrollButtons allowScrollButtonsMobile  className="Home_listTabs" textColor="secondary">
            {
                props?.value?.map((subtype)=>{
                  return (
                      <Tab 
                        label={<span className="Home_listTab">{subtype}</span>} 
                        onClick={handleListChange} 
                      />
                  )
                })
            }
            </Tabs>
        <ProductList type={props?.name} subType={subtype} />
        
    </div>
   

  );
}

export default HomeProductList;
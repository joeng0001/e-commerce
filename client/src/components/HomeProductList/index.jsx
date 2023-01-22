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
  console.log("in home product list ,received",props)
  return (
    <div className="list_item">
            <Tabs value={value} onChange={handleTabChange}  aria-label="basic tabs example"
            scrollButtons allowScrollButtonsMobile  className="list_tabs" textColor="secondary">
            {
                props?.value?.map((subtype)=>{
                return (
                    <Tab 
                        label={<span className="list_tab">{subtype}</span>} 
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
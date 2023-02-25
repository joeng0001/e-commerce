import './index.css'
import ProductList from '../../components/ProductList'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState} from 'react'
import store from '../../redux/store';
function HomeProductList(props) {
  //component that display products in Home page,include the Tab,reuse ProductList component
  const [value, setValue] = useState(0);//value to notify Tabs Component of tab change
  const [subtype, setSubtype] = useState(Object.keys(store.getState().ItemReducer.itemList[props.name])?.[0]);//store current displaying subType
  const [listToDisplay,setlistToDisplay]=useState(store.getState().ItemReducer.itemList[props.name][subtype]?.slice(0,12));
  const handleListChange = (event)=> {
    //handler while clicking different Tabs,reset the current handling subType and the list to display
    setSubtype(event.target.textContent)
    setlistToDisplay(store.getState().ItemReducer.itemList[props.name][event.target.textContent]?.slice(0,12))
  };
  const handleTabChange=(event,newValue)=>{
    //while click to new Tabs,update value to move to next Tab
    setValue(newValue)
  }
  return (
    <div className="Home_listItem" >
            <Tabs value={value} onChange={handleTabChange}  
            scrollButtons allowScrollButtonsMobile  className="Home_listTabs" textColor="secondary">
            {
                props?.value?.map((subtype)=>{
                  return (
                      <Tab 
                        key={subtype}
                        label={<span className="Home_listTab">{subtype}</span>} 
                        onClick={handleListChange} 
                      />
                  )
                })
            }
            </Tabs>
          
        <ProductList type={props?.name} subType={subtype} list={listToDisplay}/>
        
    </div>
   

  );
}

export default HomeProductList;
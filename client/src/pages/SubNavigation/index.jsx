import './index.css'
import { useParams,Link} from 'react-router-dom';
import {BsArrowDown} from 'react-icons/bs'
import React ,{useState}from 'react';
import ProductList from '../../components/ProductList';
import {subNavigationList,productList} from '../../sampleData'
import Pagination from '@mui/material/Pagination';
let prev_type;//store the previous param {type} ->will remove after apply redux
export default function SubNavigation() {//use functional component for using useParam()
    const navlist  =subNavigationList; //i.e. under food,sub list contain apple,orange...
    const prolist  =productList;
    const { type } = useParams();
    const [showMoreMsg, setShowMoreMsg] = useState(navlist[type]?.length>4);//display the show more msg if more than 4 subtype
    const [subType, setsubType] = useState("new");//default show new subtype product
    const [page, setPage] = useState(1);//default 1 page
    const [totalPage,setTotalPage]=useState(Math.ceil(prolist[type][subType]?.length/12)>0?Math.ceil(prolist[type][subType]?.length/12):1)///make sure at least 1
    const [listToDisplay,setlistToDisplay]=useState(prolist[type][subType]?.slice(0,12));
    if(prev_type!==type){ 
        setsubType("new");
    }
    prev_type=type
    let myref=React.createRef()
    function scrollHandler(){
        setShowMoreMsg(myref.current.scrollHeight - myref.current.scrollTop !== myref.current.clientHeight);
    }
    function scrollDown(){
        myref.current.scrollTop=myref.current.scrollHeight+myref.current.clientHeight;
        setShowMoreMsg(false);
    }
    function handlePageChange(event,newValue){
        setPage(newValue)
        setlistToDisplay(prolist[type][subType].slice(newValue*12-12,newValue*12))
    }
    function subTypeChange(event){
        setsubType(event.target.textContent)
        setTotalPage(Math.ceil(prolist[type][event.target.textContent]?.length/12)>0?Math.ceil(prolist[type][event.target.textContent].length/12):1)
        setlistToDisplay(prolist[type][event.target.textContent].slice(0,12))
    }

    // useEffect(() => {//detect param change,update content of <ProductList/> 
    //useful hook but not apply at that moment
    // }, [useLocation()]);
      return (
        <div className="SubNavigation_wrapper">
            <div className="SubNavigation_leftbar">
                <div className="SubNavigation_Container" onScroll={scrollHandler} ref={myref}>
                    {
                        navlist[type]?.map(subType=>{
                        return (
                            <div key={subType.id} className="SubNavigation_element"  >
                                <Link className="SubNavigation_link" onClick={subTypeChange}>
                                    {subType.name}
                                </Link>
                            </div>                   
                        )})
                    }
                    
                </div>
                
                {   
                    (navlist[type]?.length>4&&showMoreMsg)?
                        <div >

                            <BsArrowDown />
                                    <span className="SubNavigation_scrollDownText" onClick={scrollDown}>&nbsp;MORE&nbsp;</span>
                            <BsArrowDown />
                        </div>
                    :<div>&nbsp;</div> /* add extra space -> avoid window shaking because of the message div added*/ 
                        
                }
            </div>
            <div className="SubNavigation_rightBar">
                <Pagination count={totalPage} page={page} color="secondary" size="large" onChange={handlePageChange} className="SubNavigation_paging" /> 
                <ProductList type={type} subType={subType} list={listToDisplay}/>
            </div>
        </div>      
      );

}

import './index.css'
import { useParams,Link ,useNavigate  } from 'react-router-dom';
import {BsArrowDown} from 'react-icons/bs'
import React ,{useState}from 'react';
import ProductList from '../../components/ProductList';
import {subNavigationList,productList} from '../../sampleData'
import Pagination from '@mui/material/Pagination';
import store from '../../redux/store'
export default function SubNavigation() {//use functional component for using useParam()

     //whenever store data change,rerender whole APP by update state
    const [forceUpdate, setForceUpdate] = useState(false);
    store.subscribe(()=>{
        setForceUpdate(!forceUpdate)
    })





    const navlist  =subNavigationList; //i.e. under food,sub list contain apple,orange...
    const prolist  =productList;
    const { type,subType } = useParams();
    // const navigate=useNavigate();
    // navigate("/");
    //navigate to home
    //need to perform checking in param
    const [showMoreMsg, setShowMoreMsg] = useState(navlist[type]?.length>4);//display the show more msg if more than 4 subtype
    const [page, setPage] = useState(1);//default 1 page
    const [totalPage,setTotalPage]=useState(Math.ceil(prolist[type][subType]?.length/12)>0?Math.ceil(prolist[type][subType]?.length/12):1)///make sure at least 1
    let ContainerRef=React.createRef()
    function scrollHandler(){
        setShowMoreMsg(ContainerRef.current.scrollHeight - ContainerRef.current.scrollTop !== ContainerRef.current.clientHeight);
        
    }
    function scrollDown(){
        ContainerRef.current.scrollTop=ContainerRef.current.scrollHeight+ContainerRef.current.clientHeight;
        setShowMoreMsg(false);
    }
    function handlePageChange(event,newValue){
        setPage(newValue)
    }
    function subTypeChange(event){
        setTotalPage(Math.ceil(prolist[type][event.target.textContent]?.length/12)>0?Math.ceil(prolist[type][event.target.textContent].length/12):1)
    }
      return (
        <div className="SubNavigation_wrapper">
            <div className="SubNavigation_leftbar">
                <div className="SubNavigation_hierarchicalNavigationMenu">
                    <Link className="SubNavigation_link" to={'/'}>Home</Link>
                    <span>&nbsp;{'>'}&nbsp;</span>
                    <Link className="SubNavigation_link" to={'/subNavigation/food/new'}>subNavigation</Link>
                    <span>&nbsp;{'>'}&nbsp;</span>
                    <Link className="SubNavigation_link" to={`/subNavigation/${type}/new`}>{type}</Link>
                    <span>&nbsp;{'>'}&nbsp;</span>
                    <Link className="SubNavigation_link" to={`/subNavigation/${type}/${subType}`}>{subType}</Link>
                </div>
                <div className="SubNavigation_Container" onScroll={scrollHandler} ref={ContainerRef}>
                    {
                        navlist[type]?.map(NavsubType=>{
                        return (
                            <div key={NavsubType.id} className="SubNavigation_element"  >
                                <Link className="SubNavigation_link" onClick={subTypeChange} to={`/subNavigation/${type}/${NavsubType.name}`}>
                                    {NavsubType.name}
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
                    :<div>&nbsp;</div> /* hold extra extra space -> avoid window shaking because of the message div added*/ 
                        
                }
            </div>
            <div className="SubNavigation_rightBar">
                <Pagination count={totalPage} page={page} color="secondary" size="large" onChange={handlePageChange} className="SubNavigation_paging" /> 
                <ProductList type={type} subType={subType} list={prolist[type][subType].slice(page*12-12,page*12)}/>
                {/* cannot store list in state-> cannot detect param change and update component */}
            </div>
        </div>      
      );

}

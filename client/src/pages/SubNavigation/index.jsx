import './index.css'
import { useParams,Link } from 'react-router-dom';
import {BsArrowDown} from 'react-icons/bs'
import React ,{useState,useEffect}from 'react';
import ProductList from '../../components/ProductList';
import Pagination from '@mui/material/Pagination';
import store from '../../redux/store'
import {GiSeaDragon} from 'react-icons/gi'

export default function SubNavigation() {
    const prolist=store.getState().ItemReducer.itemList;//list of all the item
    const navlist  =store.getState().CategoryReducer.categoryList; //list of categories
    const { type,subType } = useParams();//params in URL
    const [showMoreMsg, setShowMoreMsg] = useState(navlist[type]?.length>4);//display the show more msg if more than 4 subtype
    const [page, setPage] = useState(1);//current page,default 1 page
    const [totalPage,setTotalPage]=useState(Math.ceil(prolist[type][subType]?.length/12)>0?Math.ceil(prolist[type][subType]?.length/12):1)//totalpage by calculation 
    const [list,setList]=useState(prolist[type][subType]?.slice(page*12-12,page*12));//product list to display in Table component
    let ContainerRef=React.createRef()//Ref to Drawer container
    function scrollHandler(){
        //if not scrolled to bottom,show the message of "More"
        setShowMoreMsg(ContainerRef.current.scrollHeight - ContainerRef.current.scrollTop !== ContainerRef.current.clientHeight);
    }
    function scrollDown(){
        //while click the "More" message,directly scroll to bottom and hide the message.
        ContainerRef.current.scrollTop=ContainerRef.current.scrollHeight+ContainerRef.current.clientHeight;
        setShowMoreMsg(false);
    }
    function handlePageChange(event,newValue){
        //while page change,store new page value and reset list to display in table
        setPage(newValue)
        setList(prolist[type][subType].slice(newValue*12-12,newValue*12))
    }
    useEffect(()=>{
        //monitor type and subType changing->i.e. click Navigation bar on Header
        //reset all the property
        setShowMoreMsg(navlist[type]?.length>4)
        setTotalPage(Math.ceil(prolist[type][subType]?.length/12)>0?Math.ceil(prolist[type][subType]?.length/12):1)
        setPage(1)
        setList(prolist[type][subType]?.slice(0,12))
    },[type,subType])
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
                <GiSeaDragon size={100}/>
                <div className="SubNavigation_Container" onScroll={scrollHandler} ref={ContainerRef}>
                    {
                        navlist[type]?.map(NavsubType=>{
                        return (
                            <div key={NavsubType} className="SubNavigation_element"  >
                                <Link className="SubNavigation_link" to={`/subNavigation/${type}/${NavsubType}`}>
                                    {NavsubType}
                                </Link>
                            </div>                   
                        )})
                    }
                    
                </div>
                
                {   
                    showMoreMsg?
                        <div >

                            <BsArrowDown />
                                    <span className="SubNavigation_scrollDownText" onClick={scrollDown}>&nbsp;MORE&nbsp;</span>
                            <BsArrowDown />
                        </div>
                    :<div>&nbsp;</div> /* hold extra extra space -> avoid window shaking because of the message div added*/ 
                        
                }
            </div>
            <div className="SubNavigation_rightBar">
                <Pagination 
                    count={totalPage} 
                    page={page} color="secondary" size="large" onChange={handlePageChange} className="SubNavigation_paging" /> 
                <ProductList type={type} subType={subType} list={list}/>
            </div>
        </div>      
      );

}

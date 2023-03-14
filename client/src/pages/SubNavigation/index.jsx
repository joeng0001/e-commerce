import './index.css'
import { useParams,Link } from 'react-router-dom';
import {BsArrowDown} from 'react-icons/bs'
import React ,{useState,useEffect}from 'react';
import ProductList from '../../components/ProductList';
/*import Pagination from '@mui/material/Pagination';*/
import store from '../../redux/store'
import {GiSeaDragon} from 'react-icons/gi'

//some note: 
//origin design to implement pagination,but for fulfilling assignment requirement
//switch to infinte scroll 


export default function SubNavigation() {
    const prolist=store.getState().ItemReducer.itemList;//list of all the item
    const navlist  =store.getState().CategoryReducer.categoryList; //list of categories
    const { type,subType } = useParams();//params in URL
    const [showMoreMsg, setShowMoreMsg] = useState(navlist[type]?.length>4);//display the show more msg if more than 4 subtype
    //const [page, setPage] = useState(1);//current page,default 1 page
    // const [totalPage,setTotalPage]=useState(Math.ceil(prolist[type][subType]?.length/12)>0?Math.ceil(prolist[type][subType]?.length/12):1)//totalpage by calculation 
    //const [list,setList]=useState(prolist[type][subType]?.slice(page*12-12,page*12));//product list to display in Table component
    const [list,setList]=useState(prolist[type][subType]?.slice(0,10));
    const [loadMoreCount,setloadMoreCount]=useState(1)//similar to page implementation
    const [hasMoreToLoad,setHasMoreToLoad]=useState(prolist[type][subType]?.length>10)
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
    /*
    function handlePageChange(event,newValue){
        //while page change,store new page value and reset list to display in table
        setPage(newValue)
        setList(prolist[type][subType].slice(newValue*12-12,newValue*12))
    }
    */

    function loadMore(){
        setList(list.concat(prolist[type][subType]?.slice((loadMoreCount+1)*10-10,(loadMoreCount+1)*10)))
        setloadMoreCount(loadMoreCount+1)
        setHasMoreToLoad((loadMoreCount+1)*10<prolist[type][subType]?.length)
    }
    useEffect(()=>{
        //monitor type and subType changing->i.e. click Navigation bar on Header
        //reset all the property
        /*
        setShowMoreMsg(navlist[type]?.length>4)
        setTotalPage(Math.ceil(prolist[type][subType]?.length/12)>0?Math.ceil(prolist[type][subType]?.length/12):1)
        setPage(1)
        setList(prolist[type][subType]?.slice(0,12))
        */
        setloadMoreCount(1)
        setHasMoreToLoad(prolist[type][subType]?.length>10)
        setList(prolist[type][subType]?.slice(0,10))
    },[type,subType,prolist])
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
                {/* 
                <Pagination 
                    count={totalPage} 
                    page={page} color="secondary" size="large" onChange={handlePageChange} className="SubNavigation_paging" />  
                */}
                <ProductList type={type} subType={subType} list={list} loadMore={loadMore} hasMoreToLoad={hasMoreToLoad}/>
            </div>
        </div>      
      );

}

import './index.css'
import { useParams,Link} from 'react-router-dom';
import {BsArrowDown} from 'react-icons/bs'
import React ,{useState}from 'react';
import ProductList from '../../components/ProductList';
import {subNavigationList} from '../../sampleData'
let prev_type;//store the previous param {type}
export default function SubNavigation() {//use functional component for using useParam()
    //received props by navigation
    //display sub navigate,i.e. food-> burger,potatos chips drinks etc...
    //for each,use the list Product list to display all items
    //for each item,enable it go to detail page

        
    const { type } = useParams();
    const [showMoreDisplay, setShowMoreDisplay] = useState(true);
    const [listDisplay, setlistDisplay] = useState("new");
    if(prev_type!==type){ 
        //while clciking navigation link,type changed but subtype doesnot
        //case happen like[Food][chopper] that not exist
        //need to detect the change of param->type and modify the subtpye to default "new"
        setlistDisplay("new");
    }
    prev_type=type
    const list =subNavigationList;
    // const list={//fake data
    //     food:['apple','orange','banana'],
    //     toys:['bear','robot','car'],
    //     others:['chopper','earphones','cup','box','pan','ball','tap']
    // }
    let myref=React.createRef()
    function scrollHandler(){
        setShowMoreDisplay(myref.current.scrollHeight - myref.current.scrollTop !== myref.current.clientHeight);
    }
    function scrollDown(){
        myref.current.scrollTop=myref.current.scrollHeight+myref.current.clientHeight;
        setShowMoreDisplay(false);
    }
    // useEffect(() => {//detect param change,update content of <ProductList/> 
    //useful hook but not apply at that moment
    // }, [useLocation()]);
      return (
        <div className="SubNavigation_wrapper">
            <div className="SubNavigation_leftbar">
                <div className="SubNavigation_Container" onScroll={scrollHandler} ref={myref}>
                    {
                        list[type]?.map(subType=>{
                        return (
                            <div key={subType.id} className="SubNavigation_element"  >
                                <Link className="SubNavigation_link" onClick={()=>{
                                    setlistDisplay(subType.name)
                                }}>
                                    {subType.name}
                                </Link>
                            </div>                   
                        )})
                    }
                    
                </div>
                
                {   
                    (list[type]?.length>4&&showMoreDisplay)?
                        <div >

                            <BsArrowDown />
                                    <span className="SubNavigation_scrollDownText" onClick={scrollDown}>&nbsp;MORE&nbsp;</span>
                            <BsArrowDown />
                        </div>
                    :<div></div>
                        
                }
            </div>
            
            <ProductList type={type} subType={listDisplay}/>
        </div>      
      );

}

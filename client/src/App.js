import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import { Suspense, useEffect,useState } from 'react';
import {
  useRoutes
} from "react-router-dom";
import routes from './route'
import store from './redux/store';
import {initialItemList} from '../src/redux/action/item_action'
import {initialCategoryList,initialCIDList,initialIconList} from '../src/redux/action/category_action'
import { initialHomeList } from './redux/action/homeList_action';
import { RestoreFavourListFromLocalStorage } from './redux/action/favour_action';
import { RestoreCartListFromLocalStorage } from './redux/action/cart_action';
import axios_service from './axios_service'
import { useLocation ,useNavigate,useSearchParams} from 'react-router-dom';
function App() {
   const [search,setSearch]=useSearchParams();
  const location = useLocation();
  const route=useRoutes(routes);
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);
  const restorelocalStorage=async(itemList)=>{
    let restoredFavourList=[];
    JSON.parse(window.localStorage.getItem("favourList"))?.forEach(pid=>{
      restoredFavourList.push(itemList.find(obj=>{
        return obj.PID===pid
      }))
    })
    let restoredCartList=[];
    JSON.parse(window.localStorage.getItem("cartList"))?.forEach(PQPair=>{//each PQPair is {PID:orderNum}
      let item=itemList.find(obj=>{
        return obj.PID===PQPair.PID
      })
      restoredCartList.push({...item,orderNum:PQPair.orderNum})
    })
    store.dispatch(RestoreFavourListFromLocalStorage(restoredFavourList))
    store.dispatch(RestoreCartListFromLocalStorage(restoredCartList))
    return
  }
  const restorelocalStorageFromCrossDomain=async()=>{
    try{
      var data = search.get("data");
      if(!data){
        setSearch('')
        return
      }
      var decodedData = JSON.parse(decodeURIComponent(data)); 
      let favourList=JSON.parse(window.localStorage.getItem("favourList"))
      let cartList=JSON.parse(window.localStorage.getItem("cartList"))

      favourList=[...new Set(favourList?.concat(JSON.parse(decodedData?.favourList)??[]))]
      window.localStorage.setItem("favourList",JSON.stringify(favourList))

      JSON.parse(decodedData?.cartList)?.forEach(item=>{
        let target=cartList.find(item2=>{
          return item2.PID===item.PID
        })
        if(target){
          target.orderNum=item?.orderNum??1
        }else{
          cartList.push(item)
        }
      })
      window.localStorage.setItem("cartList",JSON.stringify(cartList))
      setSearch('')
    }catch{
      setSearch('')
      return
    }
  
  }
  const initiation=async ()=>{
    //fetch data via axios
        let categories;
        let items;
        //get category
        await axios_service.get_categoryList()
          .then(res => categories=res.data)
          .catch(e=>console.log(e))
        //get all the product
        await axios_service.get_productList()
          .then(res => {
              items=res.data;
              const items_list_with_type_subtype_property={};
              const category_list={};
              const icon_list={};
              //combine cateogry and product
              categories.forEach((cate)=>{
                items_list_with_type_subtype_property[cate.NAME]={};
                //subCateList is a string seperate by ',',convert to array
                let subCateList=cate.subCategories.split(",");
                category_list[cate.NAME]=subCateList;
                icon_list[cate.NAME]=cate.NavListIcon;
                subCateList.forEach((subCate)=>{
                  items_list_with_type_subtype_property[cate.NAME][subCate]=[];
                })
              })
              items.forEach((item)=>{
                item.inventory=parseInt(item.inventory)
                item.category=categories.find((cate)=>cate.CID===item.CID)?.NAME
                items_list_with_type_subtype_property[item.category][item.subCategory].push(item)
              })
              //save to store
              store.dispatch(initialIconList(icon_list))
              store.dispatch(initialCategoryList(category_list))
              store.dispatch(initialItemList(items_list_with_type_subtype_property))
              store.dispatch(initialCIDList(categories))
              
            })
          .catch(e=>console.log(e))
          //get product list that need to display in home page
        await axios_service.get_homeList()
          .then((res)=>{
            const homeList=res.data;
            let list=[];
            homeList.forEach((o)=>{
              let obj={'name':o.name,'id':o.CID,'value':o.value.split(",")}
              list.push(obj);
            })
            store.dispatch(initialHomeList(list))
          })
          .catch(e=>console.log(e))
          //get favour/cart product from localstorage
        await restorelocalStorageFromCrossDomain();
        await restorelocalStorage(items);
          setLoading(false);  
    }
  const redirectToHttps=()=>{
    //pass the localstorage to the https domain,it's string
    let data={
      favourList:window.localStorage.getItem("favourList"),
      cartList:window.localStorage.getItem("cartList")
    }
    window.location.replace("https://secure.s47.ierg4210.ie.cuhk.edu.hk"+window.location.pathname+"?data="+encodeURIComponent(JSON.stringify(data)))
  }
  const https_path=["/adminTable","/login","/signup","/changePW","/payment"]
    useEffect(()=>{
      initiation()
    },[])
    useEffect(() => {
      //whenever URL change,check whether need to redirect to https
      if(https_path.find((path)=>{
        return location.pathname.toLowerCase().includes(path.toLowerCase())
      })
      &&
      (
        !(window.location.hostname.toLocaleLowerCase().includes('secure'))
      ||
      window.location.protocol!=="https:"
      )
      ){
        redirectToHttps()
      }
      //if attempt to access admintable,check redux store isAdmin porperty
      if(location.pathname.toLowerCase().includes('/admintable')&&store.getState().SecurityReducer.isAdmin!==true){
        navigate('/login')
      }
    }, [window.location.pathname]);
  return (
    <div>
      {loading?
      <h2>
        <span>Loading</span>
        <span className="Loading_dot"></span>
        <span className="Loading_dot"></span>
        <span className="Loading_dot"></span>
      </h2> 
      :
      <>
        <Header />
          <div className="content_wrapper">
            
              <Suspense fallback={
                <h2>
                  <span>Loading</span>
                  <span className="Loading_dot"></span>
                  <span className="Loading_dot"></span>
                  <span className="Loading_dot"></span>
                </h2> 
              }>
                {route}  
              </Suspense>     
            
          </div>
        <Footer/>
      </>
  }
    </div>    
  );
}

export default App;

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
function App() {
  const route=useRoutes(routes);
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
  const initiation=async ()=>{
        let categories;
        let items;
        await axios_service.get_categoryList()
          .then(res => categories=res.data)
          .catch(e=>console.log(e))
        await axios_service.get_productList()
          .then(res => {
              items=res.data;
              const items_list_with_type_subtype_property={};
              const category_list={};
              const icon_list={};
              categories.forEach((cate)=>{
                items_list_with_type_subtype_property[cate.NAME]={};
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
              store.dispatch(initialIconList(icon_list))
              store.dispatch(initialCategoryList(category_list))
              store.dispatch(initialItemList(items_list_with_type_subtype_property))
              store.dispatch(initialCIDList(categories))
              
            })
          .catch(e=>console.log(e))
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
        await restorelocalStorage(items);
          setLoading(false);  
    }
    useEffect(()=>{
      initiation()
    },[])
  return (
    <div>
      {loading?
      <h2>Loading...</h2>:
      <>
        <Header />
          <div className="content_wrapper">
            
              <Suspense fallback={<h2>Loading...</h2>}>
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

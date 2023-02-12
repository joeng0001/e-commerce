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
import {initialCategoryList,initialIconList} from '../src/redux/action/category_action'
import { initialHomeList } from './redux/action/homeList_action';
function App() {
  const route=useRoutes(routes);
  const [loading,setLoading]=useState(true);
  const initiation=async ()=>{
        let categories;
         await fetch('http://52.192.59.69/server.php/category_getList', {
        })
        .then((res) => res.json())
        .then((res) => categories=res.data)
        .then(()=>{
          fetch('http://52.192.59.69/server.php/product_getList')
          .then((res) => res.json())
          .then((res) => {
              const items=res.data;
              const items_list_with_type_subtype_property={};
              const category_list={};
              const icon_list={};
              categories.map((cate)=>{
                console.log(cate)
                items_list_with_type_subtype_property[cate.NAME]={};
                let subCateList=cate.subCategories.split(",");
                category_list[cate.NAME]=subCateList;
                icon_list[cate.NAME]=cate.NavListIcon;
                subCateList.map((subCate)=>{
                  items_list_with_type_subtype_property[cate.NAME][subCate]=[];
                })
              })
              items.map((item)=>{
                item.category=categories.find((cate)=>cate.CID===item.CID)?.NAME
                items_list_with_type_subtype_property[item.category][item.subCategory].push(item)
              })
              console.log("in fetch,cate list is",category_list)
              console.log("in fetch,icon list is",icon_list)
              store.dispatch(initialIconList(icon_list))
              store.dispatch(initialCategoryList(category_list))
              store.dispatch(initialItemList(items_list_with_type_subtype_property))
          })
        })  
        await fetch('http://52.192.59.69/server.php/homeList_getList')
        .then((res) => res.json())
        .then((res) => {
          const homeList=res.data;
          let list=[];
          homeList.map((o)=>{
            let obj={};
            obj['name']=o.name
            obj['id']=o.CID;
            obj['value']=o.value.split(",");
            list.push(obj);
          })
           store.dispatch(initialHomeList(list))
        })
        setLoading(false);
        //until all the initiation done,start render page
    }
    useEffect(()=>{
      initiation()
    },[])
  return (
    <div>
      {loading?
            <h2>Loading...</h2>:<>
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

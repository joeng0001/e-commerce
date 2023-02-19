import './index.css'
import React from 'react'
import { Button, Dialog,Snackbar,Alert } from '@mui/material';
//import {subNavigationList} from '../../../sampleData'
import EditDialog from '../Table/EditDialog';
import EditCateDialog from './EditCateDialog';
import axios_service from '../../../axios_service';
import store from '../../../redux/store';
import { initialItemList} from '../../../redux/action/item_action'
import {initialCategoryList,initialCIDList,initialIconList} from '../../../redux/action/category_action'
import { initialHomeList} from '../../../redux/action/homeList_action';
export default function ButtonList(props) {
  const [editDialogOpen,setEditDialogOpen]=React.useState(false);
  const [editCateDialogOpen,setEditCateDialogOpen]=React.useState(false);
  const[openSuccessSnackBar,setOpenSuccessSnackBar]=React.useState(false);
  const[openFailSnackBar,setOpenFailSnackBar]=React.useState(false);
  const[failSnackBarMessage,setFailSnackBarMessage]=React.useState("");
  const vertical='top';
  const horizontal='center'
  const openEditDialog=()=>{
    setEditDialogOpen(true);
  }
  const closeEditDialog=()=>{
    setEditDialogOpen(false);
  }

  const openEditCateDialog=()=>{
    setEditCateDialogOpen(true);
  }
  const closeEditCateDialog=()=>{
    setEditCateDialogOpen(false);
  }
  const closeSuccessSnackBar=()=>{
    setOpenSuccessSnackBar(false)
  }
  const closeFailSnackBar=()=>{
    setOpenFailSnackBar(false)
  }
  const fetchData=async()=>{
        let categories;
        //let CIDPair={};
        await axios_service.get_categoryList()
          .then(res => categories=res.data)
          .catch(e=>console.log(e))
        await axios_service.get_productList()
          .then(res => {
              const items=res.data;
              const items_list_with_type_subtype_property={};
              const category_list={};
              const icon_list={};
              categories.forEach((cate)=>{
                //CIDPair[cate.CID]=cate.NAME;
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
    }
  const checking=(item,image)=>{
    let alert_msg="";
    if(!item.name)
      alert_msg+="Name "
    if(!item.prevPrice)
      alert_msg+="PrevPirce "
    if(!item.price)
      alert_msg+="Price "
    if(!item.inventory)
      alert_msg+="Stock "
    if(!item.description)
      alert_msg+="Description "
    if(!item.comeFrom)
      alert_msg+="Comefrom "
    if(!image)
      alert_msg+="Image "
    return alert_msg
  }
  const submitHandler=(data,image)=>{
      //data =>{CID,subCategory,price,prevPrice,comeForm,inventory,description}
      let item={...data}
      //item['CID']=item.category?store.getState().CategoryReducer.CIDList.find((obj)=>obj.NAME===item.category)?.CID:store.getState().CategoryReducer.CIDList[0].CID
      
      let check_res=checking(item,image)
      if(check_res!=""){
        setFailSnackBarMessage(`Insert Failed => ${check_res}missing`)
        setOpenFailSnackBar(true)
        return false
      }
      let insert_res=false;//flag to told Dialog whether it should empty the image field
      let form=new FormData();
      Object.keys(item).map((key)=>{
          form.append(key,data[key])
      })
     form.append('file',image,image.name)
      axios_service.insert_to_productList(form)
        .then(async(res)=>{
            console.log("receive res",res.data)
            setEditDialogOpen(false);
            insert_res=true;
            await fetchData();
        })
        .catch((e)=>{
            console.log(e)
            insert_res=false;
        })
      return insert_res
  }
  return (
    <div className="ButtonList_Wrapper">
        <Button color="secondary" variant='outlined' onClick={openEditDialog}>Create item</Button>
        <Button color="secondary" variant='outlined' onClick={()=>setEditCateDialogOpen(true)}>Edit Category</Button>
        <Button color="secondary" variant='contained' onClick={()=>console.log("click for reload")}>Click for reload to check change</Button>
        <EditDialog item={{}} open={editDialogOpen} closeDialog={closeEditDialog} submitHandler={submitHandler} />
        <EditCateDialog open={editCateDialogOpen} closeDialog={closeEditCateDialog}/>
        <Snackbar open={openSuccessSnackBar} autoHideDuration={6000} onClose={closeSuccessSnackBar} anchorOrigin={{vertical , horizontal}}>
          <Alert onClose={closeSuccessSnackBar} severity="success" sx={{ width: '100%' }}>
            Update success
          </Alert>
        </Snackbar>
        <Snackbar open={openFailSnackBar} autoHideDuration={9000} onClose={closeFailSnackBar} anchorOrigin={{vertical , horizontal}}>
          <Alert onClose={closeFailSnackBar} severity="error" >
            {failSnackBarMessage}
          </Alert>
        </Snackbar>

    </div>
  );
}
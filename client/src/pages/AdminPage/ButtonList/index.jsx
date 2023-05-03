import './index.css'
import React from 'react'
import { Button, Alert } from '@mui/material';
import EditDialog from '../Table/EditDialog';
import EditCateDialog from './EditCateDialog';
import OrderHistory from '../../../components/OrderHistory';
import axios_service from '../../../axios_service';
import store from '../../../redux/store';
import { initialItemList} from '../../../redux/action/item_action'
import {initialCategoryList,initialCIDList,initialIconList} from '../../../redux/action/category_action'
import { initialHomeList} from '../../../redux/action/homeList_action';
import SnackBar from '../../../components/SnackBar'
import { useNavigate } from 'react-router';
import { NavLink,Outlet } from 'react-router-dom';
export default function ButtonList(props) {
  const navigate=useNavigate();
  const [editDialogOpen,setEditDialogOpen]=React.useState(false);//control item edit dialog
  const [editCateDialogOpen,setEditCateDialogOpen]=React.useState(false);//control category edit dialog
  const [orderHistoryOpen,setOpenOrderHistory]=React.useState(false);
  const[openSnackBar,setOpenSnackBar]=React.useState(false);//control snack bar
  const[snackBarMessage,setSnackBarMessage]=React.useState("");//message display in  snack bar
  const[snackBarSeverity,setSnackBarSeverity]=React.useState(true); //type of snack bar,true for success,false for error
  const openEditDialog=()=>{//open item edit dialog
    setEditDialogOpen(true);
  }
  const closeEditDialog=()=>{//close item edit dialog 
    setEditDialogOpen(false);
  }
  const openEditCateDialog=()=>{//open category edit dialog
    setEditCateDialogOpen(true);
  }
  const closeEditCateDialog=()=>{//close category edit dialog
    setEditCateDialogOpen(false);
  }
  const openHistoryOrder=()=>{
    setOpenOrderHistory(true);
  }
  const closeHistoryOrder=()=>{
    setOpenOrderHistory(false);
  }
  const closeSnackBar=()=>{//close success snack bar
    setOpenSnackBar(false)
  }


  const fetchData=async()=>{
    //fetch data after update
    let categories;
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
    //simple checking null and format
    let missing_msg="",format_msg="",size_msg="";
    if(!item.name)
      missing_msg+="Name "
    if(!item.prevPrice)
      missing_msg+="PrevPirce "
    if(!item.price)
      missing_msg+="Price "
    if(!item.inventory)
      missing_msg+="Stock "
    if(!item.description)
      missing_msg+="Description "
    if(!item.comeFrom)
      missing_msg+="Comefrom "
    if(!image)
      missing_msg+="Image "
    if(missing_msg)
        missing_msg+="missing! "
    if(!(/^-?[0-9]+([.,][0-9]+)?$/.test(item.price)&&(/^-?[0-9]+([.,][0-9]+)?$/.test(item.prevPrice))))
        format_msg+="price "
    if(!(/^\d+$/.test(item.inventory)))
        format_msg+="inventory "
    if(!(/^[A-Za-z0-9\s]+$/).test(item.name))
        format_msg+="name "
    if(!(/^[A-Za-z]+$/).test(item.ComeFrom))
        format_msg+="comeFrom "
    if(!(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(item.Descrition)))
        format_msg+="Description "
    if(format_msg)
        format_msg+="format not correct! "
    if(image?.size>5242880)
      size_msg="image too big,pls upload beload 5MB"
    return missing_msg+" "+format_msg+size_msg
  }
  const submitHandler=(data,image)=>{
    //create item
      //data format =>{CID,subCategory,price,prevPrice,comeForm,inventory,description}
    let item={...data}
    let check_res=checking(item,image)
    if(check_res!==" "){
      //if not passing checking,display fail snack bar with message
      setSnackBarMessage(`Insert Failed => ${check_res}`)
      setSnackBarSeverity(false);
      setOpenSnackBar(true)
      return 
    }
    //construct a form with data,send via axios
    let form=new FormData();
    Object.keys(item).forEach((key)=>{
        form.append(key,data[key])
    })
    form.append('file',image,image.name)
    axios_service.insert_to_productList(form)
      .then(async(res)=>{
          setSnackBarSeverity(true);
          setEditDialogOpen(false);
          setSnackBarMessage(res.data)
          setOpenSnackBar(true)
          await fetchData();
      })
      .catch((e)=>{
          setSnackBarSeverity(false);
          setSnackBarMessage(`Insert Failed => ${check_res}`)
          setOpenSnackBar(true)
          if(e.response.data==="cookie expired"||e.response.data==="Fail to pass checking"){
                navigate('/login')
            }
      })
    return 
  }
  const reload=()=>{
    //reload whole window
    window.location.reload(true)
  }
  return (
    <div className="ButtonList_Wrapper">
        <Button color="secondary" variant="outlined" onClick={openHistoryOrder}>History order</Button> 
        <Button color="secondary" variant='outlined' onClick={openEditDialog}>Create item</Button>
        <Button color="secondary" variant='outlined' onClick={openEditCateDialog}>Edit Category</Button>
        <Button color="secondary" variant='contained' onClick={reload}>Click for Hard reload</Button>
        <OrderHistory open={orderHistoryOpen} closeDialog={closeHistoryOrder} getAll={true}/>
        <EditDialog item={{}} open={editDialogOpen} closeDialog={closeEditDialog} submitHandler={submitHandler} />
        <EditCateDialog open={editCateDialogOpen} closeDialog={closeEditCateDialog}/>
        <SnackBar openSnackBar={openSnackBar} closeSnackBar={closeSnackBar} severity={snackBarSeverity} message={snackBarMessage}/>
    </div>
  );
}
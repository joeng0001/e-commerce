import './index.css'
import React from 'react'
import { Button, Snackbar,Alert } from '@mui/material';
import EditDialog from '../Table/EditDialog';
import EditCateDialog from './EditCateDialog';
import axios_service from '../../../axios_service';
import store from '../../../redux/store';
import { initialItemList} from '../../../redux/action/item_action'
import {initialCategoryList,initialCIDList,initialIconList} from '../../../redux/action/category_action'
import { initialHomeList} from '../../../redux/action/homeList_action';
export default function ButtonList(props) {
  const [editDialogOpen,setEditDialogOpen]=React.useState(false);//control item edit dialog
  const [editCateDialogOpen,setEditCateDialogOpen]=React.useState(false);//control category edit dialog
  const[openSuccessSnackBar,setOpenSuccessSnackBar]=React.useState(false);//control success snack bar
  const[openFailSnackBar,setOpenFailSnackBar]=React.useState(false);//control failure snack bar
  const[failSnackBarMessage,setFailSnackBarMessage]=React.useState("");//message display in fail snack bar
  const[successSnackBarMessage,setSuccessSnackBarMessage]=React.useState("");//message display in success snack bar
  const vertical='top',horizontal='center';//position param of snack bar
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
  const closeSuccessSnackBar=()=>{//close success snack bar
    setOpenSuccessSnackBar(false)
  }
  const closeFailSnackBar=()=>{//close fail snack bar
    setOpenFailSnackBar(false)
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
    if(!(/^[A-Za-z]+$/).test(item.name))
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
      //data format =>{CID,subCategory,price,prevPrice,comeForm,inventory,description}
    let item={...data}
    let check_res=checking(item,image)
    if(check_res!==" "){
      //if not passing checking,display fail snack bar with message
      setFailSnackBarMessage(`Insert Failed => ${check_res}`)
      setOpenFailSnackBar(true)
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
          setEditDialogOpen(false);
          setSuccessSnackBarMessage(res.data)
          setOpenSuccessSnackBar(true)
          await fetchData();
      })
      .catch((e)=>{
          setFailSnackBarMessage(`Insert Failed => ${check_res}`)
          setOpenFailSnackBar(true)
      })
    return 
  }
  const reload=()=>{
    //reload whole window
    window.location.reload(true)
  }
  return (
    <div className="ButtonList_Wrapper">
        <Button color="secondary" variant='outlined' onClick={openEditDialog}>Create item</Button>
        <Button color="secondary" variant='outlined' onClick={openEditCateDialog}>Edit Category</Button>
        <Button color="secondary" variant='contained' onClick={reload}>Click for reload</Button>
        <EditDialog item={{}} open={editDialogOpen} closeDialog={closeEditDialog} submitHandler={submitHandler} />
        <EditCateDialog open={editCateDialogOpen} closeDialog={closeEditCateDialog}/>
        <Snackbar open={openSuccessSnackBar} autoHideDuration={6000} onClose={closeSuccessSnackBar} anchorOrigin={{vertical , horizontal}}>
          <Alert onClose={closeSuccessSnackBar} severity="success" sx={{ width: '100%' }}>
            {successSnackBarMessage}
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
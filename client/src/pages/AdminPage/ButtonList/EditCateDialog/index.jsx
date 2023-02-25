import {Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField,MenuItem,Table,TableCell,TableHead,TableRow,TableBody,TableContainer,
Tooltip,IconButton,Snackbar,Alert} from '@mui/material';
import {ImBin} from 'react-icons/im'
import {BsFillPencilFill} from 'react-icons/bs'
import { useState ,useEffect} from 'react';
import TextfieldDialog from './TextfieldDialog'
import axios_service from '../../../../axios_service'
import store from '../../../../redux/store';
import { initialItemList} from '../../../../redux/action/item_action'
import {initialCategoryList,initialCIDList,initialIconList} from '../../../../redux/action/category_action'
import { initialHomeList} from '../../../../redux/action/homeList_action';
import './index.css'
export default function EditCateDialog(props){
    const [CIDList,setCIDList]=useState(store.getState().CategoryReducer.CIDList)//list of {CID,category,subCategory}
    const [currCate,setCurrCate]=useState(CIDList[0]?.NAME)//store current editing category
    const [subCateList,setSubCateList]=useState(CIDList[0]?.subCategories?.split(","))//store list of subCategory
    const [openTextfieldDialog,SetOpenTextfieldDialog]=useState(false)//control textfield dialog open
    const [dialogTitle,setDialogTitle]=useState('new');//title of textfield dialog
    const [dialogTextContent,setDialogTextContent]=useState("")//default value in the textfield dialog
    const [dialogSubmitHandler,setDialogSubmitHandler]=useState(null);//store handler function of textfield dialog for different submission
    const[openSuccessSnackBar,setOpenSuccessSnackBar]=useState(false);//control open success snack bar
    const[successSnackBarMessage,setSuccessSnackBarMessage]=useState("");//success snack bar message
    const[openFailSnackBar,setOpenFailSnackBar]=useState(false);//control open failure snack bar
    const[failSnackBarMessage,setFailSnackBarMessage]=useState("");//failure snack bar message
    const vertical='top',horizontal='center'//position param of snack bar
    const selectHandler=(e)=>{
        //category selection handler,update currCate and subCategory list
        setCurrCate(e.target.value)
        setSubCateList(CIDList.find(obj=>obj.NAME===e.target.value)?.subCategories?.split(","))
    }
    const openDialog=(title,textContent,submitHandler)=>{
        //open the textfieldDialog,set title,default content,hnadler function
        setDialogTitle(title);
        setDialogTextContent(textContent)
        setDialogSubmitHandler(submitHandler)
        SetOpenTextfieldDialog(true);
    }
    const closeDialog=()=>{
        //close textfield dialog
        SetOpenTextfieldDialog(false);
    }
    const closeSuccessSnackBar=()=>{
        //close success snack bar
        setOpenSuccessSnackBar(false)
    }
    const closeFailSnackBar=()=>{
        //close failure snack bar
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
    const contentCheck=(content)=>{
        //checking function of textfield content
        //only alphabet & apace is allowed -> no symbol/number
        return (/^[a-zA-Z ]*$/.test(content));
    }

    const deleteSubCate=(subCate)=>{
        //remove a subCategory from the current category
        if(!window.confirm("you can not delete any category before its' items are deleted,continue?"))
            return   
        let form=new FormData();
        //construct data with CID,category,subCategory
        let data={
            CID:CIDList.find(obj=>obj.NAME===currCate)?.CID,
            category:currCate,
            subCategory:subCate
        }
        //construct a form and submit via axios
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.delete_subCate_from_category(form)
        .then(async (res)=>{
            //if success,display success message,fetch data,update CID list in current state
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true) 
            await fetchData()
            setCIDList(store.getState().CategoryReducer.CIDList)
        })
        .catch(e=>{
            //fail,display fail message
            setFailSnackBarMessage("delete fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    const deleteCate=()=>{
        //remove a category 
        if(!window.confirm("you can't delete it if there are items belongs to this category,continue?"))
            return 
        let form=new FormData();
        //construct data with CID and category
        let data={
            'CID':CIDList.find(obj=>obj.NAME===currCate)?.CID,
            'category':currCate,
        }
        //construct a form and submit via axios
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.delete_from_category(form)
        .then(async (res)=>{
            //if success,show success message,fetch data,update currCate to a new one,and update CID list in state
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true)
            await fetchData()
            setCurrCate(CIDList.find(obj=>obj.NAME!==currCate)?.NAME)//random pick another cate to handle after delete the current one
            setCIDList(store.getState().CategoryReducer.CIDList)
            
        })
        .catch(e=>{
            //fail,display fail message
            setFailSnackBarMessage("delete fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    // editCateIcon/editCate/editSubCate/createSubCate/createCate are submit handler of textfield dialog
    const editCateIcon=(content,originData)=>{
        //edit icon of a category that display in headers' navigation bar
        if(!content||!contentCheck(content)){
            setFailSnackBarMessage("Format not match!")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
            CID:CIDList.find(obj=>obj.NAME===currCate)?.CID,
            category:currCate,
            newIcon:content
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.update_icon_to_category(form)
        .then(async (res)=>{
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true) 
            await fetchData()
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    const editSubcate=(content,originData)=>{
        //rename a subCategory of current category
        if(!content||!contentCheck(content)){
            setFailSnackBarMessage("Format not match!")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
            CID:CIDList.find(obj=>obj.NAME===currCate)?.CID,
            category:currCate,
            originSubCategory:originData,
            newSubCategory:content
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.update_subCate_to_category(form)
        .then(async (res)=>{
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true) 
            await fetchData()
            setCIDList(store.getState().CategoryReducer.CIDList)
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    const editCate=(content,originData)=>{
        //rename current category
        if(!content||!contentCheck(content)){
            setFailSnackBarMessage("Format not match!")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
            'CID':CIDList.find(obj=>obj.NAME===currCate)?.CID,
            'originCategory':originData,
            'newCategory':content
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.update_to_category(form)
        .then(async (res)=>{
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true) 
            await fetchData()
            setCurrCate(content)
            setCIDList(store.getState().CategoryReducer.CIDList)
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    const createSubcate=(content,originData)=>{
        //add a new subCategory to current category
        if(!content||!contentCheck(content)){
            setFailSnackBarMessage("Format not match!")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
             'CID':CIDList.find(obj=>obj.NAME===currCate)?.CID,
            'category':currCate,
            'subCategory':content
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.insert_subCate_to_category(form)
        .then(async (res)=>{
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true)
            await fetchData()
            setCIDList(store.getState().CategoryReducer.CIDList)      
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    const createCate=(content,originData)=>{
        //create a new category
        if(!content||!contentCheck(content)){
            setFailSnackBarMessage("Format not match!")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
             'CID':CIDList.find(obj=>obj.NAME===currCate)?.CID,
            'category':content,
            'subCategory':'new'//default have new subCategory
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.insert_to_category(form)
        .then(async(res)=>{
            setSuccessSnackBarMessage(res.data)
            setOpenSuccessSnackBar(true)
            await fetchData()
            setCurrCate(content)
            setCIDList(store.getState().CategoryReducer.CIDList)
            
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
   
    useEffect(()=>{//SubcateList base on CIDList and current category,whenever CIDList updated,update subCateList
         setSubCateList(CIDList.find(obj=>obj.NAME===currCate)?.subCategories?.split(","));
    },[CIDList,currCate])
    return(
        <div>
            <Dialog
            open={props.open}
            onClose={props.closeDialog}
            maxWidth='lg'
            fullWidth={true}
            scroll="body"
            >
                <DialogTitle ><div className="EditCateDialog_title">Editing category</div></DialogTitle>
                    <DialogContent className="EditCateDialog_dialogContent" >
                        <Button  onClick={()=>openDialog('create Category','',()=>createCate)}>new Category</Button>
                        <Button onClick={()=>openDialog(`create subCategory for ${currCate}`,'',()=>createSubcate)}>new SubCategory</Button>
                        <TextField
                                select
                                label="Category"
                                value={currCate}
                                helperText="Please select category"
                                onChange={(e)=>{selectHandler(e)}}
                                className="EditCateDialog_selectField" 
                                >
                                {CIDList?.map((option) => 
                                    (
                                    <MenuItem key={option.CID} value={option.NAME} >
                                        {option.NAME}
                                    </MenuItem>
                                ))}
                        </TextField>
                        <Button variant="outlined" onClick={()=>openDialog(`Editing ${currCate}`,currCate,()=>editCate)}>Edit category</Button>
                        <Button variant="outlined" onClick={()=>openDialog(`Editing ${currCate} icon`,"",()=>editCateIcon)}>Edit category icon</Button>
                        <Button variant="outlined" color="error" onClick={deleteCate}>Delete category</Button>
                        <TableContainer>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>subCategory</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>   
                                <TableBody>
                                    
                                        {subCateList?.map(subCate=>{
                                            return (
                                            <TableRow key={subCate}>
                                                <TableCell>{subCate}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Edit">
                                                        <IconButton onClick={()=>openDialog('edit subcate',subCate,()=>editSubcate)}> 
                                                            <BsFillPencilFill size={28} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={()=>deleteSubCate(subCate)}>
                                                            <ImBin  size={28} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                            )
                                            })} 
                                </TableBody>         
                            </Table>  
                        </TableContainer>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={props.closeDialog}>
                            Back
                        </Button>
                        {/* <Button onClick={submitHandler}>
                            Submit
                        </Button> */}
                    </DialogActions>
            </Dialog>
            <TextfieldDialog open={openTextfieldDialog} title={dialogTitle} closeDialog={closeDialog} content={dialogTextContent} submitHandler={dialogSubmitHandler}/>
            <Snackbar open={openSuccessSnackBar} autoHideDuration={9000} onClose={closeSuccessSnackBar} anchorOrigin={{vertical , horizontal}}>
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
    )
}
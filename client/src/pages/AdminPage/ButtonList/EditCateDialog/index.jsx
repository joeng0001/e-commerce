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
    //let CIDList=store.getState().CategoryReducer.CIDList;
    const [CIDList,setCIDList]=useState(store.getState().CategoryReducer.CIDList)
    const [currCate,setCurrCate]=useState(CIDList[0]?.NAME)
    const [subCateList,setSubCateList]=useState(CIDList[0]?.subCategories?.split(","))
    const [openTextfieldDialog,SetOpenTextfieldDialog]=useState(false)
    const [dialogTitle,setDialogTitle]=useState('new');
    const [dialogTextContent,setDialogTextContent]=useState("")
    const [dialogSubmitHandler,setDialogSubmitHandler]=useState(null);
    const[openSuccessSnackBar,setOpenSuccessSnackBar]=useState(false);
    const[successSnackBarMessage,setSuccessSnackBarMessage]=useState("");
    const[openFailSnackBar,setOpenFailSnackBar]=useState(false);
    const[failSnackBarMessage,setFailSnackBarMessage]=useState("");
    const vertical='top';
    const horizontal='center'
    const selectHandler=(e)=>{
        setCurrCate(e.target.value)
        setSubCateList(CIDList.find(obj=>obj.NAME===e.target.value)?.subCategories?.split(","))
    }
   
    const openDialog=(title,textContent,submitHandler)=>{
        setDialogTitle(title);
        setDialogTextContent(textContent)
        setDialogSubmitHandler(submitHandler)
        SetOpenTextfieldDialog(true);
    }
    const closeDialog=()=>{
        SetOpenTextfieldDialog(false);
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
    // editCateIcon/editCate/editSubCate/createSubCate/createCate are submit handler of textfield dialog
     const deleteSubCate=(subCate)=>{
        if(!window.confirm("you can not delete any category before its' items are deleted,continue?"))
            return   
        let form=new FormData();
        let data={
            CID:CIDList.find(obj=>obj.NAME===currCate)?.CID,
            category:currCate,
            subCategory:subCate
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.delete_subCate_from_category(form)
        .then(async (res)=>{
            console.log("res data is",res.data)
            setSuccessSnackBarMessage("delete success ")
            setOpenSuccessSnackBar(true) 
            await fetchData()
            setCIDList(store.getState().CategoryReducer.CIDList)
        })
        .catch(e=>{
            console.log(e)
            setFailSnackBarMessage("delete fail "+e.response.data)
            setOpenFailSnackBar(true)
        })
    }
    const editCateIcon=(content,originData)=>{
        if(!content){
            setFailSnackBarMessage("it can't be empty ")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
            category:currCate,
            newIcon:content
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.update_icon_to_category(form)
        .then((res)=>{
            console.log("res data is",res.data)
            setSuccessSnackBarMessage("create success ")
            setOpenSuccessSnackBar(true) 
            fetchData()
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail ",e)
            setOpenFailSnackBar(true)
        })
    }
    const editSubcate=(content,originData)=>{
        if(!content){
            setFailSnackBarMessage("it can't be empty ")
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
        console.log("sending data",data)
        axios_service.update_subCate_to_category(form)
        .then(async (res)=>{
            console.log("res data is",res.data)
            setSuccessSnackBarMessage("edit subcate success ")
            setOpenSuccessSnackBar(true) 
            await fetchData()
            setCIDList(store.getState().CategoryReducer.CIDList)
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail ",e)
            setOpenFailSnackBar(true)
        })
    }
    const editCate=(content,originData)=>{
        if(!content){
            setFailSnackBarMessage("it can't be empty ")
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
        .then(async(res)=>{
            console.log("res data is",res.data)
            setSuccessSnackBarMessage("create success ")
            setOpenSuccessSnackBar(true) 
            await fetchData()
            setCurrCate(content)
            setCIDList(store.getState().CategoryReducer.CIDList)
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail ",e)
            setOpenFailSnackBar(true)
        })
    }
    const createSubcate=(content,originData)=>{
        if(!content){
            setFailSnackBarMessage("it can't be empty ")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
            'category':currCate,
            'subCategory':content
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.insert_subCate_to_category(form)
        .then(async(res)=>{
            console.log("res data is",res.data)
            setSuccessSnackBarMessage("create success ")
            setOpenSuccessSnackBar(true)
            await fetchData()
            setCIDList(store.getState().CategoryReducer.CIDList)      
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail ",e)
            setOpenFailSnackBar(true)
        })
    }
    const createCate=(content,originData)=>{
        if(!content){
            setFailSnackBarMessage("it can't be empty ")
            setOpenFailSnackBar(true)
            return
        }
        let form=new FormData();
        let data={
            'category':content,
            'subCategory':'new'//default have new subCategory
        }
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key])
        })
        axios_service.insert_to_category(form)
        .then(async(res)=>{
            console.log("res data is",res.data)
            setSuccessSnackBarMessage("create success ")
            setOpenSuccessSnackBar(true)
            await fetchData()
            setCurrCate(content)
            setCIDList(store.getState().CategoryReducer.CIDList)
            
        })
        .catch(e=>{
            setFailSnackBarMessage("insert fail ",e)
            setOpenFailSnackBar(true)
        })
    }
    useEffect(()=>{//SubcateList base on CIDList,whenever CIDList updated,SUBcateList update too
         setSubCateList(CIDList.find(obj=>obj.NAME===currCate)?.subCategories?.split(","));
    },[CIDList,currCate])
    return(
        <>
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
                        <Button variant="outlined" onClick={()=>openDialog(`Editing ${currCate}`,currCate,()=>editCate)}>edit category</Button>
                        <Button variant="outlined" onClick={()=>openDialog(`Editing ${currCate} icon`,"",()=>editCateIcon)}>edit category icon</Button>
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
        </>
    )
}
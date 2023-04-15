import {Table,TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box,TableBody,TableContainer,TablePagination,TableFooter,Alert,Snackbar} from '@mui/material';
import {Component} from 'react'
import store from '../../../redux/store'
import {ImBin} from 'react-icons/im'
import {Tooltip,IconButton} from '@mui/material'
import {BsFillPencilFill,BsEyeFill} from 'react-icons/bs'
import ProductDetail from '../../../components/ProductDetail'
import EditDialog from './EditDialog';
import axios_service from '../../../axios_service';
import imageURL from '../../../imageURL';
import './index.css'
import { initialItemList} from '../../../redux/action/item_action'
import {initialCategoryList,initialCIDList,initialIconList} from '../../../redux/action/category_action'
import { initialHomeList} from '../../../redux/action/homeList_action';
import SnackBar from '../../../components/SnackBar'
//import { useNavigate } from 'react-router';
import { withRouter } from 'react-router-dom';
export default class AdminTable extends Component {  
    
    state={selectedItems:[],detailDialogOpen:false,detailDialogItem:null,editDialogOpen:false,editDialogItem:null,
    openSnackBar:false,snackBarMessage:"",snackBarSeverity:false}
    AllClick=(event)=>{
        //add all item to the selectedItems list or empty the selectedItems list
        if(event.target.checked)
            this.setState({selectedItems:[...this.props.displayList]})
        else
            this.setState({selectedItems:[]})  
    }
    //navigate=useNavigate();
    fetchData=async()=>{
        //fetch all data after update,and save to store
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
    checkHandler=(event,item)=>{
        //add select item to selectedList or remove it from the list
        if(event.target.checked){
            this.setState({selectedItems:[...this.state.selectedItems,item]})
        }else{
            let newSelectedItemsList=this.state.selectedItems.filter((obj)=>{
                return obj.PID!==item.PID
            })
            this.setState({selectedItems:newSelectedItemsList})
        }
        
    }
    openDetailDialog=(item)=>{
        //set item to display in dialog and open the dialog
        this.setState({detailDialogItem:item,detailDialogOpen:true});
    }
    closeDetailDialog=()=>{
        //clean item to display in dialog and close it
        this.setState({detailDialogItem:null,detailDialogOpen:false});
    }
    openEditDialog=(item)=>{
        //set item to display in the edit dialog and open the dialog
        this.setState({editDialogItem:item,editDialogOpen:true});
    }
    closeEditDialog=()=>{
        //close the item to display in edit Dialog and close dialog
        this.setState({editDialogItem:null,editDialogOpen:false});
    }
    closeSnackBar=()=>{
        //pclose success snack bar after displaying success message
        this.setState({openSnackBar:false});
    }
    checking=(item,image)=>{
    //perform simple checking before sending request to server
    //not included image->can leave as default while updating an product
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
    if(!(/^[a-zA-Z ]*$/.test(item.Descrition)))
        format_msg+="Description "
    if(format_msg)
        format_msg+="format not correct! "
    if(image?.size>5240880)
        size_msg="image too big,pls upload size below 5MB"
    return missing_msg+" "+format_msg+size_msg
  }
    submitHandler=(data,image)=>{
        //handler of submission
        //construct an item and perform checking
        let item={...data}
        let check_res=this.checking(item,image)
        if(check_res!==" "){
            //if fail to pass checking,display the message and return
            this.setState({snackBarSeverity:false,openSnackBar:true,snackBarMessage:`Insert Failed => ${check_res}`})
            return
        }
        //after passing checking,construct a Form with all properties of the item
        let form=new FormData();
        Object.keys(item).forEach((key)=>{
            form.append(key,data[key])
        })
        if(image){
            form.append('file',image,image?.name)
        }
        //start calling 
        //send the form to server via axios
        axios_service.update_to_productList(form)
        .then(async (res)=>{
            //if success,display success message,close editing dialog,and fetch data for update 
            this.setState({snackBarSeverity:true,openSnackBar:true,snackBarMessage:res.data})
            this.closeEditDialog();
            await this.fetchData();
        })
        .catch((e)=>{
            //if fail,display the failure message
            this.setState({snackBarSeverity:false,openSnackBar:true,snackBarMessage:e.response.data})
            if(e.response.data==="cookie expired"||e.response.data==="Fail to pass checking"){
                //will loss the login state with using window.location for redirection
                 window.location.pathname="/login";
            }
        })
        return 
    }
    deleteItem=(item)=>{
        //handler of deletion
        //confirm delete operation
        if(!window.confirm('delete it?'))
            return
        //construct a form with CID
        let form=new FormData();
        form.append('PID',item?.PID)
        //send via axios
        axios_service.delete_from_productList(form)
        .then(async (res)=>{
            //display success message and fetch data for update
            this.setState({snackBarSeverity:true,openSnackBar:true,snackBarMessage:res.data})
            await this.fetchData();

        })
        .catch((e)=>{
            //if fail,display failure message
            this.setState({snackBarSeverity:false,openSnackBar:true,snackBarMessage:e.response.data})
            if(e.response?.data==="cookie expired"||e.response?.data==="Fail to pass checking"){
                //will loss the login state with using window.location for redirection
                window.location.pathname="/login";
            }
        
        })
    }
    render(){
        return(
            <>
            <TableContainer>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    checked={this.state.selectedItems.length===this.props.listLength}
                                    onChange={(e)=>this.AllClick(e)}
                                />
                                {
                                    this.state.selectedItems.length>0?<button>Remove Selected</button>:<div></div>
                                }
                            </TableCell>
                            {this.props.tableHeader.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align='left'
                                >
                                <TableSortLabel
                                    active={false}
                                    direction={false? 'asc': 'asc'}
                                >
                                    {headCell.label}
                                    {true? (<Box component="span"></Box>) : null}
                                </TableSortLabel> 
                                </TableCell>
                            ))} 
                        </TableRow>
                    </TableHead>   
                    <TableBody>
                    {this.props.displayList?.map((item)=>{
                        return (
                        <TableRow key={item.PID}>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                checked={this.state.selectedItems.findIndex((obj)=>{return obj.PID===item.PID})>-1}
                                onChange={(e)=>this.checkHandler(e,item)}
                            />
                        </TableCell>
                        <TableCell>
                            {item.PID}
                        </TableCell>
                        <TableCell>
                            <div>
                                {/* <img src={`../../../productPhoto/${this.props.type}/${this.props.subType}/${item.name}.jpg`} alt="not found" className="adminTable_img"></img> */}
                                <img src={`${imageURL}/${item.PID}`} alt="not found" className="adminTable_img"></img>
                            </div>
                        </TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>
                            {item.name}
                        </TableCell>
                        <TableCell>
                            {parseInt(item.inventory)}
                        </TableCell>
                            <TableCell>
                                <Tooltip title="View">
                                    <IconButton onClick={()=>this.openDetailDialog(item)}>
                                        <BsEyeFill size={28} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton onClick={()=>this.openEditDialog(item)}> 
                                        <BsFillPencilFill size={28} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton onClick={()=>{this.deleteItem(item)}}>
                                        <ImBin  size={28}/>
                                    </IconButton>
                                </Tooltip>
                                
                            
                                
                            </TableCell>
                        </TableRow>
                        )
                    })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15]}
                                count={this.props.listLength}
                                rowsPerPage={this.props.tableRowsNum}
                                page={this.props.tablePage}
                                onPageChange={(e,newpage)=>this.props.tablePageChange(e,newpage)}
                                onRowsPerPageChange={(e)=>this.props.tableRowsChange(e)}
                            />
                        </TableRow>
                    </TableFooter>
                    
                </Table>  
                <ProductDetail {...this.state.detailDialogItem} type={this.props.type} subType={this.props.subType}
                open={this.state.detailDialogOpen} openDialog={this.openDetailDialog} closeDialog={this.closeDetailDialog} /> 
                <EditDialog submitHandler={this.submitHandler}  item={this.state.editDialogItem} open={this.state.editDialogOpen} closeDialog={this.closeEditDialog}/>
                    
            </TableContainer>
            <SnackBar openSnackBar={this.state.openSnackBar} closeSnackBar={this.closeSnackBar} severity={this.state.snackBarSeverity} message={this.state.snackBarMessage}/>
            </>
    )}
}
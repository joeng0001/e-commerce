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
export default class AdminTable extends Component {  
    state={selectedItems:[],detailDialogOpen:false,detailDialogItem:null,editDialogOpen:false,editDialogItem:null,
    openSuccessSnackBar:false,successSnackBarMessage:"",openFailSnackBar:false,failSnackBarMessage:false}
    AllClick=(event)=>{
        if(event.target.checked)
            this.setState({selectedItems:[...this.props.displayList]})
        else
            this.setState({selectedItems:[]})  
    }
    fetchData=async()=>{
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
    checkHandler=(event,item)=>{
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
        this.setState({detailDialogItem:item,detailDialogOpen:true});
    }
    closeDetailDialog=()=>{
        this.setState({detailDialogItem:null,detailDialogOpen:false});
    }
    openEditDialog=(item)=>{
        this.setState({editDialogItem:item,editDialogOpen:true});
    }
    closeEditDialog=()=>{
        this.setState({editDialogItem:null,editDialogOpen:false});
    }
    closeSuccessSnackBar=()=>{
        this.setState({openSuccessSnackBar:false});
    }
    closeFailSnackBar=()=>{
        this.setState({openFailSnackBar:false});
    }
    checking=(item,image)=>{
    //this checking function not included image->can leave as default
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
    return alert_msg
  }
    submitHandler=(data,image)=>{
        console.log("receiving data",data)
        let item={...data}
        let check_res=this.checking(item,image)
        if(check_res!==""){
            this.setState({openFailSnackBar:true,failSnackBarMessage:`Insert Failed => ${check_res}missing`})
            return false
        }
        let insert_res=false;//flag to told Dialog whether it should empty the image field
        let form=new FormData();
        Object.keys(item).forEach((key)=>{
            form.append(key,data[key])
        })
        if(image){
            form.append('file',image,image?.name)
        }
        
        axios_service.update_to_productList(form)
        .then(async(res)=>{
            console.log("receive res",res.data)
            this.setState({openSuccessSnackBar:true,successSnackBarMessage:"success insert"})
            this.closeEditDialog();
            await this.fetchData();
            insert_res=true;
        })
        .catch((e)=>{
            console.log(e)
            this.setState({openFailSnackBar:true,failSnackBarMessage:`Insert Failed`})
            insert_res=false;
        })
        return insert_res;
    }
    deleteItem=(item)=>{
        if(!window.confirm('delete it?'))
            return
        console.log("deleting item",item )
        let form=new FormData();
        form.append('PID',item?.PID)
        axios_service.delete_from_productList(form)
        .then((res)=>{
            console.log("receive res",res.data)
            this.setState({openSuccessSnackBar:true,successSnackBarMessage:"success delete"})
            this.fetchData();

        })
        .catch((e)=>{
            this.setState({openFailSnackBar:true,failSnackBarMessage:"fail to delete"})
            console.log(e)
        })
    }
    render(){
        const vertical='top',horizontal='center'
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
        <Snackbar open={this.state.openSuccessSnackBar} autoHideDuration={9000} onClose={this.closeSuccessSnackBar} anchorOrigin={{vertical , horizontal}}>
                <Alert onClose={this.closeSuccessSnackBar} severity="success" sx={{ width: '100%' }}>
                    {this.state.successSnackBarMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={this.state.openFailSnackBar} autoHideDuration={9000} onClose={this.closeFailSnackBar} anchorOrigin={{vertical , horizontal}}>
                <Alert onClose={this.closeFailSnackBar} severity="error" >
                    {this.state.failSnackBarMessage}
                </Alert>
            </Snackbar>
        </>
    )}
}
import {Table,TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box,TextField,TableBody,TableContainer,TablePagination,TableFooter} from '@mui/material';
import {Component} from 'react'
import store from '../../../redux/store'
import {ImBin} from 'react-icons/im'
import {Tooltip,IconButton} from '@mui/material'
import {BsFillPencilFill,BsEyeFill} from 'react-icons/bs'
import ProductDetail from '../../../components/ProductDetail'
import EditDialog from './EditDialog';
import './index.css'
export default class AdminTable extends Component {  
    state={selectedItems:[],detailDialogOpen:false,detailDialogItem:null,editDialogOpen:false,editDialogItem:null}
    AllClick=(event)=>{
        if(event.target.checked)
            this.setState({selectedItems:[...store.getState().CartReducer.cartList]})
        else
            this.setState({selectedItems:[]})
        
    }
    checkHandler=(event,item)=>{
        if(event.target.checked){
            this.setState({selectedItems:[...this.state.selectedItems,item]})
        }else{
            let newSelectedItemsList=this.state.selectedItems.filter((obj)=>{
                return obj.id!==item.id
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
    render(){
    return(
        
        <TableContainer>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={false}
                                checked={true}
                                onChange={(e)=>this.AllClick(e)}
                            />
                            {
                                this.state.selectedItems.length>0?<button onClick={this.RemoveAllSelectedItemFromCart}>Remove Selected</button>:<div></div>
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
                {this.props.displayList.map((item)=>{
                    return (
                    <TableRow key={item.id}>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={this.state.selectedItems.findIndex((obj)=>{return obj.id===item.id})>-1}
                            onChange={(e)=>this.checkHandler(e,item)}
                        />
                    </TableCell>
                    <TableCell>
                         {item.id}
                    </TableCell>
                    <TableCell>
                        <div>
                            <img src={`../../../productPhoto/${this.props.type}/${this.props.subType}/${item.name}.jpg`} alt="not found" className="adminTable_img"></img>
                        </div>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                        {item.name}
                    </TableCell>
                    <TableCell>
                        {item.inventory}
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
                                <IconButton>
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
             <EditDialog open={this.state.editDialogOpen} closeDialog={this.closeEditDialog}/>
        </TableContainer>
    )}
}
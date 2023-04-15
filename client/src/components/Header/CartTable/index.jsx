import {Table,TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box,TextField,TableBody,TableContainer} from '@mui/material';
import {Component} from 'react'
import store from '../../../redux/store'
import {AddOneToCart,DirectSetNumToCart,RemoveOneFromCart,RemoveAllFromCart} from '../../../redux/action/cart_action'
import {ImBin} from 'react-icons/im'
import {AiOutlineMinusCircle,AiOutlinePlusCircle} from 'react-icons/ai'
import ProductDetail from '../../ProductDetail';
import imageURL from '../../../imageURL'
import './index.css'
export default class CartTable extends Component {  
    //table component inside the Cart Drawer
    state={selectedItems:[],dialogItem:null,dialogOpen:false}
    AllClick=(event)=>{
        if(event.target.checked)
            this.setState({selectedItems:[...store.getState().CartReducer.cartList]})
        else
            this.setState({selectedItems:[]})
        
    }
    RemoveAllSelectedItemFromCart=()=>{
        this.state.selectedItems.forEach((item)=>{
            store.dispatch(RemoveAllFromCart(item))
        })
        this.setState({selectedItems:[]})
    }
    AddOneToCart=(item)=>{
        store.dispatch(AddOneToCart(item))
    }
    MinusOneFromCart=(item)=>{
        store.dispatch(RemoveOneFromCart(item))
        if(item.number===1){//become 0 after -1,then remove from slect item list
             let newList=this.state.selectedItems.filter((obj)=>{
                return obj.PID!==item.PID
            })
            this.setState({selectedItems:newList})
        }
    }
    RemoveAllFromCart=(item)=>{
        store.dispatch(RemoveAllFromCart(item))
         let newList=this.state.selectedItems.filter((obj)=>{
                return obj.PID!==item.PID
            })
        this.setState({selectedItems:newList})
    }
    ItemNumChangeHandler=(item,event)=>{
        if(isNaN(event.target.value*1)||event.target.value.trim()===''||event.target.value*1>99||event.target.value*1<=0){//filter non number input and no more than 99/less than 0 items at a time
            return
        }
        let newItem={...item,orderNum:event.target.value*1}
        store.dispatch(DirectSetNumToCart(newItem))
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
    openDialog=(item)=>{
        this.setState({dialogItem:item,dialogOpen:true});
    }
    closeDialog=()=>{
        this.setState({dialogItem:null,dialogOpen:false});
    }
    render(){
        let tableHeader=[
            {
                id: 'name',
                numeric: false,
                label: 'Name',
            },
            {
                id: 'price',
                numeric: true,
                label: 'price',
            },
            {
                id: 'number',
                numeric: true,
                label: 'Number',
            },
            {
                id: 'action',
                numeric: true,
                label: 'Action',
            },
           
        ];
    return(
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={this.state.selectedItems.length > 0 && this.state.selectedItems.length < store.getState().CartReducer.cartList.length}
                                checked={store.getState().CartReducer.cartList.length > 0 && this.state.selectedItems.length === store.getState().CartReducer.cartList.length}
                                onChange={(e)=>this.AllClick(e)}
                            />
                            {
                                this.state.selectedItems.length>0?<button onClick={this.RemoveAllSelectedItemFromCart}>Remove Selected</button>:<div></div>
                            }
                        </TableCell>
                        {tableHeader.map((headCell) => (
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
                {store.getState().CartReducer.cartList.map((item)=>{
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
                        <div>
                            <img src={`${imageURL}/${item?.PID}`} alt="not found" 
                            className="CartTable_itemImg" onClick={()=>this.openDialog(item)}></img>
                        </div>
                        {item.name}
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                        <TextField 
                            value={item.orderNum}
                            onChange={(event)=>this.ItemNumChangeHandler(item,event)}
                            className="CartTable_itemtextField"
                        />
                        </TableCell>
                        <TableCell >
                            <button className="CartTable_btn"><AiOutlineMinusCircle onClick={()=>this.MinusOneFromCart(item)} size={28} className="CartTable_icon"/></button>
                            <button className="CartTable_btn"><AiOutlinePlusCircle onClick={()=>this.AddOneToCart(item)} size={28} className="CartTable_icon"/></button>
                            <button className="CartTable_btn"><ImBin onClick={()=>this.RemoveAllFromCart(item)} size={28} className="CartTable_icon"/></button>
                        </TableCell>
                    </TableRow>
                    )
                })}
                </TableBody>
            </Table>  
             <ProductDetail {...this.state.dialogItem} 
             open={this.state.dialogOpen} openDialog={this.openDialog} closeDialog={this.closeDialog} /> 
        </TableContainer>
    )}
}
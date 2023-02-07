import {Table,TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box,TextField,TableBody,TableContainer,TablePagination,TableFooter} from '@mui/material';
import {Component} from 'react'
import store from '../../../redux/store'
import {ImBin} from 'react-icons/im'
import {AiOutlineMinusCircle,AiOutlinePlusCircle} from 'react-icons/ai'
import './index.css'
export default class AdminTable extends Component {  
    state={selectedItems:[]}
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
                    <TableCell><div><img src={`../../../../productPhoto/${item.type}/${item.subType}/${item.name}.jpg`} alt="not found"></img></div>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                        <TextField 
                            value={item.number}
                            onChange={(event)=>this.ItemNumChangeHandler(item,event)}
                        />
                        </TableCell>
                        <TableCell>
                            <AiOutlineMinusCircle  size={28}/>
                            <AiOutlinePlusCircle  size={28}/>
                            <ImBin  size={28}/>
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
        </TableContainer>
    )}
}
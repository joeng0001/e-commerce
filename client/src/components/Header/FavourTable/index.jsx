import {Table,TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box,TableBody,TableContainer} from '@mui/material';
import {Component} from 'react'
import store from '../../../redux/store'
import {RemoveFromFavour} from '../../../redux/action/favour_action'
import {ImBin} from 'react-icons/im'
import './index.css'
export default class FavourTable extends Component {  
    state={selectedItems:[]}
    AllClick=(event)=>{
        if(event.target.checked)
            this.setState({selectedItems:[...store.getState().FavourReducer.favourList]})
        else
            this.setState({selectedItems:[]})
        
    }
    RemoveAllSelectedItemFromFavour=()=>{
        this.state.selectedItems.forEach((item)=>{
            store.dispatch(RemoveFromFavour(item))
        })
        this.setState({selectedItems:[]})
    }
    RemoveFromFavour=(item)=>{
        store.dispatch(RemoveFromFavour(item))
         let newList=this.state.selectedItems.filter((obj)=>{
                return obj.id!==item.id
            })
        this.setState({selectedItems:newList})
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
                                indeterminate={this.state.selectedItems.length > 0 && this.state.selectedItems.length < store.getState().FavourReducer.favourList.length}
                                checked={store.getState().FavourReducer.favourList.length > 0 && this.state.selectedItems.length === store.getState().FavourReducer.favourList.length}
                                onChange={(e)=>this.AllClick(e)}
                            />
                            {
                                this.state.selectedItems.length>0?<button onClick={this.RemoveAllSelectedItemFromFavour}>Remove Selected</button>:<div></div>
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
                {store.getState().FavourReducer.favourList.map((item)=>{
                    return (
                    <TableRow key={item.id}>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={this.state.selectedItems.findIndex((obj)=>{return obj.id===item.id})>-1}
                            onChange={(e)=>this.checkHandler(e,item)}
                        />
                    </TableCell>
                    <TableCell><div><img src={`../../../../productPhoto/${item.type}/${item.subType}/${item.name}.jpg` } alt="not found"className="CartTable_itemImg"></img></div>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                        <TableCell>
                            <button><ImBin onClick={()=>this.RemoveFromFavour(item)} size={28} className="FavourTable_icon"/></button>
                        </TableCell>
                    </TableRow>
                    )
                })}
                </TableBody>
            </Table>  
        </TableContainer>
    )}
}
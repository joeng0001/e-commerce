import {TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box} from '@mui/material';
import {Component} from 'react'
import store from '../../../redux/store'
import {AddToCart} from '../../../redux/action/cart_action'
export default class CartTable extends Component {  
    // store.subscribe(()=>{ //whenever store data change
    //     this.setState({}); //call setState to trigger render -> cannot call render manually
    // this.forceUpdate();
    // })
    //const cart_list=store.getState
    //store.dispatch(AddToStore(value))
    AllClick=()=>{
        console.log("all click")
    }
    AddCartHandler=()=>{
        store.dispatch(AddToCart('1'))
    }
    render(){
        let rowCount=5;
        let numSelected=3;
        let headCells=[
            {
                id: 'name',
                numeric: false,
                label: 'Name',
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
    <TableHead>
        <TableRow>
            <TableCell padding="checkbox">
            <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={this.AllClick}
                inputProps={{
                'aria-label': 'select all desserts',
                }}
            />
            </TableCell>
            {headCells.map((headCell) => (
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'none' : 'left'}
                >
                    <TableSortLabel
                        active={false}
                        direction={false? 'asc': 'asc'}
                    >
                    {headCell.label}
                    {true? (
                        <Box component="span">
                        </Box>
                    ) : null}
                    </TableSortLabel> 
                </TableCell>
            ))} 
        </TableRow>
    </TableHead>
    
    )}
}
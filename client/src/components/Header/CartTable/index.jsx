import {TableCell,TableHead,TableRow,Checkbox,TableSortLabel,Box} from '@mui/material';
import {Component} from 'react'
export default class CartTable extends Component {  
    AllClick=()=>{
        console.log("all click")
    }
    render(){
        let rowCount=5;
        let numSelected=3;
        let headCells=[
            {
                id: 'name',
                numeric: false,
                disablePadding: true,
                label: 'Dessert (100g serving)',
            },
            {
                id: 'number',
                numeric: true,
                disablePadding: false,
                label: 'Calories',
            },
            {
                id: 'fat',
                numeric: true,
                disablePadding: false,
                label: 'Fat (g)',
            },
            {
                id: 'carbs',
                numeric: true,
                disablePadding: false,
                label: 'Carbs (g)',
            },
            {
                id: 'protein',
                numeric: true,
                disablePadding: false,
                label: 'Protein (g)',
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
                        onClick={console.log('haha')}
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
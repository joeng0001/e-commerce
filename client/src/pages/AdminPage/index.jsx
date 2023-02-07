import './index.css'
import React from 'react'
import Drawer from './Drawer'
import AdminTable from './Table'
import {productList} from '../../sampleData'
export default function AdminPage() {
    //this component manage most of the state of drawer and table
    //so that drawer and table can pass data through this component
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currType, setcurrType] = React.useState('food');
    const [currSubType, setcurrSubType] = React.useState('new');
    const [displayList,setDisplayList]=React.useState(productList[currType][currSubType]?.slice(0,5));
    const [tablePage,setTablePage]=React.useState(0);
    const [tableRowsNum,setTableRowsNum]=React.useState(5);
    const open = Boolean(anchorEl); 
    const typeChange=(event)=>{
        setAnchorEl(event.currentTarget);
        setcurrType(event.target.textContent)
    }

    const subTypeChange=(event)=>{
        setAnchorEl(null)
        setcurrSubType(event.target.textContent)
        setDisplayList(productList[currType][event.target.textContent]?.slice(tablePage*tableRowsNum,tablePage*tableRowsNum+tableRowsNum))
        setTablePage(0)
    }
    const tablePageChange=(event,newpage)=>{
        setTablePage(newpage)
        setDisplayList(productList[currType][currSubType]?.slice(newpage*tableRowsNum,newpage*tableRowsNum+tableRowsNum))
    }
    const tableRowsChange=(event)=>{
        setTableRowsNum(parseInt(event.target.value, 10));
        setTablePage(0); 
        setDisplayList(productList[currType][currSubType]?.slice(tablePage*event.target.value,tablePage*event.target.value+parseInt(event.target.value)))
    }
    return (
        <div className="Admin_page">
            <Drawer  anchorEl={anchorEl} currType={currType} open={open} typeChange={typeChange} subTypeChange={subTypeChange}/>
            <div className="dashBoard">this is the dashboard
            <AdminTable displayList={displayList} listLength={productList[currType][currSubType]?productList[currType][currSubType]?.length:1} tablePage={tablePage}
             tableRowsNum={tableRowsNum} tablePageChange={tablePageChange} tableRowsChange={tableRowsChange}/>
            </div>
        </div>
    );
}
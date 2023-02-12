import './index.css'
import React from 'react'
import Drawer from './Drawer'
import AdminTable from './Table'
import {productList} from '../../sampleData'
import {useState} from 'react'
import store from '../../redux/store'
export default function AdminPage() {
    //this component manage most of the state of drawer and table
    //so that drawer and table can pass data through this component
    const [forceUpdate, setForceUpdate] = useState(false);
    store.subscribe(()=>{
        setForceUpdate(!forceUpdate)
    })

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currType, setcurrType] = React.useState('food');
    const [currSubType, setcurrSubType] = React.useState('new');
    const [displayList,setDisplayList]=React.useState(productList[currType][currSubType]?.slice(0,5));
    const [tablePage,setTablePage]=React.useState(0);
    const [tableRowsNum,setTableRowsNum]=React.useState(5);
    const tableHeader=[
            {   id:'id',
                numeric:true,
                label:'ID',
            }
            ,
            {
                id: 'img',
                numeric: false,
                label: 'Image',
            },
            {
                id: 'price',
                numeric: true,
                label: 'Price',
            },
            {
                id: 'name',
                numeric: true,
                label: 'Name',
            },
            {
                id:'stock',
                numeric:true,
                label:'Stock'
            },
            {
                id: 'action',
                numeric: true,
                label: 'Action',
            },
           
        ];
    const open = Boolean(anchorEl); 
    const typeClick=(event)=>{
        setAnchorEl(event.currentTarget);
    }
    const closeMenu=()=>{
        setAnchorEl(null);
    }
    const subTypeChange=(event,type)=>{
        setAnchorEl(null)
        setcurrType(type)
        setcurrSubType(event.target.textContent)
        setDisplayList(productList[type][event.target.textContent]?.slice(tablePage*tableRowsNum,tablePage*tableRowsNum+tableRowsNum))
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
            <Drawer  anchorEl={anchorEl} currType={currType} open={open} typeClick={typeClick} subTypeChange={subTypeChange} closeMenu={closeMenu}/>
            <div className="dashBoard">this is the dashboard
            <AdminTable displayList={displayList} listLength={productList[currType][currSubType]?productList[currType][currSubType]?.length:1} tablePage={tablePage}
             tableRowsNum={tableRowsNum} tablePageChange={tablePageChange} tableRowsChange={tableRowsChange} type={currType} subType={currSubType} tableHeader={tableHeader}/>
            </div>
        </div>
    );
}
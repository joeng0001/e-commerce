import './index.css'
import React from 'react'
import Drawer from './Drawer'
import AdminTable from './Table'
import ButtonList from './ButtonList'
import store from '../../redux/store'
import { useSearchParams} from 'react-router-dom'
export default function AdminPage() {
    //this component manage most of the state of drawer and table
    //so that drawer and table can pass data through this component

    //for Drawer Component
    const [search,setSearch]=useSearchParams();//get the query url
    const [anchorEl, setAnchorEl] = React.useState(null);//while select category,a menu show up,anchor element will point to that category button such the menu appear right below the button
    const [currType, setcurrType] = React.useState(//set the type according to query cid,if not found,set to default(the first category)
                store.getState().CategoryReducer.CIDList.find(obj=>obj.CID===search.get('cid'))?
                store.getState().CategoryReducer.CIDList.find(obj=>obj.CID===search.get('cid'))?.NAME:
                store.getState().CategoryReducer.CIDList[0]?.NAME)
    const [currSubType, setcurrSubType] = React.useState(store.getState().CategoryReducer.CIDList.find(obj=>obj.NAME===currType)?.subCategories?.split(",")[0]);//set subCategory to the default(first subCategory)
    
    
    //for Table Component
    const [displayList,setDisplayList]=React.useState(store.getState().ItemReducer.itemList[currType][currSubType]?.slice(0,5));//list to display in Table according to category/subCategory
    const [tablePage,setTablePage]=React.useState(0);//current page of table,start from 0
    const [tableRowsNum,setTableRowsNum]=React.useState(5);//number of items to show in table,default 5
    const [listLength,setListLength]=React.useState(store.getState().ItemReducer.itemList[currType][currSubType]?.length??1);//length of displayList,default 1
    store.subscribe(()=>{
        //while store change->admin add a subCategory/item,reset subType and list to display in table to check update
        setcurrSubType(store.getState().CategoryReducer.CIDList.find(obj=>obj.NAME===currType)?.subCategories?.split(",")[0])
        setDisplayList(store.getState().ItemReducer.itemList[currType][currSubType]?.slice(0,tableRowsNum))
    })
    const tableHeader=[//header of table
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
    const open = Boolean(anchorEl);//set menu display depends on anchorEl existence
    const typeClick=(event)=>{
        //while selecting category,set Anchor element to the button
        setAnchorEl(event.currentTarget);
    }
    const closeMenu=()=>{
        //close menu by remove Anchor element
        setAnchorEl(null);
    }
    const subTypeChange=(event,type)=>{
        //after select a subType->close menu,save category and subCategory,update display list and it's length,move to page 1,update URL with cid
        setAnchorEl(null)
        setcurrType(type)
        setcurrSubType(event.target.textContent)
        setDisplayList(store.getState().ItemReducer.itemList[type][event.target.textContent]?.slice(0,tableRowsNum))
        setListLength(store.getState().ItemReducer.itemList[type][event.target.textContent]?.length)
        setTablePage(0)
        const CID=store.getState().CategoryReducer.CIDList.find(obj=>obj.NAME===type)?.CID
        setSearch(`cid=${CID?CID:1}`)
    }
    const tablePageChange=(event,newpage)=>{
        //while select a new page in table,store the page number,update display list and ;ength
        setTablePage(newpage)
        setDisplayList(store.getState().ItemReducer.itemList[currType][currSubType]?.slice(newpage*tableRowsNum,newpage*tableRowsNum+tableRowsNum))
        setListLength(store.getState().ItemReducer.itemList[currType][currSubType]?.length)
    }
    const tableRowsChange=(event)=>{
        //while changing number of item to display in table,save the rows number,move to page 1,update display list and it's length
        setTableRowsNum(parseInt(event.target.value, 10));
        setTablePage(0); 
        setDisplayList(store.getState().ItemReducer.itemList[currType][currSubType]?.slice(tablePage*event.target.value,tablePage*event.target.value+parseInt(event.target.value)))
        setListLength(store.getState().ItemReducer.itemList[currType][currSubType]?.length)
    }
    return (
        <>
            <ButtonList />
            <div className="Admin_page">
                <Drawer  anchorEl={anchorEl} currType={currType} open={open} typeClick={typeClick} subTypeChange={subTypeChange} closeMenu={closeMenu}/>
                <div className="dashBoard">
                <AdminTable displayList={displayList} listLength={listLength??1} tablePage={tablePage}
                tableRowsNum={tableRowsNum} tablePageChange={tablePageChange} tableRowsChange={tableRowsChange} type={currType} subType={currSubType} tableHeader={tableHeader}/>
                </div>
            </div>
        </>
    );
}
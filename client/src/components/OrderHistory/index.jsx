import './index.css'
import { Dialog,DialogContent } from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import { useEffect,useState } from 'react';
import store from '../../redux/store';
import axios_service from '../../axios_service';
//!!!
//navigate to https is disable for local development testing
//

//the rows should pass via prop
export default function OrderHistory(props) {

const columns=[
    {field: "address", headerName: "Address",width: 100},
    {field: "email", headerName: "Email",width: 300},
    {field: "name", headerName: "Name",width: 150},
    {field: "currency", headerName: "Currency",width: 100},
    {field: "amount", headerName:"Amount",width: 100},
    {field:"item_name", headerName: "Item Name",width: 150},
    {field: "item_price", headerName: "Item Price",width: 100},
    {field: "item_quantity", headerName: "Item Quantity",width: 100},
    {field: "payment_time", headerName: "Payment Time",width: 200},
    {field: "payment_status", headerName: "payment Status",width: 200}

]
const [list,setList]=useState([]);
const [loading,setLoading]=useState(false)
const fetchHistoryForAdmin=()=>{
    let form=new FormData;
    form.append('userid',store.getState().SecurityReducer.userid)

    axios_service.get_order_for_admin(form)
        .then(res=>{
            let list_with_id=res.data
            let init_index=0
            list_with_id.map(item=>{
                item.id=init_index
                init_index+=1
            })
            setList(list_with_id)
            setLoading(false)
        })
        .catch(e=>{
            console.log(e)
        })
}

const fetchHistoryForClient=()=>{
    let form=new FormData;
    form.append('userid',store.getState().SecurityReducer.userid)

    axios_service.get_order_for_client(form)
        .then(res=>{
             let list_with_id=res.data
            let init_index=0
            list_with_id.map(item=>{
                item.id=init_index
                init_index+=1
            })
            setList(list_with_id)
            setLoading(false)
        })
        .catch(e=>{
            console.log(e)
        })
}

 useEffect(()=>{
    if(props.open){
        setLoading(true)
        if(props.getAll){
            fetchHistoryForAdmin()
        }else{
            fetchHistoryForClient()
        }
    }
},[props.open])

    return (
        <Dialog
                open={props.open}
                onClose={props.closeDialog}
                maxWidth='md'
                fullWidth={true}
                scroll="body"
            >
                <DialogContent  >
                    <DataGrid
                        rows={list}
                        columns={columns}
                        autoHeight={true}
                        loading={loading}
                        pagination
                        pageSizeOptions={[5,10,25,50,100]}
                        pageSize={10}
                        
                    />
                </DialogContent>
            </Dialog>
        
    );
}
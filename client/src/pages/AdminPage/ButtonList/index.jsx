import './index.css'
import React from 'react'
import { Button } from '@mui/material';
//import {subNavigationList} from '../../../sampleData'
import EditDialog from '../Table/EditDialog';
export default function ButtonList(props) {
  const [editDialogOpen,setEditDialogOpen]=React.useState(false);
  const openEditDialog=()=>{
    setEditDialogOpen(true);
  }
  const closeEditDialog=()=>{
    setEditDialogOpen(false);
  }
  return (
    <div className="ButtonList_Wrapper">
        <Button color="secondary" variant='outlined' onClick={openEditDialog}>Create item</Button>
        <Button color="secondary" variant='outlined'>Create Category</Button>
        <EditDialog item={{}} open={editDialogOpen} closeDialog={closeEditDialog}/>
    </div>
  );
}
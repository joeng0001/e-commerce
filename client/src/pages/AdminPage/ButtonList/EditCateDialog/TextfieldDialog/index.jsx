import {Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField, FormControl} from '@mui/material';
import { useState,useEffect} from 'react';
import './index.css'
export default function EditCateDialog(props){
    const [content,setContent]=useState(props.content)//store the input of textfield
    const [originContent,setOriginContent]=useState(props.content)//store the original content before modification
    const changeHandler=(e)=>{
        //store the input to content
        setContent(e.target.value);
    }
    useEffect(()=>{
        //since the component only render once,update content while props change
        setContent(props.content)
        setOriginContent(props.content)
    },[props.content])
    return(
            <Dialog
                open={props.open}
                onClose={props.closeDialog}
                maxWidth='xs'
                fullWidth={true}
                scroll="body"
            >
                <DialogTitle >{props.title}</DialogTitle>
                    <DialogContent  >
                        <FormControl>
                            <TextField required={true} label={props.title} variant="outlined"  value={content} 
                            onChange={(e)=>changeHandler(e)} autoFocus={true} className="TextFieldDialog_textfield"/>
                        </FormControl>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={props.closeDialog}>
                            Back
                        </Button>
                        <Button onClick={()=>{
                            props.submitHandler(content,originContent)
                            setContent("")
                            props.closeDialog()
                            }}>
                            Submit
                        </Button>
                    </DialogActions>
            </Dialog>
    )
}
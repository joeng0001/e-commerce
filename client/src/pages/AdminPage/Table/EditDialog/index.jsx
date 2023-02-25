import {Dialog,DialogTitle,DialogContent,DialogActions,Button,FormHelperText,TextField,MenuItem} from '@mui/material';
import { useState ,useEffect,useRef} from 'react';
import store from '../../../../redux/store';
import imageURL from '../../../../imageURL'
import './index.css'
export default function EditDialog(props){
    const [fileURL, setFileURL] = useState(`${imageURL}/${props.item?.PID}`);//url to get the image
    const [file,setFile]=useState(null)//store the upload file/image
    const [imgName,setImgName]=useState('not selected');//store name of uploaded file name
    const [item,setItem]=useState(props.item); //props item cannot be modofied->create item instance to store data and enable modification
    const inputRef=useRef()//ref to <input> element that is hide behind the upload button
    const CIDList=store.getState().CategoryReducer.CIDList //list of {CID,categoryr,subCategories}
    //list of subCategories according to the category of item
    const [subTypeList,setSubTypeList]=useState(item?.category?CIDList.find(obj=>obj.NAME===item.category)?.subCategories?.split(","):CIDList[0]?.subCategories.split(","))
    const fileSelect=(e)=> {
        //handler of input file select,store to state
        if(e.target.files){
            setImgName(e.target.files[0]?.name)
            setFileURL(URL.createObjectURL(e.target.files[0]));
            setFile(e.target.files[0])
        }     
    }
    const fileUpdate=(e)=> {
        //handler of drag and drop file upload,store to state
        e.preventDefault();
        if(e.dataTransfer.files){
            setImgName(e.dataTransfer.files[0]?.name)
            setFileURL(URL.createObjectURL(e.dataTransfer.files[0]));   
            setFile(e.target.files[0])
        }
        
    }
    const fileDragOver=e=>{
        //prevent browser default open imager in new tab for drag and drop
        e.preventDefault();
    }
    const btnClickHanlder=()=>{
        //handler of button click,trigger input file selection
        inputRef.current.click()
    }
    const submitHandler=()=>{
        //handler of submit button,call props handler to submit via axios and close dialog
        let data={...item}
        props.submitHandler(data,file);
        props.closeDialog();
    }
    const inputHandler=(e,type)=>{
       //whenever inputing,store to state
        let newItem={...item}
        //if category change,give subCategory to the first subCategory as ddefault
        if(type==='category'&&e.target.value!==item?.category){
            newItem['subCategory']=CIDList.find(obj=>obj.NAME===e.target.value)?.subCategories.split(",")[0]
            newItem['CID']=CIDList.find(obj=>obj.NAME===e.target.value)?.CID
        }
        newItem[type]=e.target.value
        setItem(newItem)
    }
    const cleanState=()=>{
        //after closing dialog,reset all state
        setFileURL(null);
        setItem(null);
        setImgName('not selected');
    }
    //since this dialog only render once
    //need effect hook to monitor props.item
     useEffect(()=>{
       setItem(props.item)
       //if props.item have category->editing instead of creating, set imageURL and subType
        if(props.item?.category){
                setFileURL(`${imageURL}/${props.item?.PID}`)
                setSubTypeList(CIDList.find(obj=>obj.NAME===props.item.category)?.subCategories?.split(","))
        }else{
            //else -> creating new item->give default categtory to the new item
                setItem({...props.item,category:CIDList[0]?.NAME,subCategory:CIDList[0]?.subCategories.split(",")[0]})
                setFileURL(null)
                setSubTypeList(CIDList[0]?.subCategories?.split(","))
        }
       return ()=>{
        //before unmount,clean state
        cleanState();
       }
    },[props.item,CIDList])
    return(
        <Dialog
          open={props.open}
          onClose={()=>{
            props.closeDialog();
            cleanState();}}
          maxWidth='lg'
          fullWidth={true}
          scroll="body"
        >
            <DialogTitle ><div className="EditDialog_title">Editing</div></DialogTitle>
                <DialogContent className="EditDialog_contentWrapper">
                        <div className="EditDialog_leftContent"> 
                            <Button variant='contained' onClick={btnClickHanlder} >
                                Click to upload file
                                <input  ref={inputRef} type='file' accept="image/png,image/gif,image/jpg"  onChange={(e)=>fileSelect(e)} className="EditDialog_imgInput"/>
                            </Button>
                            <br/>
                            <img
                                onDrop={(e)=>fileUpdate(e)}//handle file upload
                                onDragOver={e=>fileDragOver(e)} //prevent browser auto open file while drag event trigger
                                className="EditDialog_imgUploadArea"
                                src={fileURL}
                                alt=" or drag and drop your file here"
                            >      
                            </img>
                            <FormHelperText >{imgName}</FormHelperText>
                            <TextField required={true} label="Name" variant="outlined" margin="dense" onChange={(e)=>inputHandler(e,'name')} defaultValue={props.item?.name}/>
                            <TextField required={true} label="PrevPrice" variant="outlined" margin="dense" onChange={(e)=>inputHandler(e,'prevPrice')} defaultValue={props.item?.prevPrice}/>
                            <TextField required={true} label="Price" variant="outlined" margin="dense" onChange={(e)=>inputHandler(e,'price')} defaultValue={props.item?.price}/>
                            <TextField required={true} label="Stock" variant="outlined" margin="dense" onChange={(e)=>inputHandler(e,'inventory')} defaultValue={props.item?.inventory}/>
                            
                         </div> 
                        <div className="EditDialog_rightContent"> 
                            <TextField required={true} label="Description" variant="outlined" className="EditDialog_formComponent" 
                            onChange={(e)=>inputHandler(e,'description')} defaultValue={props.item?.description} 
                            multiline={true}  rows={10} margin="dense"/>
                            <TextField
                                select
                                label="Type"
                                value={item?.category||CIDList[0]?.NAME}
                                helperText="Please select type"
                                onChange={(e)=>{
                                    inputHandler(e,'category')
                                    setSubTypeList(CIDList.find(obj=>obj.NAME===e.target.value)?.subCategories.split(","))
                                }}
                                margin="dense"  
                                >
                                {CIDList?.map((option) => 
                                    (
                                    <MenuItem key={option.CID} value={option.NAME} >
                                        {option.NAME}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Subtype"
                                value={item?.subCategory?item?.subCategory:CIDList[0]?.subCategories.split(",")[0]}
                                helperText="Please select subtype"
                                onChange={(e)=>{
                                    inputHandler(e,'subCategory')
                                }}
                                margin="dense"
                                >
                                    {subTypeList?subTypeList?.map((option) => 
                                    (
                                        <MenuItem key={option} value={option} >
                                            {option}
                                        </MenuItem>
                                    )):
                                    <MenuItem>
                                            
                                    </MenuItem>
                                    
                                    }
                            </TextField>
                            <TextField required={true} label="comeFrom" variant="outlined" margin="dense" onChange={(e)=>inputHandler(e,'comeFrom')} defaultValue={props.item?.comeFrom}/>
                        </div>
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={props.closeDialog}>
                        Back
                    </Button>
                    <Button onClick={submitHandler}>
                        Submit
                    </Button>
                </DialogActions>
        </Dialog>
    )
}
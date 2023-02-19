import {Dialog,DialogTitle,DialogContent,DialogActions,Button,FormControl,FormHelperText,TextField,MenuItem} from '@mui/material';
import { useState ,useEffect,useRef} from 'react';
import store from '../../../../redux/store';
import imageURL from '../../../../imageURL'
import './index.css'
export default function EditDialog(props){
    const [fileURL, setFileURL] = useState(`${imageURL}/${props.item?.PID}`);
    const [file,setFile]=useState(null)
    const [imgName,setImgName]=useState('not selected');
    //props item cannot be modofied->create item instance to store data
    const [item,setItem]=useState(props.item);
    const ref=useRef()
    const CIDList=store.getState().CategoryReducer.CIDList
    const [subTypeList,setSubTypeList]=useState(item?.category?CIDList.find(obj=>obj.NAME===item.category)?.subCategories?.split(","):
        CIDList[0]?.subCategories.split(","))
    const fileSelect=(e)=> {
        if(e.target.files){
            setImgName(e.target.files[0]?.name)
            setFileURL(URL.createObjectURL(e.target.files[0]));
            setFile(e.target.files[0])
        }
        
    }
    const fileUpdate=(e)=> {
        e.preventDefault();
        if(e.dataTransfer.files){
            setImgName(e.dataTransfer.files[0]?.name)
            setFileURL(URL.createObjectURL(e.dataTransfer.files[0]));   
            setFile(e.target.files[0])
        }
        
    }
    const fileDragOver=e=>{
        e.preventDefault();
    }
    const btnClickHanlder=()=>{
        ref.current.click()
    }
    const submitHandler=()=>{
        const data={...item}
        console.log("data is",data)
        if(props.submitHandler(data,file)){
            //if return true=>success update
            //reset image
            //item will be auto reset in new props.item editing
            setFileURL(null)
            setFile(null)
            setImgName('not selected')
        }
        
    }
    const inputHandler=(e,type)=>{
       
        let newItem={...item}
         if(type==='category'&&e.target.value!==item?.category){
            //if category change,reset subCategory to the first subCategory of the category 
            newItem['subCategory']=CIDList.find(obj=>obj.NAME===e.target.value)?.subCategories.split(",")[0]
            newItem['CID']=CIDList.find(obj=>obj.NAME===e.target.value)?.CID
        }
        newItem[type]=e.target.value
        setItem(newItem)
    }
    const cleanState=()=>{
        setFileURL(null);
        setItem(null);
        setImgName('not selected');
    }
    //since this dialog only render once
    //need effect hook to monitor props.item
     useEffect(()=>{
       setItem(props.item)
       if(props.item?.category){
         setFileURL(`${imageURL}/${props.item?.PID}`)
         setSubTypeList(CIDList.find(obj=>obj.NAME===props.item.category)?.subCategories?.split(","))
       }else{
            setItem({...props.item,category:CIDList[0]?.NAME,subCategory:CIDList[0]?.subCategories.split(",")[0]})
            setFileURL(null)
            setSubTypeList(CIDList[0]?.subCategories?.split(","))
       }
       return ()=>{
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
                        <FormControl className="EditDialog_leftContent">
                            <Button variant='contained' onClick={btnClickHanlder} className="EditDialog_formComponent" >
                                Click to upload file
                                <input  ref={ref} type='file' accept="image/png,image/gif,image/jpg"  onChange={(e)=>fileSelect(e)} className="EditDialog_imgInput"/>
                            </Button>
                            <img
                                onDrop={(e)=>fileUpdate(e)}//handle file upload
                                onDragOver={e=>fileDragOver(e)} //prevent browser auto open file while drag event trigger
                                className="EditDialog_imgUploadArea"
                                src={fileURL}
                                alt=" or drag and drop your file here"
                            >      
                            </img>
                            <FormHelperText >{imgName}</FormHelperText>
                            <TextField required={true} label="Name" variant="outlined" className="EditDialog_formComponent" onChange={(e)=>inputHandler(e,'name')} defaultValue={props.item?.name}/>
                            <TextField required={true} label="PrevPrice" variant="outlined" className="EditDialog_formComponent" onChange={(e)=>inputHandler(e,'prevPrice')} defaultValue={props.item?.prevPrice}/>
                            <TextField required={true} label="Price" variant="outlined" className="EditDialog_formComponent" onChange={(e)=>inputHandler(e,'price')} defaultValue={props.item?.price}/>
                            <TextField required={true} label="Stock" variant="outlined" className="EditDialog_formComponent" onChange={(e)=>inputHandler(e,'inventory')} defaultValue={props.item?.inventory}/>
                            
                        </FormControl>
                        <FormControl className="EditDialog_rightContent">
                            <TextField required={true} label="Description" variant="outlined" className="EditDialog_description" 
                            onChange={(e)=>inputHandler(e,'description')} defaultValue={props.item?.description} 
                            multiline={true}  rows={10}/>
                            <TextField
                                select
                                label="Type"
                                value={item?.category||CIDList[0]?.NAME}
                                helperText="Please select type"
                                onChange={(e)=>{
                                    inputHandler(e,'category')
                                    setSubTypeList(CIDList.find(obj=>obj.NAME===e.target.value)?.subCategories.split(","))
                                }}
                                    
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
                            <TextField required={true} label="comeFrom" variant="outlined" className="EditDialog_formComponent" onChange={(e)=>inputHandler(e,'comeFrom')} defaultValue={props.item?.comeFrom}/>
                        </FormControl>
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
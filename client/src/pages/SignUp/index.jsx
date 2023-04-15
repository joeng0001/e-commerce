import './index.css'
import {useState,createRef} from 'react'
import store from '../../redux/store'
import {useNavigate} from 'react-router-dom';
import axios_service from '../../axios_service';
import {GiSeaDragon} from 'react-icons/gi'
import {RiUserAddLine} from 'react-icons/ri'
import { Button,Tooltip } from '@mui/material'
import SnackBar from '../../components/SnackBar'
export default function SignUp() {
    let MailRef=createRef()//Ref to email input box
    let PwRef=createRef()//Ref to password input box
    let SecondPwRef=createRef()//Ref to password input box
    const navigate = useNavigate();

    const[openSnackBar,setOpenSnackBar]=useState(false);//control snack bar
    const[snackBarMessage,setSnackBarMessage]=useState("");//message display in  snack bar
    const[snackBarSeverity,setSnackBarSeverity]=useState(true); //type of snack bar,true for success,false for error

    const checking=(mail,pw,secondPw)=>{
        //perform simple checking before sending request to server
        //not included image->can leave as default while updating an product
        let message="";
        // eslint-disable-next-line
        if(!(/^[\w\-\/][\w\'\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$/.test(mail))){
            message+="mail format incorrect ";
        }
        if(!(/^[a-zA-Z\d_]{8,20}$/.test(pw))){
            message+="password format incorrect ";
        }
        if(pw!==secondPw){
            message+="2 password not match"
        }
        return message
    }

    const closeSnackBar=()=>{
        setOpenSnackBar(false)
    }
    const signUp=()=>{
        let check_res=checking(MailRef.current.value,PwRef.current.value,SecondPwRef.current.value)
        if(check_res){
            //not pass checking
            setSnackBarSeverity(false)
            setSnackBarMessage(check_res)
            setOpenSnackBar(true)
        }

        let form=new FormData();
        form.append('email',MailRef.current.value)
        form.append('pw',PwRef.current.value)
        axios_service.signup(form)
        .then(res=>{
            setSnackBarSeverity(true)
            setSnackBarMessage(res.data)
            setOpenSnackBar(true)
            navigate('/login');
        })
        .catch(e=>{
            setSnackBarSeverity(false)
            setSnackBarMessage(e.response.data)
            setOpenSnackBar(true)
        })
    }



    return (
        <div className="SignUp_container">
            <div className="SignUp_panel">
                <h2><GiSeaDragon size={40}/></h2>
                <h2>Sign Up</h2>
                <Tooltip title="Email" arrow placement="top">
                    <div>
                        <input type="text" placeholder='Email' className="SignUp_inputBox" ref={MailRef}/>
                    </div>
                </Tooltip>
                <Tooltip title="Letters and Digits , 8-20 characters" arrow placement="top-end">
                    <div >
                        <input type="password"  placeholder='Password' className="SignUp_inputBox" ref={PwRef}/>
                    </div>
                </Tooltip>
                <Tooltip title="Letters and Digits , 8-20 characters" arrow placement="top-end">
                    <div >
                        <input type="password"  placeholder='Type Password Again' className="SignUp_inputBox" ref={SecondPwRef}/>
                    </div>
                </Tooltip>
                <div>
                    <Button variant="contained" color="secondary" size={"small"} className="SignUp_signUpBtn" onClick={signUp} endIcon={<RiUserAddLine/>}>SignUp</Button>
                </div>
            </div>
            <SnackBar openSnackBar={openSnackBar} closeSnackBar={closeSnackBar} severity={snackBarSeverity} message={snackBarMessage}/>
        </div>
        
    );
}
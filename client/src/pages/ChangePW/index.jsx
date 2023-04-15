import './index.css'
import {useState,createRef} from 'react'
import {useNavigate} from 'react-router-dom';
import axios_service from '../../axios_service';
import {GiSeaDragon} from 'react-icons/gi'
import { Button,Tooltip } from '@mui/material'
import { TbExchange } from 'react-icons/tb';
import SnackBar from '../../components/SnackBar'
import { Logout } from '../../redux/action/security_action';
import store from '../../redux/store';
export default function ChangePW() {
    let MailRef=createRef()//Ref to email input box
    let OriginPwRef=createRef()//Ref to password input box
    let NewPwRef=createRef()//Ref to new password input box
    let SecondPwRef=createRef()//Ref to second password input box
    const navigate = useNavigate();

    const[openSnackBar,setOpenSnackBar]=useState(false);//control snack bar
    const[snackBarMessage,setSnackBarMessage]=useState("");//message display in  snack bar
    const[snackBarSeverity,setSnackBarSeverity]=useState(true); //type of snack bar,true for success,false for error

    const checking=(mail,originPw,newPw,newSecondPw)=>{
        //perform simple checking before sending request to server
        //not included image->can leave as default while updating an product
        let message="";

        if(originPw===newPw||originPw===newSecondPw){
            message+="old password cannot equal to new password";
        }

        // eslint-disable-next-line
        if(!(/^[\w\-\/][\w\'\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$/.test(mail))){
            message+="mail format incorrect ";
        }
        if(!(/^[a-zA-Z\d_]{8,20}$/.test(originPw))||!(/^[a-zA-Z\d_]{8,20}$/.test(newPw))||!(/^[a-zA-Z\d_]{8,20}$/.test(newSecondPw))){
            message+="password format incorrect ";
        }
        if(newPw!==newSecondPw){
            message+="2 password not match"
        }
        return message
    }

    const closeSnackBar=()=>{
        setOpenSnackBar(false)
    }
    const changePW=()=>{
        let check_res=checking(MailRef.current.value,OriginPwRef.current.value,NewPwRef.current.value,SecondPwRef.current.value)
        if(check_res){
            //not pass checking
            setSnackBarSeverity(false)
            setSnackBarMessage(check_res)
            setOpenSnackBar(true)
        }

        let form=new FormData();
        form.append('email',MailRef.current.value)
        form.append('originPw',OriginPwRef.current.value)
        form.append('newPw',NewPwRef.current.value)
        form.append('newSecondPw',SecondPwRef.current.value)
        axios_service.change_pw(form)
        .then(res=>{
            axios_service.logout()
            .then(res=>{
                store.dispatch(Logout(true))
                navigate('/login');
            }).catch(e=>{
                setSnackBarSeverity(false)
                setSnackBarMessage(e.response?.data)
                setOpenSnackBar(true)
            })
        })
        .catch(e=>{
            setSnackBarSeverity(false)
            setSnackBarMessage(e.response?.data)
            setOpenSnackBar(true)
        })
    }



    return (
        <div className="ChangePW_container">
            <div className="ChangePW_panel">
                <h2><GiSeaDragon size={40}/></h2>
                <h2>Change Password</h2>
                <Tooltip title="Email" arrow placement="top">
                    <div>
                        <input type="text" placeholder='Email' className="ChangePW_inputBox" ref={MailRef}/>
                    </div>
                </Tooltip>
                <Tooltip title="Letters and Digits , 8-20 characters" arrow placement="top-end">
                    <div >
                        <input type="password"  placeholder='Origin Password' className="ChangePW_inputBox" ref={OriginPwRef}/>
                    </div>
                </Tooltip>
                <Tooltip title="Letters and Digits , 8-20 characters" arrow placement="top-end">
                    <div >
                        <input type="password"  placeholder='New Password' className="ChangePW_inputBox" ref={NewPwRef}/>
                    </div>
                </Tooltip>
                <Tooltip title="Letters and Digits , 8-20 characters" arrow placement="top-end">
                    <div >
                        <input type="password"  placeholder='Type New Password Again' className="ChangePW_inputBox" ref={SecondPwRef}/>
                    </div>
                </Tooltip>
                <div>
                    <Button variant="contained" color="secondary" size={"small"} className="ChangePW_changePWBtn" onClick={changePW} endIcon={<TbExchange/>}>Change password</Button>
                </div>
            </div>
            <SnackBar openSnackBar={openSnackBar} closeSnackBar={closeSnackBar} severity={snackBarSeverity} message={snackBarMessage}/>
        </div>
        
    );
}
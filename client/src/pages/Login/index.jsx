import './index.css'
import {useState,createRef} from 'react'
import store from '../../redux/store'
import {NavLink, useNavigate} from 'react-router-dom';
import axios_service from '../../axios_service';
import {GiSeaDragon} from 'react-icons/gi'
import {RiUserAddLine} from 'react-icons/ri'
import  {TiTickOutline} from 'react-icons/ti'
import {TbExchange} from 'react-icons/tb'
import { Button } from '@mui/material'
import SnackBar from '../../components/SnackBar'
import { addNonce, addPaypalClientID, addUserid, addUserName, changeIsAdmin, changeLoginStatus } from '../../redux/action/security_action';
export default function Login() {
  let MailRef=createRef()//Ref to email input box
  let PwRef=createRef()//Ref to password input box
  const navigate = useNavigate();
  const[openSnackBar,setOpenSnackBar]=useState(false);//control snack bar
  const[snackBarMessage,setSnackBarMessage]=useState("");//message display in  snack bar
  const[snackBarSeverity,setSnackBarSeverity]=useState(true); //type of snack bar,true for success,false for error
  const checking=(mail,pw)=>{
      let message="";
      // eslint-disable-next-line
      if(!(/^[\w\-\/][\w\'\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$/.test(mail))){
          message+="mail format incorrect ";
      }
      if(!(/^[a-zA-Z\d_]{8,20}$/.test(pw))){
          message+="password format incorrect ";
      }
      return message
    }
  const closeSnackBar=()=>{
    setOpenSnackBar(false)
  }
  const login=()=>{
      let check_res=checking(MailRef.current.value,PwRef.current.value)
      if(check_res){
          //not pass checking
          setSnackBarSeverity(false)
          setSnackBarMessage(check_res)
          setOpenSnackBar(true)
      }


      let form=new FormData();
      form.append('email',MailRef.current.value)
      form.append('pw',PwRef.current.value)
      axios_service.login(form)
      .then(res=>{
        store.dispatch(addNonce(res.data.nonce))
        store.dispatch(addUserid(res.data.userid))
        store.dispatch(addPaypalClientID(res.data.client_id))
        store.dispatch(changeLoginStatus(true))
        store.dispatch(addUserName(MailRef.current.value?.split('@')[0]))
        if(res.data.isAdmin===true){
          store.dispatch(changeIsAdmin(true))
          const first_cid=store.getState().CategoryReducer.CIDList[0]?.CID;
          navigate(`/adminTable?cid=${first_cid}`)
        }else{
          navigate('/home');
        }
      })
      .catch(e=>{
          setSnackBarSeverity(false)
          setSnackBarMessage(e.response?.data)
          setOpenSnackBar(true)
      })
  }



  return (
    <div className="Login_container">
      <div className="Login_panel">
          <h2><GiSeaDragon size={40}/></h2>
          <h2>Login</h2>
          <div>
            <input type="text" placeholder='Email' className="Login_inputBox" ref={MailRef}/>
          </div>
          <div >
            <input type="password"  placeholder='Password' className="Login_inputBox" ref={PwRef}/>
          </div>
          <div>
            <input type="checkbox"></input>
            <span>Remember Me</span>
            <Button variant="contained" color="success" size={"small"} className="Login_loginBtn" onClick={login} endIcon={<TiTickOutline/>}>Login</Button>
          </div>
          <div>
            <span>Not yet have account?</span>
            <NavLink to={"/signup"}><Button color="secondary" endIcon={<RiUserAddLine/>}>Sign up</Button></NavLink>
          </div>
          <div>
            <NavLink to={"/changepw"}><Button color="secondary" endIcon={<TbExchange/>}>Change Password</Button></NavLink>
          </div>
      </div>
      <SnackBar openSnackBar={openSnackBar} closeSnackBar={closeSnackBar} severity={snackBarSeverity} message={snackBarMessage}/>
    </div>
      
  );
}
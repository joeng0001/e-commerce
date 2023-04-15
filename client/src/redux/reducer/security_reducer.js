export default function securityReducer(preState={nonce:null,userid:null,userName:"Guest",loginStatus:false,isAdmin:false,paypalClientID:""},action){
    const {type,data}=action
    switch(type){
        case 'addNonce':
            return {...preState,nonce:data}
        case 'addUserid':
            return {...preState,userid:data}
        case 'addUserName':
            return {...preState,userName:data}
        case 'changeLoginStatus':
            return {...preState,loginStatus:data}
        case 'changeIsAdmin':
            return {...preState,isAdmin:data}
        case 'addPaypalClientID':
            return {...preState,paypalClientID:data}
        case 'Logout':
            return {nonce:null,userid:null,userName:"Guest",loginStatus:false,isAdmin:false}
        default:
            return {...preState}
    }
}
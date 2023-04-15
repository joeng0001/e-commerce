import {lazy} from 'react'
import {Navigate} from 'react-router-dom';


//const OrderHistory=lazy(()=>import('../pages/AdminPage/OrderHistory'))
const Payment=lazy(()=>import('../pages/Payment'))
const PaypalPayment=lazy(()=>import('../pages/Payment/Paypal'))
const AdminPage=lazy(()=>import('../pages/AdminPage'))
const ChangePW=lazy(()=>import('../pages/ChangePW'))
const SignUp=lazy(()=>import('../pages/SignUp'))
const Login=lazy(()=>import('../pages/Login'))
const Home=lazy(()=>import('../pages/Home'))
const SubNavigation=lazy(()=>import('../pages/SubNavigation'))
// eslint-disable-next-line
export default [
    
    {
        path:'/home',
        element:<Home/>,
        query:{
            
        }
    },
    {
        path:'/subNavigation/:type/:subType',
        element:<SubNavigation/>,
    },
    {
        path:'/admintable',
        element:<AdminPage/>,
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    },
    {
        path:'/changePW',
        element:<ChangePW/>
    },
    {
        path:'/payment',
        element:<Payment/>,
        children:[
            {
                path:'paypal',
                element:<PaypalPayment/>
            }
        ]
    },
    {
        path:'/*',
        element:<Navigate to="/home" replace/>,
    },

]
import Home from '../pages/Home'
import SubNavigation from '../pages/SubNavigation'
import AdminPage from '../pages/AdminPage'
import {Navigate} from 'react-router-dom';
// eslint-disable-next-line
export default [
    
    {
        path:'/home',
        element:<Home/>
    },
    {
        path:'/subnavigation/:type/:subType',
        element:<SubNavigation/>,
    },
    {
        path:'/admintable',
        element:<AdminPage/>
    },
    {
        path:'/*',
        element:<Navigate to="/home" replace/>,
    },

]
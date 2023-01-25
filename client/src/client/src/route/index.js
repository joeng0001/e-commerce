import Home from '../pages/Home'
import SubNavigation from '../pages/SubNavigation'
import {Navigate} from 'react-router-dom';
import ProductList from '../components/ProductList';
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
        path:'/*',
        element:<Navigate to="/home" replace/>,
    },

]
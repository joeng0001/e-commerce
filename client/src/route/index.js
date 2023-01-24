import Home from '../pages/Home'
import SubNavigation from '../pages/SubNavigation'
import {Navigate} from 'react-router-dom';
// eslint-disable-next-line
export default [
    {
        path:'/*',
        element:<Navigate to="/" replace/>,
    },
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/subnavigation/:type',
        element:<SubNavigation/>,
        // children:[{
        //     path:':subType',
        //     element:<ProductList/>
        // }]
    },

]
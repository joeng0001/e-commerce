import Home from '../pages/Home'
import SubNavigation from '../pages/SubNavigation'
export default [
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
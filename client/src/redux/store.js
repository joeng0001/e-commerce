import {configureStore ,combineReducers} from '@reduxjs/toolkit'
import CartReducer from './reducer/cart_reducer'
import FavourReducer from './reducer/favour_reducer'
import ItemReducer from './reducer/item_reducer'
import CategoryReducer from './reducer/category_reducer'
import HomeListReducer from './reducer/homeList_reducer'
let rootReducer=combineReducers({CartReducer,FavourReducer,ItemReducer,CategoryReducer,HomeListReducer})
export default configureStore({reducer: rootReducer})
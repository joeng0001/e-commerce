import {configureStore ,combineReducers} from '@reduxjs/toolkit'
import CartReducer from './reducer/cart_reducer'
import FavourReducer from './reducer/favour_reducer'
let rootReducer=combineReducers({CartReducer,FavourReducer})
export default configureStore({reducer: rootReducer})
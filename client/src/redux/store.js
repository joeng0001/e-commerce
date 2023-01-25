import {configureStore } from '@reduxjs/toolkit'
import CartReducer from './reducer/cart_reducer'
import FavourReducer from './reducer/favour_reducer'
export default configureStore({ reducer: FavourReducer })
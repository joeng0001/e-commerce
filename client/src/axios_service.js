import {axios_form,secure_axios_form} from "./axios_instance";
import store from "./redux/store";
const http_middleware=(data)=>{
    data.append('nonce',store.getState().SecurityReducer.nonce)
    data.append('userid',store.getState().SecurityReducer.userid)
    return data
}

const axios_instance=()=>{
    return window.location.protocol==="http"?
        axios_form:
        secure_axios_form
}
class axios_service{
    get_productList(){//fetch all product at once
        return axios_instance().get('/product_getList')
    }
    get_categoryList(){//fetch all category at once
        return axios_instance().get('/category_getList')
    }
    get_homeList(){//fetch all category that display at home at once
        return axios_instance().get('/homeList_getList')
    }
    update_to_productList(data){//update existing item
        data=http_middleware(data)
        return axios_instance().post('/product_updateToList',data)
    }
    insert_to_productList(data){//create a new item->data is a product with property
        data=http_middleware(data)
        return axios_instance().post('/product_insertToList',data)
    }
    update_to_category(data){//update existing category
        data=http_middleware(data)
        return axios_instance().post('/category_updateToList',data)
    }
    update_icon_to_category(data){//update icon of existing category
        data=http_middleware(data)
        return axios_instance().post('/category_updateIconToList',data)
    }
    insert_to_category(data){//create a new category->data is a category with property
        data=http_middleware(data)
        return axios_instance().post('/category_insertToList',data)
    }
    update_subCate_to_category(data){//update existing subCategory
        data=http_middleware(data)
        return axios_instance().post('/category_updateSubCateToList',data)
    }
    insert_subCate_to_category(data){//create a new subCategory for a exist category
        data=http_middleware(data)
        return axios_instance().post('/category_insertSubCateToList',data)
    }
    delete_from_productList(data){//delete a product from products table
        data=http_middleware(data)
        return axios_instance().post('/product_deleteFromList',data)
    }
    delete_subCate_from_category(data){//delete subCategory from categories table,abort if having items belongs to the subCate
        data=http_middleware(data)
        return axios_instance().post('/category_deleteSubCateFromList',data)
    }
    delete_from_category(data){//delete a category from categories table,abort if having items belongs to this category
        data=http_middleware(data)
        return axios_instance().post('/category_deleteFromList',data)
    }
    login(data){ //login with email and password
        return axios_instance().post('/login',data)
    }
    logout(){   //logout to clean any cookie
        return axios_instance().post('/logout')
    }
    signup(data){ //signup an account
        return axios_instance().post('/signup',data)
    }
    change_pw(data){ //change password,data included email,original password and new password
        data=http_middleware(data)
        return axios_instance().post('/change_pw',data)
    }
    create_order(data){ //return an json object -> purchase_unit
        data=http_middleware(data)
        return axios_instance().post('/create_order',data)
    }
    get_order_for_client(data){ //get detail of payment over last 5 times 
        data=http_middleware(data)
        return axios_instance().post('/get_order_for_client',data)
    }
    get_order_for_admin(data){ //get all the detail of payemnt of all client
        data=http_middleware(data)
        return axios_instance().post('/get_order_for_admin',data)
    }
    save_order(data){ //save the order info to db
        data=http_middleware(data)
        return axios_instance().post('/save_order',data)
    }
}
// eslint-disable-next-line
export default new axios_service()
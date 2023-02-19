import {axios_json,axios_form} from "./axios_instance";

class axios_service{
    get_productList(){//fetch all product at once
        return axios_json.get('/product_getList')
    }
    get_categoryList(){//fetch all category at once
        return axios_json.get('/category_getList')
    }
    get_homeList(){//fetch all category that display at home at once
        return axios_json.get('/homeList_getList')
    }
    update_to_productList(data){//update existing item
        return axios_form.post('/product_updateToList',data)
    }
    insert_to_productList(data){//create a new item->data is a product with property
        return axios_form.post('/product_insertToList',data)
    }
    update_to_category(data){//update existing category
        return axios_form.post('/category_updateToList',data)
    }
    update_icon_to_category(data){//update icon of existing category
        return axios_form.post('/category_updateIconToList',data)
    }
    insert_to_category(data){//create a new category->data is a category with property
        return axios_form.post('/category_insertToList',data)
    }
    update_subCate_to_category(data){//update existing subCategory
        return axios_form.post('/category_updateSubCateToList',data)
    }
    insert_subCate_to_category(data){//create a new subCategory for a exist category
         return axios_form.post('/category_insertSubCateToList',data)
    }
    delete_from_productList(data){//delete a product from products table
        return axios_form.post('/product_deleteFromList',data)
    }
    delete_subCate_from_category(data){//delete subCategory from categories table,aboot if having items belongs to the subCate
        return axios_form.post('/category_deleteSubCateFromList',data)
    }
    get_img(){//testing
        return axios_form.get('/get_img')
    }
}
// eslint-disable-next-line
export default new axios_service()
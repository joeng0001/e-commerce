import axios_instance from "./axios_instance";

class axios_service{
    get_productList(){//fetch all product at once
        return axios_instance.get('/product_getList')
    }
    get_categoryList(){//fetch all category at once
        return axios_instance.get('/category_getList')
    }
    get_homeList(){//fetch all category that display at home at once
        return axios_instance.get('/homeList_getList')
    }
    update_to_productList(data){//update existing item
        return axios_instance.post('/product_updateToList',data)
    }
    update_to_category(data){//update existing category
        return axios_instance.post('category_updateToList',data)
    }
    insert_to_productList(data){//create a new item->data is a product with property
        return axios_instance.post('/product_insertToList',data)
    }
    insert_to_category(data){//create a new category->data is a category with property
        return axios_instance.post('/category_insertToList',data)
    }

}

export default new axios_service
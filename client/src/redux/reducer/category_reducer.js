export default function categoryReducer(preState={categoryList:{},iconList:{}},action){
    const {type,data}=action
    switch(type){
        case 'initialCategoryList':
            return {...preState,categoryList:data}
        case 'initialIconList':
            return {...preState,iconList:data}
        default:
            return {...preState}
    }
}
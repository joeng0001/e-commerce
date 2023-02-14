export default function categoryReducer(preState={categoryList:{},iconList:{},CIDList:{}},action){
    const {type,data}=action
    switch(type){
        case 'initialCategoryList':
            return {...preState,categoryList:data}
        case 'initialIconList':
            return {...preState,iconList:data}
        case 'initialCIDList':
            return {...preState,CIDList:data}
        default:
            return {...preState}
    }
}
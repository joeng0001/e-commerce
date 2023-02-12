export default function itemReducer(preState={itemList:[]},action){
    const {type,data}=action
    switch(type){
        case 'initialItemList':
            return {...preState,itemList:data}
        default:
            return {...preState}
    }
}
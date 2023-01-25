export default function favourReducer(preState={cartList:[],favourList:[]},action){
    const {type,data}=action
    console.log('call favourreducer')
    switch(type){
        case 'AddToFavour':
            console.log({...preState,favourList:[...preState.favourList,data]})
            return {...preState,favourList:[...preState.favourList,data]}
        case 'RemoveFromFavour':
                return {...preState,favourList:(preState.favourList).filter((obj)=>{
                    return obj.id!==data.id
                })}
        default:
            return preState
    }
}

export default function favourReducer(preState={favourList:[],open:false},action){
    const {type,data}=action
    switch(type){
        case 'OpenFavourDrawer':
            return {...preState,open:data}
        case 'AddToFavour':
            return {...preState,favourList:[...preState.favourList,data]}
        case 'RemoveFromFavour':
                return {...preState,favourList:(preState.favourList).filter((obj)=>{
                    return obj.PID!==data.PID
                })}
        default:
            return preState
    }
}

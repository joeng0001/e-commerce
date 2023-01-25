export default function cartReducer(preState={cartList:[],favourList:[]},action){
    const {type,data}=action
    switch(type){
        case 'AddToCart':
            return {...preState,cartList:[...preState.cartList,data]}
        case 'RemoveFromCart':
            return ()=>{
                let res=(preState.cartList).filter((obj)=>{
                    return obj.id!==data
                });
                console.log(res)
                return res
            }
        default:
            return preState
    }
}

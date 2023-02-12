export default function cartReducer(preState={cartList:[],open:false},action){

    const {type,data}=action
    let duplicateItemIndex,newCartList;
    switch(type){
        case 'OpenCartDrawer':
            return {...preState,open:data}
        case 'AddOneToCart':
            duplicateItemIndex=preState.cartList.findIndex((item)=>{
                return item.PID===data.PID
            })
            newCartList=JSON.parse(JSON.stringify(preState.cartList));
            if (duplicateItemIndex>-1){
                if(newCartList[duplicateItemIndex].orderNum<99){
                    newCartList[duplicateItemIndex].orderNum+=1
                }
                return {...preState,cartList:newCartList}
            }
            //no match found in iist,insert to list
            return {...preState,cartList:[...preState.cartList,data]}

        case 'RemoveOneFromCart':
            duplicateItemIndex=preState.cartList.findIndex((item)=>{
                return item.PID===data.PID
            })
            newCartList=JSON.parse(JSON.stringify(preState.cartList));
            if (duplicateItemIndex>-1){
                if(newCartList[duplicateItemIndex].orderNum>1){
                    newCartList[duplicateItemIndex].orderNum-=1
                }
                return {...preState,cartList:newCartList}
            }
            return {...preState,cartList:[...preState.cartList,data]}    
        
        case 'DirectSetNumToCart':
            duplicateItemIndex=preState.cartList.findIndex((item)=>{
                return item.PID===data.PID
            })
            newCartList=JSON.parse(JSON.stringify(preState.cartList));
            if (duplicateItemIndex>-1){
                if(data.orderNum*1<=99){
                    newCartList[duplicateItemIndex].orderNum=data.orderNum*1
                }
                return {...preState,cartList:newCartList}
            }
            return {...preState,cartList:[...preState.cartList,data]}

        case 'RemoveAllFromCart':
            let res=(preState.cartList).filter((obj)=>{
                return obj.PID!==data.PID
            });
            return {...preState,cartList:res}
        default:
            return preState
    }
}

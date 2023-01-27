export default function cartReducer(preState={cartList:[],open:false},action){

    const {type,data}=action
    let duplicateItemIndex,newCartList;
    switch(type){
        case 'OpenCartDrawer':
            return {...preState,open:data}
        case 'AddOneToCart':
            duplicateItemIndex=preState.cartList.findIndex((item)=>{
                return item.id===data.id
            })
            newCartList=JSON.parse(JSON.stringify(preState.cartList));
            if (duplicateItemIndex>-1){
                if(newCartList[duplicateItemIndex].number<99){
                    newCartList[duplicateItemIndex].number+=1
                }
                return {...preState,cartList:newCartList}
            }
            //no match found in iist,init the number to 1
            data.number=1
            return {...preState,cartList:[...preState.cartList,data]}

        case 'RemoveOneFromCart':
            duplicateItemIndex=preState.cartList.findIndex((item)=>{
                return item.id===data.id
            })
            newCartList=JSON.parse(JSON.stringify(preState.cartList));
            if (duplicateItemIndex>-1){
                if(newCartList[duplicateItemIndex].number>1){
                    newCartList[duplicateItemIndex].number-=1
                }
                return {...preState,cartList:newCartList}
            }
            return {...preState,cartList:[...preState.cartList,data]}    
        
        case 'DirectSetNumToCart':
            duplicateItemIndex=preState.cartList.findIndex((item)=>{
                return item.id===data.id
            })
            newCartList=JSON.parse(JSON.stringify(preState.cartList));
            if (duplicateItemIndex>-1){
                if(data.number*1<=99){
                    newCartList[duplicateItemIndex].number=data.number*1
                }
                return {...preState,cartList:newCartList}
            }
            return {...preState,cartList:[...preState.cartList,data]}

        case 'RemoveAllFromCart':
            let res=(preState.cartList).filter((obj)=>{
                return obj.id!==data.id
            });
            return {...preState,cartList:res}
        default:
            return preState
    }
}

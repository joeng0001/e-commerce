
export default function favourReducer(preState={favourList:[],open:false},action){
    const {type,data}=action
    let originStorageFavourList,newStorageFavourList
    switch(type){
        case 'OpenFavourDrawer':
            return {...preState,open:data}
        case 'AddToFavour':
            originStorageFavourList=JSON.parse(window.localStorage.getItem("favourList"))||[]//return a list of PID list or empty list(initial state)
            newStorageFavourList=[...originStorageFavourList,data?.PID]
            window.localStorage.setItem("favourList",JSON.stringify(newStorageFavourList))
            return {...preState,favourList:[...preState.favourList,data]}
        case 'RemoveFromFavour':
            originStorageFavourList=JSON.parse(window.localStorage.getItem("favourList"))||[]//return a list of PID list or empty list
            newStorageFavourList=originStorageFavourList.filter(PID=>{//filter out the remove target
                return PID!==data?.PID
            })
            window.localStorage.setItem("favourList",JSON.stringify(newStorageFavourList))
            console.log("storing new favour list",newStorageFavourList)
            return {...preState,favourList:(preState.favourList).filter((obj)=>{
                return obj.PID!==data.PID
            })}
        case 'RestoreFavourListFromLocalStorage':
            return {...preState,favourList:data}
        default:
            return preState
    }
}

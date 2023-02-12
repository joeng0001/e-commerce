export default function HomeListReducer(preState={homeList:[]},action){
    const {type,data}=action
    switch(type){
        case 'initialHomeList':
            return {...preState,homeList:data}
        default:
            return {...preState}
    }
}
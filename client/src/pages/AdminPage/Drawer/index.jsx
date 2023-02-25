import './index.css'
import React from 'react'
import { Drawer } from '@mui/material';
import {Menu,MenuItem,Card} from '@mui/material'
import store from '../../../redux/store';
export default function LeftDrawer(props) {
  const [type, setType] = React.useState(props.currType);//get the type from props
  const subNavigationList=store.getState().CategoryReducer.categoryList;//get all category
  return (
        <Drawer
            variant="permanent"
            anchor='left'
            PaperProps={{
                sx: {
                    position:'inherit',
                }
            }}
            className="drawer"
        >
            <div className="drawer_ContentWrapper">
                {
                    Object.keys(subNavigationList).map((type)=>{
                        return (
                            <div key={type}>
                                <Card
                                    onClick={event=>{
                                        props.typeClick(event);
                                        setType(event.target.textContent)
                                    }}
                                    className="drawer_card"
                                >
                                    {type.toString()}
                                </Card>
                            </div>
                        )
                    })
                
                }
            </div>



            <Menu
                anchorEl={props.anchorEl}
                open={props.open}
                onClose={props.closeMenu}
            >
                {
                    subNavigationList[type]?.map((subtype)=>{
                        return  <MenuItem onClick={(e)=>props.subTypeChange(e,type)} key={subtype}>{subtype}</MenuItem>
                    })
                }
                
            </Menu>
        </Drawer>
  );
}
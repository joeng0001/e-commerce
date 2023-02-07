import './index.css'
import React from 'react'
import { Drawer } from '@mui/material';
import {subNavigationList} from '../../../sampleData'
import {Menu,MenuItem,Card} from '@mui/material'
export default function LeftDrawer(props) {

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
                <div>this is drawer content</div>
                {
                    Object.keys(subNavigationList).map((type)=>{
                        return (
                            // <div key={subtype.id}>{subtype.name}</div>
                            <div key={subNavigationList[type].id}>
                                <Card
                                    onClick={event=>props.typeChange(event)}
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
                    subNavigationList[props.currType]?.map((subtype)=>{
                        return  <MenuItem onClick={(e)=>props.subTypeChange(e)}>{subtype.name}</MenuItem>
                    })
                }
                
            </Menu>
        </Drawer>
  );
}
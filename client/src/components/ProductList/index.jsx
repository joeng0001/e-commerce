
import './index.css'
import {Component} from 'react'
import ProductDetail from '../ProductDetail'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
export default class ProductList extends Component {
  state={opendialogID:null}
  OpenDialogByCompareID=(id)=>{
     this.setState({opendialogID:id})
  }
  render(){
    const {type,subType,list}=this.props;

     return(
        <div className="ProductList_wrapper">
          <div className="ProductList_tableless">
            {
              list?.map((obj)=>{
                return (
                  <Card key={obj.id} className="ProductList_card">
                    <CardMedia
                      className="ProductList_image"
                      image={`../../../productPhoto/${type}/${subType}/${obj.name}.jpg`}
                      onClick={()=>this.OpenDialogByCompareID(obj.id)}
                    />
                    <CardContent>
                      <div>
                          <span className="ProductList_card_itemName" onClick={()=>this.OpenDialogByCompareID(obj.id)}>
                            {obj.name } 
                          </span>
                          &nbsp;&nbsp;&nbsp;
                          <span className="ProductList_card_itemComeFrom">
                            {obj.comeFrom}
                          </span>
                      </div>
                      <div className="ProductList_card_itemPrice">
                        ${obj.price} Now! <span className="ProductList_card_itemPrevPrice">${obj.prevPrice}</span>
                      </div>
                      
                    </CardContent>
                    <CardActions>
                        <ProductDetail {...obj} type={type} subType={subType} open={this.state.opendialogID===obj.id} OpenDialogByCompareID={this.OpenDialogByCompareID}/>{/*display a button to open a dialog*/}
                    </CardActions>
                  </Card>

              )})
            }
          </div>
        </div>      
      );
  }

}

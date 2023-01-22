
import './index.css'
import {Component} from 'react'
import ProductDetail from '../ProductDetail'
import {productList} from '../../sampleData';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
export default class ProductList extends Component {
   
  
  render(){
    const {type,subType}=this.props;
    const list = productList
     return(
        
        <div className="ProductList_wrapper">
          <div className="ProductList_tableless">
            {
              list[type][subType]?.map((obj)=>{
                return (
                  <Card key={obj.id} className="ProductList_card">
                    <CardMedia
                      className="ProductList_image"
                      image={`../../../productPhoto/${type}/${obj.name}.jpg`}
                      
                    />
                    <CardContent>
                      <div>this is contetnt
                         {obj.name} {obj.price}
                      </div>
                      
                    </CardContent>
                    <CardActions>
                        <ProductDetail {...obj} type={type}/>{/*display a button to open a dialog*/}
                    </CardActions>
                  </Card>

              )})
            }
          </div>
        </div>      
      );
  }

}

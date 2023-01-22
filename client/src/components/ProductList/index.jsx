
import './index.css'
import {Component} from 'react'
import ProductDetail from '../ProductDetail'
import {productList} from '../../sampleData';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
export default class ProductList extends Component {
   
  //@note
  //should limit the size, i.e. 15
  //in home page list,shouldn't display all of item
  //in productList page,should perform paging
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
                      <div>
                        this is content
                      </div>
                      <div>
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

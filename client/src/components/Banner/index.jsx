import {Component} from 'react'
import './index.css'
export default class Banner extends Component {
  render(){
      return (
        <div className="Banner_wrapper">
            <div className="Banner_banner">
                <span className="Banner_content">Welcome to My Shop,
                  <span className="Banner_decoration">10% off </span>for local delivery</span>
            </div>
        </div>          
      );
  }

}
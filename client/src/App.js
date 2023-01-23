import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import {
  useRoutes
} from "react-router-dom";

import routes from './route'
 function App() {
  const route=useRoutes(routes);
  return (
    <div>
      <Header />
        <div className="content_wrapper">
          {route}  
        </div>
      <Footer/>
    </div>    
  );
}

export default App;

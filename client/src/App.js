import './App.css';
import Header from './components/Header'
import Banner from './components/Banner'
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import {
  useRoutes
} from "react-router-dom";

import routes from './route'
 function App() {
  const route=useRoutes(routes);
  return (
    <div>
      <Header />
      <Banner/>
      <Navigation/>
        {route}
      
      <Footer/>
    </div>    
  );
}

export default App;

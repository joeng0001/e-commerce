//the file contain axios default configuration
import axios from "axios";

// export const axios_json = axios.create({
//   baseURL: "http://52.192.59.69/server.php",
//   headers: {
//     "Content-type": "application/json"
//   }
// });

export const axios_form = axios.create({
  //baseURL: "http://s47.ierg4210.ie.cuhk.edu.hk/server.php",
  baseURL: "http://localhost/server.php",
  headers: {
    "Content-type": "multipart/form-data"
  }
});


export const secure_axios_form=axios.create({
  baseURL: "http://localhost/server.php",
  headers: {
    "Content-type": "multipart/form-data"
  },
  withCredentials:true
})
//should create another instance for security

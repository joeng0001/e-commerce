//the file contain axios default configuration
import axios from "axios";

export default axios.create({
  baseURL: "http://52.192.59.69/server.php",
  headers: {
    "Content-type": "application/json"
  }
});


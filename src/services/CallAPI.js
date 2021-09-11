import axios from 'axios';
import * as Config from '../constants/config'

export default function CallAPI(endpoint, method='GET',body,token){
    return  axios({
        method: method,
        url: `${Config.API_URL}${endpoint}`,
        data: body,
        headers: {Authorization:`Bearer ${token}`}
        
      }).catch(err=>{

        console.log(err)
      });


};



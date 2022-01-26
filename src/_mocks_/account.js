// ----------------------------------------------------------------------
import CallAPI from './../services/CallAPI';

const account = {
  displayName: '',
  email: '',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  firstName: '',
  lastName:'',
  phone:'',
  username:'',
  id:'',
  role:''
};

function getInfo(){
  CallAPI('/users/me', 'GET', null, sessionStorage.getItem('jwt')).then(res => {
              
    account.id = res.data.id;
    account.email = res.data.email;
    account.displayName = res.data.username;
    account.photoURL='/static/mock-images/avatars/avatar_default.jpg';
    account.lastName = res.data.lastName;
    account.firstName = res.data.firstName;
    account.phone = res.data.phone;
    account.username = res.data.username;
    account.role = res.data.role.name;
}).catch(err=>{
    console.log('inside catch block.');
    if (err.response) {
        
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    console.log(JSON.stringify(err));
  });


}

getInfo();



export default account;

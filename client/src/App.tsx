import React, { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import './styles/App.css';
import { IUser } from './models/IUser';
import UserService from './service/UserService';

function App() {

  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(()=>{
    if(localStorage.getItem('token')){
      store.checkAuth()
    }
  },[])

  async function getUsers(){
    try{
      const response = await UserService.fethUsers()
      setUsers(response.data)
    } catch(e){
      console.log(e)
    }
  }



  if(store.isLoading){
    return (
      <div className="App">
      <span>Loading...</span>
      </div>
    )
  }

  if(!store.isAuth){
    return (
      <div className="App">
      <h1>{store.isAuth ? `User ${store.user.email} authorized`: `LOGIN!`}</h1>
      
      <LoginForm
  
      />
      </div>
    );
  } 
  if(!store.user.isActivated){
    return (
      <div className="App">
      <h1>{store.isAuth ? `User ${store.user.email} authorized`: `LOGIN!`}</h1>
      {!store.user.isActivated ? <h1>verify your account by {store.user.email} </h1> : ''}

        <button onClick={()=>store.logout()}>logout</button>
        {/* <button onClick={()=>getUsers()}>Users List</button>
        
        {users.map(user =>
         <div key={user.id}>{user.email}</div>
          )} */}
        
      </div>
    );
  }
    return (
      <div className="App">
      <h1>{store.isAuth ? `User ${store.user.email} authorized`: `LOGIN!`}</h1>
      {!store.user.isActivated ? <h1>verify your account by {store.user.email} </h1> : ''}

        <button onClick={()=>store.logout()}>logout</button>
        <button onClick={()=>getUsers()}>Users List</button>
        
        {users.map(user =>
         <div key={user.id}>{user.email}</div>
          )}
        
      </div>
    );
  
}

export default observer(App);

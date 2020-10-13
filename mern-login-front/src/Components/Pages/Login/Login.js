import React, { useState, useContext } from 'react'
import Axios from 'axios'
import UserContext from '../../../context/UserContext'
import { useHistory } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {setUserData} = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    // creo un objeto con los datos de el nuevo usuario
    const loginUser = {
      email, password
    };
    // send data to backend db
    const loginRes = await Axios.post("http://localhost:5000/users/login",
     loginUser
     );
    //Actualizo el context con los datos del usuario nuevo registrado y logeado
     setUserData({
       token:loginRes.data.token,
       user:loginRes.data.user,
     });
     // guardar el token en el localstorage
     localStorage.setItem("auth-token", loginRes.data.token)
     //mandar al home despues de logear
     history.push("/")
    };
  return (
    <>
      <form onSubmit={submit}>
       <h2>Log In</h2>
       <label htmlFor="Email">Email</label>
       <input value={email} onChange={e => setEmail(e.target.value)} id="login-email" type="email" placeholder="Email"/> <br/>
       
       <label htmlFor="Password">Password</label>
       <input value={password} onChange={e => setPassword(e.target.value)} id="Login-password" type="password" placeholder="Password"/> <br/>
       
       <input type="submit" value="Login"/>
    </form>
    </>
  )
}

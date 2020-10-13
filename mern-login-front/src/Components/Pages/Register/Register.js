import React, { useState, useContext } from 'react'
import Axios from 'axios'
import UserContext from '../../../context/UserContext'
import { useHistory } from "react-router-dom";
import ErrorNotice from '../../Misc/ErrorNotice';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState();

  const {setUserData} = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    try {
    e.preventDefault();
    // creo un objeto con los datos de el nuevo usuario
    const newUser = {
      email, password, passwordCheck, displayName
    };
    // send data to backend db
    await Axios.post("http://localhost:5000/users/register",
     newUser
     );
     // send login data to login route to get token and login the user
     const loginRes = await Axios.post("http://localhost:5000/users/login",{
        email,
        password
     });
     //Actualizo el context con los datos del usuario nuevo registrado y logeado
     setUserData({
       token:loginRes.data.token,
       user:loginRes.data.user,
     });
     localStorage.setItem("auth-token", loginRes.data.token)
     // Luego lo redirijo a home
     history.push("/")
    } catch(err){
      //reviso si hay un error y lo pongo en el state para luego mostrarlo
      err.response.data.msg && setError(err.response.data.msg);
    }
    };
  return (
    <>
    <form onSubmit={submit}>
       <h2>Register</h2>
       {
         // si error no es undefined mostrar el error
         error && <ErrorNotice message={error} clearError={() => setError(undefined)} />
       }
       <label htmlFor="Email">Email</label>
       <input value={email} onChange={e => setEmail(e.target.value)} id="register-email" type="email" placeholder="Email"/> <br/>
       
       <label htmlFor="Password">Password</label>
       <input value={password} onChange={e => setPassword(e.target.value)} id="register-password" type="password" placeholder="Password"/> <br/>
       
       <label htmlFor="Verify-Password">Verify Password</label>
       <input value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} type="password" placeholder="Verify password"/><br/>

       <label htmlFor="Password">Nombre de Usuario</label>
       <input value={displayName} onChange={e => setDisplayName(e.target.value)} id="register-display-name" type="text" placeholder="Usuario"/> <br/>

       <input type="submit" value="Register"/>
    </form>
    </>
  ) 
}

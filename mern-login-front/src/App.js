import React, {useState ,useEffect, useContext} from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
import Home from './Components/Pages/Home/Home'
import Login from './Components/Pages/Login/Login'
import Register from './Components/Pages/Register/Register'
import Header from './Components/layout/Header'
import UserContext from "./context/UserContext"
function App() {
  // data del usuario en este estado que se pasará por el context
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  // este hook se ejecuta cuando la pagina se inicia
  useEffect(() => {
    const checkLoggedIn = async () => {
      //obtengo el token de el localStorage
      let token = localStorage.getItem("auth-token");
      // si no existe creo uno vacio
      if(token === null){
        localStorage.setItem("auth-token", "");
        token = "";
      } 
      // Esto es para verificar que sea un token valido, retorna true si es valido
      const tokenRes = await Axios.post(
        "http://localhost:5000/users/tokenIsValid", null, {
          headers: { "x-auth-token": token }
      }
      )
      // verifico si ya existe un usuario logeado
      if(tokenRes.data) {
        // actualizo el state con los datos del usuario logeado
        const userRes = await Axios.get("http://localhost:5000/users/",
         {headers: {"x-auth-token" : token},
        })
        setUserData({
          token,
          user: userRes.data
        })
      };
    }

    checkLoggedIn();
  }, [])
  return (
    <>
    <BrowserRouter>
    {/* Usar el context para pasar la info del usuario por todos los componentes */}
    <UserContext.Provider value={{userData, setUserData}}>
    <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
      </UserContext.Provider>
    </BrowserRouter>
    </>
  );
}

export default App;

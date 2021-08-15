import React, { useEffect, useState } from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from "./routes/Home";
import Game from "./routes/Game";
import List from "./routes/List";
import Auth from "./routes/Auth";
import Profile from "./routes/Profile";
import Navigation from "./components/Navigation";
import PrivateRoute from "./helpers/PrivateRoute";
import "./App.css";
import {authService} from "./fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    authService.onAuthStateChanged((user)=> {
      if(user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
    console.log(isLoggedIn);
  }, []);

  if(!init) {
    return "initializing...";
  } else {
    return (
      <HashRouter>
        <Navigation isLoggedIn={isLoggedIn}></Navigation>
        <Route path="/" exact={true} component={Home} />
        <PrivateRoute path="/game" component={Game} />
        <PrivateRoute path="/list" component={List} />
        <Route path="/auth" component={Auth} />
        <PrivateRoute path="/profile" component={Profile} />
      </HashRouter>
    );
  } 
}

export default App;
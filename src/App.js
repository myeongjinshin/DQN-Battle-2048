import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
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
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user)=> {
      if(user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  if(!init) {
    return "initializing...";
  } else {
    return (
      <Router>
        <img src="http://localhost:8000/images/logo.png" height="100"></img>
        <Navigation isLoggedIn={isLoggedIn}></Navigation>
        <Route path="/" exact={true} component={Home} />
        <PrivateRoute path="/game" component={Game} isLoggedIn={isLoggedIn} userObj={userObj}/>
        <PrivateRoute exact={true} path="/list" component={List} />
        <PrivateRoute path="/list/:id" component={Game} isLoggedIn={isLoggedIn} userObj={userObj}/>
        <Route path="/auth" component={Auth} />
        <PrivateRoute path="/profile" component={Profile} isLoggedIn={isLoggedIn} userObj={userObj}/>
      </Router>
    );
  } 
}

export default App;
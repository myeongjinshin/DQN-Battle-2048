import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from "./routes/Home";
import Game from "./routes/Game";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Route path="/" exact={true} component={Home} />
      <Route path="/game" component={Game} />
    </HashRouter>
  );
}

export default App;
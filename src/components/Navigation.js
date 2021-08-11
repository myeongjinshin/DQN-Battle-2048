import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation({isLoggedIn}) {
  return (
    <div className="nav">
      <Link to="/">Home</Link>
      <Link to="game">Game</Link>
      {isLoggedIn?<Link to="/profile">Profile</Link>:<Link to="/auth">Login</Link>}
    </div>
  );
}

export default Navigation;
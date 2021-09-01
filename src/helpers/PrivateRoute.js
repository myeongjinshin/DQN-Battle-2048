import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authService } from "../fbase";

function PrivateRoute({ component: Component, userObj, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authService.currentUser ? (
          <Component {...props} userObj={userObj} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;

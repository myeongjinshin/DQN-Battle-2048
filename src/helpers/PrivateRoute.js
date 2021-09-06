import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authService } from "../fbase";
import PropTypes from "prop-types";

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

PrivateRoute.propTypes = {
    component: PropTypes.element.isRequired,
    userObj: PropTypes.object.isRequired,
    location: PropTypes.any,
};

export default PrivateRoute;

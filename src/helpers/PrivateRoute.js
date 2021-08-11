import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {authService} from "../fbase";

function PrivateRoute ({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render = {props => 
                authService.currentUser?(
                    <Component {...props} />
                ) : ( 
                    <Redirect to={{
                                    pathname: '/auth', 
                                    state: {from: props.location}
                                  }}
                    />
                )
            }
        />
    )
}

export default PrivateRoute;
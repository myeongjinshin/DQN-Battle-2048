import React from "react";
import { useHistory } from "react-router";
import { authService } from "../fbase";

const Profile = ({userObj}) => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    return (
        <center>
            <h1>{userObj.uid}</h1>
            <button onClick={onLogOutClick}>Log Out</button>
        </center>
    );
}

export default Profile;
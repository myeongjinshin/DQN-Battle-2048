import React from "react";
import { useHistory } from "react-router";
import { authService } from "../fbase";

function Profile() {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    return (
        <center>
            <button onClick={onLogOutClick}>Log Out</button>
        </center>
    );
}

export default Profile;